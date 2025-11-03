import {motion} from "motion/react"
import {ReactSetState} from "@/app/roulette/types";
import SquareButton from "@/app/roulette/SquareButton";

const WinGameLabel: React.FC<{
    currentGame: string,
    setCurrentGame: ReactSetState<string>,
    currentGamePos: number
}> = ({currentGame, setCurrentGame, currentGamePos}) => {
    return (
        <motion.div
            style={{top: `${currentGamePos + 32}px`}}
            className={`${currentGame ? "opacity-100" : "opacity-0"} flex flex-row fixed max-h-[85%] max-w-[85%] text-4xl left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-[56%] border-3 bg-black whitespace-nowrap`}
            layout
            transition={{
                default: {ease: "ease"},
                layout: {duration: 0.5}
            }}>
            <div className="border-2 p-6">
                {currentGame}
            </div>
            <div className={"flex justify-center items-center w-full px-3"}>
                <SquareButton
                    onClickButton={() => setCurrentGame('')}
                    icon={"x"}
                    hint={"Close"}
                />
            </div>
        </motion.div>)
}

export default WinGameLabel;