import {
  CurrentUserQueryResult,
  GetCurrentUserQuery,
} from '@app/authentication/hexagon/queries/get-current-user.query';

export class StubGetCurrentUserQuery implements GetCurrentUserQuery {
  private _result: Map<string, CurrentUserQueryResult> = new Map();
  async execute(id): Promise<CurrentUserQueryResult> {
    return this._result.get(id);
  }

  givenResult(id: string, result: CurrentUserQueryResult) {
    this._result.set(id, result);
  }
}
