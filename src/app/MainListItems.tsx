import {motion} from "motion/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-regular-svg-icons";
import React from "react";
import {CellData} from "@/utils/getGamesList";
import {useSelector} from "react-redux";
import {
    allData as sAllData,
    currentRolls as sCurrentRolls
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

    const handleOpenInfo = (e: React.MouseEvent<HTMLDivElement>, item: CellData[]) => {
        getAndSetElementPos(e);
        updateOpenModal({openInfoModal: true});
        setInfoData(item);
    };

    return (allData.map((item) => (
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
    )));
};

export default MainListItems;