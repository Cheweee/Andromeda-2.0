import { DepartmentLoadState, ModelsState, ModelState, DeleteState } from "./state";
import { DepartmentLoadActions, ActionType } from "./actions";
import { StudyLoad, DepartmentLoad, UserDisciplineLoad } from "../../models";

const initialState: DepartmentLoadState = {
    deleting: false,
    modelLoading: true,
    modelsLoading: true
}

export function departmentLoadReducer(prevState: DepartmentLoadState = initialState, action: DepartmentLoadActions): DepartmentLoadState {
    switch (action.type) {
        case ActionType.getModelsRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getModelsSuccess: {
            const state: ModelsState = { modelsLoading: false, models: action.models };
            return { ...prevState, ...state };
        }
        case ActionType.getModelsFailure: {
            const state: ModelsState = { modelsLoading: false, models: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.getModelRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.getModelSuccess: {
            const state: ModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...state };
        }
        case ActionType.getModelFailure: {
            const state: ModelState = { modelLoading: false, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.saveRequest: return prevState;
        case ActionType.createSuccess: {
            if (prevState.modelsLoading === true) return prevState;
            const state: ModelsState = { modelsLoading: false, models: prevState.models.concat(action.model) };
            return { ...prevState, ...state };
        }
        case ActionType.updateSuccess: {
            if (prevState.modelsLoading === true) return prevState;
            const updated = prevState.models.map(o => o.id == action.model.id ? action.model : o);
            const state: ModelsState = { modelsLoading: false, models: updated };
            return { ...prevState, ...state };
        }
        case ActionType.saveFailure: return prevState;

        case ActionType.deleteRequest: {
            const deleteState: DeleteState = { deleting: true, ids: action.ids };
            return { ...prevState, ...deleteState };
        }
        case ActionType.deleteSuccess: {
            if (prevState.modelsLoading === true) return prevState;
            const state: ModelsState = { modelsLoading: false, models: prevState.models.filter((value) => !prevState.ids.includes(value.id)) };
            const deleteState: DeleteState = { deleting: false, deleted: true };
            return { ...prevState, ...deleteState, ...state };
        }
        case ActionType.deleteFailure: {
            const deleteState: DeleteState = { deleting: false, deleted: false };
            return { ...prevState, ...deleteState };
        }

        case ActionType.clearEditionState: {
            const state: ModelState = { modelLoading: true, model: undefined };
            return { ...prevState, ...state };
        }

        case ActionType.importRequest: {
            const state: ModelsState = { modelsLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.importSuccess: {
            if (prevState.modelsLoading === true) return;

            const updated = prevState.models.slice(0);
            updated.push(action.model);

            const state: ModelsState = { modelsLoading: false, models: updated };
            const modelState: ModelState = { modelLoading: false, model: action.model };
            return { ...prevState, ...state, ...modelState };
        }
        case ActionType.importFailure: {
            const state: ModelsState = { modelsLoading: false };
            return { ...prevState, ...state };
        }

        case ActionType.generateRequest: {
            const state: ModelState = { modelLoading: true };
            return { ...prevState, ...state };
        }
        case ActionType.generateSuccess: {
            if (prevState.modelLoading === true) return;

            const result = action.model;

            const state: ModelState = { modelLoading: false, model: result };
            return { ...prevState, ...state };
        }
        case ActionType.generateRequest: {
            const state: ModelState = { modelLoading: false };
            return { ...prevState, ...state };
        }

        case ActionType.updateDetails: {
            if (prevState.modelLoading === true) return;

            const updated = { ...prevState.model, ...action.model };
            const state: ModelState = { modelLoading: false, model: updated };
            return { ...prevState, ...state };
        }

        case ActionType.updateGroupDisciplineLoad: {
            if (prevState.modelLoading === true) return;

            const groupDisciplineLoad = prevState.model.groupDisciplineLoad;

            groupDisciplineLoad[action.index] = action.groupDisciplineLoad;

            const updated: DepartmentLoad = { ...prevState.model, groupDisciplineLoad };

            const state: ModelState = { modelLoading: false, model: updated };
            return { ...prevState, ...state };
        }

        case ActionType.deleteGroupDisciplineLoad: {
            if (prevState.modelLoading === true) return;

            const model = prevState.model;

            const groupDisciplineLoad = model.groupDisciplineLoad.splice(action.index, 1);
            const updatedModel = { ...model, groupDisciplineLoad };

            const state: ModelState = { modelLoading: false, model: updatedModel };
            return { ...prevState, ...state };
        }

        case ActionType.updateUserDiscplineLoad: {
            if (prevState.modelLoading === true) return;

            const groupsDisciplinesLoad = prevState.model.groupDisciplineLoad;

            const groupDisciplineLoad = groupsDisciplinesLoad[action.groupDisciplineLoadIndex];
            const selectedStudyLoad = groupDisciplineLoad.studyLoad.filter(o => action.userDisciplineLoad.studyLoad.some(vsl => vsl.projectType === o.projectType));
            const studyLoadInStream = selectedStudyLoad.filter(o => StudyLoad.getGroupsInStream(o.shownValue) > 1);
            for (let studyLoad of selectedStudyLoad) {
                if (!studyLoad.userLoad) {
                    studyLoad.userLoad = [];
                }
                studyLoad.userLoad.push({
                    studentsCount: -1,
                    studyLoadId: studyLoad.id,
                    user: action.userDisciplineLoad.user,
                    userId: action.userDisciplineLoad.user.id
                });
            }

            const additionalLoad = groupsDisciplinesLoad.filter(o =>
                o.disciplineTitleId === groupDisciplineLoad.disciplineTitleId &&
                o.studentGroupId !== groupDisciplineLoad.studentGroupId &&
                o.semesterNumber === groupDisciplineLoad.semesterNumber
            );
            const additionalStudyLoad = additionalLoad
                .map(o => o.studyLoad)
                .reduce((prev, curr) => prev.concat(curr), [])
                .filter(o => studyLoadInStream.some(sls => sls.projectType === o.projectType));

            for (let studyLoad of additionalStudyLoad) {
                if (!studyLoad.userLoad) {
                    studyLoad.userLoad = [];
                }
                studyLoad.userLoad.push({
                    studentsCount: -1,
                    studyLoadId: studyLoad.id,
                    user: action.userDisciplineLoad.user,
                    userId: action.userDisciplineLoad.user.id
                });
            }

            const model: DepartmentLoad = { ...prevState.model, groupDisciplineLoad: groupsDisciplinesLoad };

            const state: ModelState = { modelLoading: false, model: model };

            return { ...prevState, ...state };
        }
        case ActionType.deleteUserDisciplineLoad: {
            if (prevState.modelLoading === true) return;

            const groupsDisciplinesLoad = prevState.model.groupDisciplineLoad;

            const studyLoads = groupsDisciplinesLoad.filter(o => o.studyLoad.some(sl => sl.userLoad))
                .map(o => o.studyLoad).reduce((prev, curr) => prev.concat(curr), []);

            for(let studyLoad of studyLoads) {
                if(!studyLoad.userLoad || !studyLoad.userLoad.some(o => o.userId === action.userId)) continue;

                studyLoad.userLoad = studyLoad.userLoad.filter(o => o.userId !== action.userId);
            }

            const model: DepartmentLoad = { ...prevState.model, groupDisciplineLoad: groupsDisciplinesLoad };

            const state: ModelState = { modelLoading: false, model: model };

            return { ...prevState, ...state };
        }

        default: return prevState;
    }
}