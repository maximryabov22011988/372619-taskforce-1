import { Knex } from 'knex';

const TABLE_NAME = 'refresh_sessions';

export async function up(knex: Knex) {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id');
    table.uuid('user_id').notNullable();
    table.uuid('token_id').notNullable();
    table.timestamp('expires_in').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.raw(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

  await knex.raw(`
      CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON refresh_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
}

export async function down(knex: Knex) {
  const triggers = await knex
    .select('tgname', 'relname')
    .from('pg_trigger')
    .join('pg_class', 'pg_trigger.tgrelid', 'pg_class.oid')
    .whereRaw(
      `pg_trigger.tgfoid = (SELECT oid FROM pg_proc WHERE proname = 'update_updated_at_column')`
    );

  for (const trigger of triggers) {
    await knex.raw(`DROP TRIGGER IF EXISTS ?? ON ??`, [
      trigger.tgname,
      trigger.relname,
    ]);
  }

  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column');

  await knex.schema.dropTableIfExists(TABLE_NAME);
}
