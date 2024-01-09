import { Module } from '@nestjs/common';
import { NotifyConfig } from '@project/libs/config';

const { NotifyConfigModule: ConfigModule } = NotifyConfig;

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [],
})
export class NotifyModule {}
