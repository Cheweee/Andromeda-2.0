import { DisciplineTitle } from "../../models"

export type DisciplinesTitlesLoading = {
    loading: true;
}

export type DisciplinesTitlesLoaded = {
    loading: false;
    disciplinesTitles: DisciplineTitle[];
}

export type DisciplineTitleGetting = {
    disciplineTitleLoading: true;
}

export type DisciplineTitleGetted = {
    disciplineTitleLoading: boolean;
    disciplineTitle?: DisciplineTitle;
}

export type DisciplineTitleGetState = DisciplineTitleGetting | DisciplineTitleGetted;
export type DisciplinesTitlesGetState = DisciplinesTitlesLoading | DisciplinesTitlesLoaded;

export type DisciplineTitleState = DisciplinesTitlesGetState & DisciplineTitleGetState;