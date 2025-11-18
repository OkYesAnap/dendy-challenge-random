import {
    shuffleRouletteList,
    setVolume,
    volume as sVolume, slotsList as sSlotsList, defaultCellData,
} from '@/redux/slices/gamesSlice';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import WinGameLabel from './WinGameLabel';
import RouletteRollList from './RouletteRollList';
import {audioPath} from '@/constants/audioEnv';
import {useRouletteButtons} from "@/app/roulette/hooks/useRouletteButtons";
import SquareButton from "@/app/roulette/SquareButton";
import {CellData} from "@/utils/getGamesList";

const Roulette: React.FC<{ setOpenRoll: () => void }> = ({setOpenRoll}) => {

    const [spinning, setSpinning] = useState<boolean>(false);
    const [clearList, setClearList] = useState<boolean>(false);
    const [newRollAvailable, setNewRollAvailable] = useState<boolean>(false);
    const [currentGame, setCurrentGame] = useState<CellData>(defaultCellData);
    const [currentGamePos, setCurrentGamePos] = useState<number>(0);
    const [audioSrcName, setAudioSrcName] = useState<string>('');
    const audioRouletteRef = useRef<HTMLAudioElement>(null);
    const audioStopRef = useRef<HTMLAudioElement>(null);
    const dispatch = useDispatch();
    const volume = useSelector(sVolume);
    const [vol, setVol] = useState<number>(volume);
    const slotsList = useSelector(sSlotsList);

    const {startSpinning, stopSpinning, closeRoulette} = useRouletteButtons({
        setAudioSrcName,
        setSpinning,
        audioStopRef,
        setClearList,
        setCurrentGame,
        setOpenRoll
    });

    useEffect(() => {
        if (audioRouletteRef.current && audioSrcName) {
            audioRouletteRef.current.pause();
            audioRouletteRef.current.currentTime = 0;
            audioRouletteRef.current.play();
        }
    }, [audioSrcName]);

    useEffect(() => {
        if (audioRouletteRef.current && audioSrcName) {
            audioRouletteRef.current!.volume = vol / 100;
            audioStopRef.current!.volume = vol / 100;
            dispatch(setVolume(vol));
        }
    }, [vol, dispatch, audioSrcName]);

    const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVol(Number(e.target.value));
    };
    return (
        <div className="fixed inset-0 bg-black/80">
            {!!audioSrcName && <audio ref={audioRouletteRef} src={`${audioPath}${audioSrcName}`}/>}
            {<audio ref={audioStopRef} src={`${audioPath}StopRoll.mp3`}/>}
            <RouletteRollList {...{
                setCurrentGamePos,
                start: spinning,
                clearList,
                currentGame,
                setNewRollAvailable,
                setAudioSrcName,
                setCurrentGame,
            }} />
            <WinGameLabel {...{currentGame, setCurrentGame, currentGamePos, newRollAvailable}} />
            <div className="flex flex-col justify-center fixed text-xl left-1/2 transform -translate-x-1/2 bottom-0
            bg-black p-3 pt-1 border rounded overflow-hidden">
                <span className="m-auto mb-1">Volume: {volume}%</span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={Number(volume)}
                    onChange={handleChangeVolume}
                    className="h-2 bg-gray-300 accent-blue-600 rounded-lg appearance-none cursor-pointer mb-1"
                />
                <div className={"flex-row"}>
                    <div className="border rounded-full p-1 flex flex-row">
                        <SquareButton disabled={newRollAvailable || slotsList.length <= 1}
                                      onClickButton={() => dispatch(shuffleRouletteList())}
                                      icon={"🔀"}
                                      hint={"Shuffle"}/>
                        {!spinning ?
                            (
                                <SquareButton
                                    disabled={newRollAvailable || !slotsList.length}
                                    onClickButton={startSpinning}
                                    icon={"🚀"}
                                    hint={"Start"}/>
                            ) :
                            (
                                <SquareButton
                                    onClickButton={stopSpinning}
                                    icon={"🛑"}
                                    hint={"Stop"}/>
                            )
                        }
                        <SquareButton
                            disabled={newRollAvailable}
                            onClickButton={closeRoulette} icon={"❌"}
                            hint={"Close roulette"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Roulette;