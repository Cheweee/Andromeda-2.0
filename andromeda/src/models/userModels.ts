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
    graduateDegrees: UserGraduateDegree[];
}

export namespace User {
    export const initial: User = {
        email: '',
        firstname: '',
        lastname: '',
        pinnedDisciplines: [],
        userLoad: [],
        username: '',
        graduateDegrees: []
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
    roleId?: number;
    canTeach?: boolean;
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

export interface UserGraduateDegree {
    id?: number;
    userId: number;
    graduateDegree: GraduateDegree;
    branchOfScience: BranchOfScience;
}

export interface UserGraduateDegreeValidation extends Validation {
    graduateDegreeError?: string;
    branchOfScienceError?: string;
}

export namespace UserGraduateDegreeValidation {
    export const initial: UserGraduateDegreeValidation = Validation.initial;
}

export namespace UserGraduateDegree {
    export function getUserGraduateDegreeShortening(value: UserGraduateDegree) {
        let shortening = '';

        switch (value.graduateDegree) {
            case GraduateDegree.candidatOfSciences:
                shortening += 'к.';
                break;
            case GraduateDegree.doctorOfSciences:
                shortening += 'д.';
                break;
        }

        switch (value.branchOfScience) {
            case BranchOfScience.Architecture:
                shortening += 'арх.';
                break;
            case BranchOfScience.Biology:
                shortening += 'б.';
                break;
            case BranchOfScience.Veterinary:
                shortening += 'в.';
                break;
            case BranchOfScience.Military:
                shortening += 'воен.';
                break;
            case BranchOfScience.Geographical:
                shortening += 'г.';
                break;
            case BranchOfScience.GeologicalAndMineralogical:
                shortening += 'г.-м.';
                break;
            case BranchOfScience.ArtHistory:
                shortening += 'иск.';
                break;
            case BranchOfScience.Historical:
                shortening += 'и.';
                break;
            case BranchOfScience.Medical:
                shortening += 'м.';
                break;
            case BranchOfScience.Pedagogical:
                shortening += 'п.';
                break;
            case BranchOfScience.Political:
                shortening += 'пол.';
                break;
            case BranchOfScience.Psychological:
                shortening += 'псх.';
                break;
            case BranchOfScience.Agricultural:
                shortening += 'с.-х.';
                break;
            case BranchOfScience.Sociological:
                shortening += 'соц.';
                break;
            case BranchOfScience.Technical:
                shortening += 'т.';
                break;
            case BranchOfScience.Pharmaceutical:
                shortening += 'фарм.';
                break;
            case BranchOfScience.Physics:
                shortening += 'ф.-м.';
                break;
            case BranchOfScience.Philological:
                shortening += 'фил.';
                break;
            case BranchOfScience.Philosophical:
                shortening += 'ф.';
                break;
            case BranchOfScience.Chemical:
                shortening += 'х.';
                break;
            case BranchOfScience.Economic:
                shortening += 'э.';
                break;
            case BranchOfScience.Legal:
                shortening += 'ю.';
                break;
        }

        shortening += 'н.';

        return shortening;
    }

    export function getUserGraduateDegreeDescription(value: UserGraduateDegree) {
        let shortening = '';

        switch (value.graduateDegree) {
            case GraduateDegree.candidatOfSciences:
                shortening += 'кандидат ';
                break;
            case GraduateDegree.doctorOfSciences:
                shortening += 'доктор ';
                break;
        }

        switch (value.branchOfScience) {
            case BranchOfScience.Architecture:
                shortening += 'архитектурных ';
                break;
            case BranchOfScience.Biology:
                shortening += 'биологических ';
                break;
            case BranchOfScience.Veterinary:
                shortening += 'ветеринарных ';
                break;
            case BranchOfScience.Military:
                shortening += 'военных ';
                break;
            case BranchOfScience.Geographical:
                shortening += 'географических ';
                break;
            case BranchOfScience.GeologicalAndMineralogical:
                shortening += 'геолого-минералогических ';
                break;
            case BranchOfScience.ArtHistory:
                shortening += 'искусствоведения';
                break;
            case BranchOfScience.Historical:
                shortening += 'исторических ';
                break;
            case BranchOfScience.Medical:
                shortening += 'медицинских ';
                break;
            case BranchOfScience.Pedagogical:
                shortening += 'педагогических ';
                break;
            case BranchOfScience.Political:
                shortening += 'политологических ';
                break;
            case BranchOfScience.Psychological:
                shortening += 'психологических ';
                break;
            case BranchOfScience.Agricultural:
                shortening += 'сельскохозяйственных ';
                break;
            case BranchOfScience.Sociological:
                shortening += 'социологических ';
                break;
            case BranchOfScience.Technical:
                shortening += 'технических ';
                break;
            case BranchOfScience.Pharmaceutical:
                shortening += 'фармацевтических ';
                break;
            case BranchOfScience.Physics:
                shortening += 'физико-математических ';
                break;
            case BranchOfScience.Philological:
                shortening += 'филологических ';
                break;
            case BranchOfScience.Philosophical:
                shortening += 'философских ';
                break;
            case BranchOfScience.Chemical:
                shortening += 'химических ';
                break;
            case BranchOfScience.Economic:
                shortening += 'экономических';
                break;
            case BranchOfScience.Legal:
                shortening += 'юридических ';
                break;
        }

        shortening += 'наук';

        return shortening;
    }
}

export enum GraduateDegree {
    candidatOfSciences,
    doctorOfSciences
}

export namespace GraduateDegree {
    export function getGraduateDegreeDescription(value: GraduateDegree) {
        switch (value) {
            case GraduateDegree.candidatOfSciences: return 'Кандидат наук';
            case GraduateDegree.doctorOfSciences: return 'Доктор наук';
            default: return 'Неизвестная ученая степень';
        }
    }
}

export const GraduateDegrees = [
    GraduateDegree.candidatOfSciences,
    GraduateDegree.doctorOfSciences
]

export enum BranchOfScience {
    Architecture,
    Biology,
    Veterinary,
    Military,
    Geographical,
    GeologicalAndMineralogical,
    ArtHistory,
    Historical,
    Culturology,
    Medical,
    Pedagogical,
    Political,
    Psychological,
    Agricultural,
    Sociological,
    Theology,
    Technical,
    Pharmaceutical,
    Physics,
    Philological,
    Philosophical,
    Chemical,
    Economic,
    Legal
}


export namespace BranchOfScience {
    export function getBranchOfScienceDescription(value: BranchOfScience) {
        switch (value) {
            case BranchOfScience.Architecture: return 'Архитектура';
            case BranchOfScience.Biology: return 'Биологические';
            case BranchOfScience.Veterinary: return 'Ветеринарные';
            case BranchOfScience.Military: return 'Военные';
            case BranchOfScience.Geographical: return 'Географические';
            case BranchOfScience.GeologicalAndMineralogical: return 'Геолого-минералогические';
            case BranchOfScience.ArtHistory: return 'Искусствоведение';
            case BranchOfScience.Historical: return 'Исторические';
            case BranchOfScience.Culturology: return 'Культурология';
            case BranchOfScience.Medical: return 'Медицинские';
            case BranchOfScience.Pedagogical: return 'Педагогические';
            case BranchOfScience.Political: return 'Политические';
            case BranchOfScience.Psychological: return 'Психологические';
            case BranchOfScience.Agricultural: return 'Сельскохозяйственные';
            case BranchOfScience.Sociological: return 'Архитектура';
            case BranchOfScience.Theology: return 'Теология';
            case BranchOfScience.Technical: return 'Технические';
            case BranchOfScience.Pharmaceutical: return 'Фармацевтические';
            case BranchOfScience.Physics: return 'Физико-математические';
            case BranchOfScience.Philological: return 'Филологические';
            case BranchOfScience.Philosophical: return 'Философские';
            case BranchOfScience.Chemical: return 'Химические';
            case BranchOfScience.Economic: return 'Экономические';
            case BranchOfScience.Legal: return 'Юридические';
            default: return 'Неизвестная ученая степень';
        }
    }
}

export const BranchesOfSciences = [
    BranchOfScience.Architecture,
    BranchOfScience.Biology,
    BranchOfScience.Veterinary,
    BranchOfScience.Military,
    BranchOfScience.Geographical,
    BranchOfScience.GeologicalAndMineralogical,
    BranchOfScience.ArtHistory,
    BranchOfScience.Historical,
    BranchOfScience.Culturology,
    BranchOfScience.Medical,
    BranchOfScience.Pedagogical,
    BranchOfScience.Political,
    BranchOfScience.Psychological,
    BranchOfScience.Agricultural,
    BranchOfScience.Sociological,
    BranchOfScience.Theology,
    BranchOfScience.Technical,
    BranchOfScience.Pharmaceutical,
    BranchOfScience.Physics,
    BranchOfScience.Philological,
    BranchOfScience.Philosophical,
    BranchOfScience.Chemical,
    BranchOfScience.Economic,
    BranchOfScience.Legal
]