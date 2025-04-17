import React from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-gray-700 text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 rounded cursor-pointer"
      />
    </div>
  );
};

export default ColorPicker; 