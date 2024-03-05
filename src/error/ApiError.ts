export class ApiError extends Error{
	public status: number;
	public message: string;
	public errors: any[];
	constructor(status: number, message: string, errors: any[] = []) {
		super()
		this.status = status;
		this.message = message
		this.errors = errors
	}

	static badRequest(message: string, error: any[] = []){
		return new ApiError(404, message, error)
	}
	static internal(message: string, error: any = []){
		return new ApiError(500, message, error)
	}
	static forbidden(message: string, error: any = []) {
		return new ApiError(403, message, error)
	}
	static unAuthorized(message: string, error: any = []){
		return new ApiError(401, message, error)
	}
}
