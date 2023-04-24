import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SwapsModule } from './swaps/swaps.module';
import { EmailModule } from './email/email.module';
import { BlockchainListenerModule } from './blockchain-listener/blockchain-listener.module';
import { TypeOrmConfig } from 'config/typeorm.config';
import { validationSchema } from 'config/validationSchema';
import { AuthModule } from './auth/auth.module';
import { MyCacheModule } from 'cache/cache.module';

@Module({
  imports: [
    UsersModule,
    TransactionsModule,
    SwapsModule,
    EmailModule,
    BlockchainListenerModule,
    ConfigModule.forRoot({
      // forRoot로 설정해서 emailConfig란 동적 Config 객체가 전체 스코프에 주입가능해졌다.
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [], // load를 통해 앞에서 지정한 ConfigFactory를 지정한다.
      isGlobal: true, // 글로벌 스코프에서 사용가능하도록 한다.
      validationSchema: validationSchema, // joi를 활용한 유효성 검사 객체를 추가한다.
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    AuthModule,
    MyCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [CacheModule],
})
export class AppModule {}
