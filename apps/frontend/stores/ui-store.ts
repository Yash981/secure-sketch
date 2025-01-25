import { Shape } from '@/draw/canvas';
import { create} from 'zustand'

interface UIstate {
    selectedTool: Shape,
    setSelectedTool:(selectedTool:Shape) => void
}

export const useUIstore = create<UIstate>((set)=>({
    selectedTool:'select',
    setSelectedTool:(selectedTool)=>{
        if(!selectedTool) return;
        set({ selectedTool })
    }
}))