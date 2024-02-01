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
import { AuthUseCasesModule } from '@app/authentication/infra/clients/nestjs/auth-usecases.module';
import { Store } from 'express-session';

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
  ],
})
export class AuthModule implements NestModule {
  constructor(@Inject('SessionStore') private readonly store: Store) {}
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(
        session({
          store: this.store,
          secret: 'keyboard cat',
          resave: false,
          saveUninitialized: false,
          name: 'session',
          cookie: {
            httpOnly: true,
            domain: '192.168.5.61',
          },
        }),
      )
      .forRoutes('*');
  }
}
