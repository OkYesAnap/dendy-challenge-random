import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './slices/gamesSlice';

const store = configureStore({
    reducer: {
        games: gamesReducer,
    },
});


export type AppDispatch = typeof store.dispatch;
export default store;