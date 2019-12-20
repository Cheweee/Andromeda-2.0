import * as React from "react";
import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { mergeStyles } from "../../../utilities";
import { commonStyles } from "../../../muiTheme";
import { withStyles, WithStyles } from "@material-ui/styles";
import { StudyLoad, IFilter, Column } from "../../../models";
import { TableComponent, SearchInput } from "../../common";
import { Paper, Grid, Typography, IconButton, Tooltip, Card } from "@material-ui/core";
import { AccountBalance, Search, Add, ArrowBack } from "@material-ui/icons";

const styles = mergeStyles(commonStyles);

interface Props extends WithStyles<typeof styles> {
    studyLoad: StudyLoad[];
    loading: boolean;
    filter: IFilter;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
    onBackClick: () => void;
}

export const NotDistributedStudyLoad = withStyles(styles)(function (props: Props) {

    const columns: Column[] = [
        { displayName: 'Название дисциплины', name: 'disciplineTitle' },
        { displayName: 'Семестр', name: 'semester'},
        { displayName: 'Направление', name: 'studyDirection'},
        { displayName: 'Факультет', name: 'faculty'},
        { displayName: 'Курс', name: 'course'},
        { displayName: 'Группа', name: 'studentGroup'},
        { displayName: 'Число студентов', name: 'studentsCount'},
        { displayName: 'Групп в потоке', name: 'groupsInStream'},
        { displayName: 'Учебных недель', name: 'weeksCount'},
        { displayName: 'Лекции', name: 'lections'},
        { displayName: 'Практ. занятия', name: 'practical'},
        { displayName: 'Лаб. занятия', name: 'laboratory'},
        { displayName: 'Тем. дискуссии', name: 'discussions'},
        { displayName: 'Консультации', name: 'consultation'},
        { displayName: 'Экзамены', name: 'exams'},
        { displayName: 'Зачеты', name: 'offsets'},
        { displayName: 'Контрольные, РГР, ДЗ и др.', name: 'others'},
        { displayName: 'Рефераты', name: 'abstracts'},
        { displayName: 'Контрольные работы ЗФО', name: ''},
        { displayName: 'Государственные экзамены', name: 'stateExams'},
        { displayName: 'Вступ. экз. в аспирантуру', name: 'postgraduateEntranceExams'},
        { displayName: 'Практика', name: 'practice'},
        { displayName: 'Рук. кафедрой', name: 'departmentManagement'},
        { displayName: 'НИРС', name: 'srw'},
        { displayName: 'КР, КП', name: 'courseWorks'},
        { displayName: 'Рук. ВКР', name: 'gqm'},
        { displayName: 'Рук. программой магистратуры', name: 'mpm'},
        { displayName: 'Рук. программой аспирантуры', name: 'ppm'},
        { displayName: 'Всего', name: 'total'},
    ]

    const {
        classes,
        studyLoad,
        filter,
        loading,
        onSearch,
        onSearchChange,
        onBackClick
    } = props;

    return (
        <Grid container direction="column" >
            <Grid container direction="row" alignItems="center">
                <Tooltip title="Вернуться назад">
                    <IconButton disabled={loading} onClick={onBackClick}>
                        <ArrowBack />
                    </IconButton>
                </Tooltip>
                <Typography>Нераспределенная нагрузка</Typography>
                <Grid item xs />
                <Search className={classes.searchIcon} />
                <SearchInput
                    debounce={filter.debounce}
                    search={filter.search}
                    onSearchChange={onSearchChange}
                    onSearch={onSearch}
                />
            </Grid>
            <Card className={classes.margin1Y}>
                <TableComponent columns={columns} data={studyLoad} loading={loading} />
            </Card>
        </Grid>
    );
});