"use client"
import Link from "next/link";


const MainPage: React.FC = () => {
    return (
            <div className="flex bg-black text-gray-100 flex-row items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)] pt-80 pb-30">
                <Link className="p-4 border rounded text-center" href={`/roulette`}>Roulette</Link>
                <Link className="p-4 border rounded text-center" href={`/random-sample-test`}>Random Test</Link>
            </div>
    );
}

export default MainPage;