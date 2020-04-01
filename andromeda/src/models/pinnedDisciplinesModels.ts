import { Validation, ProjectType } from "./commonModels";
import { DisciplineTitle } from "./disciplineTitleModels";

export interface PinnedDiscipline
{
    id?:number;
    userId: number;
    disciplineTitleId: number;
    disciplineTitle: string;
    projectType: ProjectType;

    title: DisciplineTitle;
}

export namespace PinnedDiscipline {
    export const initial: PinnedDiscipline = {
        title: DisciplineTitle.initial,
        
        disciplineTitleId: 0,
        projectType: null,
        disciplineTitle: '',
        userId: 0
    }
}

export interface PinnedDisciplineValidation extends Validation {
    disciplineTitleError?: string;
    projectsTypesError?: string;
}

export namespace PinnedDisciplineValidation {
    export const initial: PinnedDisciplineValidation = Validation.initial;
}