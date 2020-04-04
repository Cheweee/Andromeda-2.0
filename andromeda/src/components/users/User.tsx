import * as React from "react";
import { RouteComponentProps } from "react-router";

import * as Redux from "react-redux";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Card, CardContent, CardHeader, Tooltip, IconButton, LinearProgress, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from "@material-ui/core";
import { Check, Close, ArrowBack, ExpandMore, Add } from "@material-ui/icons";

import clsx from "clsx";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { paths } from "../../sharedConstants";

import { User, UserValidation, ApplicationError, DisciplineTitle, PinnedDiscipline } from '../../models';
import { AppState } from "../../models/reduxModels";
import { ProjectType } from "../../models/commonModels";
import { userService } from "../../services";
import { disciplinetitleService } from "../../services/disciplineTitleService";

import { UserDetails } from "./UserDetails";
import { PinnedDisciplineDetails, PinnedDisciplines } from "./PinnedDisciplines";

import { userActions } from "../../store/userStore";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const UserComponent = withStyles(styles)(function (props: Props) {
    const dispatch = Redux.useDispatch();
    const { userState } = Redux.useSelector((state: AppState) => ({ userState: state.userState }));

    //#region User state
    const [user, setUser] = React.useState<User>(User.initial);

    function loadUser() {
        const { match } = props;
        const tempId = match.params && match.params[paths.idParameterName];
        const id = parseInt(tempId, null);
        dispatch(userActions.getUser(id));
    }

    function handleFirstnameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, firstname: event.target && event.target.value });
    }

    function handleSecondnameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, secondname: event.target && event.target.value });
    }

    function handleLastnameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, lastname: event.target && event.target.value });
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, email: event.target && event.target.value });
    }

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, username: event.target && event.target.value });
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUser({ ...user, password: event.target && event.target.value });
    }
    //#endregion

    //#region Pinned disciplines state
    const [selectedTitle, setSelectedTitle] = React.useState<DisciplineTitle>(null);
    const [selectedProjectTypes, setSelectedProjectTypes] = React.useState<ProjectType[]>([]);
    const [pinnedDisciplineDetailsOpen, setPinnedDisciplineDetailsOpen] = React.useState<boolean>(false);
    const [disciplinesTitles, setDisciplinesTitles] = React.useState<DisciplineTitle[]>([]);

    async function loadNotPinnedDiscilines() {
        const titles = await disciplinetitleService.getTitles({});
        setDisciplinesTitles(titles);
    }

    function handlePinnedDisciplineAdd(event: React.MouseEvent<Element, MouseEvent>) {
        event.stopPropagation();
        setPinnedDisciplineDetailsOpen(true);
        setSelectedTitle(null);
        setSelectedProjectTypes([]);
    }

    function handlePinnedDisciplineDelete(id: number) {
        const pinnedDisciplines = user.pinnedDisciplines.filter(o => o.id !== id);
        setUser({ ...user, pinnedDisciplines });
    }

    function handlePinnedDisciplineEdit(id: number) {
        const discipline: DisciplineTitle = {
            name: user.pinnedDisciplines.find(o => o.id === id).disciplineTitle,
            id: user.pinnedDisciplines.find(o => o.id === id).disciplineTitleId
        };
        const projectTypes = user.pinnedDisciplines.filter(o => o.id === id).map(o => o.projectType);

        setPinnedDisciplineDetailsOpen(true);
        setSelectedTitle(discipline);
        setSelectedProjectTypes(projectTypes);
    }

    function handlePinnedDisciplineDetailsAccept(title: DisciplineTitle, projectTypes: ProjectType[]) {
        const pinnedDisciplines = user.pinnedDisciplines.filter(o => o.disciplineTitleId !== title.id);

        for (const projectType of projectTypes) {
            pinnedDisciplines.push({
                disciplineTitleId: title.id,
                userId: user.id,
                projectType: projectType,
                disciplineTitle: title.name,
                title: title
            });
        }

        setUser({ ...user, pinnedDisciplines });
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

    const [formErrors, setFormErrors] = React.useState<UserValidation>(UserValidation.initial);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => { initialize(); }, [props.match.params]);
    React.useEffect(() => {
        if (userState.userLoading === false) {
            setUser(userState.user);
            setLoading(false);
        }
    }, [userState.userLoading]);
    React.useEffect(() => { dispatch(userActions.validateUser(user)); }, [user])
    React.useEffect(() => { setFormErrors(userState.formErrors) }, [userState.formErrors]);

    function initialize() {
        loadUser();
        loadNotPinnedDiscilines();
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
        initialize();
    }

    const { classes } = props;

    let disciplinesForDialog: DisciplineTitle[] = [];

    const pinnedDisciplines: PinnedDiscipline[] = user && user.pinnedDisciplines || [];

    if (!selectedTitle) {
        disciplinesForDialog = disciplinesTitles.filter(o => !pinnedDisciplines.map(o => o.disciplineTitleId).includes(o.id));
    } else {
        const userDisciplinesWithoutSelectedDiscipline = pinnedDisciplines.filter(o => o.disciplineTitleId !== selectedTitle.id).map(o => o.disciplineTitleId);
        disciplinesForDialog = disciplinesTitles.filter(o => !userDisciplinesWithoutSelectedDiscipline.includes(o.id));
    }

    return (
        <form autoComplete="off" noValidate>
            <Grid container direction="row">
                <Grid item xs={2} />
                <Grid item xs container direction="column">
                    <Grid container direction="row">
                        <Tooltip title="Вернуться назад">
                            <span>
                                <IconButton disabled={loading} onClick={handleBackClick}>
                                    <ArrowBack />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Grid item xs />
                        <Tooltip title="Отменить">
                            <span>
                                <IconButton disabled={loading} onClick={handleCancelClick}>
                                    <Close />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Сохранить">
                            <span>
                                <IconButton color="primary" disabled={loading || !formErrors.isValid} onClick={handleSaveClick}>
                                    <Check />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <CardHeader
                            title="Пользователь"
                        />
                        {loading && <LinearProgress variant="query" />}
                        <CardContent>
                            <UserDetails
                                user={user}
                                disabled={loading}
                                formErrors={formErrors}
                                handleEmailChange={handleEmailChange}
                                handleFirstnameChange={handleFirstnameChange}
                                handleLastnameChange={handleLastnameChange}
                                handlePasswordChange={handlePasswordChange}
                                handleSecondnameChange={handleSecondnameChange}
                                handleUsernameChange={handleUsernameChange}
                            />
                        </CardContent>
                    </Card>
                    <Card className={clsx(classes.margin1Y, classes.w100)}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                                <Grid container direction="row" alignItems="center">
                                    <Typography className={classes.heading}>Прикрепленные дисциплины</Typography>
                                    <Grid item xs />
                                    <Tooltip title="Прикрепить дисциплину">
                                        <IconButton onClick={handlePinnedDisciplineAdd}>
                                            <Add />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <PinnedDisciplines
                                    pinnedDisciplines={pinnedDisciplines}
                                    handleDelete={handlePinnedDisciplineDelete}
                                    handleEdit={handlePinnedDisciplineEdit}
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Card>
                </Grid>
                <Grid item xs={2} />
                <PinnedDisciplineDetails
                    open={pinnedDisciplineDetailsOpen}
                    disciplineTitle={selectedTitle}
                    projectTypes={selectedProjectTypes}
                    disciplinesTitles={disciplinesForDialog}
                    onAccept={handlePinnedDisciplineDetailsAccept}
                    onCancel={handlePinnedDisciplineDetailsCancel}
                />
            </Grid>
        </form >
    );
});