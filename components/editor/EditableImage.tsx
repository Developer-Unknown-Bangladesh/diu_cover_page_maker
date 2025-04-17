import React, { useState, useEffect, useRef } from 'react';
import { FaTrash, FaExchangeAlt } from 'react-icons/fa';
import Image from 'next/image';

interface ImageUpdate {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  src?: string;
}

interface EditableImageProps {
  id: string;
  src: string;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  onUpdate: (id: string, updates: ImageUpdate) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  zIndex?: number;
  onDragStateChange?: (isDragging: boolean) => void;
}

const EditableImage: React.FC<EditableImageProps> = ({
  id,
  src,
  initialX,
  initialY,
  initialWidth,
  initialHeight,
  onUpdate,
  onDelete,
  isSelected = false,
  onSelect,
  zIndex = 1,
  onDragStateChange
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isHovered, setIsHovered] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Update parent component when properties change
    onUpdate(id, { position, size, src: imageSrc });
  }, [id, position, size, imageSrc, onUpdate]);

  const handleDelete = () => {
    onDelete(id);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const elementRef = useRef<HTMLDivElement>(null);
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

  // Handle resizing manually with useCallback
  const handleResizeMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleResizeMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);
      setSize({
        width: Math.max(50, newWidth),
        height: Math.max(50, newHeight)
      });
    };

    const handleResizeMouseUp = () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };

    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  }, [size.width, size.height]);

  // Show controls on hover or if selected
  const showControls = isHovered || isSelected;

  return (
    <div
      ref={elementRef}
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="drag-handle relative"
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
            <div className="w-full h-full relative">
              <Image
                src={imageSrc}
                alt="Editable image"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>

            {showControls && (
              <div className="absolute top-0 right-0 flex bg-white border border-gray-200 rounded shadow-sm">
                <label className="p-1 text-blue-600 hover:bg-blue-50 cursor-pointer" title="Change image">
                  <FaExchangeAlt size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleDelete}
                  className="p-1 text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                Uploading...
              </div>
            )}
            
            {/* Resize handle - only show when selected or hovered */}
            {showControls && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"
                onMouseDown={handleResizeMouseDown}
              />
            )}
          </div>
      </div>
  );
};

export default EditableImage;
