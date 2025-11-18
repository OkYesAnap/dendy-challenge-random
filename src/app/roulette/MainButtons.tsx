import SquareButton from "@/app/roulette/SquareButton";
import {allGamesList as sAllGamesList, shuffleAllGamesList, sortAllGamesList} from "@/redux/slices/gamesSlice";
import {motion} from "motion/react";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Modals, ReactSetState} from "@/app/roulette/types";
import {AppDispatch} from "@/redux/store";

const MainButtons = ({
                         columns,
                         setColumns,
                         handleLoad,
                         getAndSetElementPos,
                         updateOpenModal,
                     }:
                     {
                         columns: number;
                         setColumns: ReactSetState<number>;
                         handleLoad: () => void;
                         getAndSetElementPos: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
                         updateOpenModal: (openWindow: Partial<Modals>) => void;
                     }) => {

    const [additionalFunctions, setAdditionalFunctions] = useState<boolean>(false);
    const allGamesList = useSelector(sAllGamesList);
    const dispatch = useDispatch<AppDispatch>();

    const handleOpenChose = (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) getAndSetElementPos(e);
        updateOpenModal({openChoseModal: true});
    };

    return (
        <motion.div layout
                    transition={{
                        layout: {duration: .1}
                    }}
                    className="flex flex-row fixed text-xl left-1/2 transform -translate-x-1/2 bottom-0 bg-black p-3 border rounded">
            <div className="border rounded-full p-1 flex flex-row">
                {!!allGamesList.length && (
                    <SquareButton
                        onClickButton={() => updateOpenModal({openRouletteModal: true})}
                        icon={"🎰"}
                        hint={"Roulette"}
                    />
                )}
                <SquareButton
                    onClickButton={() => setAdditionalFunctions(p => !p)}
                    icon={"..."}
                    hint={"Settings"}/>
            </div>
            {additionalFunctions && <div className="border rounded-full p-1 flex flex-row">
                <SquareButton
                    onClickButton={(e) => handleOpenChose(e)}
                    icon={"📥"}
                    hint={"Load list"}
                />

                {!!allGamesList.length && (<>
                    <SquareButton
                        onClickButton={() => setColumns(p => p > 1 ? p - 1 : p)}
                        icon={"-"}
                        hint={"Less columns"}
                    />
                    <SquareButton
                        icon={String(columns)}
                        hint={"Columns"}
                    />
                    <SquareButton
                        onClickButton={() => setColumns(p => p < 12 ? p + 1 : p)}
                        icon={"+"}
                        hint={"More columns"}
                    />
                    <SquareButton
                        onClickButton={() => dispatch(shuffleAllGamesList())}
                        icon={"🔀"}
                        hint={"Shuffle"}/>
                    <SquareButton
                        onClickButton={() => dispatch(sortAllGamesList())}
                        icon={"📈"}
                        hint={"Order"}/>
                    <SquareButton
                        onClickButton={() => handleLoad()}
                        icon={"🔄"}
                        hint={"Update"}/>
                </>)}
            </div>}
        </motion.div>
    )
}

export default MainButtons;