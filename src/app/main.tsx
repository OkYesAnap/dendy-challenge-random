"use client"
import EventsList from "@/components/EventsList";
import RandomSlotControl from "@/components/RandomSlotControls";
import FieldsList from "@/components/SlotsList";
import store from "@/redux/store";
import Link from "next/link";
import { Provider } from "react-redux";


const MainPage: React.FC = () => {
    return (
            <div className="flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)] pt-80 pb-30">
                <Link className="p-4 border rounded text-center" href={`/roulette`}>Roulette</Link>
            </div>
    );
}

export default MainPage;