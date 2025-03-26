import { GamesState } from "./gamesSlice";

export const randomRoll = (state: GamesState) => {
    const slotNumber = Math.floor((Math.random() * state.slotsList.length));
    const value = state.slotsList[slotNumber];
    state.currentSlot = value;
    state.slotsList.splice(slotNumber, 1);
    state.currentRolls.push(value);

    if (state.gamesInEvent <= state.currentRolls.length) {
        state.eventsList.push(state.currentRolls);
        if (state.currentRolls.find(item => item.includes('Black slot'))) {
            state.blackFieldsCounter += 1;
        }
        state.currentRolls = [];
        state.slotsList = state.startSlots;
        state.eventsCounter += 1;
    }
    if (state.showVisualEvents <= state.eventsList.length) {
        state.eventsList = []
    }
    state.statistics[value] += 1 || 0;
    state.rollCounter += 1;
}

export const shuffleArr = <T extends string[] | string[][]>(arr: T): T => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const sortArr = <T extends string[][]>(arr: T): T => {
    if (Array.isArray(arr) && arr.length > 0) {
        return arr.sort((a, b) => {
            const numA = parseInt(a[0], 10);
            const numB = parseInt(b[0], 10);
            return numA - numB;
        });
    }
    return arr;
}