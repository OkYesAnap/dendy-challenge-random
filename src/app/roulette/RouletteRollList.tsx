import { motion } from "motion/react";
import { SetStateAction, useEffect, useLayoutEffect, useRef, useState } from "react";
import WinFrame from "./WinFrame";
import {
    addRoll,
    rollOneStep,
    currentRolls as sCurrentRolls,
    slotsList as sSlotsList
} from "@/redux/slices/gamesSlice";
import { useDispatch, useSelector } from "react-redux";

const slotHeight = 16;
const rollComplete = "RollComplete.mp3";
const visibleSlots = 30;
const intervals = { min: 30, max: 2000, step: 3 };

interface RollListProps {
    setCurrentGamePos: React.Dispatch<SetStateAction<number>>;
    setNewRollAvailable: React.Dispatch<SetStateAction<boolean>>;
    setCurrentGame: React.Dispatch<SetStateAction<string>>;
    setAudioSrcName: React.Dispatch<SetStateAction<string>>;
    start: boolean;
    currentGame: string;
}

const RouletteRollList: React.FC<RollListProps> = ({
    setCurrentGamePos,
    start,
    currentGame,
    setNewRollAvailable,
    setAudioSrcName,
    setCurrentGame
}) => {

    const dispatch = useDispatch();
    const [optimizedSlots, setOptimizedSlots] = useState<string[]>([]);
    const [winSlot, setWinSlot] = useState<number>(0);
    const [rollStage, setRollStage] = useState<number>(0);
    const [halfListHeight, setHalfListHeight] = useState<number>(0);
    
    const endTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const rollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const rollIntervalRef = useRef<ReturnType<typeof setInterval>>(null);
    const audioStopRef = useRef<HTMLAudioElement>(null);

    const slotsList = useSelector(sSlotsList);
    const currentRolls = useSelector(sCurrentRolls);
    const listRef = useRef<HTMLDivElement>(null);

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
    }, [listRef, setWinSlot, setHalfListHeight, currentRolls, optimizedSlots, setCurrentGamePos]);


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
    }, [start, rollStage, dispatch, winSlot, slotsList, setCurrentGame]);

    useEffect(() => {
        if(start){setRollStage(1)};
    }, [start])


    useEffect(() => {
        if (currentGame) {
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
    }, [currentGame, setAudioSrcName, setCurrentGame, setNewRollAvailable])


    return (<div
        ref={listRef}
        className="fixed max-h-[85%] w-[30%] text-xl left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-[58%] border-3 bg-black rounded overflow-hidden">
        <WinFrame {...{ halfListHeight, visible: !!rollTimeoutRef.current }} />
        {<audio ref={audioStopRef} src={`${process.env.NEXT_PUBLIC_AUDIO_PATH}StopRoll.mp3`} />}

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
    </div>)
}

export default RouletteRollList;