import { randomUUID } from "crypto";

export class Reply {
  private _id: string;

  constructor(
    private _conteudo: string,
    private _tweetId: string,
    private _userId: string,
    private _tipo: "tweet" | "reply"
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

  get tweetId(): string {
    return this._tweetId;
  }

  get userId(): string {
    return this._userId;
  }

  get tipo(): "tweet" | "reply" {
    return this._tipo;
  }
}
