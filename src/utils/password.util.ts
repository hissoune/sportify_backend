import * as bcrypt from 'bcryptjs';


export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Adjust based on your requirements
  return bcrypt.hash(password, saltRounds);
}


export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
