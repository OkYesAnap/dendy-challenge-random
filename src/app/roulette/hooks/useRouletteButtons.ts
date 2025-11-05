import {ReactSetState} from "@/app/roulette/types";
import React from "react";
import {audioSrcNames} from "@/constants/audioEnv";
import {CellData} from "@/utils/getGamesList";
import {defaultCellData} from "@/redux/slices/gamesSlice";

export const useRouletteButtons = ({setAudioSrcName, setSpinning, audioStopRef, setClearList, setCurrentGame, setOpenRoll}: {
    setAudioSrcName: ReactSetState<string>,
    setSpinning: ReactSetState<boolean>,
    audioStopRef: React.RefObject<HTMLAudioElement | null>,
    setClearList: ReactSetState<boolean>,
    setCurrentGame: ReactSetState<CellData>,
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
        setCurrentGame(defaultCellData);
        setTimeout(() => {
            setOpenRoll();
        }, 500);
    };
return {startSpinning, stopSpinning, closeRoulette}
}