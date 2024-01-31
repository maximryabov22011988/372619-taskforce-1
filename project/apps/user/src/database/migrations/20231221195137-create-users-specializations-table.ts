import { Knex } from 'knex';

const TABLE_NAME = 'users_specializations';

export async function up(knex: Knex) {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.uuid('user_id').notNullable();
    table.integer('specialization_id').unsigned().notNullable();
    table.primary(['user_id', 'specialization_id']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
