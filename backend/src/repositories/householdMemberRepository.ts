import { randomUUID } from 'crypto';
import { getDatabase } from '@config/database';
import { encryptionService } from '@services/encryption/encryptionService';
import type { HouseholdMember, HouseholdMemberPublic, HouseholdRole } from '@typings/core.types';

function rowToMember(row: Record<string, unknown>): HouseholdMember {
  return {
    id: row['id'] as string,
    householdId: row['household_id'] as string,
    userId: row['user_id'] as string,
    role: row['role'] as HouseholdRole,
    joinedAt: new Date(row['joined_at'] as string),
  };
}

class HouseholdMemberRepository {
  private get db() {
    return getDatabase();
  }

  async findByUserId(userId: string): Promise<HouseholdMember | null> {
    const row: unknown = await this.db('household_members').where({ user_id: userId }).first();
    return row ? rowToMember(row as Record<string, unknown>) : null;
  }

  /** Returns just the household_id for a user — fast lookup without full member object. */
  async getHouseholdId(userId: string): Promise<string | null> {
    const row = (await this.db('household_members')
      .where({ user_id: userId })
      .select('household_id')
      .first()) as { household_id: string } | undefined;
    return row?.household_id ?? null;
  }

  /** Returns enriched member list with decrypted email and display name. */
  async findAllByHouseholdId(householdId: string): Promise<HouseholdMemberPublic[]> {
    const rows = (await this.db('household_members')
      .join('users', 'household_members.user_id', 'users.id')
      .where({ 'household_members.household_id': householdId })
      .select(
        'household_members.user_id',
        'household_members.role',
        'household_members.joined_at',
        'users.display_name',
        'users.email_encrypted'
      )
      .orderBy('household_members.joined_at', 'asc')) as Array<Record<string, unknown>>;

    return rows.map((row) => ({
      userId: row['user_id'] as string,
      displayName: (row['display_name'] as string | null) ?? null,
      email: encryptionService.decrypt(row['email_encrypted'] as string),
      role: row['role'] as HouseholdRole,
      joinedAt: new Date(row['joined_at'] as string),
    }));
  }

  async addMember(
    householdId: string,
    userId: string,
    role: HouseholdRole
  ): Promise<HouseholdMember> {
    const id = randomUUID();
    const now = new Date();
    await this.db('household_members').insert({
      id,
      household_id: householdId,
      user_id: userId,
      role,
      joined_at: now,
    });
    const row: unknown = await this.db('household_members').where({ id }).first();
    return rowToMember(row as Record<string, unknown>);
  }

  async removeMember(householdId: string, userId: string): Promise<void> {
    await this.db('household_members')
      .where({ household_id: householdId, user_id: userId })
      .delete();
  }
}

export const householdMemberRepository = new HouseholdMemberRepository();
