import { randomUUID } from 'crypto';
import { getDatabase } from '@config/database';
import type {
  AccountShare,
  AccountShareAccessLevel,
  UpsertAccountShareData,
} from '@typings/core.types';

function rowToShare(row: Record<string, unknown>): AccountShare {
  return {
    id: row['id'] as string,
    accountId: row['account_id'] as string,
    sharedWithUserId: row['shared_with_user_id'] as string,
    accessLevel: row['access_level'] as AccountShareAccessLevel,
    createdAt: new Date(row['created_at'] as string),
  };
}

class AccountShareRepository {
  private get db() {
    return getDatabase();
  }

  async findByAccountId(accountId: string): Promise<AccountShare[]> {
    const rows = await this.db('account_shares').where({ account_id: accountId });
    return rows.map(rowToShare);
  }

  /**
   * Replace all shares for an account with the provided list.
   * Pass an empty array to remove all shares.
   */
  async upsertShares(accountId: string, shares: UpsertAccountShareData[]): Promise<void> {
    await this.db('account_shares').where({ account_id: accountId }).delete();
    if (shares.length === 0) return;
    const now = new Date();
    await this.db('account_shares').insert(
      shares.map((s) => ({
        id: randomUUID(),
        account_id: accountId,
        shared_with_user_id: s.userId,
        access_level: s.accessLevel,
        created_at: now,
      }))
    );
  }

  async updateAccessLevel(
    accountId: string,
    userId: string,
    level: AccountShareAccessLevel
  ): Promise<void> {
    await this.db('account_shares')
      .where({ account_id: accountId, shared_with_user_id: userId })
      .update({ access_level: level });
  }

  async deleteByUser(userId: string): Promise<void> {
    await this.db('account_shares').where({ shared_with_user_id: userId }).delete();
  }

  async deleteByAccount(accountId: string): Promise<void> {
    await this.db('account_shares').where({ account_id: accountId }).delete();
  }
}

export const accountShareRepository = new AccountShareRepository();
