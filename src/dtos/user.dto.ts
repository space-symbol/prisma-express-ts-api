import { Role, user } from '@prisma/client';

export class UserDto {
	id;
	username;
	isAdmin;
	role;
	constructor(product: user) {
		this.id = product.id
		this.username = product.username
		this.role = product.role
		this.isAdmin = product.role === Role.ADMIN
	}

}

