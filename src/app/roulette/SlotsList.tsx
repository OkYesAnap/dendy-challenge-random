import ModalPortal from "@/components/ModalPortal";
import {
    getAllGamesList,
    statistics as sStatistics,
    currentRolls as sCurrentRolls,
    eventsList as sEventsList,
    loading as sLoading,
    GoogleSheetsParams
} from "@/redux/slices/gamesSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Roulette from "./Roulette";

const defaultParams: GoogleSheetsParams = {
    url: "https://docs.google.com/spreadsheets/d/1lQKxm4V-xac7sl0mrwcgOg1BLpHGAy_f873ls0hoVeM/edit?gid=1031682936#gid=1031682936",
    range: "A1:A60"
}

const FieldsList: React.FC = () => {
    const [googleParams, setGoogleParams] = useState<GoogleSheetsParams>(defaultParams);
    const [openChoseModal, setOpenChoseModal] = useState<boolean>(false);
    const [openRoll, setOpenRoll] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const statisticsList = useSelector(sStatistics);
    const currentRolls = useSelector(sCurrentRolls);
    const eventsList = useSelector(sEventsList);
    const loading = useSelector(sLoading);

    const selected = currentRolls.length ? currentRolls : eventsList[eventsList.length - 1] || [];

    useEffect(() => {
        const setInit = async () => {
            dispatch(getAllGamesList(googleParams));
        }
        setInit();
    }, [dispatch, googleParams]);

    const handleChangeGoogleParams = (params: GoogleSheetsParams) => {
        setGoogleParams(params)
    }

    const handleLoad = () => {
        dispatch(getAllGamesList(googleParams));
        setOpenChoseModal(false)
    }

    return (
        <div className="flex flex-wrap text-2xl top-1 bg-black w-full">
            {!loading ? (
                <>
                    {Object.entries(statisticsList).map((item) => (
                        <div key={item[0]} className={`flex justify-between items-center w-1/3 p-1 border ${selected.find(roll => roll === item[0]) ? 'text-gray-500' : ''}`}>
                            <span className={`flex-grow overflow-hidden whitespace-nowrap overflow-ellipsis`}>{item[0]}</span>
                        </div>
                    ))}
                    <div className="fixed text-xl left-1/2 transform -translate-x-1/2 bottom-10 bg-black p-4 border rounded">
                        <button className="flex-1 mr-2 p-1 border" style={{borderRadius:"50%", width:"40px", height:"40px"}} onClick={() => setOpenChoseModal(true)}>...</button>
                        <button className="flex-1 mr-2 p-1 border" onClick={() => setOpenRoll(true)}>Start Roll</button>
                    </div>
                    {openRoll && <Roulette {...{setOpenRoll: () => setOpenRoll(false)}}/>}
                    <ModalPortal {...{ isOpen: openChoseModal, onClose: () => setOpenChoseModal(false) }}>
                        <div className="flex flex-col">
                            <div className="flex flex-row border p-2 items-center">
                                <span className="flex-1">URL:</span>
                                <input onChange={(e) => handleChangeGoogleParams({ url: e.target.value, range: googleParams.range })}
                                    className="flex-1 bg-gray-700 p-1" type="text" defaultValue={googleParams.url} />
                            </div>
                            <div className="flex flex-row border p-2 items-center">
                                <span className="flex-1 mr-2 pt-1">Range:</span>
                                <input onChange={(e) => handleChangeGoogleParams({ url: googleParams.url, range: e.target.value })}
                                    className="flex-1 bg-gray-700 p-1" type="text" defaultValue={googleParams.range} />
                            </div>
                            <div className="flex flex-row border p-2 items-center">
                                <button className="flex-1 mr-2 p-1 border" onClick={handleLoad}>Load</button>
                                <button className="flex-1 mr-2 p-1 border" onClick={() => setOpenChoseModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </ModalPortal>
                </>) : <div className="fixed text-lg text-center w-full">Loading List</div>}
        </div>
    )
}

export default FieldsList;