import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  Scope,
} from '@nestjs/common';
import { AuthController } from '@app/authentication/infra/clients/nestjs/controllers/auth.controller';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from '@app/authentication/infra/clients/nestjs/guards/auth.guard';
import { AuthGatewaysModule } from '@app/authentication/infra/clients/nestjs/auth-gateways.module';
import { AuthGateway } from '@app/authentication/hexagon/gateways/auth.gateway';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { default as Redis } from 'ioredis';
import { redisConfig } from '@app/authentication/infra/redis-config/redis.config';
import { AuthUseCasesModule } from '@app/authentication/infra/clients/nestjs/auth-usecases.module';

@Module({
  imports: [AuthGatewaysModule, AuthUseCasesModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      inject: ['AuthGateway', Reflector],
      useFactory: (authGateway: AuthGateway, reflector: Reflector) =>
        new AuthGuard(authGateway, reflector),
      scope: Scope.REQUEST,
    },
    {
      provide: 'RedisStore',
      useFactory: () => {
        const redisClient = new Redis(
          process.env.NODE_ENV == 'production'
            ? redisConfig.production
            : redisConfig.development,
        );
        return new (RedisStore as any)({ client: redisClient });
      },
    },
  ],
})
export class AuthModule implements NestModule {
  constructor(
    @Inject('RedisStore') private readonly redisStore: RedisStore.RedisStore,
  ) {}
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(
        session({
          store: this.redisStore,
          secret: 'keyboard cat',
          resave: false,
          saveUninitialized: true,
          name: 'session',
          cookie: {
            httpOnly: true,
          },
        }),
      )
      .forRoutes('*');
  }
}
