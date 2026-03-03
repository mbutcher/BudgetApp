import { randomUUID } from 'crypto';
import { getDatabase } from '@config/database';
import type { Household, CreateHouseholdData } from '@typings/core.types';

function rowToHousehold(row: Record<string, unknown>): Household {
  return {
    id: row['id'] as string,
    name: row['name'] as string,
    createdAt: new Date(row['created_at'] as string),
    updatedAt: new Date(row['updated_at'] as string),
  };
}

class HouseholdRepository {
  private get db() {
    return getDatabase();
  }

  async findById(id: string): Promise<Household | null> {
    const row: unknown = await this.db('households').where({ id }).first();
    return row ? rowToHousehold(row as Record<string, unknown>) : null;
  }

  async findByUserId(userId: string): Promise<Household | null> {
    const row: unknown = await this.db('households')
      .join('household_members', 'households.id', 'household_members.household_id')
      .where({ 'household_members.user_id': userId })
      .select('households.*')
      .first();
    return row ? rowToHousehold(row as Record<string, unknown>) : null;
  }

  /** Create a household. The caller is responsible for also creating the owner member row. */
  async create(data: CreateHouseholdData): Promise<Household> {
    const id = randomUUID();
    const now = new Date();
    await this.db('households').insert({
      id,
      name: data.name,
      created_at: now,
      updated_at: now,
    });
    const row: unknown = await this.db('households').where({ id }).first();
    return rowToHousehold(row as Record<string, unknown>);
  }

  async update(id: string, name: string): Promise<Household> {
    await this.db('households').where({ id }).update({ name, updated_at: new Date() });
    const row: unknown = await this.db('households').where({ id }).first();
    return rowToHousehold(row as Record<string, unknown>);
  }

  async count(): Promise<number> {
    const result = (await this.db('households').count({ cnt: '*' }).first()) as
      | { cnt: string | number }
      | undefined;
    return Number(result?.cnt ?? 0);
  }
}

export const householdRepository = new HouseholdRepository();
