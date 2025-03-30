'use client';
import {
    getAllGamesList,
    allData as sAllData,
    currentRolls as sCurrentRolls,
    startSlots as sStartSlots,
    allGamesList as sAllGamesList,
    loading as sLoading,
    headers as sHeaders,
    shuffleAllGamesList,
    sortAllGamesList,
} from "@/redux/slices/gamesSlice";
import { AppDispatch } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Roulette from "./Roulette";
import Info from "./Info";
import Instructions from "./Instructions";
import ChoseUrlParamsModal from "./ChoseUrlParamsModal";
import { motion } from "motion/react";
import { GoogleSheetsParams } from "@/utils/getGamesList";

const defaultParams = {
    url: "",
    range: "A1:A1000",
    header: false
}

export const buttonsClasses = "flex-1 p-1 border text-3xl rounded-full w-15 h-15"

const MainInfo: React.FC = () => {
    const [openChoseModal, setOpenChoseModal] = useState<boolean>(false);
    const [additionalFunctions, setAdditionalFunctions] = useState<boolean>(false);
    const [openRoll, setOpenRoll] = useState<boolean>(false);
    const [columns, setColumns] = useState<number>(3);
    const [emptySlots, setEmptySlots] = useState<boolean>(true);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [info, setInfo] = useState<Array<string>>([]);
    const paramsRef = useRef<GoogleSheetsParams>(defaultParams);
    const dispatch = useDispatch<AppDispatch>();
    const allData = useSelector(sAllData);
    const headers = useSelector(sHeaders);
    const currentRolls = useSelector(sCurrentRolls);
    const loading = useSelector(sLoading);
    const startSlots = useSelector(sStartSlots)
    const allGamesList = useSelector(sAllGamesList)
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleLoad = useCallback(() => {
        const { range, url, header } = paramsRef.current;
        router.push(`?range=${range}&header=${header}&url=${url}`);
        dispatch(getAllGamesList(paramsRef.current));
        setOpenChoseModal(false);
    }, [dispatch, router])

    useEffect(() => {
        setEmptySlots(!startSlots.length);
    }, [startSlots.length]);

    useEffect(() => {
        const headerUrl = searchParams.get("header") === "true" ;
        const rangeUrl = searchParams.get("range") || defaultParams.range;
        const sheetUrl = searchParams.get("url") || defaultParams.url;
        const { range, url } = paramsRef.current;

        if (
            rangeUrl !== range ||
            sheetUrl !== url
        ) {
            paramsRef.current = {
                header: headerUrl,
                range: rangeUrl,
                url: sheetUrl
            }
            handleLoad();
        }
    }, [searchParams, handleLoad]);

    const handleOpenInfo = (item: string[]) => {
        setOpenInfo(true)
        setInfo(item);
    }

    return (
        <div>
            {!!headers.length && <div className="w-full text-center text-4xl p-2 font-bold">{headers[1]}</div>}
            <div className={`grid grid-flow-col text-2xl top-1 bg-black`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${Math.ceil(allData.length / columns)}, minmax(0, 1fr))`
                }}>
                {allData.map((item) => (
                    <motion.div key={item[0]}
                        layout
                        transition={{
                            layout: { duration: 1.5 }
                        }}
                        className={`flex justify-between p-1 border ${currentRolls.find(roll => roll === item[0]) ? 'text-gray-500' : ''}`}
                    >
                        <span className={`flex-grow overflow-hidden whitespace-nowrap overflow-ellipsis`}>{item[0]}</span>
                        {item.length > 2 ? (<div className="cursor-pointer" onClick={() => handleOpenInfo(item)}>🅸</div>
                        ) : null}
                    </motion.div>
                ))}
                {(emptySlots && !loading) && <Instructions />}
                <div className="flex flex-row fixed text-xl left-1/2 transform -translate-x-1/2 bottom-0 bg-black p-3 border rounded overflow-hidden">
                    <div className="border rounded-full p-1 flex flex-row">
                        {!!allGamesList.length && (
                            <button className={buttonsClasses}
                                onClick={() => setOpenRoll(true)}>
                                🎰
                            </button>
                        )}
                        <button className={buttonsClasses} onClick={() => setOpenChoseModal(true)}>📥</button>
                        <button className={buttonsClasses} onClick={() => setAdditionalFunctions(p => !p)}>...</button>
                    </div>
                    {additionalFunctions && <div className="border rounded-full p-1 flex flex-row">
                        <button className={buttonsClasses} onClick={() => setColumns(p => p > 1 ? p - 1 : p)}>-</button>
                        <button className={buttonsClasses}>{columns}</button>
                        <button className={buttonsClasses} onClick={() => setColumns(p => p < 12 ? p + 1 : p)}>+</button>
                        {!!allGamesList.length && (<>
                            <button className={buttonsClasses}
                                onClick={() => dispatch(shuffleAllGamesList())}>
                                🔀
                            </button>
                            <button className={buttonsClasses}
                                onClick={() => dispatch(sortAllGamesList())}>
                                📈
                            </button>
                            <button className={buttonsClasses}
                                onClick={() => handleLoad()}>
                                🔄
                            </button>
                        </>)}
                    </div>}
                </div>
                {openRoll && <Roulette {...{ setOpenRoll: () => setOpenRoll(false) }} />}
                <ChoseUrlParamsModal {...{
                    isOpen: openChoseModal,
                    onClose: () => setOpenChoseModal(false),
                    paramsRef,
                    handleLoad
                }} />
                <Info {...{ headers, infoData: info, isOpen: openInfo, onClose: () => setOpenInfo(false) }} />
                {loading && (<div className="fixed max-h-[85%] text-4xl left-1/2 transform p-10 -translate-x-1/2 top-1/2 -translate-y-[50%] border-3 bg-black rounded">Loading List</div>)}
            </div>
        </div>
    )
}

export default MainInfo;