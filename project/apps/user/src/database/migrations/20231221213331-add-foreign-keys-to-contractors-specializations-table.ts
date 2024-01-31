import { Knex } from 'knex';

const TABLE_NAME = 'users_specializations';

export async function up(knex: Knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .foreign('specialization_id')
      .references('id')
      .inTable('specializations')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropForeign('user_id');
    table.dropForeign('specialization_id');
  });
}
