import React from "react"

const WinFrame: React.FC<{ halfListHeight: number, visible: boolean }> = ({ halfListHeight, visible }) => {
    return (
        <div className={`${visible ? 'opacity-100' : 'opacity-0'} duration-1500 ease-linear`}>
            <div style={{ top: `${halfListHeight}px` }} className={`absolute -right-5 bg-white w-10 h-10 rotate-[45deg] z-10`} />
            <div style={{ top: `${halfListHeight - 18}px` }} className={`absolute bg-white w-full h-2 z-10`} />
            <div style={{ top: `${halfListHeight + 50}px` }} className={`absolute bg-white w-full h-2 z-10`} />
            <div style={{ top: `${halfListHeight}px` }} className={`absolute -left-5 bg-white w-10 h-10 rotate-[45deg] z-10`} />
        </div>
    )
}

export default WinFrame