import { Faculty, DepartmentValidation } from "../../models"

export type FacultiesLoading = {
    facultiesLoading: true;
}

export type FacultiesLoaded = {
    facultiesLoading: false;
    faculties: Faculty[];
}

export type FacultyLoading = {
    facultyLoading: true;
}

export type FacultyLoaded = {
    facultyLoading: boolean;
    faculty?: Faculty;
}

export type FacultiesDeleting = {
    deleting: true;
    ids: number[];
}

export type FacultiesDeleted = {
    deleting: false;
    deleted?: boolean;
    ids?: number[];
}

export type ValidateFacultyState = {
    formErrors?: DepartmentValidation;
}

export type FacultiesState = FacultiesLoading | FacultiesLoaded;
export type SelectedFacultyState = FacultyLoading | FacultyLoaded;
export type DeleteFacultiesState = FacultiesDeleting | FacultiesDeleted;

export type FacultyState = FacultiesState & SelectedFacultyState & DeleteFacultiesState & ValidateFacultyState;