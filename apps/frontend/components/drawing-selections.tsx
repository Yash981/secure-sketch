import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DrawingControls } from './drawing-controls';

const DrawingSelection = () => {
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(1);
  const [isFilled, setIsFilled] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);

  return (
    <div className="">
      {/* Fixed Controls Toggle Button */}
      <button
        onClick={() => setIsControlsVisible(!isControlsVisible)}
        className="fixed bottom-4 left-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        {!isControlsVisible ? <Menu className="w-6 h-6 text-gray-700" /> : <X className="w-6 h-6 text-gray-700" />}
      </button>

      {/* Drawing Controls with Animation */}
      <div
        className={`fixed bottom-20 left-4 transition-all duration-300 transform ${
          isControlsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <DrawingControls
          color={color}
          setColor={setColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          opacity={opacity}
          setOpacity={setOpacity}
          isFilled={isFilled}
          setIsFilled={setIsFilled}
        />
      </div>
    </div>
  );
};

export default DrawingSelection;