import {
  CurrentUserQueryResult,
  GetCurrentUserQuery,
} from '@app/authentication/hexagon/queries/get-current-user.query';
import { Knex } from 'knex';
import { UserPm } from '@app/authentication/infra/gateways/repositories/knex/persistent-models/user.pm';

export class KnexGetCurrentUserQuery implements GetCurrentUserQuery {
  constructor(private readonly knex: Knex) {}
  execute(id: string): Promise<CurrentUserQueryResult> {
    return this.knex<UserPm>('users').where({ id }).first('id', 'email');
  }
}
