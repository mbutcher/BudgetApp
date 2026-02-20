import { forecastService } from '@services/core/forecastService';

jest.mock('@config/database');
import { getDatabase } from '@config/database';
const mockGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;

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

beforeEach(() => jest.clearAllMocks());

describe('forecastService.getForecast', () => {
  it('returns forecast months with isForecast=true', async () => {
    const rows = [
      { month: '2025-09', income: '3000', expenses: '2000' },
      { month: '2025-10', income: '3200', expenses: '1800' },
      { month: '2025-11', income: '2800', expenses: '2100' },
      { month: '2025-12', income: '3100', expenses: '1900' },
      { month: '2026-01', income: '2900', expenses: '2000' },
      { month: '2026-02', income: '3000', expenses: '2050' },
    ];
    mockGetDatabase.mockReturnValue(buildDbMock(rows));

    const result = await forecastService.getForecast('user-1', 3);

    expect(result).toHaveLength(3);
    result.forEach((entry) => {
      expect(entry.isForecast).toBe(true);
      expect(entry.income).toBeGreaterThan(0);
      expect(entry.expenses).toBeGreaterThan(0);
      expect(entry.month).toMatch(/^\d{4}-\d{2}$/);
    });
  });

  it('caps months at 12', async () => {
    mockGetDatabase.mockReturnValue(buildDbMock([]));

    const result = await forecastService.getForecast('user-1', 50);

    expect(result).toHaveLength(12);
  });

  it('returns 0 for income and expenses when no history', async () => {
    mockGetDatabase.mockReturnValue(buildDbMock([]));

    const result = await forecastService.getForecast('user-1', 2);

    expect(result).toHaveLength(2);
    result.forEach((entry) => {
      expect(entry.income).toBe(0);
      expect(entry.expenses).toBe(0);
    });
  });

  it('uses median (not mean) to reduce outlier impact', async () => {
    // Median of [100, 200, 300, 400, 5000] = 300 (mean would be 1200)
    const rows = [
      { month: '2025-09', income: '100', expenses: '100' },
      { month: '2025-10', income: '200', expenses: '200' },
      { month: '2025-11', income: '300', expenses: '300' },
      { month: '2025-12', income: '400', expenses: '400' },
      { month: '2026-01', income: '5000', expenses: '5000' },
    ];
    mockGetDatabase.mockReturnValue(buildDbMock(rows));

    const result = await forecastService.getForecast('user-1', 1);

    expect(result[0]!.income).toBe(300);
    expect(result[0]!.expenses).toBe(300);
  });

  it('returns months after the current month', async () => {
    mockGetDatabase.mockReturnValue(buildDbMock([]));

    const result = await forecastService.getForecast('user-1', 2);
    const now = new Date();
    const currentYearMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

    result.forEach((entry) => {
      expect(entry.month > currentYearMonth).toBe(true);
    });
  });
});
