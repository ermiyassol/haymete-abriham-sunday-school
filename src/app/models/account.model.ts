export class Account {
  constructor(
    public username: string,
    public role: string,
    public status: boolean,
    public password?: string,
    public key?: string,
    public uid?: string,
    public email?: string
    ) {}
}