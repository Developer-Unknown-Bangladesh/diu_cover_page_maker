import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
  initialColor: string;
  initialOpacity?: number;
  onChange: (color: string, opacity: number) => void;
  label?: string;
  showOpacityControl?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  initialColor,
  initialOpacity = 100,
  onChange,
  label = 'Color',
  showOpacityControl = true
}) => {
  const [color, setColor] = useState(initialColor);
  const [opacity, setOpacity] = useState(initialOpacity);
  const [isExpanded, setIsExpanded] = useState(false);

  // Common colors palette
  const colorPalette = [
    '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0', 
    '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b',
    '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'
  ];

  useEffect(() => {
    onChange(color, opacity);
  }, [color, opacity, onChange]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseInt(e.target.value));
  };

  const handlePaletteColorClick = (newColor: string) => {
    setColor(newColor);
    setIsExpanded(false);
  };

  return (
    <div className="color-picker w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="flex items-center gap-3 mb-2">
        <div 
          className="w-10 h-10 rounded border border-gray-300 relative cursor-pointer"
          style={{ 
            backgroundColor: color,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
          />
        </div>
        
        <div className="text-sm font-mono flex-1">{color}</div>
        
        <button 
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? 'Close' : 'Palette'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-5 gap-2 p-2 bg-white rounded-md shadow-md mb-2">
          {colorPalette.map((paletteColor) => (
            <div
              key={paletteColor}
              className="w-8 h-8 rounded cursor-pointer border border-gray-200 hover:scale-110 transition-transform"
              style={{ 
                backgroundColor: paletteColor, 
                boxShadow: color === paletteColor ? '0 0 0 2px #2563eb' : 'none'
              }}
              onClick={() => handlePaletteColorClick(paletteColor)}
            />
          ))}
        </div>
      )}
      
      {showOpacityControl && (
        <div className="mb-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Opacity: {opacity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">0%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={handleOpacityChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs">100%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker; 