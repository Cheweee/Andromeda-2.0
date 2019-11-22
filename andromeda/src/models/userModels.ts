import { Validation, GetOptions } from "./commonModels";

export interface User {
    id?: number;
    username: string;
    firstname: string;
    secondname?: string;
    lastname: string;
    password?: string;
    email: string;
}

export interface AuthenticatedUser extends User {
    token: string;
}

export interface UserGetOptions extends GetOptions {
    username?: string;
    password?: string;
}

export interface UserAuthorizeOptions {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface UserValidation extends Validation {
    emailError?: string;
    usernameError?: string;
    passwordError?: string;
    firstnameError?: string;
    lastnameError?: string;
}