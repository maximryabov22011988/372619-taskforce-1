import { Knex } from 'knex';

const tableName = 'reviews';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('text', 500).notNullable();
    table.integer('task_id').unsigned().notNullable();
    table.uuid('author_id').nullable();
    table.smallint('rating').unsigned().notNullable().checkBetween([1, 5]);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
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
      BEFORE UPDATE ON reviews
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

  await knex.schema.dropTableIfExists(tableName);
}
