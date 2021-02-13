export class User {
  constructor(
    public email: string,
    public id: String,
    private _token: string,
    private _tokentExpirationDate
  ) {}

  get Token() {
    if (
      !this._tokentExpirationDate ||
      new Date() > this._tokentExpirationDate
    ) {
      return null;
    }
    return this._token;
  }
}
