export class NoInternetConnectionException extends Error {
  constructor(message: string) { super(message); this.name = "NoInternetConnectionException"; }
}