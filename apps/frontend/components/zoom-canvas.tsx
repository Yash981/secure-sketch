import React from 'react';
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';
import { useZoomStore } from '@/stores';

const ZoomCanvas: React.FC = () => {
    const {zoom, setZoom} = useZoomStore(); 

    

    return (
        <div className="fixed z-10 left-1/2 transform -translate-x-1/2 w-44 bg-gray-400 p-2 rounded-md h-[50px] bottom-5">
            <Button onClick={()=>setZoom(zoom - 10)} variant={"secondary"} className=" rounded-l-md cursor-pointer bg-transparent hover:bg-transparent"><Minus size={15}/></Button>
            <span className="mx-2 text-lg font-semibold">{zoom}%</span>
            <Button onClick={()=>setZoom(zoom + 10)} variant={"secondary"} className="rounded-r-md cursor-pointer bg-transparent hover:bg-transparent"><Plus size={15}/></Button>
        </div>
    );
};

export default ZoomCanvas;
