import axios from "axios";

const sheetId = '1lQKxm4V-xac7sl0mrwcgOg1BLpHGAy_f873ls0hoVeM';
const range = 'Список игр 2025!A1:A60';

interface SheetsResponse {
    table: {
        rows: Array<{
            c: Array<{
                v: string
            }>
        }>
    }
}

export const getGamesList = async () => {
    try {
        const response = await axios.get(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&range=${range}`);
        const text = response.data;
        const json = JSON.parse(text.substr(47).slice(0, -2)) as SheetsResponse;
        const rows = json.table.rows.map((row, index) => `${index + 1}. ${row.c[0].v}`);
        return rows
    } catch (error) {
        console.error('Error fetching data:', error);
        return []
    }
};