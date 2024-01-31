import { Knex } from 'knex';

const tableName = 'tasks';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('title', 50).notNullable();
    table.string('description', 1024).notNullable();
    table.integer('price').unsigned();
    table.date('execution_date');
    table.text('image_url');
    table.string('address', 255);
    table.integer('category_id').unsigned();
    table.integer('city_id').unsigned();
    table.integer('status_id').unsigned();
    table.uuid('contractor_id');
    table.uuid('customer_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

    table
      .foreign('category_id')
      .references('id')
      .inTable('categories')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');

    table
      .foreign('city_id')
      .references('id')
      .inTable('cities')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');

    table
      .foreign('status_id')
      .references('id')
      .inTable('statuses')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
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
      BEFORE UPDATE ON tasks
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

  await knex.schema
    .table(tableName, (table) => {
      table.dropForeign('category_id');
      table.dropForeign('city_id');
      table.dropForeign('status_id');
    })
    .dropTableIfExists(tableName);
}
