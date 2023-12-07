import { v4 as makeUuid } from 'uuid';
import { Knex } from 'knex';

const tableName = 'tasks';

export async function seed(knex: Knex): Promise<any> {
  await knex(tableName)
    .del()
    .insert([
      {
        id: 1,
        title: 'Собрать шкаф',
        description: 'Шкаф новый. Инструкция имеется',
        price: 300,
        execution_date: new Date(),
        image_url:
          'https://mdf-m.ru/thumb/2/FC9X4ob9LMrtSt1E9Qt3Cg/r/d/ustanovka_zadney_stenki_shkafa.png',
        address: 'ул.Мебельная, д.1, кв.2',
        category_id: 1,
        city_id: 1,
        status_id: 1,
        contractor_id: makeUuid(),
        customer_id: makeUuid(),
      },
      {
        id: 2,
        title: 'Установить фильтр для воды',
        description: 'Фильтр осмос Prestige-3M',
        price: 100,
        execution_date: new Date(),
        image_url:
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fsantehnikguru.ru%2Fluchshij-filtr-dlya-vody%2F&psig=AOvVaw3qYgO3VbLpyjmE8mIJOiJd&ust=1702061804626000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCLiRi8KA_oIDFQAAAAAdAAAAABAE',
        address: 'ул.Гагарина, д.2, кв.23',
        category_id: 2,
        city_id: 3,
        status_id: 1,
        contractor_id: makeUuid(),
        customer_id: makeUuid(),
      },
    ]);
}
