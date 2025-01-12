import { randomUUID } from "crypto";

export class User {
  private _id: string;

  constructor(
    private _nome: string,
    private _email: string,
    private _username: string,
    private _senha: string,
    private _token?: string
  ) {
    this._id = randomUUID();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get nome(): string {
    return this._nome;
  }

  get email(): string {
    return this._email;
  }

  get username(): string {
    return this._username;
  }

  get senha(): string {
    return this._senha;
  }

  get token(): string | undefined {
    return this._token;
  }
}
