"use client"
import EventsList from "@/components/EventsList";
import RandomSlotControl from "@/components/RandomSlotControls";
import FieldsList from "@/components/SlotsList";
import store from "@/redux/store";
import { Provider } from "react-redux";


const MainPage: React.FC = () => {
    return (
        <Provider store={store}>
            <div className="font-[family-name:var(--font-geist-sans)] pt-80 pb-30">
                <main className="w-full">
                    <FieldsList/>
                    <EventsList />
                    <RandomSlotControl />
                </main>
            </div>
        </Provider>
    );
}

export default MainPage;