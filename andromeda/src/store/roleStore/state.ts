import { Role, RoleValidation } from "../../models"

export type RolesLoading = {
    loading: true;
}

export type RolesLoaded = {
    loading: false;
    roles: Role[];
}

export type RoleGetting = {
    roleLoading: true;
}

export type RoleGetted = {
    roleLoading: boolean;
    role?: Role;
}

export type RolesDeleting = {
    deleting: true;
    ids: number[];
}

export type RolesDeleted = {
    deleting: false;
    deleted?: boolean;
    ids?: number[];
}

export type RoleValidating = {
    formErrors?: RoleValidation;
}

export type RoleGetState = RoleGetting | RoleGetted;
export type RolesListState = RolesLoading | RolesLoaded;
export type RolesDeleteState = RolesDeleting | RolesDeleted;
export type RoleState = RoleGetState & RolesListState & RolesDeleteState & RoleValidating;