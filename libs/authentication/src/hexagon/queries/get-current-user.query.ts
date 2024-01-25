export type CurrentUserQueryResult = {
  id: string;
  email: string;
};

export interface GetCurrentUserQuery {
  execute(id: string): Promise<CurrentUserQueryResult>;
}
