import { GoogleSheetsParams } from "@/redux/slices/gamesSlice";
import axios from "axios";

interface SheetsResponse {
    table: {
        rows: Array<{
            c: Array<{
                v: string
            }>
        }>
    }
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

export const getGamesList = async ({ url, range }: GoogleSheetsParams) => {
    const { id, gid } = extractIds(url);
    try {
        const response = await axios.get(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&gid=${gid}&range=${range}`);
        const text = response.data;
        const json = JSON.parse(text.substr(47).slice(0, -2)) as SheetsResponse;
        const { rows } = json.table
        // const rows = json.table.rows.map((row, index) => `${index + 1}. ${row.c[0]?.v}`);
        const parseRows = rows.reduce((accum: string[], row) => {
            // let field: GoogleParsedItem
            if (row.c[0]?.v) {
                accum.push(`${accum.length + 1}. ${row.c[0]?.v}`);
            }
            return accum
        }, []);
        return parseRows
    } catch (error) {
        console.error('Error fetching data:', error);
        return []
    }
};