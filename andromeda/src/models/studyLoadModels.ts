import {
    ProjectType, User, GroupDisciplineLoad
} from ".";

export interface StudyLoad {
    id?: number;
    value: number;
    shownValue: string;
    projectType: ProjectType;
    groupDisciplineLoadId?: number;

    // WARNING: Only UI Field
    groupDisciplineLoadIndex?: number;

    usersLoad: UserLoad[];
}

export namespace StudyLoad {
    export const initial: StudyLoad = {
        projectType: null,
        shownValue: '1',
        usersLoad: [],
        value: 1
    }

    export function getComputedValue(shownValue: string): number {
        if (!shownValue) return 1;
        const regex = /^(\d)+/g;
        const matches = shownValue.match(regex);
        if (matches) {
            const tempValue = matches[0];
            const value = parseInt(tempValue);

            return value;
        }

        return 1;
    }

    export function getGroupsInStream(shownValue: string): number {
        const regex = /\/\d*/g
        let matches = shownValue.match(regex);
        if (matches) {
            let tempValue = matches[0].replace('/', '');
            const value = parseInt(tempValue);

            return value;
        }

        return 1;
    }

    export function updateGroupsInStream(shownValue: string, groupsInStream: number): string {
        const regex = /\/\d*/g;
        if (!groupsInStream)
            groupsInStream = 1;
        const matches = shownValue.match(regex);
        if (matches) {
            const searchValue = matches[0];
            return shownValue.replace(searchValue, `/${groupsInStream}`);
        }

        return `${shownValue}/${groupsInStream}`;
    }

    export function updateComputedValue(shownValue: string, value: number): string {
        const regex = /^.*(?=\/)/g;
        if (!value)
            value = 1;

        const matches = shownValue.match(regex);
        if (matches) {
            const searchValue = matches[0];
            return shownValue.replace(searchValue, `${value}`);
        }
        return `${value}`;
    }

    export function computeValue(shownValue: string): number {
        return parseFloat(eval(shownValue));
    }
}

export interface StudyLoadGetOptions {
    departmentId?: number
    onlyNotDistributed?: boolean;
    onlyDistributed?: boolean;
}

export interface UserLoad {
    id?: number;
    userId: number;
    studyLoadId: number;
    studentsCount: number;

    user: User;
}