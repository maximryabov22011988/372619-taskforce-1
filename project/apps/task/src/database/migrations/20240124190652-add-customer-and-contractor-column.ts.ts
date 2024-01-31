import { Knex } from 'knex';

const tableName = 'reviews';

export async function up(knex: Knex) {
  await knex.schema.table(tableName, (table) => {
    table.uuid('customer_id').nullable();
    table.uuid('contractor_id').nullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.table(tableName, (table) => {
    table.dropColumn('customer_id');
    table.dropColumn('contractor_id');
  });
}
