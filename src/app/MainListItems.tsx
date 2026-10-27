import {motion} from "motion/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import React, {useState} from "react";
import {CellData} from "@/utils/getGamesList";
import {useSelector, useDispatch} from "react-redux";
import {
    allData as sAllData,
    currentRolls as sCurrentRolls,
    updateItemWeight
} from "@/redux/slices/gamesSlice";
import {Modals, ReactSetState} from "@/app/roulette/types";

const MainListItems = ({
                           setInfoData,
                           updateOpenModal,
                           getAndSetElementPos,
                           openModals,
                           infoData
                       }: {
                           setInfoData: ReactSetState<CellData[]>;
    updateOpenModal: (openWindow: Partial<Modals>) => void;
                           getAndSetElementPos: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
                           openModals: Modals;
                           infoData: CellData[];
                       }
) => {
    const allData = useSelector(sAllData);
    const currentRolls = useSelector(sCurrentRolls);
    const dispatch = useDispatch();

    const [inputValues, setInputValues] = useState<Record<string, string>>({});

    const handleOpenInfo = (e: React.MouseEvent<HTMLDivElement>, item: CellData[]) => {
        getAndSetElementPos(e);
        updateOpenModal({openInfoModal: true});
        setInfoData(item);
    };

    const getWeight = (item: CellData[]) => {
        return item[1]?.weight ?? 0;
    };

    const handleInputChange = (key: string, value: string) => {
        setInputValues(prev => ({...prev, [key]: value}));
    };

    const handleWeightOk = (rowIndex: number, item: CellData[]) => {
        const inputVal = inputValues[item[0].formattedValue];
        const parsed = Number(inputVal);
        const newWeight = !isNaN(parsed) ? parsed : getWeight(item);
        dispatch(updateItemWeight({rowIndex, newWeight}));
    };

    return (allData.map((item, rowIndex) => (
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
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <span className="text-sm min-w-[3ch]">
                    {getWeight(item)}
                </span>
                <input
                    type="number"
                    step={100}
                    min={-100000}
                    max={100000}
                    className="w-16 text-sm border rounded px-1 py-0.5"
                    value={inputValues[item[0].formattedValue] ?? ''}
                    onChange={(e) => handleInputChange(item[0].formattedValue, e.target.value)}
                />
                <button
                    className="text-xs bg-blue-500 text-white rounded px-2 py-0.5 hover:bg-blue-600"
                    onClick={() => handleWeightOk(rowIndex, item)}
                >
                    OK
                </button>
            </div>
            {(item.length > 2 && (item[0].formattedValue !== infoData[0].formattedValue || !openModals.openInfoModal)) ? (
                <div className="cursor-pointer" onClick={(e) => handleOpenInfo(e, item)}>
                    <FontAwesomeIcon icon={faPlusSquare}/>
                </div>
            ) : null}
        </motion.div>
    )));
};

export default MainListItems;