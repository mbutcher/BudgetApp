import {
  createAccountSchema,
  updateAccountSchema,
  createCategorySchema,
  createTransactionSchema,
  updateTransactionSchema,
  linkTransactionSchema,
  createBudgetSchema,
  updateBudgetSchema,
  budgetCategoriesSchema,
  transactionFiltersSchema,
} from '@validators/coreValidators';

// ─── Account Validators ───────────────────────────────────────────────────────

describe('createAccountSchema', () => {
  const valid = {
    name: 'Chase Checking',
    type: 'checking',
    isAsset: true,
    startingBalance: 1000,
    currency: 'USD',
  };

  it('passes with minimal valid data', () => {
    const { error } = createAccountSchema.validate(valid);
    expect(error).toBeUndefined();
  });

  it('rejects missing name', () => {
    const { error } = createAccountSchema.validate({ ...valid, name: undefined });
    expect(error).toBeDefined();
    expect(error?.details[0]?.message).toMatch(/required/i);
  });

  it('rejects invalid account type', () => {
    const { error } = createAccountSchema.validate({ ...valid, type: 'crypto' });
    expect(error).toBeDefined();
  });

  it('rejects invalid hex color', () => {
    const { error } = createAccountSchema.validate({ ...valid, color: 'blue' });
    expect(error).toBeDefined();
    expect(error?.details[0]?.message).toMatch(/hex color/i);
  });

  it('accepts valid hex color', () => {
    const { error } = createAccountSchema.validate({ ...valid, color: '#3b82f6' });
    expect(error).toBeUndefined();
  });
});

describe('updateAccountSchema', () => {
  it('rejects empty update (no fields)', () => {
    const { error } = updateAccountSchema.validate({});
    expect(error).toBeDefined();
  });

  it('passes with just a name update', () => {
    const { error } = updateAccountSchema.validate({ name: 'New Name' });
    expect(error).toBeUndefined();
  });
});

// ─── Category Validators ──────────────────────────────────────────────────────

describe('createCategorySchema', () => {
  it('passes with minimal valid data', () => {
    const { error } = createCategorySchema.validate({ name: 'Groceries' });
    expect(error).toBeUndefined();
  });

  it('defaults isIncome to false', () => {
    const { value } = createCategorySchema.validate({ name: 'Groceries' });
    expect(value.isIncome).toBe(false);
  });

  it('rejects missing name', () => {
    const { error } = createCategorySchema.validate({});
    expect(error).toBeDefined();
  });
});

// ─── Transaction Validators ───────────────────────────────────────────────────

describe('createTransactionSchema', () => {
  const validId = '123e4567-e89b-12d3-a456-426614174000';
  const valid = {
    accountId: validId,
    amount: -45.5,
    date: '2026-02-18',
  };

  it('passes with minimal valid data', () => {
    const { error } = createTransactionSchema.validate(valid);
    expect(error).toBeUndefined();
  });

  it('rejects zero amount', () => {
    const { error } = createTransactionSchema.validate({ ...valid, amount: 0 });
    expect(error).toBeDefined();
  });

  it('rejects invalid date format', () => {
    const { error } = createTransactionSchema.validate({ ...valid, date: '18/02/2026' });
    expect(error).toBeDefined();
    expect(error?.details[0]?.message).toMatch(/YYYY-MM-DD/);
  });

  it('rejects invalid accountId format', () => {
    const { error } = createTransactionSchema.validate({ ...valid, accountId: 'not-a-uuid' });
    expect(error).toBeDefined();
  });
});

describe('updateTransactionSchema', () => {
  it('rejects empty update', () => {
    const { error } = updateTransactionSchema.validate({});
    expect(error).toBeDefined();
  });

  it('passes with a single field update', () => {
    const { error } = updateTransactionSchema.validate({ isCleared: true });
    expect(error).toBeUndefined();
  });

  it('allows null categoryId to unset category', () => {
    const { error } = updateTransactionSchema.validate({ categoryId: null });
    expect(error).toBeUndefined();
  });
});

describe('linkTransactionSchema', () => {
  it('rejects missing targetTransactionId', () => {
    const { error } = linkTransactionSchema.validate({});
    expect(error).toBeDefined();
  });

  it('passes with valid UUID', () => {
    const { error } = linkTransactionSchema.validate({
      targetTransactionId: '123e4567-e89b-12d3-a456-426614174000',
    });
    expect(error).toBeUndefined();
  });

  it('defaults linkType to transfer', () => {
    const { value } = linkTransactionSchema.validate({
      targetTransactionId: '123e4567-e89b-12d3-a456-426614174000',
    });
    expect(value.linkType).toBe('transfer');
  });
});

// ─── Budget Validators ────────────────────────────────────────────────────────

describe('createBudgetSchema', () => {
  const valid = { name: 'February 2026', startDate: '2026-02-01', endDate: '2026-02-28' };

  it('passes with valid data', () => {
    const { error } = createBudgetSchema.validate(valid);
    expect(error).toBeUndefined();
  });

  it('rejects missing name', () => {
    const { error } = createBudgetSchema.validate({ ...valid, name: undefined });
    expect(error).toBeDefined();
  });

  it('rejects invalid date format', () => {
    const { error } = createBudgetSchema.validate({ ...valid, startDate: '02-01-2026' });
    expect(error).toBeDefined();
  });
});

describe('updateBudgetSchema', () => {
  it('rejects empty update', () => {
    const { error } = updateBudgetSchema.validate({});
    expect(error).toBeDefined();
  });

  it('passes with just name update', () => {
    const { error } = updateBudgetSchema.validate({ name: 'Updated Name' });
    expect(error).toBeUndefined();
  });
});

describe('budgetCategoriesSchema', () => {
  const validId = '123e4567-e89b-12d3-a456-426614174000';

  it('rejects empty categories array', () => {
    const { error } = budgetCategoriesSchema.validate({ categories: [] });
    expect(error).toBeDefined();
  });

  it('rejects missing categories', () => {
    const { error } = budgetCategoriesSchema.validate({});
    expect(error).toBeDefined();
  });

  it('passes with valid categories', () => {
    const { error } = budgetCategoriesSchema.validate({
      categories: [{ categoryId: validId, allocatedAmount: 500 }],
    });
    expect(error).toBeUndefined();
  });

  it('rejects negative allocatedAmount', () => {
    const { error } = budgetCategoriesSchema.validate({
      categories: [{ categoryId: validId, allocatedAmount: -100 }],
    });
    expect(error).toBeDefined();
  });
});

describe('transactionFiltersSchema', () => {
  it('defaults page to 1 and limit to 50', () => {
    const { value } = transactionFiltersSchema.validate({});
    expect(value.page).toBe(1);
    expect(value.limit).toBe(50);
  });

  it('caps limit at 100', () => {
    const { error } = transactionFiltersSchema.validate({ limit: 200 });
    expect(error).toBeDefined();
  });
});
