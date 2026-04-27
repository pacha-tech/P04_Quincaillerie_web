export class UserNotConnectedException extends Error {
  constructor(message: string) { super(message); this.name = "UserNotConnectedException"; }
}