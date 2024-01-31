import { Knex } from 'knex';

const TABLE_NAME = 'users';

export async function up(knex: Knex) {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('id').primary();
    table.string('firstname', 50).notNullable();
    table.string('lastname', 50).notNullable();
    table.string('email', 250).notNullable().unique();
    table.integer('city_id').unsigned().notNullable();
    table.string('password_hash', 60).notNullable();
    table.integer('role_id').unsigned().notNullable();
    table.text('avatar_url').nullable();
    table.string('info', 300).nullable();
    table.date('birth_date').notNullable();
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
      BEFORE UPDATE ON users
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
