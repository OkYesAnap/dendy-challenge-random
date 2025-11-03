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
    hint: "8-bit Challenge: Global Research - Famicom/FDS",
    range: "A1:Z1500",
    url: "https://docs.google.com/spreadsheets/d/1d8xJrgTGSQilXd8UEbQUtAf5OTLiZASRumVNbZcbLZQ/edit?gid=890290760",
    header: true
},{
    hint: "8-bit Challenge: Global Research NES (NTSC)",
    range: "A1:Z1500",
    url: "https://docs.google.com/spreadsheets/d/1d8xJrgTGSQilXd8UEbQUtAf5OTLiZASRumVNbZcbLZQ/edit?gid=481799788#gid=481799788",
    header: true
},{
    hint: "8-bit Challenge: Global Research NES (PAL)",
    range: "A1:Z1500",
    url: "https://docs.google.com/spreadsheets/d/1d8xJrgTGSQilXd8UEbQUtAf5OTLiZASRumVNbZcbLZQ/edit?gid=1298713468#gid=1298713468",
    header: true
}];
