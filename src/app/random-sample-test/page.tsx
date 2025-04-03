"use client"
import EventsList from "@/app/random-sample-test/EventsList";
import RandomSlotControl from "@/app/random-sample-test/RandomSlotControls";
import SlotsList from "@/app/random-sample-test/SlotsList";
import store from "@/redux/store";
import { Provider } from "react-redux";

const Roulette: React.FC = () => {
    return (
        <Provider store={store}>
            <div className="text-gray-100 min-h-screen h-full bg-black font-[family-name:var(--font-geist-sans)] pt-80 pb-30">
                <main className="w-full">
                    <SlotsList />
                    <EventsList />
                    <RandomSlotControl />
                </main>
            </div>

        </Provider>)
}

export default Roulette;