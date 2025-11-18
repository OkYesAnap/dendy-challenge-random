const isDev = process.env.NODE_ENV === 'development';
export const audioPath = isDev ? '/audio/' : '/dendy-challenge-random/audio/';
export const audioSrcNames = [
    '01-Title.mp3',
    '02-Intermission.mp3',
    '03-Ragnaroks-Canyon-(Level-1).mp3',
    '04-Wookie-Hole(Leve-2).mp3',
    '06-Turbo-Tunnel-Speeder-Bike-(Level-3-2).mp3',
    '07-Arctic-Caverns-(Level-4).mp3',
    '12-Intruder-Excluder-(Level-8).mp3',
];