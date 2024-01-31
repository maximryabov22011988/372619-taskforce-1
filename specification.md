### Запуск микросервисов.

Микросервисы, использующие в качестве БД `PostgreSQL`: `user`, `task`. Микросервисы, использующие в качестве БД `MongoDb`: `image`, `notify`. 

Для корректной работы микросервисов в системе должен быть установлен актуальный LTS релиз `Node.js` и `Docker`.
Если данные компоненты установлены, то необходимо сделать следующие шаги:

1. В терминале перейдите в директорию `project` и запустите команду `npm i`. Будут установлены необходимые npm-пакеты.
2. В каждом из микросервисов (в директории `./project/apps/microserviceName`) находится файл `microserviceName.env-example`. Переименуйте файлы `microserviceName.env-example` в `.microserviceName.env`. 
   Это позволит быстро запустить микросервисы с предварительно настроенными переменными окружения (при необходимости Вы можете их изменить). 
   Для запуска контейнеров, необходимых каждому из микросервисов, выполните команду `docker compose -f docker-compose.dev.yml up -d`. Для остановки контейнеров используйте команду `docker compose -f docker-compose.dev.yml down`.
3. Для настройки базы данных микросервиса "Task", в терминале перейдите в директорию `./project/apps/task` и выполните команду `npx nx run task:db:migrate:run` и команду `npx nx run task:db:seed:run`.
4. Для настройки базы данных микросервиса "User", в терминале перейдите в директорию `./project/apps/user` и выполните команду `npx nx run user:db:migrate:run` и команду `npx nx run user:db:seed:run`.
5. Теперь Вы можете запустить микросервисы. Для этого в терминале перейдите в директорию `project` и запустите команды:
   - `npx nx run user:serve:development`
   - `npx nx run task:serve:development`
   - `npx nx run image:serve:development`
   - `npx nx run notify:serve:development`
6. Для запуска BFF в `.bff.env` укажите переменные окружения для микросервисов (url, полученные на шаге 5) и в директории `project` запустите команду `npx nx run bff:serve:development`.
   Для ознакомления с API TaskForce перейдите на `/spec`.

**Приятной работы!**
