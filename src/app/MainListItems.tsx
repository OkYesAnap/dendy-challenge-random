import {motion} from "motion/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import {faTimes as faTimesSolid, faPlus, faCheck} from "@fortawesome/free-solid-svg-icons";
import React, {useState, useRef, useEffect, FormEvent, KeyboardEvent} from "react";
import {CellData} from "@/utils/getGamesList";
import {useSelector, useDispatch} from "react-redux";
import {
    allData as sAllData,
    currentRolls as sCurrentRolls,
    updateItemWeight,
    addItem
} from "@/redux/slices/gamesSlice";
import {Modals, ReactSetState} from "@/app/roulette/types";

const MainListItems = ({
                           setInfoData,
                           updateOpenModal,
                           getAndSetElementPos,
                           openModals,
                           infoData,
                           columns
                       }: {
                           setInfoData: ReactSetState<CellData[]>;
                           updateOpenModal: (openWindow: Partial<Modals>) => void;
                           getAndSetElementPos: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
                           openModals: Modals;
                           infoData: CellData[];
                           columns: number
                       }
) => {
    const allData = useSelector(sAllData);
    const currentRolls = useSelector(sCurrentRolls);
    const dispatch = useDispatch();

    const [inputValues, setInputValues] = useState<Record<string, string>>({});
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [newItemName, setNewItemName] = useState<string>("");
    const addInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAdding && addInputRef.current) {
            addInputRef.current.focus();
        }
    }, [isAdding]);

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

    const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = newItemName.trim();
        if (trimmed) {
            dispatch(addItem(trimmed));
            setNewItemName("");
            setIsAdding(false);
        }
    };

    const handleAddCancel = () => {
        setNewItemName("");
        setIsAdding(false);
    };

    const handleAddKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const trimmed = newItemName.trim();
            if (trimmed) {
                dispatch(addItem(trimmed));
                setNewItemName("");
                setIsAdding(false);
            }
        } else if (e.key === "Escape") {
            handleAddCancel();
        }
    };

    return (
        <>
            <div className="grid grid-flow-col text-2xl top-1"
                 style={{
                     gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                     gridTemplateRows: `repeat(${Math.ceil(allData.length / columns)}, minmax(0, 1fr))`
                 }}>
                {allData.map((item, rowIndex) => (
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
                ))}
            </div>
            {/* Add Item Row */}
            <div className="flex justify-center mt-4"
                 onClick={!isAdding ? () => setIsAdding(true) : undefined}>
                <div className="w-1/4 p-1 border rounded 20px">
                    {!isAdding ? (
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlus}/>
                            <span>Add Item</span>
                        </div>
                    ) : (
                        <form onSubmit={handleAddSubmit} className="flex items-center gap-2 flex-grow">
                            <input
                                ref={addInputRef}
                                type="text"
                                className="flex-grow text-sm border rounded px-2 py-0.5"
                                placeholder="Enter item name..."
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={handleAddKeyDown}
                            />
                            <button
                                type="submit"
                                className="text-xs bg-green-500 text-white rounded px-2 py-0.5 hover:bg-green-600"
                                disabled={!newItemName.trim()}
                            >
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                            <button
                                type="button"
                                className="text-xs bg-red-500 text-white rounded px-2 py-0.5 hover:bg-red-600"
                                onClick={handleAddCancel}
                            >
                                <FontAwesomeIcon icon={faTimesSolid}/>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default MainListItems;