const isDev = process.env.NODE_ENV === 'development';
export const audioPath = isDev ? '/audio/' : '/dendy-challenge-random/audio/'