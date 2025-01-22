import { create} from 'zustand'

interface UIstate {
    selectedTool: string,
    setSelectedTool:(selectedTool:string) => void
}

export const useUIstore = create<UIstate>((set)=>({
    selectedTool:'select',
    setSelectedTool:(selectedTool)=>{
        if(!selectedTool) return;
        set({ selectedTool })
    }
}))