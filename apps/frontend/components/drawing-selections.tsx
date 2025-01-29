import { Menu, X } from 'lucide-react';
import { DrawingControls } from './drawing-controls';
import { useUIstore } from '@/stores';
import { cn } from '@/lib/utils';

const DrawingSelection = () => {
  const {isControlsVisible,setIsControlsVisible}  = useUIstore()

  return (
    <div className="">
      <button
        onClick={() => setIsControlsVisible(!isControlsVisible)}
        className={cn(
          "fixed bottom-4 left-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 border-2 border-black"
        )}
      >
        {!isControlsVisible ? <Menu className="w-6 h-6 text-gray-700" /> : <X className="w-6 h-6 text-gray-700" />}
      </button>

      <div
        className={`fixed bottom-20 left-4 transition-all duration-300 transform ${
          isControlsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <DrawingControls />
      </div>
    </div>
  );
};

export default DrawingSelection;