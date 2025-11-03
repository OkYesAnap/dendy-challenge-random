import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDisabledSlots, randomRoll, shuffleArr as shuffleStrArray, sortArr } from './gamesLogics';
import { getGamesList, GoogleSheetsParams, ParsedSheetData } from '@/utils/getGamesList';
import {Cols} from "@/app/roulette/types";

export const getAllGamesList = createAsyncThunk('games/getGamesList', async (params: GoogleSheetsParams) => {
    return await getGamesList(params)
});

const addSlotsAction = createAction<{ slots: string[] }>('games/addSlots');
const addDisabledSlotsAction = createAction<string[]>('games/addDisabledSlots');

export interface GamesState {
    allGamesList: string[];
    allData: string[][];
    headers: Cols[];
    startSlots: string[];
    currentRolls: string[];
    slotsList: string[];
    statistics: { [key: string]: number };
    gamesInEvent: number;
    showVisualEvents: number;
    eventsList: Array<Array<string>>;
    blackFieldsCounter: number;
    eventsCounter: number;
    rollCounter: number;
    currentSlot: string;
    loading: boolean;
    volume: number;
}

const initialState: GamesState = {
    allGamesList: [],
    allData: [],
    headers: [],
    startSlots: [],
    currentRolls: [],
    slotsList: [],
    statistics: {},
    gamesInEvent: 7,
    showVisualEvents: 6,
    eventsList: [],
    blackFieldsCounter: 0,
    eventsCounter: 0,
    rollCounter: 0,
    currentSlot: '',
    loading: false,
    volume: 50
};

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        setAllGamesList(state, action: PayloadAction<Array<string>>) {
            state.allGamesList = action.payload;
        },
        setStartSlots(state, action: PayloadAction<Array<string>>) {
            state.startSlots = action.payload;
        },
        addSlots(state, action: PayloadAction<{ slots: string[] }>) {
            const { slots } = action.payload
            state.startSlots = [...state.allGamesList, ...slots];
            state.slotsList = state.startSlots;
            gamesSlice.caseReducers.resetStatistics(state);
        },
        addRoll(state, action: PayloadAction<number>) {
            const winSlot = action.payload;
            const value = state.slotsList[winSlot];
            state.currentSlot = value;
            state.slotsList.splice(winSlot, 1);
            state.currentRolls.push(value);
        },
        addDisabledSlots(state, action: PayloadAction<string[]>){
            state.currentRolls = action.payload;
            state.slotsList = state.slotsList.filter((item) => !action.payload.includes(item));
        },
        addRandomRoll(state) {
            randomRoll(state);
        },
        rollOneStep(state) {
            const last = state.slotsList.shift();
            state.slotsList.push(last || '');
        },
        setCurrentSlot(state, action: PayloadAction<string>) {
            state.currentSlot = action.payload;
        },
        setGamesInEvent(state, action: PayloadAction<number>) {
            let val = action.payload;
            const max = state.startSlots.length;
            const min = 1;
            if (val > max) val = max;
            if (val < min) val = min;
            state.gamesInEvent = val;
        },
        shuffleRouletteList(state) {
            const { slotsList } = state;
            state.slotsList = shuffleStrArray(slotsList);
        },
        syncAllDataAndSlotsList(state) {
            const { allData, slotsList } = state;
            state.slotsList = allData.reduce((acc, allDataItem) => {
                const find = slotsList.find(slotItem => slotItem === allDataItem[0]);
                if (find) acc.push(find);
                return acc
            }, [])
        },
        shuffleAllGamesList(state) {
            const { allData } = state;
            const shuffledAllData = shuffleStrArray(allData);
            state.allData = shuffleStrArray(shuffledAllData);
            gamesSlice.caseReducers.syncAllDataAndSlotsList(state);
        },
        sortAllGamesList(state) {
            const { allData } = state;
            state.allData = sortArr(allData);
            gamesSlice.caseReducers.syncAllDataAndSlotsList(state);
        },
        resetStatistics(state) {
            state.statistics = {};
            state.currentRolls = [];
            state.eventsList = [];
            state.startSlots.forEach(item => state.statistics[item] = 0);
            state.blackFieldsCounter = 0;
            state.eventsCounter = 0;
            state.rollCounter = 0;
        },
        setVolume(state, action: PayloadAction<number>) {
            state.volume = action.payload;
        },
        resetStartSlots() {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllGamesList.pending, (state) => {
                state.loading = true
                gamesSlice.caseReducers.addSlots(state, addSlotsAction({ slots: [] }))
            }).addCase(getAllGamesList.fulfilled, (state, action: PayloadAction<ParsedSheetData>) => {
                state.loading = false
                state.allGamesList = action.payload.data.map(item => item[0]);
                state.allData = action.payload.data;
                state.headers = action.payload.headers;
                gamesSlice.caseReducers.addSlots(state, addSlotsAction({ slots: [] }))
                const findDisabled =  getDisabledSlots(action.payload.data);
                gamesSlice.caseReducers.addDisabledSlots(state, addDisabledSlotsAction(findDisabled))
            });
    },
});

export const {
    setAllGamesList,
    setStartSlots,
    addRoll,
    addRandomRoll,
    addSlots,
    setCurrentSlot,
    setGamesInEvent,
    resetStatistics,
    rollOneStep,
    shuffleRouletteList,
    shuffleAllGamesList,
    sortAllGamesList,
    resetStartSlots,
    setVolume
} = gamesSlice.actions;

export const allGamesList = (state: { games: GamesState }) => state.games.allGamesList;
export const allData = (state: { games: GamesState }) => state.games.allData;
export const headers = (state: { games: GamesState }) => state.games.headers;
export const startSlots = (state: { games: GamesState }) => state.games.startSlots;
export const currentRolls = (state: { games: GamesState }) => state.games.currentRolls;
export const statistics = (state: { games: GamesState }) => state.games.statistics;
export const slotsList = (state: { games: GamesState }) => state.games.slotsList;
export const eventsList = (state: { games: GamesState }) => state.games.eventsList;
export const blackFieldsCounter = (state: { games: GamesState }) => state.games.blackFieldsCounter;
export const eventsCounter = (state: { games: GamesState }) => state.games.eventsCounter;
export const rollCounter = (state: { games: GamesState }) => state.games.rollCounter;
export const currentSlot = (state: { games: GamesState }) => state.games.currentSlot;
export const gamesInEvent = (state: { games: GamesState }) => state.games.gamesInEvent;
export const loading = (state: { games: GamesState }) => state.games.loading;
export const volume = (state: { games: GamesState }) => state.games.volume;

export default gamesSlice.reducer;