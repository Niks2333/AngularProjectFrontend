export class UserModel {
  username: string = '';
  password: string = '';

  constructor(init?: Partial<UserModel>) {
    Object.assign(this, init);
  }
}
