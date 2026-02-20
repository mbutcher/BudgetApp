import { loginSchema, registerSchema, totpSchema, backupCodeSchema } from '@features/auth/schemas';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'secret' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toContain('email');
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toContain('password');
  });

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(2);
  });
});

describe('registerSchema', () => {
  const valid = {
    email: 'user@example.com',
    password: 'securepassword1',
    confirmPassword: 'securepassword1',
  };

  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects password shorter than 12 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'short', confirmPassword: 'short' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toContain('password');
  });

  it('rejects password longer than 128 characters', () => {
    const longPass = 'a'.repeat(129);
    const result = registerSchema.safeParse({ ...valid, password: longPass, confirmPassword: longPass });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toContain('password');
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'different' });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toContain('confirmPassword');
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'bad' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toContain('email');
  });

  it('accepts minimum valid password length (12)', () => {
    const pw = 'a'.repeat(12);
    expect(registerSchema.safeParse({ ...valid, password: pw, confirmPassword: pw }).success).toBe(true);
  });
});

describe('totpSchema', () => {
  it('accepts a 6-digit code', () => {
    expect(totpSchema.safeParse({ token: '123456' }).success).toBe(true);
  });

  it('rejects codes that are too short', () => {
    const result = totpSchema.safeParse({ token: '12345' });
    expect(result.success).toBe(false);
  });

  it('rejects codes that are too long', () => {
    const result = totpSchema.safeParse({ token: '1234567' });
    expect(result.success).toBe(false);
  });

  it('rejects non-digit codes', () => {
    const result = totpSchema.safeParse({ token: '12345a' });
    expect(result.success).toBe(false);
  });

  it('rejects empty token', () => {
    expect(totpSchema.safeParse({ token: '' }).success).toBe(false);
  });
});

describe('backupCodeSchema', () => {
  it('accepts a valid 10-char code', () => {
    const result = backupCodeSchema.safeParse({ code: 'ABCDEFGHIJ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe('ABCDEFGHIJ');
    }
  });

  it('normalizes lowercase to uppercase', () => {
    const result = backupCodeSchema.safeParse({ code: 'abcdefghij' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe('ABCDEFGHIJ');
    }
  });

  it('strips dashes from code', () => {
    const result = backupCodeSchema.safeParse({ code: 'ABCDE-FGHIJ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe('ABCDEFGHIJ');
    }
  });

  it('strips spaces from code', () => {
    const result = backupCodeSchema.safeParse({ code: 'ABCDE FGHIJ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe('ABCDEFGHIJ');
    }
  });

  it('rejects codes shorter than 8 characters after transform', () => {
    // 7 chars — below minimum
    const result = backupCodeSchema.safeParse({ code: 'ABCDEFG' });
    expect(result.success).toBe(false);
  });

  it('rejects codes longer than 12 characters', () => {
    const result = backupCodeSchema.safeParse({ code: 'ABCDEFGHIJKLM' });
    expect(result.success).toBe(false);
  });
});
