import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrash, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';

interface EditableTextProps {
  id: string;
  initialText: string;
  initialX: number;
  initialY: number;
  initialFontSize?: number;
  initialFontWeight?: string;
  initialColor?: string;
  initialAlign?: 'left' | 'center' | 'right';
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  zIndex?: number;
}

const EditableText: React.FC<EditableTextProps> = ({
  id,
  initialText,
  initialX,
  initialY,
  initialFontSize = 16,
  initialFontWeight = 'normal',
  initialColor = '#000000',
  initialAlign = 'center',
  onUpdate,
  onDelete,
  isSelected = false,
  onSelect,
  zIndex = 1
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [fontWeight, setFontWeight] = useState(initialFontWeight);
  const [color, setColor] = useState(initialColor);
  const [align, setAlign] = useState(initialAlign);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update parent component when properties change
    onUpdate(id, { text, position, fontSize, fontWeight, color, align });
  }, [id, text, position, fontSize, fontWeight, color, align, onUpdate]);

  const handleDrag = (_e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(Number(e.target.value));
  };

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontWeight(e.target.value);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleAlignChange = (newAlign: 'left' | 'center' | 'right') => {
    setAlign(newAlign);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect();
    }
    
    if (e.target instanceof HTMLElement && e.target.closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Use useCallback to memoize the handler function
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  // Use useCallback for the mouseup handler too
  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Show edit button on hover or if selected
  const showControls = isHovered || isSelected;

  return (
    <div
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        {isEditing ? (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 min-w-[300px]">
            <textarea
              value={text}
              onChange={handleTextChange}
              className="w-full p-2 border border-gray-300 rounded mb-3"
              rows={3}
              autoFocus
            />

            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center gap-2">
                <label className="text-sm w-24">Font Size:</label>
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  className="flex-1"
                />
                <span className="text-sm w-8">{fontSize}px</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm w-24">Font Weight:</label>
                <select
                  value={fontWeight}
                  onChange={handleFontWeightChange}
                  className="flex-1 p-1 border border-gray-300 rounded"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="semibold">Semi-Bold</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm w-24">Color:</label>
                <input
                  type="color"
                  value={color}
                  onChange={handleColorChange}
                  className="w-8 h-8"
                />
                <span className="text-sm">{color}</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm w-24">Alignment:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAlignChange('left')}
                    className={`p-1 rounded ${align === 'left' ? 'bg-blue-100' : 'bg-gray-100'}`}
                  >
                    <FaAlignLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAlignChange('center')}
                    className={`p-1 rounded ${align === 'center' ? 'bg-blue-100' : 'bg-gray-100'}`}
                  >
                    <FaAlignCenter />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAlignChange('right')}
                    className={`p-1 rounded ${align === 'right' ? 'bg-blue-100' : 'bg-gray-100'}`}
                  >
                    <FaAlignRight />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleEditComplete}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div
              ref={textRef}
              className="drag-handle p-2 cursor-move"
              style={{
                fontSize: `${fontSize}px`,
                fontWeight: fontWeight,
                color: color,
                textAlign: align,
                minWidth: '50px',
                minHeight: '24px',
                whiteSpace: 'pre-wrap'
              }}
            >
              {text}
            </div>

            {showControls && (
              <div className="absolute top-0 right-0 flex bg-white border border-gray-200 rounded shadow-sm">
                <button
                  onClick={handleEditClick}
                  className="p-1 text-blue-600 hover:bg-blue-50"
                  title="Edit text"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default EditableText;
