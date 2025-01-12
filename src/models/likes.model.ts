import { randomUUID } from "crypto";

export class Like {
  private _id: string;

  constructor(private _userId: string, private _tweetId: string) {
    this._id = randomUUID();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get tweetId(): string {
    return this._tweetId;
  }
}
