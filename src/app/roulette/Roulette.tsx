import { shuffleRouletteList } from "@/redux/slices/gamesSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { buttonsClasses } from "./MainInfo";
import WinGameLabel from "./WinGameLabel";
import RouletteRollList from "./RouletteRollList";
import { audioPath } from "@/constants/audioEnv";

const audioSrcNames = [
    '01-Title.mp3',
    '02-Intermission.mp3',
    '03-Ragnaroks-Canyon-(Level-1).mp3',
    '04-Wookie-Hole(Leve-2).mp3',
    '06-Turbo-Tunnel-Speeder-Bike-(Level-3-2).mp3',
    '07-Arctic-Caverns-(Level-4).mp3',
    '12-Intruder-Excluder-(Level-8).mp3'
]

const Roulette: React.FC<{ setOpenRoll: () => void }> = ({ setOpenRoll }) => {

    const [start, setStart] = useState<boolean>(false);
    const [clearList, setClearList] = useState<boolean>(false);
    const [newRollAvailable, setNewRollAvailable] = useState<boolean>(false);
    const [currentGame, setCurrentGame] = useState<string>('');
    const [currentGamePos, setCurrentGamePos] = useState<number>(0);
    const [audioSrcName, setAudioSrcName] = useState<string>('');
    const audioRouletteRef = useRef<HTMLAudioElement>(null);
    const audioStopRef = useRef<HTMLAudioElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (audioRouletteRef.current && audioSrcName) {
            audioRouletteRef.current.pause();
            audioRouletteRef.current.currentTime = 0;
            audioRouletteRef.current.play();
        }
    }, [audioSrcName]);

    const handleStart = () => {
        const randomSample = Math.floor(Math.random() * (audioSrcNames.length));
        setAudioSrcName(audioSrcNames[randomSample]);
        setStart(true);
    }
    const handleStopWithDelay = () => {
        setStart(false);
        if (audioStopRef.current) {
            audioStopRef.current.currentTime = 0;
            audioStopRef.current.play();
        }
    }
    const handleCloseRoulette = () => {
        setClearList(true);
        setCurrentGame('');
        setTimeout(() => {
            setOpenRoll();            
        }, 500);
    }

    return (
        <div className="fixed inset-0 bg-black/80">
            {!!audioSrcName && <audio ref={audioRouletteRef} src={`${audioPath}${audioSrcName}`} />}
            {<audio ref={audioStopRef} src={`${audioPath}StopRoll.mp3`} />}
            <RouletteRollList {...{
                setCurrentGamePos,
                start,
                clearList,
                currentGame,
                setNewRollAvailable,
                setAudioSrcName,
                setCurrentGame
            }} />
            <WinGameLabel {...{ currentGame, currentGamePos }} />
            <div className="flex flex-row fixed text-xl left-1/2 transform -translate-x-1/2 bottom-0 bg-black p-3 border rounded overflow-hidden">
                <div className="border rounded-full p-1 flex flex-row">
                    <button className={buttonsClasses} onClick={() => dispatch(shuffleRouletteList())}>
                        🔀
                    </button>
                    {!start ?
                        (
                            <button className={`${buttonsClasses} ${start || newRollAvailable ? 'text-gray-500 grayscale' : 'hover:bg-gray-700'}`}
                                disabled={start || newRollAvailable}
                                onClick={handleStart}>
                                🚀
                            </button>
                        ) :
                        (
                            <button className={`${buttonsClasses} ${!start ? 'text-gray-500 grayscale' : 'hover:bg-gray-700'}`}
                                disabled={!start}
                                onClick={handleStopWithDelay}>
                                🛑
                            </button>
                        )
                    }
                    <button className={buttonsClasses} onClick={handleCloseRoulette}>
                        ❌
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Roulette;