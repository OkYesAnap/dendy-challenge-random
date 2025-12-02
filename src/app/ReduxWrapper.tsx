"use client";
import store from "@/redux/store";
import {Provider} from "react-redux";

const ReduxWrapper: React.FC<{children: React.ReactNode}> = ({children}) =>
    <Provider store={store}>
        {children}
    </Provider>;


export default ReduxWrapper;