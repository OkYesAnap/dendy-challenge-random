import axios from "axios";

interface SheetsResponse {
    table: {
        rows: Array<{
            c: Array<{
                v: string;
            }>
        }>,
        cols: Array<{
            id: string;
            label: string;
            type: string;
        }>
    }
}


export interface GoogleSheetsParams {
    url: string,
    range: string,
    header: boolean,
}

export interface ParsedSheetData {
    headers: string[],
    data: string[][]
}

function extractIds(url: string) {
    const regex = /\/d\/(.*?)\/.*\?gid=(\d+)/;
    const match = url.match(regex);

    if (match) {
        const id = match[1];
        const gid = match[2];
        return { id, gid };
    }

    return {};
}


export const getGamesList = async ({ url, range, header }: GoogleSheetsParams): Promise<ParsedSheetData> => {
    const { id, gid } = extractIds(url);
    let headers: string[] = [];
    try {
        const response = await axios.get(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&gid=${gid}&range=${range}`);
        const text = response.data;
        const json = JSON.parse(text.substr(47).slice(0, -2)) as SheetsResponse;
        const { rows, cols } = json.table;
        const isLabel = cols[0].label;
        const firstElementNeeded = header && !isLabel
        const addLabelsToHeaders = header && isLabel
        let idNum = firstElementNeeded ? 0 : 1;
        const data = rows.reduce((accum: string[][], row) => {
            if (row.c[0]?.v) {
                accum.push([]);
                const current = accum[accum.length - 1];
                current.push(`${idNum++}. ${row.c[0]?.v}`, row.c[0]?.v);
                if (row.c.length > 1) {
                    row.c.forEach((item, i) => {
                        if (row.c[i]?.v && i) {
                            current.push(item.v);
                        }
                    })
                }
            }
            return accum
        }, []);
        if (firstElementNeeded) headers = data.shift() || []
        if (addLabelsToHeaders) headers = ['', ...cols.map(item=>item.label)]
        return { headers, data }
    } catch (error) {
        console.error('Error fetching data:', error);
        return { headers: [], data: [] }
    }
};