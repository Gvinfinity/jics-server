export class EntryExistsError extends Error {
  static message = 'User already exists in database!';

  constructor(code) {
    super(EntryExistsError.message);
    this.code = code;
  }
}
