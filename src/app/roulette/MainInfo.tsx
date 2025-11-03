'use client';
import {
    allData as sAllData,
    currentRolls as sCurrentRolls,
    startSlots as sStartSlots,
    allGamesList as sAllGamesList,
    loading as sLoading,
    headers as sHeaders,
    shuffleAllGamesList,
    sortAllGamesList,
} from "@/redux/slices/gamesSlice";
import {AppDispatch} from "@/redux/store";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "next/navigation";
import Roulette from "./Roulette";
import Info from "./Info";
import ChoseUrlParamsModal from "./ChoseUrlParamsModal";
import {motion} from "motion/react";
import {GoogleSheetsParams} from "@/utils/getGamesList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import SquareButton from "@/app/roulette/SquareButton";
import {useHandleLoad} from "@/app/roulette/hooks/useHandleLoad";
import {defaultParams} from "@/app/roulette/utils/constants/urlParams";

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
    const searchParams = useSearchParams();

    const handleLoad = useHandleLoad({paramsRef, setOpenChoseModal});

    const handleOpenChose = (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) getAndSetElementPos(e);
        setOpenChoseModal(true);
    }

    useEffect(() => {
        setOpenChoseModal(!allGamesList.length && !loading);
        setEmptySlots(!startSlots.length);
    }, [startSlots.length, allGamesList.length,emptySlots, loading]);

    useEffect(() => {
        const headerUrl = searchParams.get("header") === "true";
        const rangeUrl = searchParams.get("range") || defaultParams.range;
        const sheetUrl = searchParams.get("url") || defaultParams.url;
        const {range, url} = paramsRef.current;

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


    return (
        <>
            {!!headers.length && <div className="bg-black w-full text-center text-4xl p-2 font-bold">{headers[0]?.label}</div>}
            <div className={`grid grid-flow-col text-2xl top-1`}
                 style={{
                     gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                     gridTemplateRows: `repeat(${Math.ceil(allData.length / columns)}, minmax(0, 1fr))`
                 }}>
                {allData.map((item) => (
                    <motion.div key={item[0]}
                                layout
                                transition={{
                                    layout: {duration: 1.5}
                                }}
                                className={`flex justify-between p-1 border ${currentRolls.find(roll => roll === item[0]) ? 'text-gray-500' : ''}`}
                    >
                        <span
                            className={`flex-grow overflow-hidden whitespace-nowrap overflow-ellipsis`}>{item[0]}</span>
                        {(item.length > 2 && (item[0] !== info[0] || !openInfo)) ? (
                            <div className="cursor-pointer" onClick={(e) => handleOpenInfo(e, item)}>
                                <FontAwesomeIcon icon={faPlusSquare}/>
                            </div>
                        ) : null}
                    </motion.div>
                ))}
                <motion.div layout
                            transition={{
                                layout: {duration: .1}
                            }}
                            className="flex flex-row fixed text-xl left-1/2 transform -translate-x-1/2 bottom-0 bg-black p-3 border rounded">
                    <div className="border rounded-full p-1 flex flex-row">
                        {!!allGamesList.length && (
                            <SquareButton
                                onClickButton={() => setOpenRoll(true)}
                                icon={"🎰"}
                                hint={"Roulette"}
                            />
                        )}
                        <SquareButton
                            onClickButton={() => setAdditionalFunctions(p => !p)}
                            icon={"..."}
                            hint={"Settings"}/>
                    </div>
                    {additionalFunctions && <div className="border rounded-full p-1 flex flex-row">
                        <SquareButton
                            onClickButton={(e) => handleOpenChose(e)}
                            icon={"📥"}
                            hint={"Load list"}
                        />

                        {!!allGamesList.length && (<>
                            <SquareButton
                                onClickButton={() => setColumns(p => p > 1 ? p - 1 : p)}
                                icon={"-"}
                                hint={"Less columns"}
                            />
                            <SquareButton
                                icon={String(columns)}
                                hint={"Columns"}
                            />
                            <SquareButton
                                onClickButton={() => setColumns(p => p < 12 ? p + 1 : p)}
                                icon={"+"}
                                hint={"More columns"}
                            />
                            <SquareButton
                                onClickButton={() => dispatch(shuffleAllGamesList())}
                                icon={"🔀"}
                                hint={"Shuffle"}/>
                            <SquareButton
                                onClickButton={() => dispatch(sortAllGamesList())}
                                icon={"📈"}
                                hint={"Order"}/>
                            <SquareButton
                                onClickButton={() => handleLoad()}
                                icon={"🔄"}
                                hint={"Update"}/>
                        </>)}
                    </div>}
                </motion.div>
                {openRoll && <Roulette {...{setOpenRoll: () => setOpenRoll(false)}} />}
                <ChoseUrlParamsModal {...{
                    startPos: elementPos,
                    isOpen: openChoseModal,
                    onClose: () => setOpenChoseModal(false),
                    paramsRef,
                    handleLoad,
                    startElement: <SquareButton icon={"📥"}/>
                }} />
                <Info {...{
                    startPos: elementPos,
                    startElement: <FontAwesomeIcon icon={faPlusSquare}/>,
                    headers,
                    infoData: info,
                    isOpen: openInfo,
                    onClose: () => setOpenInfo(false)
                }} />
                {loading && (<div
                    className="fixed max-h-[85%] text-4xl left-1/2 transform p-10 -translate-x-1/2 top-1/2 -translate-y-[50%] border-3 bg-black rounded">
                    Loading List</div>)}
            </div>
        </>
    )
}

export default MainInfo;