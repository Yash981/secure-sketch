"use client";

import CanvasComponent from "./canvas-component";
import { ClearDialog } from "./clear-dialog";
import Collaboration from "./collaboration";
import DrawingSelection from "./drawing-selections";
import { TopBar } from "./top-bar";
import { UserBlock } from "./user-block";
import ZoomCanvas from "./zoom-canvas";

const Draw = () => {
  return (
    <div className='relative w-screen h-screen'>
      <UserBlock />
      <TopBar className="fixed top-3 lg:left-1/2 sm:left-[33%] transform -translate-x-1/2 z-10"/>
      <div className="z-10 relative">
        <Collaboration/>
      </div>
      <ClearDialog/>
      <CanvasComponent/>
      <DrawingSelection/>
      <ZoomCanvas/>
    </div>
  );
};
  
export default Draw;