import axios from "axios";
import {Cols} from "@/app/roulette/types";

export interface GoogleSheetsParams {
    url: string,
    range: string,
    header?: boolean,
}

export interface CellData {
    formattedValue: string,
    hyperlink?: string
}

export interface ParsedSheetData {
    headers: Cols[],
    data: string[][]
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

const apiKey = "AIzaSyAJRnfNSh5XllaAReLgmrmy-yhCW8APsJI";

const getHeadersNames = (sheet: {
    tables: Array<{
        columnProperties: Array<{ columnName: string }>
    }>
}): Cols[] => {
    const headersData: Cols[] = sheet.tables[0].columnProperties.map((col: {
        columnName: string
    }) => ({
        label: col.columnName
    }));
    return headersData;
}

const getAllData = (rows: {
    values: Array<CellData>
}, i: number): string[] => {
    if(Object.keys(rows).length === 0) return [`${i + 1}.`]
    return [`${i + 1}. ${rows.values[0].formattedValue}`, ...rows.values.map(item => item.hyperlink || item.formattedValue)]
}

const getGameListWithApi = async ({url, range, header}: GoogleSheetsParams): Promise<ParsedSheetData> => {
    console.log(header);
    let headers: Cols[] = [];
    const {id, gid} = extractIds(url);

    const urlWithApi = `https://sheets.googleapis.com/v4/spreadsheets/${id}?key=${apiKey}`;
    const response = await axios.get(urlWithApi);
    const findSheet = await response.data.sheets.find((props: {
        properties: { sheetId: string }
    }) => Number(props.properties.sheetId) === Number(gid));
    const encodeSheetName = encodeURIComponent(findSheet.properties.title)
    const currentSheet = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${id}?includeGridData=true&ranges=${encodeSheetName}!${range}&key=${apiKey}`);
    const sheet = currentSheet.data.sheets[0];
    const sheetData = sheet.data[0].rowData;

    if (sheet.tables) {
        headers = getHeadersNames(sheet)
        sheetData.shift();
    }
    const data = sheetData.map(getAllData);

    return {headers, data};
}

export const getGamesList = async ({url, range, header}: GoogleSheetsParams): Promise<ParsedSheetData> => {
    try {
        return getGameListWithApi({url, range, header});
    } catch (error) {
        console.error('Error fetching data:', error);
        return {headers: [], data: []}
    }

    // interface SheetsResponse {
    //     table: {
    //         rows: Array<{
    //             c: Array<{
    //                 v: string;
    //                 f?: string;
    //             }>
    //         }>,
    //         cols: Cols[]
    //     }
    // }
    // const {id, gid} = extractIds(url);
    // let headers: Cols[] = [];
    // await getGameListWithApi({url, range, header});
    // try {
    //     const response = await axios.get(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&gid=${gid}&range=${range}`);
    //     const text = response.data;
    //     const json = JSON.parse(text.substr(47).slice(0, -2)) as SheetsResponse;
    //     const {rows, cols} = json.table;
    //     const isLabel = cols[0].label;
    //     const firstElementNeeded = header && !isLabel
    //     const addLabelsToHeaders = header && isLabel
    //     let idNum = firstElementNeeded ? 0 : 1;
    //     const data = rows.reduce((accum: string[][], row) => {
    //         if (row.c[0]?.v) {
    //             accum.push([]);
    //             const current = accum[accum.length - 1];
    //             current.push(`${idNum++}. ${row.c[0]?.v}`);
    //             row.c.forEach((item) => {
    //                 current.push(item?.f || item?.v || "");
    //             })
    //         }
    //         return accum
    //     }, []);
    //     if (addLabelsToHeaders) headers = [...cols]
    //     return {headers, data}
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    //     return {headers: [], data: []}
    // }
};