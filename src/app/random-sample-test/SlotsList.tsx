import {
    setAllGamesList,
    statistics as sStatistics,
    currentRolls as sCurrentRolls,
    blackFieldsCounter as sBlackSlotsCount,
    eventsCounter as sEventsCounter,
    rollCounter as sRollCounter,
    allGamesList as sAllGamesList,
    eventsList as sEventsList
} from "@/redux/slices/gamesSlice";
import { getGamesList } from "@/utils/getGamesList";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const defaultParams = {
    url: "https://docs.google.com/spreadsheets/d/1lQKxm4V-xac7sl0mrwcgOg1BLpHGAy_f873ls0hoVeM/edit?gid=1031682936#gid=1031682936",
    range: "A1:A60"
}

const SlotsList: React.FC = () => {
    const dispatch = useDispatch();
    const statisticsList = useSelector(sStatistics);
    const currentRolls = useSelector(sCurrentRolls);
    const blackFieldsCounter = useSelector(sBlackSlotsCount);
    const eventsCounter = useSelector(sEventsCounter);
    const rollCounter = useSelector(sRollCounter);
    const allGamesList = useSelector(sAllGamesList);
    const eventsList = useSelector(sEventsList);

    const selected = currentRolls.length ? currentRolls : eventsList[eventsList.length -1] || [];

    useEffect(() => {
        const setInit = async () => {
            const serverProps = await getGamesList(defaultParams);
            dispatch(setAllGamesList(serverProps));
        }
        setInit();
    }, [dispatch]);

    return (
        <div className="flex flex-wrap text-xs fixed top-1 left-1 bg-black w-full">
            {allGamesList.length ? (<><div className="w-full flex flex-row">
                <div className="flex-1 text-lg text-center">Rolls {rollCounter}</div>
                <div className="flex-1 text-lg text-center">Events {eventsCounter}</div>
                <div className="flex-1 text-lg text-center">Black slots in event {blackFieldsCounter}</div>
                <div className="flex-1 text-lg text-center">% {((blackFieldsCounter / eventsCounter || 0) * 100).toFixed(2)}</div>
            </div>
                {Object.entries(statisticsList).map(item => (
                    <div key={item[0]} className={`flex justify-between items-center w-1/6 p-1 border ${selected.find(roll => roll === item[0]) ? 'text-gray-500' : ''}`}>
                        <span className={`flex-10 w-30 overflow-hidden whitespace-nowrap overflow-ellipsis`}>{item[0]}</span>
                        <span className="flex-1 pl-2">{item[1]}</span>
                    </div>
                ))}</>) : <div className="fixed text-lg text-center w-full">Loading List</div>}
        </div>
    )
}

export default SlotsList;