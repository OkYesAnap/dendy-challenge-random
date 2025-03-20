"use client"
import SlotsList from "@/app/roulette/SlotsList";
import store from "@/redux/store";
import { Provider } from "react-redux";

const RoulettePage: React.FC = () => {
    return (
        <Provider store={store}>
            <div className="font-[family-name:var(--font-geist-sans)] pb-30">
                <main className="w-full">
                    <SlotsList />
                </main>
            </div>
        </Provider>)
}

export default RoulettePage;