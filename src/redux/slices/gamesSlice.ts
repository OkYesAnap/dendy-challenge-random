import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { roll } from './gamesLogics';
import { getGamesList } from '@/utils/getGamesList';

export interface GoogleSheetsParams {
    url: string,
    range: string
}

export const getAllGamesList = createAsyncThunk('games/getGamesList', async (params: GoogleSheetsParams) => {
    return await getGamesList(params)
});

const addSlotsAction = createAction<{ slots: string[] }>('games/addSlots');

export interface GamesState {
    allGamesList: string[];
    startSlots: string[];
    currentRolls: string[];
    beginEvent: string[];
    statistics: { [key: string]: number };
    gamesInEvent: number;
    showVisualEvents: number;
    eventsList: Array<Array<string>>;
    blackFieldsCounter: number;
    eventsCounter: number;
    rollCounter: number;
    currentSlot: string;
    loading: boolean;
}

const initialState: GamesState = {
    allGamesList: [],
    startSlots: [],
    currentRolls: [],
    beginEvent: [],
    statistics: {},
    gamesInEvent: 7,
    showVisualEvents: 6,
    eventsList: [],
    blackFieldsCounter: 0,
    eventsCounter: 0,
    rollCounter: 0,
    currentSlot: '',
    loading: false
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
            state.beginEvent = state.startSlots;
            gamesSlice.caseReducers.resetStatistics(state);
        },
        addRoll(state) {
            roll(state);
        },
        rollOneStep(state) {
            const last = state.beginEvent.shift();
            state.beginEvent.push(last || '');
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
        shuffle(state) {
            const shuffledArray = [];
            const { beginEvent } = state;
            do {
                const rndIndex = Math.floor(Math.random() * beginEvent.length);
                shuffledArray.push(beginEvent[rndIndex]);
                beginEvent.splice(rndIndex, 1);
            } while (beginEvent.length)
            state.beginEvent = shuffledArray;
        },
        resetStatistics(state) {
            state.statistics = {};
            state.currentRolls = [];
            state.eventsList = [];
            state.startSlots.forEach(item => state.statistics[item] = 0);
            state.blackFieldsCounter = 0;
            state.eventsCounter = 0;
            state.rollCounter = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllGamesList.pending, (state) => {
                state.loading = true
                gamesSlice.caseReducers.addSlots(state, addSlotsAction({ slots: [] }))
            }).addCase(getAllGamesList.fulfilled, (state, action: PayloadAction<Array<string>>) => {
                state.loading = false
                state.allGamesList = action.payload;
                gamesSlice.caseReducers.addSlots(state, addSlotsAction({ slots: [] }))
            });
    },
});

export const { setAllGamesList,
    setStartSlots,
    addRoll,
    addSlots,
    setCurrentSlot,
    setGamesInEvent,
    resetStatistics,
    rollOneStep,
    shuffle
} = gamesSlice.actions;
export const allGamesList = (state: { games: GamesState }) => state.games.allGamesList;
export const startSlots = (state: { games: GamesState }) => state.games.startSlots;
export const currentRolls = (state: { games: GamesState }) => state.games.currentRolls;
export const statistics = (state: { games: GamesState }) => state.games.statistics;
export const beginEvent = (state: { games: GamesState }) => state.games.beginEvent;
export const eventsList = (state: { games: GamesState }) => state.games.eventsList;
export const blackFieldsCounter = (state: { games: GamesState }) => state.games.blackFieldsCounter;
export const eventsCounter = (state: { games: GamesState }) => state.games.eventsCounter;
export const rollCounter = (state: { games: GamesState }) => state.games.rollCounter;
export const currentSlot = (state: { games: GamesState }) => state.games.currentSlot;
export const gamesInEvent = (state: { games: GamesState }) => state.games.gamesInEvent;
export const loading = (state: { games: GamesState }) => state.games.loading;

export default gamesSlice.reducer;