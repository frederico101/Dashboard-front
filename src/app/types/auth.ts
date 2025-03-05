export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    message?: string;
    token?: string;
    user?: User;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface LoginData {
    email: string;
    password: string;
}