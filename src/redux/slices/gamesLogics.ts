import { GamesState } from "./gamesSlice";

export const randomRoll = (state:GamesState) => {
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
