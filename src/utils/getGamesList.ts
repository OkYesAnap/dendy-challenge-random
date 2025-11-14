import axios from "axios";
import {Cols} from "@/app/roulette/types";
import {GetThunkAPI} from "@reduxjs/toolkit";
import {AsyncThunkConfig} from "@/redux/slices/gamesSlice";

const apiKey = "AIzaSyAJRnfNSh5XllaAReLgmrmy-yhCW8APsJI";

export interface GoogleSheetsParams {
    url: string,
    range: string,
    header?: boolean,
}

export interface CellData {
    formattedValue: string,
    hyperlink?: string
}

export interface Names {
    fileName: string,
    sheetName: string,
}

export interface ParsedSheetData {
    headers: Cols[],
    data: CellData[][],
    names?: Names,
}

function extractIds(url: string) {
    const regex = /\/d\/(.*?)\/.*\?gid=(\d+)/;
    const match = url.match(regex);

    if (match) {
        const id = match[1];
        const gid = match[2];
        return {id, gid};
    }

    return {};
}

interface ApiRows {
    values: CellData[]
}

interface ApiRanges {
    rowData: Array<ApiRows>
}

interface CurrentRange {
    data: {
        rowData: {
            values: [];
        }[];
    }[];
}

interface CurrentSheet {
    data: {
        sheets: CurrentRange[];
    }
}

const getHeadersNames = (sheet: CurrentRange): Cols[] => sheet.data.reduce((
    headersAcc: Cols[], range: { rowData: Array<{ values: CellData[] }> }) => {
    range.rowData[0].values.forEach(val => {
        headersAcc = [...headersAcc, {
            label: val.formattedValue
        }]
    });
    return headersAcc;
}, [])


const getAllData = (sheetData: ApiRows[]): CellData[][] => {

    return sheetData.reduce((reduceData: CellData[][], rows: ApiRows): CellData[][] => {
            if (rows.values[0].formattedValue) {
                const index = reduceData.length
                reduceData.push([]);
                reduceData[index].push(
                    {formattedValue: `${index + 1}. ${rows.values[0].formattedValue}`},
                    ...rows.values)
            }
            return reduceData;
        }, []
    )
}

const combineRanges = (currentSheet: CurrentSheet) => {
    return currentSheet.data.sheets[0].data.reduce((accumRanges: ApiRows[], range: ApiRanges, i: number) => {
        if (i === 0) return [...range.rowData];

        for (let x = 0; x < range.rowData.length; x++) {
            accumRanges[x] = {...accumRanges[x], values: [...accumRanges[x].values, ...range.rowData[x].values]};
        }
        return accumRanges;
    }, [])
}

const getGameListWithApi = async ({url, range}: GoogleSheetsParams): Promise<ParsedSheetData> => {
    let headers: Cols[] = [];
    const {id, gid} = extractIds(url);

    const urlWithApi = `https://sheets.googleapis.com/v4/spreadsheets/${id}?key=${apiKey}`;
    const response = await axios.get(urlWithApi);
    const findSheet = await response.data.sheets.find((props: {
        properties: { sheetId: string }
    }) => Number(props.properties.sheetId) === Number(gid));
    const splitRanges = range.split(',')
    const collectRanges = splitRanges.join(`&ranges=${findSheet.properties.title}!`)
    const encodeSheetName = encodeURIComponent(findSheet.properties.title)
    const sheetAndRange = `${encodeSheetName}!${collectRanges}`
    const currentSheet = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${id}?includeGridData=true&ranges=${sheetAndRange}&key=${apiKey}`);
    const firstSheet = currentSheet.data.sheets[0];

    const haveTable = firstSheet.tables

    const sheetData = combineRanges(currentSheet);
    if (haveTable) {
        headers = getHeadersNames(firstSheet)
        sheetData.shift();
    }
    const data = getAllData(sheetData);
    const names = {fileName: currentSheet.data.properties.title, sheetName: findSheet.properties.title};

    return {headers, data, names};
}

export const getGamesList = async ({
                                       url,
                                       range,
                                       header
                                   }: GoogleSheetsParams, thunkAPI: GetThunkAPI<AsyncThunkConfig>): Promise<ParsedSheetData | undefined> => {
    try {
        return await getGameListWithApi({url, range, header});
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const serverError = error as { response: { data: unknown } };
            //@ts-expect-error Thunk types is not working
            return thunkAPI.rejectWithValue(serverError.response.data);
        }
    }
};