import { Validation, GetOptions } from "./commonModels";
import { PinnedDiscipline, UserLoad } from ".";

export interface User {
    id?: number;
    username: string;
    firstname: string;
    secondname?: string;
    lastname: string;
    password?: string;
    email: string;

    pinnedDisciplines: PinnedDiscipline[];
    userLoad: UserLoad[];
}

export namespace User {
    export const initial: User = {
        email: '',
        firstname: '',
        lastname: '',
        pinnedDisciplines: [],
        userLoad: [],
        username: ''
    }

    export function getFullName(user: User) {
        if (!user || !user.firstname || !user.lastname)
            return '';
            
        return `${user.firstname} ${user.secondname ? (user.secondname + ' ') : ''}${user.lastname}`;
    }

    export function getName(user: User) {
        if (!user || !user.firstname || !user.lastname)
            return '';

        return `${user.firstname} ${user.lastname}`;
    }

    export function getFullInitials(user: User) {
        if (!user || !user.firstname || !user.lastname)
            return '';

        return `${user.firstname[0].toUpperCase()}. ${user.secondname ? (user.secondname[0].toUpperCase() + '. ') : ''}${user.lastname}`;
    }
}

export interface AuthenticatedUser extends User {
    token: string;
}

export interface UserGetOptions extends GetOptions {
    username?: string;
    password?: string;
    departmentId?: number;
}

export interface UserAuthenticateOptions {
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

export namespace UserValidation {
    export const initial: UserValidation = Validation.initial;
}