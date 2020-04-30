import * as React from "react";
import { RouteComponentProps } from "react-router";

import * as Redux from "react-redux";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Card, CardContent, CardHeader, Tooltip, IconButton, LinearProgress, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Breadcrumbs, Link } from "@material-ui/core";
import { Check, Close, ArrowBack, ExpandMore, Add } from "@material-ui/icons";

import clsx from "clsx";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { paths } from "../../sharedConstants";

import { User, DisciplineTitle, AppState } from '../../models';
import { ProjectType } from "../../models/commonModels";

import { UserDetails } from "./UserDetails";
import { PinnedDisciplineDetails, PinnedDisciplines } from "./PinnedDisciplines";

import { userActions } from "../../store/userStore";
import { disciplineTitleActions } from "../../store/disciplineTitleStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const UserComponent = withStyles(styles)(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { userState, disciplineTitleState } = Redux.useSelector((state: AppState) => ({
        userState: state.userState,
        disciplineTitleState: state.disciplineTitleState
    }));
    //#region User state
    const [isUserExist, setIsUserExist] = React.useState<boolean>(false);

    function handleUserDetailsChange(model: User) {
        dispatch(userActions.updateUserDetails(model));
    }
    //#endregion

    //#region Pinned disciplines state
    const [selectedTitle, setSelectedTitle] = React.useState<DisciplineTitle>(null);
    const [selectedProjectTypes, setSelectedProjectTypes] = React.useState<ProjectType[]>([]);
    const [pinnedDisciplineDetailsOpen, setPinnedDisciplineDetailsOpen] = React.useState<boolean>(false);
    const [disciplinesTitles, setDisciplinesTitles] = React.useState<DisciplineTitle[]>([]);

    function handlePinnedDisciplineAdd(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setPinnedDisciplineDetailsOpen(true);
        setSelectedTitle(null);
        setSelectedProjectTypes([]);
    }

    function handlePinnedDisciplineEdit(disciplineTitleId: number) {
        const discipline: DisciplineTitle = {
            name: user.pinnedDisciplines.find(o => o.disciplineTitleId === disciplineTitleId).disciplineTitle,
            id: user.pinnedDisciplines.find(o => o.disciplineTitleId === disciplineTitleId).disciplineTitleId
        };
        const projectTypes = user.pinnedDisciplines.filter(o => o.disciplineTitleId === disciplineTitleId).map(o => o.projectType);

        setPinnedDisciplineDetailsOpen(true);
        setSelectedTitle(discipline);
        setSelectedProjectTypes(projectTypes);
    }

    function handlePinnedDisciplineDelete(disciplineTitleId: number) {
        dispatch(userActions.deleteUserPinnedDiscipline(disciplineTitleId));
    }

    function handlePinnedDisciplineDetailsAccept(title: DisciplineTitle, projectTypes: ProjectType[]) {
        dispatch(userActions.updateUserPinnedDisciplines(title, projectTypes));
        setPinnedDisciplineDetailsOpen(false);
        setSelectedTitle(null);
        setSelectedProjectTypes([]);
    }

    function handlePinnedDisciplineDetailsCancel() {
        setPinnedDisciplineDetailsOpen(false);
        setSelectedTitle(null);
        setSelectedProjectTypes([]);
    }
    //#endregion

    React.useEffect(() => { initialize(); }, [props.match.params]);

    React.useEffect(() => {
        if (disciplineTitleState.loading === false) {
            const pinnedDisciplines = user && user.pinnedDisciplines || [];
            let disciplinesTitles: DisciplineTitle[];
            if (!selectedTitle) {
                disciplinesTitles = disciplineTitleState.disciplinesTitles.filter(o => !pinnedDisciplines.map(o => o.disciplineTitleId).includes(o.id));
            } else {
                const userDisciplinesWithoutSelectedDiscipline = pinnedDisciplines.filter(o => o.disciplineTitleId !== selectedTitle.id).map(o => o.disciplineTitleId);
                disciplinesTitles = disciplineTitleState.disciplinesTitles.filter(o => !userDisciplinesWithoutSelectedDiscipline.includes(o.id));
            }
            setDisciplinesTitles(disciplinesTitles);
        }
    }, [disciplineTitleState.loading, selectedTitle]);

    function initialize() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        setIsUserExist(Boolean(id));
        dispatch(userActions.getUser(id));
        //TODO: Разобраться с выборкой наименований дисциплин
        dispatch(disciplineTitleActions.getDisciplinesTitles({}));
    }

    function handleBackClick() {
        const { history } = props;
        dispatch(userActions.clearEditionState());
        history.push(paths.usersPath);
    }

    function handleSaveClick() {
        dispatch(userActions.saveUser(user));
    }

    function handleCancelClick() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        dispatch(userActions.getUser(id));
    }

    const { classes } = props;

    const userDetailsDisabled = userState.userLoading || disciplineTitleState.loading;
    let user: User = null;
    if (userState.userLoading === false) {
        user = userState.user;
    }

    return (
        <form autoComplete="off" noValidate>
            <Grid container direction="row">
                <Grid item xs={2} />
                <Grid item xs container direction="column">
                    <Grid container direction="row" alignItems="center">
                        <Breadcrumbs>
                            <Link color="inherit" onClick={handleBackClick}>Пользователи</Link>
                            <Typography color="textPrimary">{user && user.username || 'Новый пользователь'}</Typography>
                        </Breadcrumbs>
                        <Grid item xs />
                        <Tooltip title="Отменить">
                            <span>
                                <IconButton disabled={userDetailsDisabled} onClick={handleCancelClick}>
                                    <Close />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Сохранить">
                            <span>
                                <IconButton color="primary" disabled={userDetailsDisabled || !userState.formErrors.isValid} onClick={handleSaveClick}>
                                    <Check />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        {userState.userLoading && <LinearProgress variant="query" />}
                        <CardContent>
                            <UserDetails
                                user={user}
                                isUserExist={isUserExist}
                                disabled={userDetailsDisabled}
                                formErrors={userState.formErrors}
                                onUserDetailsChange={handleUserDetailsChange}
                            />
                        </CardContent>
                    </Card>
                    <Grid container direction="row" alignItems="center">
                        <Typography >Прикрепленные дисциплины</Typography>
                        <Grid item xs />
                        <Tooltip title="Прикрепить дисциплину">
                            <span>
                                <IconButton onClick={handlePinnedDisciplineAdd}>
                                    <Add />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <CardContent>
                            <Grid className={clsx(classes.overflowContainer, classes.maxHeight300)}>
                                <PinnedDisciplines
                                    disabled={userDetailsDisabled}
                                    pinnedDisciplines={user && user.pinnedDisciplines || []}
                                    handleDelete={handlePinnedDisciplineDelete}
                                    handleEdit={handlePinnedDisciplineEdit}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2} />
                <PinnedDisciplineDetails
                    open={pinnedDisciplineDetailsOpen}
                    disciplineTitle={selectedTitle}
                    projectTypes={selectedProjectTypes}
                    disciplinesTitles={disciplinesTitles}
                    onAccept={handlePinnedDisciplineDetailsAccept}
                    onCancel={handlePinnedDisciplineDetailsCancel}
                />
            </Grid>
        </form >
    );
});