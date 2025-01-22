"use client";

import { useUIstore } from "@/stores";
import { TopBar } from "./top-bar";
const Draw = () => {
    const {selectedTool} = useUIstore()
    return (
        <div className='w-screen h-screen overflow-hidden'>
            <div className="flex justify-center mt-5">
                <TopBar/>
                <h1>{selectedTool}</h1>
            </div>
        </div>
    );
}

export default Draw;