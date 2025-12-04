export const calcRadius = (segments:number) => {
    if (segments < 35) return 3.5;
    return segments / 10;
};

export const calcHeight = (maxLength:number) => {
    return maxLength * 0.1 + 0.2;
};

export const calcRandomAddRollTime = ():number => {
    return Math.round(Math.random() * 10 + 5);
};