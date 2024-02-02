import { Knex } from 'knex';

const TABLE_NAME = 'reviews';

export async function up(knex: Knex) {
  await knex.schema.table(TABLE_NAME, (table) => {
    table.uuid('customer_id').nullable();
    table.uuid('contractor_id').nullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn('customer_id');
    table.dropColumn('contractor_id');
  });
}
