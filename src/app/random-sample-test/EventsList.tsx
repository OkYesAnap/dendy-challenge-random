import {
    eventsList as sEventsList,
    currentRolls as sCurrentRolls
} from "@/redux/slices/gamesSlice"
import { useSelector } from "react-redux"

const EventsList: React.FC = () => {
    const eventsList = useSelector(sEventsList);
    const currentRolls = useSelector(sCurrentRolls)
    return (
        <div className="grid grid-cols-6 gap-1 pl-2 pr-2 pt-3">
            {eventsList.map((evnt: string[], evntIndex) => (
                <div className={`pt-5`}key={`${evntIndex}`}>
                    {evnt.map((item, itemIndex) => (
                        <div key={`${evntIndex}-${itemIndex}`} className="border pl-2 pr-2 truncate">
                            {item}
                        </div>)
                    )}
                </div>)
            )}
            {currentRolls.length ? <div className={`pt-5`}>
                {currentRolls.map((item, itemIndex) => (
                    <div key={`${itemIndex}`} className="border pl-2 pr-2 truncate">
                        {item}
                    </div>)
                )}
            </div> : null}
        </div>
    )
}
export default EventsList;