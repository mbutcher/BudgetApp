import type { Request, Response, NextFunction } from 'express';
import { reportController } from '@controllers/reportController';

jest.mock('@config/database');
import { getDatabase } from '@config/database';
const mockGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;

// Build a Knex-like query chain where each method returns the same chain,
// and .orderBy() returns a Promise resolving to `rows` (the final awaited call).
function buildDbMock(rows: unknown[]): ReturnType<typeof getDatabase> {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['where', 'select', 'sum', 'groupBy']) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain['orderBy'] = jest.fn().mockResolvedValue(rows);

  const mockRaw = jest.fn();
  const mockDb = Object.assign(jest.fn().mockReturnValue(chain), { raw: mockRaw });
  return mockDb as unknown as ReturnType<typeof getDatabase>;
}

function makeReq(query: Record<string, string> = {}): Request {
  return {
    query,
    user: { id: 'user-123' },
  } as unknown as Request;
}

function makeRes(): { res: Response; json: jest.Mock } {
  const json = jest.fn();
  return { res: { json } as unknown as Response, json };
}

const next = jest.fn() as NextFunction;

describe('reportController.monthlySummary', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns monthly summary rows converted to numbers', async () => {
    const dbRows = [
      { month: '2025-09', income: '500.00', expenses: '300.00' },
      { month: '2025-10', income: '600.00', expenses: '400.00' },
    ];
    mockGetDatabase.mockReturnValue(buildDbMock(dbRows));

    const { res, json } = makeRes();
    await reportController.monthlySummary(makeReq(), res, next);

    expect(json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        summary: [
          { month: '2025-09', income: 500, expenses: 300 },
          { month: '2025-10', income: 600, expenses: 400 },
        ],
      },
    });
  });

  it('returns empty summary when no transactions match', async () => {
    mockGetDatabase.mockReturnValue(buildDbMock([]));

    const { res, json } = makeRes();
    await reportController.monthlySummary(makeReq(), res, next);

    expect(json).toHaveBeenCalledWith({ status: 'success', data: { summary: [] } });
  });

  it('defaults months to 6 when query param is absent', async () => {
    const db = buildDbMock([]);
    mockGetDatabase.mockReturnValue(db);

    await reportController.monthlySummary(makeReq(), makeRes().res, next);

    // raw() should have been called with the default 6
    const rawMock = (db as unknown as Record<string, jest.Mock>)['raw'];
    expect(rawMock).toHaveBeenCalledWith(
      'DATE_SUB(CURDATE(), INTERVAL ? MONTH)',
      [6]
    );
  });

  it('clamps months above 24 down to 24', async () => {
    const db = buildDbMock([]);
    mockGetDatabase.mockReturnValue(db);

    await reportController.monthlySummary(makeReq({ months: '999' }), makeRes().res, next);

    const rawMock = (db as unknown as Record<string, jest.Mock>)['raw'];
    expect(rawMock).toHaveBeenCalledWith(
      'DATE_SUB(CURDATE(), INTERVAL ? MONTH)',
      [24]
    );
  });

  it('treats months=0 as invalid and uses the default 6', async () => {
    const db = buildDbMock([]);
    mockGetDatabase.mockReturnValue(db);

    await reportController.monthlySummary(makeReq({ months: '0' }), makeRes().res, next);

    // 0 is falsy so `parseInt('0') || 6` evaluates to 6
    const rawMock = (db as unknown as Record<string, jest.Mock>)['raw'];
    expect(rawMock).toHaveBeenCalledWith(
      'DATE_SUB(CURDATE(), INTERVAL ? MONTH)',
      [6]
    );
  });

  it('converts string income and expenses to numbers', async () => {
    mockGetDatabase.mockReturnValue(
      buildDbMock([{ month: '2026-01', income: '1234.56', expenses: '789.00' }])
    );

    const { res, json } = makeRes();
    await reportController.monthlySummary(makeReq({ months: '3' }), res, next);

    const result = json.mock.calls[0][0] as {
      data: { summary: Array<{ income: unknown; expenses: unknown }> };
    };
    expect(typeof result.data.summary[0]?.income).toBe('number');
    expect(typeof result.data.summary[0]?.expenses).toBe('number');
    expect(result.data.summary[0]?.income).toBe(1234.56);
    expect(result.data.summary[0]?.expenses).toBe(789);
  });
});
