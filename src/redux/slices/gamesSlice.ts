import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { randomRoll } from './gamesLogics';
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
}

const initialState: GamesState = {
    allGamesList: [],
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
        shuffle(state) {
            const shuffledArray = [];
            const { slotsList } = state;
            do {
                const rndIndex = Math.floor(Math.random() * slotsList.length);
                shuffledArray.push(slotsList[rndIndex]);
                slotsList.splice(rndIndex, 1);
            } while (slotsList.length)
            state.slotsList = shuffledArray;
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
        resetStartSlots(state) {
            state.startSlots = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllGamesList.pending, (state) => {
                state.loading = true
                gamesSlice.caseReducers.addSlots(state, addSlotsAction({ slots: [] }))
            }).addCase(getAllGamesList.fulfilled, (state, action: PayloadAction<Array<Array<string>>>) => {
                state.loading = false
                state.allGamesList = action.payload.map(item => item[0]);
                console.log(action.payload);
                gamesSlice.caseReducers.addSlots(state, addSlotsAction({ slots: [] }))
            });
    },
});

export const { setAllGamesList,
    setStartSlots,
    addRoll,
    addRandomRoll,
    addSlots,
    setCurrentSlot,
    setGamesInEvent,
    resetStatistics,
    rollOneStep,
    shuffle,
    resetStartSlots
} = gamesSlice.actions;
export const allGamesList = (state: { games: GamesState }) => state.games.allGamesList;
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

export default gamesSlice.reducer;