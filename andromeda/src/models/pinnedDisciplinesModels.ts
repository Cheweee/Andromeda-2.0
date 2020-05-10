import { Validation, ProjectType } from "./commonModels";
import { DisciplineTitle } from "./disciplineTitleModels";

export interface PinnedDiscipline
{
    id?:number;
    userId: number;
    projectType: ProjectType;
    disciplineTitleId: number;

    title: DisciplineTitle;
}

export namespace PinnedDiscipline {
    export const initial: PinnedDiscipline = {
        title: DisciplineTitle.initial,
        
        projectType: null,
        userId: 0,
        disciplineTitleId: 0
    }
}

export interface PinnedDisciplineValidation extends Validation {
    disciplineTitleError?: string;
    projectsTypesError?: string;
}

export namespace PinnedDisciplineValidation {
    export const initial: PinnedDisciplineValidation = Validation.initial;
}