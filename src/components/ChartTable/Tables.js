import React, { Fragment, ReactNode } from "react";
import AltChartTable from "components/AltChartTable";

import moment from "moment";
import numeral from "numeral";

import { transpose } from "d3-array";
import * as Styles from "./ChartTable.styles";
import { Table } from "govuk-react-jsx";

import type {
    EnglandTableProps, TablesProps,
    TableStructure, TitleOrDescription
} from "./ChartTable.types"


const sortByDate = (a, b) => {

    const
        dateA = new Date(a.date),
        dateB = new Date(b.date);

    return (dateA < dateB) || -((dateA > dateB) || 0)

}; // sortByDate


const ageSexSort = (a, b) => {

    const
        ageA = parseInt(/^(\d+).*$/.exec(a.age)[1]),
        ageB = parseInt(/^(\d+).*$/.exec(b.age)[1]);

    if ( ageA > ageB ) return 1;

    return ageA < ageB ? -1 : 0

}; // ageSexSort


const EnglandDailyCasesStructure = ({ titles, descriptions }: TitleOrDescription): TableStructure => ({
    metadata: [
        {
            key: 'previouslyReportedDailyCases',
            headings: { value: 'Date', type: 'string' },
            type: 'date',
            formatter: moment,
            format: 'DD MMM YYYY',
            valueGetter: (d) => d.date
        },
        {
            key: 'previouslyReportedDailyCases',
            headings: { value: 'Previously reported', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        },
        {
            key: 'changeInDailyCases',
            headings: { value: 'Change', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        },
        {
            key: 'dailyConfirmedCases',
            headings: { value: 'Confirmed cases', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        }
    ],
    sortFunc: sortByDate,
    extra: {
        intro: titles.dailyCases,
        description: descriptions.dailyCases,
    }
}); // englandDailyCasesStructure


const EnglandDailyTotalCasesStructure = ({ titles, descriptions }: TitleOrDescription): TableStructure => ({
    metadata: [
        {
            key: 'previouslyReportedDailyTotalCases',
            headings: { value: 'Date', type: 'string' },
            type: 'date',
            formatter: moment,
            format: 'DD MMM YYYY',
            valueGetter: (d) => d.date
        },
        {
            key: 'previouslyReportedDailyTotalCases',
            headings: { value: 'Previously reported', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        },
        {
            key: 'changeInDailyTotalCases',
            headings: { value: 'Change', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        },
        {
            key: 'dailyTotalConfirmedCases',
            headings: { value: 'Total confirmed cases', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        }
    ],
    sortFunc: sortByDate,
    extra: {
        intro: titles.totalCases,
        description: descriptions.totalCases,
    }
}); // EnglandDailyTotalCasesStructure


const EnglandAgeSexStructure = ({ titles, descriptions }: TitleOrDescription): TableStructure => ({
    metadata: [
        {
            key: 'maleCases',
            headings: { value: 'Age group', type: 'string' },
            type: 'string',
            formatter: (v) => ({ format: (r) => v.replace(/_/g, r) }),
            format: ' ',
            valueGetter: (d) => d.age.replace(/_/, ' ')
        },
        {
            key: 'maleCases',
            headings: { value: 'Male cases', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        },
        {
            key: 'femaleCases',
            headings: { value: 'Female cases', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        }
    ],
    sortFunc: ageSexSort,
    extra: {
        intro: titles.ageSex,
        description: descriptions.ageSex
    }
}); // englandDailyCasesStructure


export const GenericTable = ({ data, structure }: EnglandTableProps): React.ReactNode => {

    const
        dataKeys = structure.metadata.map(item => item.key),
        dataArray = transpose(dataKeys.map(key => data[key].sort(structure.sortFunc)));

    return <Styles.Container className="govuk-!-margin-bottom-9">
        {
            structure?.extra?.intro ?? null
                ? <span className={ "govuk-heading-s" }>{ structure.extra.intro }</span>
                : null
        }
        <Styles.Table>
            <Table
                tabIndex={ 0 }
                head={
                    dataKeys.map((_, index) => ({
                        children: [structure.metadata[index].headings.value],
                        format: structure.metadata[index].headings.type
                    }))
                }
                rows={
                    dataArray.map(item =>
                        dataKeys.map((_, index) => ({
                            children: structure
                                .metadata[index]
                                .formatter(structure.metadata[index].valueGetter(item[index]))
                                .format(structure.metadata[index].format),
                            format: structure.metadata[index].type
                        }))
                    )
                }
            />
        </Styles.Table>
        {
            structure?.extra?.description ?? null
                ? <Styles.P className={ "govuk-body govuk-!-font-size-14 govuk-!-margin-top-5" }>
                    { structure.extra.description }
                </Styles.P>
                : null
        }
    </Styles.Container>

}; // EnglandTable


/**
 * Produces the tables.
 *
 * @param data { Data }
 * @param titles { TitleOrDescriptionValues }
 * @param descriptions { TitleOrDescriptionValues }
 * @returns { ReactNode }
 */
export const Tables = ({ data, titles, descriptions }: TablesProps): ReactNode => {

    const {
        overview: { K02000001: UnitedKingdom = {} },
        countries: { E92000001: England = {} }
    } = data;

    return <Fragment>
        <GenericTable
            data={ England }
            structure={
                EnglandDailyTotalCasesStructure({
                    titles: titles,
                    descriptions: descriptions
                }) }
        />

        <GenericTable
            data={ England }
            structure={
                EnglandDailyCasesStructure({
                    titles: titles,
                    descriptions: descriptions
                }) }
        />

        <GenericTable
            data={ England }
            structure={
                EnglandAgeSexStructure({
                    titles: titles,
                    descriptions: descriptions
                }) }
        />

        <AltChartTable
            data={ UnitedKingdom?.dailyTotalDeaths ?? [] }
            header={ titles.totalDeaths }
            valueName="Total deaths"
        />

        <AltChartTable
            data={ UnitedKingdom?.dailyDeaths ?? [] }
            header={ titles.dailyDeaths }
            valueName="Daily deaths"
        />
    </Fragment>

}; // tables
