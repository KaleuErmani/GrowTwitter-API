import { randomUUID } from "crypto";

export class Seguidor {
  private _id: string;

  constructor(private _userId: string, private _seguidorId: string) {
    this._id = randomUUID();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get seguidorId(): string {
    return this._seguidorId;
  }
}
