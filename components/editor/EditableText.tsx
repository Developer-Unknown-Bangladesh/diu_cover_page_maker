import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrash, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';
import ColorPicker from './ColorPicker';

interface TextUpdate {
  position?: { x: number; y: number };
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

interface EditableTextProps {
  id: string;
  initialText: string;
  initialX: number;
  initialY: number;
  initialFontSize?: number;
  initialFontWeight?: string;
  initialColor?: string;
  initialAlign?: 'left' | 'center' | 'right';
  onUpdate: (id: string, updates: TextUpdate) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  zIndex?: number;
  onDragStateChange?: (isDragging: boolean) => void;
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
  zIndex = 1,
  onDragStateChange
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [fontWeight, setFontWeight] = useState(initialFontWeight);
  const [color, setColor] = useState(initialColor);
  const [align, setAlign] = useState(initialAlign);
  const [opacity, setOpacity] = useState(100);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outsideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update parent component when properties change
    onUpdate(id, { text, position, fontSize, fontWeight, color, align });
  }, [id, text, position, fontSize, fontWeight, color, align, onUpdate]);

  // Focus textarea when edit mode is activated
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

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

  const handleColorChange = (newColor: string, newOpacity: number) => {
    setColor(newColor);
    setOpacity(newOpacity);
  };

  const handleAlignChange = (newAlign: 'left' | 'center' | 'right') => {
    setAlign(newAlign);
    
    // Make sure to update the parent component with the new alignment
    onUpdate(id, { align: newAlign });
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
      if (onDragStateChange) onDragStateChange(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      
      // Prevent text selection during drag
      e.preventDefault();
    }
  };

  // Use useCallback to memoize the handler function
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      e.preventDefault(); // Prevent text selection during drag
    }
  }, [isDragging, dragStart]);

  // Use useCallback for the mouseup handler too
  const handleMouseUp = React.useCallback(() => {
    if (isDragging && onDragStateChange) onDragStateChange(false);
    setIsDragging(false);
  }, [isDragging, onDragStateChange]);

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

  // Handle escape key to close editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditing) {
        setIsEditing(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditing]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isEditing && outsideRef.current && !outsideRef.current.contains(e.target as Node)) {
        handleEditComplete();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  return (
    <>
      {/* Modal for editing text */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <div 
            ref={outsideRef}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the modal
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Text</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Content
                </label>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={handleTextChange}
                  className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Size: {fontSize}px
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">8px</span>
                  <input
                    type="range"
                    min="8"
                    max="72"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-600">72px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Weight
                </label>
                <select
                  value={fontWeight}
                  onChange={handleFontWeightChange}
                  className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="semibold">Semi-Bold</option>
                </select>
              </div>

              <ColorPicker
                initialColor={color}
                initialOpacity={opacity}
                onChange={handleColorChange}
                label="Text Color"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Alignment
                </label>
                <div className="flex gap-2 p-1 bg-gray-100 rounded">
                  <button
                    type="button"
                    onClick={() => handleAlignChange('left')}
                    className={`flex-1 p-2 rounded flex items-center justify-center gap-1 ${
                      align === 'left'
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FaAlignLeft size={16} />
                    <span>Left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAlignChange('center')}
                    className={`flex-1 p-2 rounded flex items-center justify-center gap-1 ${
                      align === 'center'
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FaAlignCenter size={16} />
                    <span>Center</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAlignChange('right')}
                    className={`flex-1 p-2 rounded flex items-center justify-center gap-1 ${
                      align === 'right'
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <FaAlignRight size={16} />
                    <span>Right</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleEditComplete}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          zIndex: isDragging ? 100 : zIndex,
          opacity: opacity / 100,
          transform: `translate(0, 0)`, // Helps with smoother performance
          willChange: isDragging ? 'transform' : 'auto', // Optimize for animation
          transition: isDragging ? 'none' : 'opacity 0.2s ease'
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
              whiteSpace: 'pre-wrap',
              userSelect: 'none' // Prevent text selection during drag
            }}
          >
            {text}
          </div>

          {showControls && (
            <div className="absolute -top-8 right-0 flex bg-white rounded shadow-md">
              <button
                onClick={handleEditClick}
                className="p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit text"
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <FaTrash size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditableText;
