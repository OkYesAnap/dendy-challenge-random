import {
    rollOneStep,
    shuffle,
    addRoll,
    beginEvent as sBeginEvent,
    currentRolls as sCurrentRolls
} from "@/redux/slices/gamesSlice";
import * as motion from "motion/react-client"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buttonsClasses } from "./SlotsList";

const slotHeight = 16;

const intervals = { min: 50, max: 2000, step: 5 };

const Roulette: React.FC<{ setOpenRoll: () => void }> = ({ setOpenRoll }) => {
    const beginEvent = useSelector(sBeginEvent);
    const currentRolls = useSelector(sCurrentRolls);
    const [start, setStart] = useState<boolean>(false);
    const [firstRender, setFirstRender] = useState<boolean>(true);
    const [currentGame, setCurrentGame] = useState<string>("");
    const [currentGamePos, setCurrentGamePos] = useState<number>(0);
    const [winSlot, setWinSlot] = useState<number>(0);
    const [rollStage, setRollStage] = useState<number>(0);
    const [halfListHeight, setHalfListHeight] = useState<number>(0);
    const rollIntervalRef = useRef<ReturnType<typeof setInterval>>(null);
    const rollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    const listRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (listRef.current) {
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
    }, [listRef, setWinSlot, setHalfListHeight, winSlot, dispatch, currentRolls]);

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false)
        }
        else {
            setCurrentGame(currentRolls[currentRolls.length - 1]);
            const timeOut = setTimeout(() => { setCurrentGame('') }, 3000);
            return () => clearTimeout(timeOut);
        }
    }, [setCurrentGame, currentRolls, setFirstRender])

    useEffect(() => {
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
                    dispatch(addRoll(winSlot));
                }, 3000);
            }
        }
        return () => {
            if (rollIntervalRef.current) clearInterval(rollIntervalRef.current)
            if (rollTimeoutRef.current) clearInterval(rollTimeoutRef.current)
        }
    }, [start, rollStage, dispatch, winSlot]);

    const handleStart = () => {
        setStart(true);
    }
    const handleStopWithDelay = () => {
        setStart(false);
        setRollStage(1);
    }

    return (
        <div className="fixed inset-0 bg-black/80">
            <div
                ref={listRef}
                className="fixed max-h-[85%] max-w-[85%] text-xl left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-[56%] border-3 bg-black rounded overflow-hidden">
                <div style={{ top: `${halfListHeight}px` }} className={`absolute -right-5 bg-white w-10 h-10 rotate-[45deg] z-10`} />
                <div style={{ top: `${halfListHeight - 18}px` }} className={`absolute bg-white w-full h-2 z-10`} />
                <div style={{ top: `${halfListHeight + 50}px` }} className={`absolute bg-white w-full h-2 z-10`} />
                <div style={{ top: `${halfListHeight}px` }} className={`absolute -left-5 bg-white w-10 h-10 rotate-[45deg] z-10`} />
                <ul className="w-full flex flex-col">
                    {beginEvent.map((slot) => (
                        <motion.li
                            className={`border-t border-b h-${slotHeight} border-gray-300 pl-8 pr-8 pt-4 pb-4 text-center whitespace-nowrap overflow-ellipsis`}
                            key={slot}
                            layout
                            transition={{
                                default: { ease: "ease" },
                                layout: { duration: start || (!start && rollStage) ? (rollStage) / 1000 : 1 }
                            }}
                        >
                            {slot}
                        </motion.li>
                    ))}
                </ul>
            </div>
            <motion.div
                style={{ top: `${currentGamePos + 32}px` }}
                className={`${currentGame ? "opacity-100" : "opacity-0"} fixed max-h-[85%] max-w-[85%] text-4xl left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-[56%] border-3 bg-black rounded overflow-hidden whitespace-nowrap p-6`}
                layout
                transition={{
                    default: { ease: "ease" },
                    layout: { duration: 0.5 }
                }}>
                {currentGame}
            </motion.div>
            <div className="fixed text-xl left-1/2 transform -translate-x-1/2 bottom-0 bg-black p-3 border rounded overflow-hidden">
                <button className={buttonsClasses} onClick={() => dispatch(shuffle())}>
                    🔀
                </button>

                <button className={`${buttonsClasses} ${start ? 'text-gray-600' : 'hover:bg-gray-700'}`}
                    disabled={start}
                    onClick={handleStart}>
                    🚀
                </button>
                <button className={`${buttonsClasses} ${!start ? 'text-gray-600' : 'hover:bg-gray-700'}`}
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