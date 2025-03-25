import {
    rollOneStep,
    shuffle,
    addRoll,
    slotsList as sSlotsList,
    currentRolls as sCurrentRolls
} from "@/redux/slices/gamesSlice";
import * as motion from "motion/react-client"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buttonsClasses } from "./MainInfo";
import WinGameLabel from "./WinGameLabel";
import WinFrame from "./WinFrame";

const slotHeight = 16;
const visibleSlots = 30;
const intervals = { min: 30, max: 2000, step: 3 };
const audioSrcNames = [
    '01-Title.mp3',
    '02-Intermission.mp3',
    '03-Ragnaroks-Canyon-(Level-1).mp3',
    '04-Wookie-Hole(Leve-2).mp3',
    '06-Turbo-Tunnel-Speeder-Bike-(Level-3-2).mp3',
    '07-Arctic-Caverns-(Level-4).mp3',
    '12-Intruder-Excluder-(Level-8).mp3'
]
const rollComplete = "RollComplete.mp3";

const Roulette: React.FC<{ setOpenRoll: () => void }> = ({ setOpenRoll }) => {
    const slotsList = useSelector(sSlotsList);
    const [optimizedSlots, setOptimizedSlots] = useState<string[]>([]);
    const currentRolls = useSelector(sCurrentRolls);
    const [start, setStart] = useState<boolean>(false);
    const [newRollAvailable, setNewRollAvailable] = useState<boolean>(false);
    const [currentGame, setCurrentGame] = useState<string>('');
    const [currentGamePos, setCurrentGamePos] = useState<number>(0);
    const [winSlot, setWinSlot] = useState<number>(0);
    const [rollStage, setRollStage] = useState<number>(0);
    const [halfListHeight, setHalfListHeight] = useState<number>(0);
    const rollIntervalRef = useRef<ReturnType<typeof setInterval>>(null);
    const rollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const endTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const audioRouletteRef = useRef<HTMLAudioElement>(null);
    const audioStopRef = useRef<HTMLAudioElement>(null);
    const [audioSrcName, setAudioSrcName] = useState<string>('');

    const listRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (listRef.current && optimizedSlots.length) {
            const heightInPx = listRef.current.offsetHeight;
            setWinSlot(heightInPx);
            const listItemsHeight = listRef.current.querySelectorAll('li');
            const listItemHeight = listItemsHeight[0]?.offsetHeight || 1;
            const slot = Math.floor(heightInPx / listItemHeight / 2);
            setWinSlot(slot);
            const height = slot * listItemHeight + 10;
            setHalfListHeight(height);
            const rect = listItemsHeight[slot].getBoundingClientRect();
            setCurrentGamePos(rect.top);
        }
    }, [listRef, setWinSlot, setHalfListHeight, dispatch, currentRolls, optimizedSlots]);

    useEffect(() => {
        if (audioRouletteRef.current && audioSrcName) {
            audioRouletteRef.current.pause();
            audioRouletteRef.current.currentTime = 0;
            audioRouletteRef.current.play();
        }
    }, [audioSrcName]);

    useEffect(() => {
        if (!!currentGamePos && currentGame) {
            setAudioSrcName(rollComplete);
            setNewRollAvailable(true);
            endTimeoutRef.current = setTimeout(() => {
                setNewRollAvailable(false);
                setCurrentGame('');
                setAudioSrcName('');
            }, 3000);
        }
        return () => {
            if (endTimeoutRef.current) {
                clearTimeout(endTimeoutRef.current)
            }
        };
    }, [currentGame, currentGamePos])

    useEffect(() => {
        setOptimizedSlots(slotsList.slice(0, visibleSlots));
        if (start) {
            rollIntervalRef.current = setInterval(() => {
                dispatch(rollOneStep());
            }, intervals.min);
        }
        if (!start && rollStage) {
            if (rollIntervalRef.current) clearInterval(rollIntervalRef.current)
            if (rollTimeoutRef.current) clearInterval(rollTimeoutRef.current)
            rollTimeoutRef.current = setTimeout(() => {
                dispatch(rollOneStep());
                setRollStage((prev) => prev = (prev + prev / 10));
            }, rollStage);

            if (rollStage >= intervals.max - Math.random() * 1250) {
                setRollStage(0);
                setTimeout(() => {
                    setCurrentGame(slotsList[winSlot]);
                    dispatch(addRoll(winSlot));
                    rollTimeoutRef.current = null
                }, 3000);
            }
        }
        return () => {
            if (rollIntervalRef.current) clearInterval(rollIntervalRef.current)
            if (rollTimeoutRef.current) clearInterval(rollTimeoutRef.current)
        }
    }, [start, rollStage, dispatch, winSlot, slotsList]);

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
        setRollStage(1);
    }

    return (
        <div className="fixed inset-0 bg-black/80">
            {!!audioSrcName && <audio ref={audioRouletteRef} src={`${process.env.NEXT_PUBLIC_AUDIO_PATH}${audioSrcName}`} />}
            {<audio ref={audioStopRef} src={`${process.env.NEXT_PUBLIC_AUDIO_PATH}StopRoll.mp3`} />}
            <div
                ref={listRef}
                className="fixed max-h-[85%] w-[30%] text-xl left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-[56%] border-3 bg-black rounded overflow-hidden">
                <WinFrame {...{ halfListHeight, visible: !!rollTimeoutRef.current }} />
                <ul className="w-full flex flex-col">
                    {optimizedSlots.map((slot) => (
                        <motion.li
                            className={`border-t w-full border-b h-${slotHeight} border-gray-300 pl-10 pr-10 pt-4 pb-4 text-center whitespace-nowrap overflow-hidden overflow-ellipsis`}
                            key={slot}
                            layout
                            transition={{
                                layout: { duration: start || (!start && rollStage) ? rollStage / 1000 : 1.5 }
                            }}
                        >
                            {slot}
                        </motion.li>
                    ))}
                </ul>
            </div>
            <WinGameLabel {...{ currentGame, currentGamePos }} />
            <div className="fixed text-xl left-1/2 transform -translate-x-1/2 bottom-0 bg-black p-3 border rounded overflow-hidden">
                <button className={buttonsClasses} onClick={() => dispatch(shuffle())}>
                    🔀
                </button>

                <button className={`${buttonsClasses} ${start || newRollAvailable ? 'text-gray-600 grayscale' : 'hover:bg-gray-700'}`}
                    disabled={start || newRollAvailable}
                    onClick={handleStart}>
                    🚀
                </button>
                <button className={`${buttonsClasses} ${!start ? 'text-gray-600 grayscale' : 'hover:bg-gray-700'}`}
                    disabled={!start}
                    onClick={handleStopWithDelay}>
                    🛑
                </button>
                <button className={buttonsClasses} onClick={setOpenRoll}>
                    ❌
                </button>
            </div>
        </div>
    );
};
export default Roulette;