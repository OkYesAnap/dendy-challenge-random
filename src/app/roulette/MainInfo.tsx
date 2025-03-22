'use client';
import ModalPortal from "@/components/ModalPortal";
import {
    getAllGamesList,
    allData as sAllData,
    currentRolls as sCurrentRolls,
    startSlots as sStartSlots,
    allGamesList as sAllGamesList,
    loading as sLoading,
    GoogleSheetsParams,
} from "@/redux/slices/gamesSlice";
import { AppDispatch } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Roulette from "./Roulette";
import Info from "./Info";

const defaultParams = {
    url: "",
    range: "A1:A1000"
}

export const buttonsClasses = "flex-1 mr-2 p-1 border text-5xl rounded-full w-20 h-20"

const MainInfo: React.FC = () => {
    const [openChoseModal, setOpenChoseModal] = useState<boolean>(false);
    const [openRoll, setOpenRoll] = useState<boolean>(false);
    const [emptySlots, setEmptySlots] = useState<boolean>(true);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [info, setInfo] = useState<Array<string>>([]);
    const paramsRef = useRef<GoogleSheetsParams>(defaultParams);
    const dispatch = useDispatch<AppDispatch>();
    const allData = useSelector(sAllData);
    const currentRolls = useSelector(sCurrentRolls);
    const loading = useSelector(sLoading);
    const startSlots = useSelector(sStartSlots)
    const allGamesList = useSelector(sAllGamesList)
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleLoad = useCallback(() => {
        const { range, url } = paramsRef.current;
        router.push(`?range=${range}&url=${url}`);
        dispatch(getAllGamesList(paramsRef.current));
        setOpenChoseModal(false);
    }, [dispatch, router])

    useEffect(() => {
        setEmptySlots(!startSlots.length);
    }, [startSlots.length]);

    useEffect(() => {
        const rangeUrl = searchParams.get("range") || defaultParams.range;
        const urlUrl = searchParams.get("url") || defaultParams.url;
        paramsRef.current = {
            range: rangeUrl,
            url: urlUrl
        }

        if (paramsRef.current.url !== '') {
            handleLoad()
        }

    }, [searchParams, handleLoad]);

    const handleOpenInfo = (item: string[]) => {
        setOpenInfo(true)
        setInfo(item);
    }

    const handleChangeGoogleParams = (params: Partial<GoogleSheetsParams>) => {
        paramsRef.current = { ...paramsRef.current, ...params }
    }

    return (
        <div className="flex flex-wrap text-2xl top-1 bg-black w-full">
            {allData.map((item) => (
                <div key={item[0]} className={`flex justify-between items-center w-1/3 p-1 border ${currentRolls.find(roll => roll === item[0]) ? 'text-gray-500' : ''}`}>
                    <span className={`flex-grow overflow-hidden whitespace-nowrap overflow-ellipsis`}>{item[0]}</span>
                    {item.length > 2 ? (<div className="cursor-pointer" onClick={() => handleOpenInfo(item)}>📧</div>
                    ) : null}
                </div>
            ))}
            {(emptySlots && !loading) && (<div className="fixed max-h-[85%] text-2xl left-1/2 transform p-10 -translate-x-1/2 top-1/2 -translate-y-[50%] border-3 bg-black rounded">
                Please set the Google Sheets URL and RANGE with non-empty fields.</div>)}
            <div className="fixed text-xl left-1/2 transform -translate-x-1/2 bottom-0 bg-black p-4 border rounded">
                <button className={buttonsClasses} onClick={() => setOpenChoseModal(true)}>...</button>
                {!!allGamesList.length && (<>
                    <button className={buttonsClasses} onClick={() => setOpenRoll(true)}>🎰</button>
                    <button className={buttonsClasses} onClick={() => handleLoad()}>🔄</button>
                </>)}
            </div>
            {openRoll && <Roulette {...{ setOpenRoll: () => setOpenRoll(false) }} />}
            <ModalPortal {...{ isOpen: openChoseModal, onClose: () => setOpenChoseModal(false) }}>
                <div className="flex flex-col">
                    <div className="flex flex-row border p-2 items-center">
                        <span className="flex-1">URL:</span>
                        <input onChange={(e) => handleChangeGoogleParams({ url: e.target.value })}
                            className="flex-1 bg-gray-700 p-1" type="text" defaultValue={paramsRef.current.url} />
                    </div>
                    <div className="flex flex-row border p-2 items-center">
                        <span className="flex-1 mr-2 pt-1">Range:</span>
                        <input onChange={(e) => handleChangeGoogleParams({ range: e.target.value })}
                            className="flex-1 bg-gray-700 p-1" type="text" defaultValue={paramsRef.current.range} />
                    </div>
                    <div className="flex flex-row border p-2 items-center">
                        <button className="flex-1 mr-2 p-1 border" onClick={() => handleLoad()}>Load</button>
                        <button className="flex-1 mr-2 p-1 border" onClick={() => setOpenChoseModal(false)}>Cancel</button>
                    </div>
                </div>
            </ModalPortal>
            <Info {...{ infoData: info, isOpen: openInfo, onClose: () => setOpenInfo(false) }} />
            {loading && (<div className="fixed max-h-[85%] text-4xl left-1/2 transform p-10 -translate-x-1/2 top-1/2 -translate-y-[50%] border-3 bg-black rounded">Loading List</div>)}
        </div>
    )
}

export default MainInfo;