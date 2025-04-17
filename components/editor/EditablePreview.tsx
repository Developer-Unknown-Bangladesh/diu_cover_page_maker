import React, { useState, useRef, useEffect, RefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import { FaPlus, FaAlignCenter, FaAlignLeft, FaAlignRight, FaUndo, FaQuestion } from 'react-icons/fa';
import { MdVerticalAlignCenter, MdVerticalAlignTop, MdVerticalAlignBottom } from 'react-icons/md';

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
  backgroundOverlay?: string;
  backgroundOverlayOpacity?: number;
}

// Show alignment helper when element is within this threshold
const ALIGNMENT_THRESHOLD = 5; // pixels - reduced for more precise snapping

// Page dimensions (A4 size)
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

// Generic type to accept FormData or any similar object
interface EditablePreviewProps {
  theme: string;
  initialData: Record<string, unknown>;  // Better than 'any', accepts FormData
  onDataChange: (data: EditorData) => void;
  eventTarget?: RefObject<HTMLDivElement | null>;
  backgroundOverlay?: string;
  backgroundOverlayOpacity?: number;
}

const EditablePreview: React.FC<EditablePreviewProps> = ({
  theme,
  initialData,
  onDataChange,
  eventTarget,
  backgroundOverlay = 'rgba(0, 0, 0, 0)',
  backgroundOverlayOpacity = 0
}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>('/background1.jpg');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showAlignmentX, setShowAlignmentX] = useState<boolean>(false);
  const [showAlignmentY, setShowAlignmentY] = useState<boolean>(false);
  const [alignmentXPosition, setAlignmentXPosition] = useState<number>(PAGE_WIDTH / 2);
  const [alignmentYPosition, setAlignmentYPosition] = useState<number>(PAGE_HEIGHT / 2);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [previousTheme, setPreviousTheme] = useState<string>(theme);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isAnyElementDragging, setIsAnyElementDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Track theme changes to show reset confirmation
  useEffect(() => {
    if (theme !== previousTheme && elements.length > 0) {
      setShowResetConfirm(true);
    }
    setPreviousTheme(theme);
  }, [theme, elements.length]);

  // Create default elements based on theme and initialData
  const createDefaultElements = () => {
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
      },
      // Course Code placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.courseCode ? `Course Code: ${initialData.courseCode}` : 'Course Code:',
        position: { x: 150, y: 220 },
        fontSize: 18,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Course Title placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.courseTitle ? `Course Title: ${initialData.courseTitle}` : 'Course Title:',
        position: { x: 150, y: 250 },
        fontSize: 18,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Topic placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.topic ? `Topic: ${initialData.topic}` : 'Topic:',
        position: { x: 150, y: 280 },
        fontSize: 18,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Submitted To heading
      {
        type: 'text',
        id: uuidv4(),
        text: 'Submitted To:',
        position: { x: 150, y: 350 },
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        align: 'center'
      },
      // Teacher name placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.teacherName?.toString() || 'Teacher Name',
        position: { x: 150, y: 380 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Designation placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.designation?.toString() || 'Designation',
        position: { x: 150, y: 410 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Teacher department placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.teacherDepartment?.toString() || 'Department',
        position: { x: 150, y: 440 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Submitted By heading
      {
        type: 'text',
        id: uuidv4(),
        text: 'Submitted By:',
        position: { x: 150, y: 500 },
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        align: 'center'
      },
      // Student name placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.studentName?.toString() || 'Student Name',
        position: { x: 150, y: 530 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Student ID placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.studentId ? `ID: ${initialData.studentId}` : 'ID:',
        position: { x: 150, y: 560 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Section placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.section ? `Section: ${initialData.section}` : 'Section:',
        position: { x: 150, y: 590 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Student department placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.studentDepartment?.toString() || 'Department',
        position: { x: 150, y: 620 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      },
      // Submission date placeholder
      {
        type: 'text',
        id: uuidv4(),
        text: initialData.submissionDate ? `Submission Date: ${initialData.submissionDate}` : 'Submission Date:',
        position: { x: 150, y: 680 },
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        align: 'center'
      }
    ];

    return defaultElements;
  };

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
    setElements(createDefaultElements());

    // Set background based on theme
    applyThemeBackground(theme);
  }, [initialData]);

  // Function to apply theme background
  const applyThemeBackground = (themeName: string) => {
    switch (themeName) {
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
  };

  // Reset to theme defaults
  const handleResetToDefaults = () => {
    setElements(createDefaultElements());
    applyThemeBackground(theme);
    setShowResetConfirm(false);
  };

  // Cancel theme reset
  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  // Listen for drag state changes
  const handleElementDragStateChange = (isDragging: boolean) => {
    setIsAnyElementDragging(isDragging);
    
    // Hide alignment lines when not dragging
    if (!isDragging) {
      setShowAlignmentX(false);
      setShowAlignmentY(false);
    }
  };

  // Update parent component when elements change
  useEffect(() => {
    // Debounce the updates to prevent too many state changes
    const timeoutId = setTimeout(() => {
      onDataChange({ 
        elements, 
        backgroundImage,
        backgroundOverlay,
        backgroundOverlayOpacity
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [elements, backgroundImage, onDataChange, backgroundOverlay, backgroundOverlayOpacity]);

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

      // Handle overlay color change
      const handleOverlayColorEvent = (e: CustomEvent) => {
        if (e.detail?.color) {
          // No need to update state here as we're using passed props
          // This will be handled by the parent component
          const updatedOverlay = e.detail.color;
          onDataChange({
            elements,
            backgroundImage,
            backgroundOverlay: updatedOverlay,
            backgroundOverlayOpacity
          });
        }
      };
      target.addEventListener('changeOverlayColor', handleOverlayColorEvent as EventListener);

      // Handle overlay opacity change
      const handleOverlayOpacityEvent = (e: CustomEvent) => {
        if (e.detail?.opacity !== undefined) {
          // No need to update state here as we're using passed props
          // This will be handled by the parent component
          const updatedOpacity = e.detail.opacity;
          onDataChange({
            elements,
            backgroundImage,
            backgroundOverlay,
            backgroundOverlayOpacity: updatedOpacity
          });
        }
      };
      target.addEventListener('changeOverlayOpacity', handleOverlayOpacityEvent as EventListener);
      
      return () => {
        target.removeEventListener('addText', handleAddTextEvent as EventListener);
        target.removeEventListener('addImage', handleAddImageEvent as EventListener);
        target.removeEventListener('changeBackground', handleChangeBackgroundEvent as EventListener);
        target.removeEventListener('changeOverlayColor', handleOverlayColorEvent as EventListener);
        target.removeEventListener('changeOverlayOpacity', handleOverlayOpacityEvent as EventListener);
      };
    }
  }, [eventTarget, elements, backgroundImage, backgroundOverlay, backgroundOverlayOpacity, onDataChange]);

  // Improved centering algorithm for text elements
  const calculateTextCenter = (text: string, fontSize: number): number => {
    // Better estimate based on character width approximation
    const avgCharWidth = fontSize * 0.6; // More accurate approximation
    return text.length * avgCharWidth / 2;
  };
  
  // Handle element update with improved centering
  const handleElementUpdate = React.useCallback((id: string, updates: ElementUpdate) => {
    setElements(prevElements =>
      prevElements.map(element => {
        if (element.id === id) {
          // If there's a position update, check if it's within bounds
          if (updates.position) {
            // Get page dimensions
            const pageWidth = PAGE_WIDTH;
            const pageHeight = PAGE_HEIGHT;
            
            // Ensure element stays within page bounds
            let x = Math.max(0, updates.position.x);
            let y = Math.max(0, updates.position.y);
            
            // Only check alignment during active dragging
            if (isAnyElementDragging) {
              // Check if the element is near the center horizontally
              const centerX = pageWidth / 2;
              
              // Calculate element center position for alignment checks with improved precision
              let elementCenterX: number;
              if (element.type === 'image') {
                elementCenterX = x + (element as ImageElement).size.width / 2;
              } else {
                // For text, use improved text width calculation
                const textElement = element as TextElement;
                const textCenter = calculateTextCenter(textElement.text, textElement.fontSize);
                elementCenterX = x + textCenter;
              }
              
              const isNearCenterX = Math.abs(elementCenterX - centerX) < ALIGNMENT_THRESHOLD;
              
              if (isNearCenterX) {
                // Adjust position to center the element precisely
                if (element.type === 'image') {
                  x = centerX - (element as ImageElement).size.width / 2;
                } else {
                  // For text, use improved centering
                  const textElement = element as TextElement;
                  const textCenter = calculateTextCenter(textElement.text, textElement.fontSize);
                  x = centerX - textCenter;
                }
                setShowAlignmentX(true);
                setAlignmentXPosition(centerX);
              } else {
                setShowAlignmentX(false);
              }
              
              // Check if the element is near the center vertically with improved precision
              const centerY = pageHeight / 2;
              
              // Calculate element middle point for vertical alignment
              let elementMiddleY;
              if (element.type === 'image') {
                elementMiddleY = y + (element as ImageElement).size.height / 2;
              } else {
                // More precise calculation based on font size
                elementMiddleY = y + (element as TextElement).fontSize / 2;
              }
              
              const isNearCenterY = Math.abs(elementMiddleY - centerY) < ALIGNMENT_THRESHOLD;
              
              if (isNearCenterY) {
                // Adjust position to center the element vertically with precision
                if (element.type === 'image') {
                  y = centerY - (element as ImageElement).size.height / 2;
                } else {
                  y = centerY - (element as TextElement).fontSize / 2;
                }
                setShowAlignmentY(true);
                setAlignmentYPosition(centerY);
              } else {
                setShowAlignmentY(false);
              }
            }
            
            // Update position
            return { 
              ...element, 
              ...updates,
              position: { x, y }
            };
          }
          
          return { ...element, ...updates };
        }
        return element;
      })
    );
  }, [isAnyElementDragging]);

  const handleElementDelete = React.useCallback((id: string) => {
    setElements(prevElements =>
      prevElements.filter(element => element.id !== id)
    );
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const handleAddText = React.useCallback(() => {
    if (!pageRef.current) return;

    // Get page dimensions
    const centerX = PAGE_WIDTH / 2 - 150;
    const centerY = PAGE_HEIGHT / 2 - 20;

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
  }, []);

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
          if (!pageRef.current) return;

          // Get page dimensions
          const centerX = PAGE_WIDTH / 2 - 50;
          const centerY = PAGE_HEIGHT / 2 - 50;

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
  }, []);

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
      setShowAlignmentX(false);
      setShowAlignmentY(false);
    }
  };

  // Handle horizontal alignment
  const handleHorizontalAlign = (alignment: 'left' | 'center' | 'right') => {
    if (!selectedElement || !pageRef.current) return;
    
    const selectedIdx = elements.findIndex(el => el.id === selectedElement);
    if (selectedIdx === -1) return;
    
    const element = elements[selectedIdx];
    const pageWidth = PAGE_WIDTH;
    
    let newX = 0;
    if (element.type === 'text') {
      const textElement = element as TextElement;
      
      switch (alignment) {
        case 'left':
          newX = 20; // Slight padding from the left edge
          break;
        case 'center':
          // Center calculation using the text width estimation
          const textCenter = calculateTextCenter(textElement.text, textElement.fontSize);
          newX = (pageWidth / 2) - textCenter;
          break;
        case 'right':
          // Right alignment with padding and text width consideration
          const textWidth = calculateTextCenter(textElement.text, textElement.fontSize) * 2;
          newX = pageWidth - textWidth - 20;
          break;
      }
      
      // Also update the text's internal alignment property
      setElements(prevElements =>
        prevElements.map(el =>
          el.id === selectedElement
            ? { ...el, position: { ...el.position, x: newX }, align: alignment }
            : el
        )
      );
    } else if (element.type === 'image') {
      const imgElement = element as ImageElement;
      switch (alignment) {
        case 'left':
          newX = 20;
          break;
        case 'center':
          newX = (pageWidth / 2) - (imgElement.size.width / 2);
          break;
        case 'right':
          newX = pageWidth - imgElement.size.width - 20;
          break;
      }
      
      setElements(prevElements =>
        prevElements.map(el =>
          el.id === selectedElement
            ? { ...el, position: { ...el.position, x: newX } }
            : el
        )
      );
    }
  };
  
  // Handle vertical alignment
  const handleVerticalAlign = (alignment: 'top' | 'center' | 'bottom') => {
    if (!selectedElement || !pageRef.current) return;
    
    const selectedIdx = elements.findIndex(el => el.id === selectedElement);
    if (selectedIdx === -1) return;
    
    const element = elements[selectedIdx];
    const pageHeight = PAGE_HEIGHT;
    
    let newY = 0;
    if (element.type === 'text') {
      const textElement = element as TextElement;
      
      switch (alignment) {
        case 'top':
          newY = 20; // Slight padding from the top
          break;
        case 'center':
          // Better center calculation accounting for font size
          newY = (pageHeight / 2) - (textElement.fontSize / 2);
          break;
        case 'bottom':
          newY = pageHeight - textElement.fontSize - 40; // Padding from bottom
          break;
      }
    } else if (element.type === 'image') {
      const imgElement = element as ImageElement;
      switch (alignment) {
        case 'top':
          newY = 20;
          break;
        case 'center':
          newY = (pageHeight / 2) - (imgElement.size.height / 2);
          break;
        case 'bottom':
          newY = pageHeight - imgElement.size.height - 20;
          break;
      }
    }
    
    setElements(prevElements =>
      prevElements.map(el =>
        el.id === selectedElement
          ? { ...el, position: { ...el.position, y: newY } }
          : el
      )
    );
  };

  // Disable text selection during drag
  useEffect(() => {
    const handleSelectStart = (e: Event) => {
      if (selectedElement) {
        e.preventDefault();
      }
    };

    document.addEventListener('selectstart', handleSelectStart);
    
    return () => {
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [selectedElement]);

  return (
    <div className="relative flex flex-col h-full">
      {/* Help modal - fixed background opacity */}
      {showHelpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cover Page Editor Help</h3>
            <div className="mb-4 text-gray-600">
              <p className="mb-2">Welcome to the DIU Cover Page Editor!</p>
              <p className="mb-2">Here&apos;s how to use this tool:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click &quot;Add Text&quot; to add new text elements</li>
                <li>Click &quot;Add Image&quot; to upload and add images</li>
                <li>Click and drag elements to position them</li>
                <li>Click on elements to edit their properties</li>
                <li>Change the background image and overlay color as needed</li>
              </ul>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme reset confirmation modal - fixed background opacity */}
      {showResetConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Theme Changed</h3>
            <p className="mb-4 text-gray-600">
              Would you like to reset the page to the default layout for the new theme?
              This will discard your current layout.
            </p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelReset}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded font-medium text-gray-700"
              >
                Keep Current Layout
              </button>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-medium text-white"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control panel */}
      <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-lg p-2">
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
            title="Help"
          >
            <FaQuestion size={16} />
          </button>
        </div>
      </div>

      {/* Floating action buttons */}
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

        <button
          onClick={() => setShowResetConfirm(true)}
          className="bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200 transition-colors"
          title="Reset to theme defaults"
        >
          <FaUndo className="text-gray-600" size={16} />
        </button>
      </div>

      {/* Alignment toolbar - only shows when element is selected */}
      {selectedElement && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 bg-white rounded-lg shadow-lg p-2">
          <div className="border-r pr-2 flex gap-1">
            <button
              onClick={() => handleHorizontalAlign('left')}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Align left"
            >
              <FaAlignLeft className="text-gray-700" size={16} />
            </button>
            <button
              onClick={() => handleHorizontalAlign('center')}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Align center horizontally"
            >
              <FaAlignCenter className="text-gray-700" size={16} />
            </button>
            <button
              onClick={() => handleHorizontalAlign('right')}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Align right"
            >
              <FaAlignRight className="text-gray-700" size={16} />
            </button>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => handleVerticalAlign('top')}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Align top"
            >
              <MdVerticalAlignTop className="text-gray-700" size={16} />
            </button>
            <button
              onClick={() => handleVerticalAlign('center')}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Align center vertically"
            >
              <MdVerticalAlignCenter className="text-gray-700" size={16} />
            </button>
            <button
              onClick={() => handleVerticalAlign('bottom')}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Align bottom"
            >
              <MdVerticalAlignBottom className="text-gray-700" size={16} />
            </button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8"
        style={{
          backgroundColor: '#f5f5f5',
          userSelect: 'none', // Prevent text selection
        }}
      >
        <div 
          ref={pageRef}
          className="relative shadow-2xl bg-white max-w-full max-h-full" 
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '595px',
            height: '842px',
            aspectRatio: '595/842', // Maintain aspect ratio
            transform: 'scale(0.85)', // Scale down slightly to ensure it fits in viewport
            transformOrigin: 'center',
          }}
          onClick={handleBackgroundClick}
        >
          {/* Background overlay */}
          {backgroundOverlayOpacity > 0 && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: backgroundOverlay,
                opacity: backgroundOverlayOpacity / 100,
                zIndex: 1
              }}
            />
          )}

          {/* Center alignment guides - only show during active dragging with improved visibility */}
          {isAnyElementDragging && showAlignmentX && (
            <div 
              className="absolute top-0 bottom-0 pointer-events-none z-10"
              style={{ 
                left: `${alignmentXPosition}px`,
                width: '1px',
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // More visible blue
                boxShadow: '0 0 3px rgba(59, 130, 246, 0.5)' // Glow effect
              }}
            />
          )}
          
          {isAnyElementDragging && showAlignmentY && (
            <div 
              className="absolute left-0 right-0 pointer-events-none z-10"
              style={{ 
                top: `${alignmentYPosition}px`,
                height: '1px',
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // More visible blue
                boxShadow: '0 0 3px rgba(59, 130, 246, 0.5)' // Glow effect
              }}
            />
          )}
          
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
                  zIndex={selectedElement === element.id ? 10 : 2}
                  onDragStateChange={handleElementDragStateChange}
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
                  zIndex={selectedElement === element.id ? 10 : 2}
                  onDragStateChange={handleElementDragStateChange}
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
