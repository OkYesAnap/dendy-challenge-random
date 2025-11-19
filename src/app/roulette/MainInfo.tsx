'use client';
import {
    allData as sAllData,
    startSlots as sStartSlots,
    allGamesList as sAllGamesList,
    loading as sLoading,
    names as sNames,
    errorMessage as sErrorMessage,
    defaultCellData,
} from "@/redux/slices/gamesSlice";
import React, {useEffect, useRef, useState} from "react";
import { useSelector} from "react-redux";
import {useSearchParams} from "next/navigation";
import {CellData, GoogleSheetsParams} from "@/utils/getGamesList";
import {useHandleLoad} from "@/app/roulette/hooks/useHandleLoad";
import {defaultParams} from "@/app/roulette/constants/urlParams";
import {defaultOpenModals, Modals} from "@/app/roulette/types";
import {useOpenModalsHandler} from "@/app/roulette/hooks/useOpenModalsHandler";
import {getElementPos} from "@/app/roulette/utils/getElementPos";
import ModalManager from "@/app/roulette/ModalManager";
import MainButtons from "@/app/roulette/MainButtons";
import MainListItems from "@/app/MainListItems";

const MainInfo: React.FC = () => {
    const [openModals, setOpenModal] = useState<Modals>(defaultOpenModals);
    const [columns, setColumns] = useState<number>(3);
    const [emptySlots, setEmptySlots] = useState<boolean>(true);
    const [infoData, setInfoData] = useState<CellData[]>([defaultCellData]);
    const paramsRef = useRef<GoogleSheetsParams>(defaultParams);
    const [elementPos, setElementPos] = useState<DOMRect | undefined>();
    const allData = useSelector(sAllData);
    const loading = useSelector(sLoading);
    const startSlots = useSelector(sStartSlots);
    const allGamesList = useSelector(sAllGamesList);
    const names = useSelector(sNames);
    const errorMessage = useSelector(sErrorMessage);
    const searchParams = useSearchParams();

    const handleLoad = useHandleLoad({paramsRef, setOpenModal});

    const isName = names?.fileName || names?.sheetName;

    const updateOpenModal = useOpenModalsHandler(setOpenModal);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const getAndSetElementPos = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        setElementPos(getElementPos(e));
    };

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
            };
            handleLoad();
        }
    }, [searchParams, handleLoad]);


    return (
        <>
            {isName && <div
                className="border text-center text-3xl p-3">{errorMessage ? errorMessage : `${names?.fileName} - ${names?.sheetName}`}
            </div>}
            <div
                onDragOver={handleDragOver}
                onDrop={handleDragOver}
                className="bg-black w-full h-screen overflow-y-auto text-gray-100 font-[family-name:var(--font-geist-sans)] pb-50">
                <div className="grid grid-flow-col text-2xl top-1"
                     style={{
                         gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                         gridTemplateRows: `repeat(${Math.ceil(allData.length / columns)}, minmax(0, 1fr))`
                     }}>
                    <MainListItems {...{
                        setInfoData,
                        updateOpenModal,
                        getAndSetElementPos,
                        openModals,
                        infoData
                    }}/>
                    <MainButtons {...{
                        columns,
                        setColumns,
                        handleLoad,
                        getAndSetElementPos,
                        updateOpenModal
                    }}/>
                </div>
            </div>
            <ModalManager {...{openModals, updateOpenModal, paramsRef, infoData, handleLoad, elementPos}}/>
        </>
    );
};

export default MainInfo;