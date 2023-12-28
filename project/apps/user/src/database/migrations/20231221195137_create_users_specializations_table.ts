import { Knex } from 'knex';

const tableName = 'users_specializations';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.uuid('user_id').notNullable();
    table.integer('specialization_id').unsigned().notNullable();
    table.primary(['user_id', 'specialization_id']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists(tableName);
}
1;
