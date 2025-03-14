import { getGamesList } from '@/utils/getGamesList';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const getAllGamesList = createAsyncThunk('games/getGamesList', getGamesList);

interface GamesState {
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
    currentSlot: ''
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
            action.payload.forEach(item => state.statistics[item] = 0);
        },
        addBlackSlots(state, action: PayloadAction<{ blackSlots?: number, customSlots: string[] }>) {
            const blackSlotsArray = [];
            const { customSlots, blackSlots } = action.payload
            if (blackSlots) {
                for (let i = 0; i < blackSlots; i++) {
                    blackSlotsArray.push(`Black slot ${i + 1}`)
                }
            }
            state.startSlots = [...state.allGamesList, ...blackSlotsArray, ...customSlots];
            state.beginEvent = state.startSlots;
            gamesSlice.caseReducers.resetStatistics(state);
        },
        addRoll(state) {
            const slotNumber = Math.floor((Math.random() * state.beginEvent.length));
            const value = state.beginEvent[slotNumber];
            state.currentSlot = value;
            state.beginEvent.splice(slotNumber, 1);
            state.currentRolls.push(value);

            if (state.gamesInEvent <= state.currentRolls.length) {
                state.eventsList.push(state.currentRolls);
                if (state.currentRolls.find(item => item.includes('Black slot'))) {
                    state.blackFieldsCounter += 1;
                }
                state.currentRolls = [];
                state.beginEvent = state.startSlots;
                state.eventsCounter += 1;
            }
            if (state.showVisualEvents <= state.eventsList.length) {
                state.eventsList = []
            }
            state.statistics[value] += 1 || 0;
            state.rollCounter += 1;
        },
        setBeginDay(state) {
            state.beginEvent = state.startSlots
        },
        setCurrentSlot(state, action: PayloadAction<string>) {
            state.currentSlot = action.payload;
        },
        setGamesInEvent(state, action: PayloadAction<number>) {
            let val = action.payload;
            const max = state.allGamesList.length;
            const min = 1;
            if (val > max) val = max;
            if (val < min) val = min;
            state.gamesInEvent = val;
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
            .addCase(getAllGamesList.fulfilled, (state, action: PayloadAction<Array<string>>) => {
                state.allGamesList = action.payload;
            });
    },
});

export const { setAllGamesList,
    setStartSlots,
    addRoll,
    addBlackSlots,
    setCurrentSlot,
    setGamesInEvent,
    resetStatistics
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

export default gamesSlice.reducer;