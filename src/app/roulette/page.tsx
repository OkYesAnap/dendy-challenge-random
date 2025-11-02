"use client"
import MainInfo from "@/app/roulette/MainInfo";
import store from "@/redux/store";
import {Suspense} from "react";
import {Provider} from "react-redux";

const RoulettePage: React.FC = () => {
    return (
        <Provider store={store}>
            <Suspense>
                <div
                    className="bg-black w-full h-screen overflow-y-auto text-gray-100 font-[family-name:var(--font-geist-sans)] pb-35">
                    <MainInfo/>
                </div>
            </Suspense>
        </Provider>)
}

export default RoulettePage;