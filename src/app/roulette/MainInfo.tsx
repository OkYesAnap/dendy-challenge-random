'use client';
import {
    allData as sAllData,
    currentRolls as sCurrentRolls,
    startSlots as sStartSlots,
    allGamesList as sAllGamesList,
    loading as sLoading,
    names as sNames,
    errorMessage as sErrorMessage,
    shuffleAllGamesList,
    sortAllGamesList, defaultCellData,
} from "@/redux/slices/gamesSlice";
import {AppDispatch} from "@/redux/store";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "next/navigation";
import Roulette from "./Roulette";
import Info from "./Info";
import ChoseUrlParamsModal from "./ChoseUrlParamsModal";
import {motion} from "motion/react";
import {CellData, GoogleSheetsParams} from "@/utils/getGamesList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import SquareButton from "@/app/roulette/SquareButton";
import {useHandleLoad} from "@/app/roulette/hooks/useHandleLoad";
import {defaultParams} from "@/app/roulette/constants/urlParams";
import {defaultOpenModals, Modals} from "@/app/roulette/types";
import {useOpenModalsHandler} from "@/app/roulette/hooks/useOpenModalsHandler";
import {getElementPos} from "@/app/roulette/utils/getElementPos";
import ModalManager from "@/app/roulette/ModalManager";

export const buttonsClasses = "flex-1 p-1 border text-3xl rounded-full w-15 h-15"

const MainInfo: React.FC = () => {
    const [openModals, setOpenModal] = useState<Modals>(defaultOpenModals);
    const [additionalFunctions, setAdditionalFunctions] = useState<boolean>(false);
    const [columns, setColumns] = useState<number>(3);
    const [emptySlots, setEmptySlots] = useState<boolean>(true);
    const [infoData, setInfoData] = useState<CellData[]>([defaultCellData]);
    const paramsRef = useRef<GoogleSheetsParams>(defaultParams);
    const [elementPos, setElementPos] = useState<DOMRect | undefined>();
    const dispatch = useDispatch<AppDispatch>();
    const allData = useSelector(sAllData);
    const currentRolls = useSelector(sCurrentRolls);
    const loading = useSelector(sLoading);
    const startSlots = useSelector(sStartSlots)
    const allGamesList = useSelector(sAllGamesList)
    const names = useSelector(sNames)
    const errorMessage = useSelector(sErrorMessage)
    const searchParams = useSearchParams();

    const handleLoad = useHandleLoad({paramsRef, setOpenModal});

    const isName = names?.fileName || names?.sheetName;

    const updateOpenModal = useOpenModalsHandler(setOpenModal);

    const getAndSetElementPos = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        setElementPos(getElementPos(e));
    }

    const handleOpenChose = (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) getAndSetElementPos(e);
        updateOpenModal({openChoseModal: true});
    }

    useEffect(() => {
        setOpenModal(prev => ({...prev, openChoseModal: !allGamesList.length && !loading}));
        setEmptySlots(!startSlots.length);
    }, [startSlots.length, allGamesList.length, emptySlots, loading]);

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

    const handleOpenInfo = (e: React.MouseEvent<HTMLDivElement>, item: CellData[]) => {
        getAndSetElementPos(e);
        updateOpenModal({openInfoModal: true});
        setInfoData(item);
    }
    return (
        <>
            {isName && <div
                className="border text-center text-3xl p-3">{errorMessage ? errorMessage : `${names?.fileName} - ${names?.sheetName}`}
            </div>}
            <div
                className="bg-black w-full h-screen overflow-y-auto text-gray-100 font-[family-name:var(--font-geist-sans)] pb-50">
                <div className="grid grid-flow-col text-2xl top-1"
                     style={{
                         gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                         gridTemplateRows: `repeat(${Math.ceil(allData.length / columns)}, minmax(0, 1fr))`
                     }}>
                    {allData.map((item) => (
                        <motion.div key={item[0].formattedValue}
                                    layout
                                    transition={{
                                        layout: {duration: 1.5}
                                    }}
                                    className={`flex justify-between p-1 border ${currentRolls.find(roll => roll === item[0]) ? 'text-gray-500' : ''}`}
                        >
                        <span className={`flex-grow overflow-hidden whitespace-nowrap overflow-ellipsis`}>
                            {item[0].formattedValue}
                        </span>
                            {(item.length > 2 && (item[0].formattedValue !== infoData[0].formattedValue || !openModals.openInfoModal)) ? (
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
                                    onClickButton={() => updateOpenModal({openRouletteModal: true})}
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
                </div>
            </div>
            <ModalManager {...{openModals, updateOpenModal, paramsRef, infoData, handleLoad, elementPos}}/>
        </>
    )
}

export default MainInfo;