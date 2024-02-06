import { plainToInstance, ClassConstructor } from 'class-transformer';
import { Radix } from '@project/libs/shared-types';

export const fillObject = <T, V>(
  someDto: ClassConstructor<T>,
  plainObject: V
) => plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const transform = {
  numericStringToNumber: ({ value }: { value: string }) =>
    parseInt(value, Radix.Decimal),
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

export type DateTimeUnit = 's' | 'h' | 'd' | 'm' | 'y';
export type TimeAndUnit = { value: number; unit: DateTimeUnit };

export const parseTime = (time: string): TimeAndUnit => {
  const regex = /^(\d+)([shdmy])/;
  const match = regex.exec(time);

  if (!match) {
    throw new Error(`[parseTime] Bad time string: ${time}`);
  }

  const [, valueRaw, unitRaw] = match;
  const value = parseInt(valueRaw, Radix.Decimal);
  const unit = unitRaw as DateTimeUnit;

  if (isNaN(value)) {
    throw new Error(`[parseTime] Can't parse value count. Result is NaN.`);
  }

  return {
    value,
    unit,
  };
};
