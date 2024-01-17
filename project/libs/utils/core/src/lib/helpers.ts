import { plainToInstance, ClassConstructor } from 'class-transformer';

export const fillObject = <T, V>(
  someDto: ClassConstructor<T>,
  plainObject: V
) => plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const transform = {
  numericStringToNumber: ({ value }: { value: string }) => parseInt(value, 10),
};

type GetMongoConnectionParams = {
  username: string;
  password: string;
  host: string;
  port: number;
  databaseName: string;
  authDatabase: string;
};

export const getMongoConnection = ({
  username,
  password,
  host,
  port,
  databaseName,
  authDatabase,
}: GetMongoConnectionParams): string =>
  `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;

type GetRabbitMQConnectionParams = {
  user: string;
  password: string;
  host: string;
  port: string;
};

export const getRabbitMQConnection = ({
  user,
  password,
  host,
  port,
}: GetRabbitMQConnectionParams): string =>
  `amqp://${user}:${password}@${host}:${port}`;
