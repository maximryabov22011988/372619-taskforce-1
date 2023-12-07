import { Knex } from 'knex';

const tableName = 'tasks';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('title', 50).notNullable();
    table.string('description', 1024).notNullable();
    table.integer('price');
    table.date('execution_date');
    table.text('image_url');
    table.string('address', 255);
    table.integer('category_id').notNullable();
    table.integer('city_id').notNullable();
    table.integer('status_id').notNullable();
    table.uuid('contractor_id');
    table.uuid('customer_id');
    table
      .dateTime('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));

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
}

export async function down(knex: Knex) {
  await knex.schema
    .table(tableName, (table) => {
      table.dropForeign('category_id');
      table.dropForeign('city_id');
      table.dropForeign('status_id');
    })
    .dropTableIfExists(tableName);
}
