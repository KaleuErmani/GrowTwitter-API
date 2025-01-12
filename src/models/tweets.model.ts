import { randomUUID } from "crypto";

export class Tweet {
  private _id: string;

  constructor(
    private _conteudo: string,
    private _tipo: "tweet" | "reply",
    private _userId: string
  ) {
    this._id = randomUUID();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get conteudo(): string {
    return this._conteudo;
  }

  get tipo(): "tweet" | "reply" {
    return this._tipo;
  }

  get userId(): string {
    return this._userId;
  }
}
