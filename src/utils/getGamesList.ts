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
        let idNum = 1;
        const parseRows = rows.reduce((accum: string[][], row) => {

            if (row.c[0]?.v) {
                    accum.push([]);
                    const current = accum[accum.length - 1];
                    current.push(`${idNum++}. ${row.c[0]?.v}`);
                if (row.c.length > 1) {
                    row.c.forEach((item, i) => {
                        if (row.c[i]?.v) {
                            current.push(item.v);
                        }
                    })
                }
            }
            return accum
        }, []);
        return parseRows
    } catch (error) {
        console.error('Error fetching data:', error);
        return []
    }
};