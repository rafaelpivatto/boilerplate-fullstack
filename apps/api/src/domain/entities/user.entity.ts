export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly passwordHash: string,
  ) {}

  static create(input: { id: string; email: string; passwordHash: string }) {
    const email = input.email.trim().toLowerCase();
    if (!email.includes('@')) throw new Error('Invalid email');
    return new User(input.id, email, input.passwordHash);
  }
}
