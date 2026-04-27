export class AppException extends Error {
  constructor(message: string = "Une erreur est survenue. Réessayez plus tard.") { super(message); this.name = "AppException"; }
}