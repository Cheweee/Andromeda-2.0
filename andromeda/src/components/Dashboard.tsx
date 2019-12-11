import * as React from "react";
import { withStyles, Grid, Card, CardContent, WithStyles, Typography, CardHeader, IconButton, Fab, Tooltip, TextField, Input, InputBase, CircularProgress } from "@material-ui/core";
import { mergeStyles } from "../utilities";
import { commonStyles, chartStyles } from "../muiTheme";
import { IsUnderConstruction } from "./common";

const styles = mergeStyles(chartStyles, commonStyles);

interface Props extends WithStyles<typeof styles> { }

export const Dashboard = withStyles(styles)(function (props: Props) {


    // private handleDistributeStudyLoad = () => {
    //     const {
    //         data
    //     } = this.state;
    //     const id = Math.max(...(data.map(o => o.id)), 0) + 1;

    //     const newDistributionData: DistributionBarChartData = {
    //         id: id,
    //         lecturer: "Новый преподаватель",
    //         summary: 0
    //     };
    //     data.push(newDistributionData);
    //     const newData = data.slice();

    //     this.setState({ data: newData });
    // }

    // private handleSaveStudyLoad = () => {
    //     const timer = setTimeout(() => {
    //         this.setState({
    //             saving: false
    //         });
    //         clearTimeout(timer);
    //     }, 2500);
    //     this.setState({
    //         saving: true
    //     });
    // }

    // private handleGenerateStudyLoad = () => {
    //     const timer = setTimeout(() => {
    //         this.setState({
    //             generating: false,
    //             data: initialData.slice()
    //         })
    //         clearTimeout(timer);
    //     }, 2500);

    //     this.setState({ generating: true });
    // }

    // private handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const search = event.target.value;
    //     this.setState({ search });
    // }

    // private handleDelete = (id: number) => {
    //     const {
    //         data: data
    //     } = this.state;

    //     const newData = data.filter(o => o.id !== id);

    //     this.setState({ data: newData });
    // }

    const {
        classes
    } = this.props;
    // const {
    //     studyLoad,
    //     data,
    //     search,
    //     saving,
    //     generating
    // } = this.state;
    // const allocatedStudyLoad = (data.reduce((sum, current) => sum +
    //     (current.lections ? current.lections : 0) +
    //     (current.laboratories ? current.laboratories : 0) +
    //     (current.practicals ? current.practicals : 0),
    //     0
    // ));
    // const unallocatedStudyLoad = studyLoad - allocatedStudyLoad;
    // const percentage = 100 * allocatedStudyLoad / studyLoad;

    // const buttonClassname = clsx({
    //     [classes.buttonSuccess]: !unallocatedStudyLoad && !saving,
    // });
    // const chartData = data.filter(o => o.lecturer && o.lecturer.toLowerCase().includes(search.toLowerCase()));

    return (
        <IsUnderConstruction />
        // <Grid>
        //     <Grid container direction="column" spacing={3}>
        //         <Grid container direction="row" spacing={3}>
        //             <Grid item xs={9}>
        //                 <Card className={classes.fixedHeight300}>
        //                     <CardHeader title="Нагрузка преподавателей" />
        //                     <CardContent>
        //                         <StudyLoadChart chartData={data} />
        //                     </CardContent>
        //                 </Card>
        //             </Grid>
        //             <Grid item xs={3}>
        //                 <Card className={classes.fixedHeight300}>
        //                     <CardHeader title="Прогресс" />
        //                     <CardContent>
        //                         <Grid container direction="column" alignItems="center" justify="space-between">
        //                             <PercentageCircularProgress size={140} variant="static" value={percentage} />
        //                             <Typography variant="h6">Осталось: {unallocatedStudyLoad}ч.</Typography>
        //                         </Grid>
        //                     </CardContent>
        //                 </Card>
        //             </Grid>
        //         </Grid>
        //         <Grid className={classes.margin2Top} container direction="row" spacing={3}>
        //             <Grid container direction="row" justify="flex-end" alignItems="center">
        //                 <Search className={classes.searchIcon} />
        //                 <InputBase
        //                     id="search-field"
        //                     className={classes.notUnderlined}
        //                     value={search}
        //                     onChange={this.handleSearch}
        //                     placeholder="Поиск"
        //                     margin="none"
        //                 />
        //             </Grid>
        //             {chartData && chartData.map(o =>
        //                 <Grid item xs={4}>
        //                     <LecturerStudyLoad
        //                         onDelete={this.handleDelete}
        //                         lecturer={o}
        //                     />
        //                 </Grid>
        //             )}
        //         </Grid>
        //         <div className={classes.footerSpacer}></div>
        //     </Grid>
        //     <footer className={classes.footer}>
        //         <Grid className={clsx(classes.footerContainer, classes.padding1)} container direction="row" alignItems="center">
        //             <Typography variant="h6">Всего нагрузки: {studyLoad}ч. Распределено: {allocatedStudyLoad}ч.</Typography>
        //             <Grid item xs />
        //             <Tooltip title="Автоматическое распределение нагрузки">
        //                 <div className={classes.wrapper}>
        //                     <Fab
        //                         color="primary"
        //                         onClick={this.handleGenerateStudyLoad}
        //                     >
        //                         {generating ? <PieChartRounded /> : <PieChartSharp />}
        //                     </Fab>
        //                     {generating && <CircularProgress size={68} className={classes.fabProgress} />}
        //                 </div>
        //             </Tooltip>
        //             {unallocatedStudyLoad ?
        //                 <Tooltip title="Распределить нагрузку">
        //                     <div className={classes.wrapper}>
        //                         <Fab
        //                             color="primary"
        //                             onClick={this.handleDistributeStudyLoad}
        //                         >
        //                             <Add />
        //                         </Fab>
        //                     </div>
        //                 </Tooltip>
        //                 :
        //                 <Tooltip title="Сохранить распределение">
        //                     <div className={classes.wrapper}>
        //                         <Fab
        //                             color="primary"
        //                             className={buttonClassname}
        //                             onClick={this.handleSaveStudyLoad}
        //                         >
        //                             {saving ? <Save /> : <Check />}
        //                         </Fab>
        //                         {saving && <CircularProgress size={68} className={classes.fabProgress} />}
        //                     </div>
        //                 </Tooltip>
        //             }
        //         </Grid>
        //     </footer>
        // </Grid>
    );
});