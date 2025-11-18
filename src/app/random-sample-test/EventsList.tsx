import {
    eventsList as sEventsList,
    currentRolls as sCurrentRolls
} from "@/redux/slices/gamesSlice";
import { useSelector } from "react-redux";
import {CellData} from "@/utils/getGamesList";

const EventsList: React.FC = () => {
    const eventsList = useSelector(sEventsList);
    const currentRolls = useSelector(sCurrentRolls);
    return (
        <div className="grid grid-cols-6 gap-1 pl-2 pr-2 pt-3">
            {eventsList.map((evnt: CellData[], evntIndex) => (
                <div className={`pt-5`} key={`${evntIndex}`}>
                    {evnt.map((item, itemIndex) => (
                        <div key={`${evntIndex}-${itemIndex}`} className="border pl-2 pr-2 truncate">
                            {item.formattedValue}
                        </div>)
                    )}
                </div>)
            )}
            {currentRolls.length ? <div className={`pt-5`}>
                {currentRolls.map((item, itemIndex) => (
                    <div key={`${itemIndex}`} className="border pl-2 pr-2 truncate">
                        {item.formattedValue}
                    </div>)
                )}
            </div> : null}
        </div>
    );
};
export default EventsList;