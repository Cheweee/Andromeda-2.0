import {
    SupervisorAccount,
    Dashboard as DashboardIcon,
    AccountBalance,
    Apartment,
    AssignmentInd
} from "@material-ui/icons";

import { Route } from "../models";
import { Dashboard } from "../components";
import { Users, UserComponent } from "../components/users";
import { Faculties, FacultyComponent } from "../components/departments";
import { TrainingDepartments, TrainingDepartmentComponent } from "../components/departments";
import { Roles, RoleComponent } from "../components/roles";
import { DepartmentLoads, DepartmentLoadComponent } from "../components/departmentLoad";

const idParameterName = 'id';
const departmentIdParameterName = 'departmentId';

const getUserPath = (idParameter: string) => `/users/${idParameter}`;
const getFacultyPath = (idParameter: string) => `/faculties/${idParameter}`;
const getTrainingDepartmentPath = (idParameter: string) => `/trainingdepartments/${idParameter}`;
const getRolePath = (idParameter: string) => `/roles/${idParameter}`;
const getDepartmentloadsPath = (idParameter: string) => `/trainingdepartments/${idParameter}/departmentloads`;
const getDepartmentloadPath = (departmentIdParameter: string, idParameter: string) => `/trainingdepartments/${departmentIdParameter}/departmentloads${idParameter}`;

export const paths = {
    dashboardPath: '/',
    usersPath: '/users',
    facultiesPath: '/factulties',
    trainingDepartmentsPath: '/trainingdepartments',
    rolesPath: '/roles',
    departmentloadsPath: getDepartmentloadsPath(':' + idParameterName),

    userPath: getUserPath(':' + idParameterName),
    facultyPath: getFacultyPath(':' + idParameterName),
    trainingDepartmentPath: getTrainingDepartmentPath(':' + idParameterName),
    rolePath: getRolePath(':' + idParameterName),
    departmentloadPath: getDepartmentloadPath(':' + departmentIdParameterName, ':' + idParameterName),

    getUserPath,
    getFacultyPath,
    getTrainingDepartmentPath,
    getRolePath,
    getDepartmentloadsPath,
    getDepartmentloadPath,

    idParameterName
};

export const routes: Route[] = [
    { exact: true, name: 'dashboard', text: 'Доска задач', path: paths.dashboardPath, icon: DashboardIcon, component: Dashboard },
    { exact: true, name: 'users', text: 'Пользователи', path: paths.usersPath, icon: SupervisorAccount, component: Users },
    { exact: true, name: 'faculties', text: 'Факультеты и институты', path: paths.facultiesPath, icon: Apartment, component: Faculties },
    { exact: true, name: 'trainingdepartments', text: 'Кафедры', path: paths.trainingDepartmentsPath, icon: AccountBalance, component: TrainingDepartments },
    { exact: true, name: 'roles', text: 'Роли', path: paths.rolesPath, icon: AssignmentInd, component: Roles },
    { exact: false, name: 'departmentLoad', path: paths.departmentloadPath, component: DepartmentLoadComponent },
    { exact: false, name: 'departmentLoads', path: paths.departmentloadsPath, component: DepartmentLoads },
    { exact: false, name: 'user', path: paths.userPath, component: UserComponent },
    { exact: false, name: 'faculty', path: paths.facultyPath, component: FacultyComponent },
    { exact: false, name: 'trainingdepartment', path: paths.trainingDepartmentPath, component: TrainingDepartmentComponent },
    { exact: false, name: 'role', path: paths.rolePath, component: RoleComponent }
];