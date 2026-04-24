export interface UpdateUserRequest {
    username: string;
    email: string;
}

export interface UpdateUserResponse {
    success: boolean;
    message: string;
    data: {
        id: number;
        username: string;
        email: string;
    };
}
