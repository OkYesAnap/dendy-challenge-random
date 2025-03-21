import { motion } from "motion/react"

const WinGameLabel: React.FC<{
    currentGame: string,
    currentGamePos: number
}> = ({ currentGame, currentGamePos }) => {
    return (
        <motion.div
            style={{ top: `${currentGamePos + 32}px` }}
            className={`${currentGame ? "opacity-100" : "opacity-0"} fixed max-h-[85%] max-w-[85%] text-4xl left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-[56%] border-3 bg-black rounded overflow-hidden whitespace-nowrap p-6`}
            layout
            transition={{
                default: { ease: "ease" },
                layout: { duration: 0.5 }
            }}>
            {currentGame}
        </motion.div>)
}

export default WinGameLabel;