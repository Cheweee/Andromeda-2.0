import * as React from "react";
import { RouteComponentProps } from "react-router";

import { WithStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Card, CardContent, CardHeader, Tooltip, IconButton, TextField, LinearProgress, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from "@material-ui/core";

import { mergeStyles } from "../../utilities";
import { commonStyles } from "../../muiTheme";
import { Check, Close, ArrowBack, ExpandMore, Add } from "@material-ui/icons";
import { paths } from "../../sharedConstants";

import clsx from "clsx";
import { User, UserValidation, ApplicationError, PinnedDiscipline, DisciplineTitle } from '../../models';
import { userService, departmentService } from "../../services";
import { MessageSnackbar } from "../common";
import { useState, useEffect } from "react";
import { SnackbarVariant, ProjectType } from "../../models/commonModels";
import { UserDetails } from "./UserDetails";
import { PinnedDisciplineDetails, PinnedDisciplines } from "./PinnedDisciplines";
import { disciplinetitleService } from "../../services/disciplineTitleService";
import { useSnackbarState } from "../../hooks";

const styles = mergeStyles(commonStyles);

interface Props extends RouteComponentProps, WithStyles<typeof styles> { }

export const UserComponent = withStyles(styles)(function (props: Props) {
    //#region User state
    const [user, setUser] = useState(User.initial);

    async function loadUser() {
        const { match } = props;

        const tempId = match.params && match.params[paths.idParameterName];
        let user: User = User.initial;
        try {
            setLoading(true);
            const id = parseInt(tempId, 0);
            if (id) {
                const models = await userService.get({ id });
                user = models[0];
            }
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setLoading(false);
            setUser(user);
        }
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
    const [selectedTitle, setSelectedTitle] = useState<DisciplineTitle>(null);
    const [selectedProjectTypes, setSelectedProjectTypes] = useState<ProjectType[]>([]);
    const [pinnedDisciplineDetailsOpen, setPinnedDisciplineDetailsOpen] = useState<boolean>(false);
    const [disciplinesTitles, setDisciplinesTitles] = useState<DisciplineTitle[]>([]);

    async function loadNotPinnedDiscilines() {
        try {
            setLoading(true);
            const titles = await disciplinetitleService.getTitles({});
            setDisciplinesTitles(titles);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false);
                setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
        finally {
            setLoading(false);
        }
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

    const [formErrors, setFormErrors] = useState<UserValidation>(UserValidation.initial);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useSnackbarState();

    useEffect(() => { initialize(); }, [props.match.params]);

    useEffect(() => {
        const formErrors = userService.validateUser(user);
        setFormErrors(formErrors);
    }, [user]);

    async function initialize() {
        await loadUser();
        await loadNotPinnedDiscilines();
    }

    function handleBackClick(event: React.MouseEvent<Element, MouseEvent>) {
        const { history } = props;
        history.push(paths.usersPath);
    }

    async function handleSaveClick(event: React.MouseEvent<Element, MouseEvent>) {
        try {
            setLoading(true);
            if (user.id)
                await userService.update(user);
            else
                await userService.create(user);
            setLoading(false);
            setSnackbar('Пользователь успешно сохранен', true, SnackbarVariant.success);
        }
        catch (error) {
            if (error instanceof ApplicationError) {
                setLoading(false)
                setSnackbar(error.message, true, SnackbarVariant.error);
            }
        }
    }

    function handleCancelClick(event: React.MouseEvent<Element, MouseEvent>) {
        loadUser();
    }

    const { classes } = props;

    const userDisciplines = user.pinnedDisciplines || [];

    let disciplinesForDialog: DisciplineTitle[] = [];

    if (!selectedTitle) {
        disciplinesForDialog = disciplinesTitles.filter(o => !userDisciplines.map(o => o.disciplineTitleId).includes(o.id));
    } else {
        const userDisciplinesWithoutSelectedDiscipline = userDisciplines.filter(o => o.disciplineTitleId !== selectedTitle.id).map(o => o.disciplineTitleId);
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
                                    pinnedDisciplines={user.pinnedDisciplines}
                                    handleDelete={handlePinnedDisciplineDelete}
                                    handleEdit={handlePinnedDisciplineEdit}
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Card>
                </Grid>
                <Grid item xs={2} />
                <MessageSnackbar
                    variant={snackbar.variant}
                    message={snackbar.message}
                    open={snackbar.open}
                    onClose={() => setSnackbar('', false, undefined)}
                />
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