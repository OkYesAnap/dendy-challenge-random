import {ReactSetState} from "@/app/roulette/types";
import React from "react";
import {audioSrcNames} from "@/constants/audioEnv";

export const useRouletteButtons = ({setAudioSrcName, setSpinning, audioStopRef, setClearList, setCurrentGame, setOpenRoll}: {
    setAudioSrcName: ReactSetState<string>,
    setSpinning: ReactSetState<boolean>,
    audioStopRef: React.RefObject<HTMLAudioElement | null>,
    setClearList: ReactSetState<boolean>,
    setCurrentGame: ReactSetState<string>,
    setOpenRoll: () => void,
}) => {
    const startSpinning = () => {
        const randomSample = Math.floor(Math.random() * (audioSrcNames.length));
        setAudioSrcName(audioSrcNames[randomSample]);
        setSpinning(true);
    };

    const stopSpinning = () => {
        setSpinning(false);
        if (audioStopRef.current) {
            audioStopRef.current.currentTime = 0;
            audioStopRef.current.play();
        }
    };

    const closeRoulette = () => {
        setClearList(true);
        setCurrentGame('');
        setTimeout(() => {
            setOpenRoll();
        }, 500);
    };
return {startSpinning, stopSpinning, closeRoulette}
}