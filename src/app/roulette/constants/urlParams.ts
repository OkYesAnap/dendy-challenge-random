export interface UrlParams {
    hint?: string;
    url: string
    range: string
    header: boolean
}

export const defaultParams: UrlParams = {
    url: "",
    range: "A1:A1000",
    header: false
}

export const templates: Array<UrlParams> = [{
    hint: "Dendy Challenge 2025",
    range: "A1:C60",
    url: "https://docs.google.com/spreadsheets/d/1lQKxm4V-xac7sl0mrwcgOg1BLpHGAy_f873ls0hoVeM/edit?gid=1031682936",
    header: false
},{
    hint: "8-bit Challenge: Global Research - Famicom/FDS",
    range: "A1:Z1500",
    url: "https://docs.google.com/spreadsheets/d/1d8xJrgTGSQilXd8UEbQUtAf5OTLiZASRumVNbZcbLZQ/edit?gid=890290760",
    header: true
},{
    hint: "8-bit Challenge: Global Research NES (NTSC)",
    range: "A1:Z1500",
    url: "https://docs.google.com/spreadsheets/d/1d8xJrgTGSQilXd8UEbQUtAf5OTLiZASRumVNbZcbLZQ/edit?gid=481799788",
    header: true
},{
    hint: "8-bit Challenge: Global Research NES (PAL)",
    range: "A1:Z1500",
    url: "https://docs.google.com/spreadsheets/d/1d8xJrgTGSQilXd8UEbQUtAf5OTLiZASRumVNbZcbLZQ/edit?gid=1298713468",
    header: true
}];
