import {
    setAllGamesList,
    statistics as sStatistics,
    currentRolls as sCurrentRolls,
    blackFieldsCounter as sBlackSlotsCount,
    eventsCounter as sEventsCounter,
    rollCounter as sRollCounter,
} from "@/redux/slices/gamesSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const FieldsList: React.FC<{ serverProps: string[] }> = ({ serverProps }) => {
    const dispatch = useDispatch();
    const statisticsList = useSelector(sStatistics);
    const currentRolls = useSelector(sCurrentRolls);
    const blackFieldsCounter = useSelector(sBlackSlotsCount);
    const eventsCounter = useSelector(sEventsCounter);
    const rollCounter = useSelector(sRollCounter);

    useEffect(() => {
        dispatch(setAllGamesList(serverProps));
    }, [serverProps]);

    return (
        <div className="flex flex-wrap text-xs fixed top-1 left-1 bg-black">
            <div className="w-full flex flex-row">
                <div className="flex-1 text-lg text-center">Rolls {rollCounter}</div>
                <div className="flex-1 text-lg text-center">Events {eventsCounter}</div>
                <div className="flex-1 text-lg text-center">Black slots in event {blackFieldsCounter}</div>
                <div className="flex-1 text-lg text-center">% {((blackFieldsCounter/eventsCounter || 0) * 100).toFixed(2)}</div>
            </div>
            {Object.entries(statisticsList).map(item => (
                <div key={item[0]} className={`flex justify-between items-center w-1/6 p-1 border ${currentRolls.find(roll => roll === item[0]) ? 'text-gray-500' : ''}`}>
                    <span className={`flex-10 w-30 overflow-hidden whitespace-nowrap overflow-ellipsis`}>{item[0]}</span>
                    <span className="flex-1 pl-2">{item[1]}</span>
                </div>
            ))}
        </div>
    )
}

export default FieldsList;