import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
	const hashedPassword = await bcrypt.hash('f9w4YM37t7', 10);
	return hashedPassword
}
