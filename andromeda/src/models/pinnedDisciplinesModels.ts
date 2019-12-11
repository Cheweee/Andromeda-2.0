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

export interface PinnedDisciplineValidation extends Validation {
    disciplineTitleError?: string;
    projectsTypesError?: string;
}