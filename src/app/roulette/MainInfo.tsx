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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";

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
    const [elementPos, setElementPos] = useState<DOMRect | undefined>();
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
        const headerUrl = searchParams.get("header") === "true";
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

    const getAndSetElementPos = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        const params = e.currentTarget.getBoundingClientRect();
        setElementPos(params);
    }

    const handleOpenInfo = (e: React.MouseEvent<HTMLDivElement>, item: string[]) => {
        getAndSetElementPos(e);
        setOpenInfo(true);
        setInfo(item);
    }
    const handleOpenChose = (e: React.MouseEvent<HTMLButtonElement>) => {
        getAndSetElementPos(e);
        setOpenChoseModal(true);
    }

    return (
        <>
            {!!headers.length && <div className="bg-black w-full text-center text-4xl p-2 font-bold">{headers[1]}</div>}
            <div className={`grid grid-flow-col text-2xl top-1`}
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
                        {(item.length > 2 && (item[0] !== info[0] || !openInfo)) ? (
                            <div className="cursor-pointer" onClick={(e) => handleOpenInfo(e, item)}>
                                <FontAwesomeIcon icon={faPlusSquare} />
                            </div>
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
                        <button className={buttonsClasses} onClick={(e) => handleOpenChose(e)}>📥</button>
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
                    startPos: elementPos,
                    isOpen: openChoseModal,
                    onClose: () => setOpenChoseModal(false),
                    paramsRef,
                    handleLoad,
                    startElement: <button className={buttonsClasses}>📥</button>
                }} />
                <Info {...{ 
                    startPos: elementPos,
                    startElement: <FontAwesomeIcon icon={faPlusSquare} />,
                    headers, 
                    infoData: info, 
                    isOpen: openInfo, 
                    onClose: () => setOpenInfo(false) }} />
                {loading && (<div className="fixed max-h-[85%] text-4xl left-1/2 transform p-10 -translate-x-1/2 top-1/2 -translate-y-[50%] border-3 bg-black rounded">Loading List</div>)}
            </div>
        </>
    )
}

export default MainInfo;