"use client";

import FabricRectangle from "./fabric-canvas";
// import { useUIstore } from "@/stores";
import { TopBar } from "./top-bar";
const Draw = () => {
    return (
      <div className='relative w-screen h-screen'>
        <TopBar className="fixed top-3 left-1/2 transform -translate-x-1/2 z-10"/>
        <FabricRectangle/>
      </div>
    );
  };
  
export default Draw;