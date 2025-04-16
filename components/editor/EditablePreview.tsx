import React, { useState, useRef, useEffect, RefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import { FaPlus } from 'react-icons/fa';

// Define the element types
interface TextElement {
  type: 'text';
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  fontWeight: string;
  color: string;
  align: 'left' | 'center' | 'right';
}

interface ImageElement {
  type: 'image';
  id: string;
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

type Element = TextElement | ImageElement;

interface ElementUpdate {
  position?: { x: number; y: number };
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  size?: { width: number; height: number };
  src?: string;
}

interface EditorData {
  elements: Element[];
  backgroundImage: string;
}

// Generic type to accept FormData or any similar object
interface EditablePreviewProps {
  theme: string;
  initialData: any;  // Using any here to accommodate different data types
  onDataChange: (data: EditorData) => void;
  eventTarget?: RefObject<HTMLDivElement | null>;
}

const EditablePreview: React.FC<EditablePreviewProps> = ({
  theme,
  initialData,
  onDataChange,
  eventTarget
}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>('/background1.jpg');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with default elements based on the initialData
  useEffect(() => {
    // Check if we have saved elements in localStorage
    const savedEditorData = localStorage.getItem('editorData');
    if (savedEditorData) {
      try {
        const parsedData = JSON.parse(savedEditorData) as EditorData;
        if (parsedData.elements && Array.isArray(parsedData.elements) && parsedData.elements.length > 0) {
          setElements(parsedData.elements);
          if (parsedData.backgroundImage) {
            setBackgroundImage(parsedData.backgroundImage);
          }
          return; // Skip default elements creation if we have saved data
        }
      } catch (e) {
        console.error('Failed to parse saved editor data:', e);
      }
    }

    // Create default elements if no saved data or error occurred
    const defaultElements: Element[] = [
      // Logo
      {
        type: 'image',
        id: uuidv4(),
        src: '/diu_logo.png',
        position: { x: 250, y: 50 },
        size: { width: 100, height: 100 }
      },
      // Document Type (Assignment/Lab Report)
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.type?.toString() || 'Assignment',
        position: { x: 200, y: 170 },
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
        align: 'center'
      }
    ];

    // Add course code if available
    if (initialData.courseCode) {
      defaultElements.push({
        type: 'text',
        id: uuidv4(),
        text: `Course Code: ${initialData.courseCode}`,
        position: { x: 150, y: 220 },
        fontSize: 18,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      });
    }

    // Add course title if available
    if (initialData.courseTitle) {
      defaultElements.push({
        type: 'text',
        id: uuidv4(),
        text: `Course Title: ${initialData.courseTitle}`,
        position: { x: 150, y: 250 },
        fontSize: 18,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      });
    }

    // Add topic if available
    if (initialData.topic) {
      defaultElements.push({
        type: 'text',
        id: uuidv4(),
        text: `Topic: ${initialData.topic}`,
        position: { x: 150, y: 280 },
        fontSize: 18,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      });
    }

    // Add teacher info if available
    if (initialData.teacherName) {
      defaultElements.push({
        type: 'text',
        id: uuidv4(),
        text: `Submitted To:`,
        position: { x: 150, y: 350 },
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        align: 'center'
      });

      defaultElements.push({
        type: 'text',
        id: uuidv4(),
        text: initialData.teacherName.toString(),
        position: { x: 150, y: 380 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      });

      if (initialData.designation) {
        defaultElements.push({
          type: 'text',
          id: uuidv4(),
          text: initialData.designation.toString(),
          position: { x: 150, y: 410 },
          fontSize: 16,
          fontWeight: 'normal',
          color: '#000000',
          align: 'center'
        });
      }

      if (initialData.teacherDepartment) {
        defaultElements.push({
          type: 'text',
          id: uuidv4(),
          text: initialData.teacherDepartment.toString(),
          position: { x: 150, y: 440 },
          fontSize: 16,
          fontWeight: 'normal',
          color: '#000000',
          align: 'center'
        });
      }
    }

    // Add student info if available
    if (initialData.studentName) {
      defaultElements.push({
        type: 'text',
        id: uuidv4(),
        text: `Submitted By:`,
        position: { x: 150, y: 500 },
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        align: 'center'
      });

      defaultElements.push({
        type: 'text',
        id: uuidv4(),
        text: initialData.studentName.toString(),
        position: { x: 150, y: 530 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      });

      if (initialData.studentId) {
        defaultElements.push({
          type: 'text',
          id: uuidv4(),
          text: `ID: ${initialData.studentId}`,
          position: { x: 150, y: 560 },
          fontSize: 16,
          fontWeight: 'normal',
          color: '#000000',
          align: 'center'
        });
      }

      if (initialData.section) {
        defaultElements.push({
          type: 'text',
          id: uuidv4(),
          text: `Section: ${initialData.section}`,
          position: { x: 150, y: 590 },
          fontSize: 16,
          fontWeight: 'normal',
          color: '#000000',
          align: 'center'
        });
      }

      if (initialData.studentDepartment) {
        defaultElements.push({
          type: 'text',
          id: uuidv4(),
          text: initialData.studentDepartment.toString(),
          position: { x: 150, y: 620 },
          fontSize: 16,
          fontWeight: 'normal',
          color: '#000000',
          align: 'center'
        });
      }
    }

    // Add submission date if available
    if (initialData.submissionDate) {
      defaultElements.push({
        type: 'text',
        id: uuidv4(),
        text: `Submission Date: ${initialData.submissionDate}`,
        position: { x: 150, y: 680 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      });
    }

    setElements(defaultElements);

    // Set background based on theme
    switch (theme) {
      case 'modern':
        setBackgroundImage('/background2.jpg');
        break;
      case 'elegant':
        setBackgroundImage('/background3.jpg');
        break;
      case 'professional':
        setBackgroundImage('/background4.jpg');
        break;
      case 'formal':
        setBackgroundImage('/background5.jpg');
        break;
      default:
        setBackgroundImage('/background1.jpg');
    }
  }, [initialData, theme]);

  // Update parent component when elements change
  useEffect(() => {
    // Debounce the updates to prevent too many state changes
    const timeoutId = setTimeout(() => {
      onDataChange({ elements, backgroundImage });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [elements, backgroundImage, onDataChange]);

  // Listen for custom events from parent
  useEffect(() => {
    if (eventTarget?.current) {
      const target = eventTarget.current;
      
      // Handle addText event
      const handleAddTextEvent = () => handleAddText();
      target.addEventListener('addText', handleAddTextEvent as EventListener);
      
      // Handle addImage event
      const handleAddImageEvent = () => handleAddImage();
      target.addEventListener('addImage', handleAddImageEvent as EventListener);
      
      // Handle changeBackground event
      const handleChangeBackgroundEvent = () => handleBackgroundChange();
      target.addEventListener('changeBackground', handleChangeBackgroundEvent as EventListener);
      
      return () => {
        target.removeEventListener('addText', handleAddTextEvent as EventListener);
        target.removeEventListener('addImage', handleAddImageEvent as EventListener);
        target.removeEventListener('changeBackground', handleChangeBackgroundEvent as EventListener);
      };
    }
  }, [eventTarget]);

  const handleElementUpdate = React.useCallback((id: string, updates: ElementUpdate) => {
    setElements(prevElements =>
      prevElements.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  }, []);

  const handleElementDelete = React.useCallback((id: string) => {
    setElements(prevElements =>
      prevElements.filter(element => element.id !== id)
    );
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const handleAddText = React.useCallback(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const centerX = containerRect.width / 2 - 100;
    const centerY = containerRect.height / 2 - 20;

    const newTextElement: TextElement = {
      type: 'text',
      id: uuidv4(),
      text: 'New Text',
      position: { x: centerX, y: centerY },
      fontSize: 16,
      fontWeight: 'normal',
      color: '#000000',
      align: 'center'
    };

    setElements(prevElements => [...prevElements, newTextElement]);
    setSelectedElement(newTextElement.id);
  }, [containerRef]);

  const handleAddImage = React.useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (!containerRect) return;

          const centerX = containerRect.width / 2 - 50;
          const centerY = containerRect.height / 2 - 50;

          const newImageElement: ImageElement = {
            type: 'image',
            id: uuidv4(),
            src: reader.result as string,
            position: { x: centerX, y: centerY },
            size: { width: 100, height: 100 }
          };

          setElements(prevElements => [...prevElements, newImageElement]);
          setSelectedElement(newImageElement.id);
        };

        reader.readAsDataURL(file);
      }
    };

    input.click();
  }, [containerRef]);

  const handleBackgroundChange = React.useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          setBackgroundImage(reader.result as string);
        };

        reader.readAsDataURL(file);
      }
    };

    input.click();
  }, []);

  // Handle element selection
  const handleSelectElement = (id: string) => {
    setSelectedElement(id);
  };

  // Handle click on background to deselect
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only deselect if the click was directly on the background, not on a child
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 bg-white rounded-full shadow-lg p-2">
        <button
          onClick={handleAddText}
          className="bg-blue-100 p-2 rounded-full shadow-md hover:bg-blue-200 transition-colors"
          title="Add text"
        >
          <FaPlus className="text-blue-600" size={16} />
        </button>

        <button
          onClick={handleAddImage}
          className="bg-green-100 p-2 rounded-full shadow-md hover:bg-green-200 transition-colors"
          title="Add image"
        >
          <FaPlus className="text-green-600" size={16} />
        </button>

        <button
          onClick={handleBackgroundChange}
          className="bg-purple-100 p-2 rounded-full shadow-md hover:bg-purple-200 transition-colors"
          title="Change background"
        >
          <FaPlus className="text-purple-600" size={16} />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 relative overflow-auto"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={handleBackgroundClick}
      >
        <div className="w-[595px] h-[842px] mx-auto relative shadow-2xl" style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {elements.map(element => {
            if (element.type === 'text') {
              return (
                <EditableText
                  key={element.id}
                  id={element.id}
                  initialText={element.text}
                  initialX={element.position.x}
                  initialY={element.position.y}
                  initialFontSize={element.fontSize}
                  initialFontWeight={element.fontWeight}
                  initialColor={element.color}
                  initialAlign={element.align}
                  onUpdate={handleElementUpdate}
                  onDelete={handleElementDelete}
                  isSelected={selectedElement === element.id}
                  onSelect={() => handleSelectElement(element.id)}
                  zIndex={selectedElement === element.id ? 10 : 1}
                />
              );
            } else if (element.type === 'image') {
              return (
                <EditableImage
                  key={element.id}
                  id={element.id}
                  src={element.src}
                  initialX={element.position.x}
                  initialY={element.position.y}
                  initialWidth={element.size.width}
                  initialHeight={element.size.height}
                  onUpdate={handleElementUpdate}
                  onDelete={handleElementDelete}
                  isSelected={selectedElement === element.id}
                  onSelect={() => handleSelectElement(element.id)}
                  zIndex={selectedElement === element.id ? 10 : 1}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default EditablePreview;
