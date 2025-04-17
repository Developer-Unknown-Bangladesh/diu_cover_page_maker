/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { FaImage, FaFont, FaPalette, FaCloudDownloadAlt, FaQuestionCircle } from 'react-icons/fa';
import { MdWallpaper, MdFormatColorFill } from 'react-icons/md';
import ThemeSelector from "@/components/ThemeSelector";
import ColorPicker from "@/components/editor/ColorPicker";

// Import our components
import EditablePreview from "@/components/editor/EditablePreview";
import PreviewToPDF from "@/components/editor/PreviewToPDF";

// Define types
interface FormData {
  type: string;
  courseCode: string;
  courseTitle: string;
  topic: string;
  experimentNo: string;
  teacherName: string;
  designation: string;
  teacherDepartment: string;
  studentName: string;
  studentId: string;
  section: string;
  studentDepartment: string;
  submissionDate: string;
  titleExperiments: string[];
}

// Use any for now to avoid type conflicts with EditablePreview
interface EditorData {
  elements: any[];
  backgroundImage: string;
  backgroundOverlay?: string;
  backgroundOverlayOpacity?: number;
}

export default function Home() {
  // Basic form data for initial setup
  const [formData, setFormData] = useState<FormData>({
    type: "Assignment",
    courseCode: "",
    courseTitle: "",
    topic: "",
    experimentNo: "",
    teacherName: "",
    designation: "",
    teacherDepartment: "",
    studentName: "",
    studentId: "",
    section: "",
    studentDepartment: "",
    submissionDate: "",
    titleExperiments: [],
  });

  // Editor state
  const [theme, setTheme] = useState<"modern" | "elegant" | "professional" | "formal" | "classic" | undefined>("classic");
  const [isLoading, setIsLoading] = useState(true);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showOverlayPicker, setShowOverlayPicker] = useState(false);
  const [backgroundOverlay, setBackgroundOverlay] = useState<string>('rgba(0, 0, 0, 0)');
  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useState<number>(0);
  const [showTips, setShowTips] = useState(true);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [editorData, setEditorData] = useState<EditorData>({ 
    elements: [], 
    backgroundImage: '/background1.jpg',
    backgroundOverlay: 'rgba(0, 0, 0, 0)',
    backgroundOverlayOpacity: 0
  });
  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);
    const savedFormData = localStorage.getItem('coverPageFormData');
    const savedTheme = localStorage.getItem('coverPageTheme');
    const savedEditorData = localStorage.getItem('editorData');

    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData) as FormData;
        // Ensure titleExperiments exists
        if (!parsedData.titleExperiments) {
          parsedData.titleExperiments = [];
        }
        // Ensure experimentNo exists
        if (!parsedData.experimentNo) {
          parsedData.experimentNo = "";
        }
        setFormData(parsedData);
      } catch (e) {
        console.error('Failed to parse saved form data:', e);
      }
    }

    if (savedTheme && ["modern", "elegant", "professional", "formal", "classic"].includes(savedTheme)) {
      setTheme(savedTheme as "modern" | "elegant" | "professional" | "formal" | "classic");
    }

    if (savedEditorData) {
      try {
        const parsedData = JSON.parse(savedEditorData) as EditorData;
        if (parsedData.elements && Array.isArray(parsedData.elements)) {
          setEditorData(parsedData);
          if (parsedData.backgroundOverlay) {
            setBackgroundOverlay(parsedData.backgroundOverlay);
          }
          if (parsedData.backgroundOverlayOpacity !== undefined) {
            setBackgroundOverlayOpacity(parsedData.backgroundOverlayOpacity);
          }
        }
      } catch (e) {
        console.error('Failed to parse saved editor data:', e);
      }
    }

    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('coverPageFormData', JSON.stringify(formData));
      localStorage.setItem('coverPageTheme', theme || '');
      localStorage.setItem('editorData', JSON.stringify({
        ...editorData,
        backgroundOverlay,
        backgroundOverlayOpacity
      }));
    }
  }, [formData, theme, editorData, isLoading, backgroundOverlay, backgroundOverlayOpacity]);

  // Handle theme change
  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme as "modern" | "elegant" | "professional" | "formal" | "classic");
    setShowThemeSelector(false);
  };

  // Handle editor data changes
  const handleEditorDataChange = (data: EditorData) => {
    setEditorData({
      ...data,
      backgroundOverlay,
      backgroundOverlayOpacity
    });
  };

  // Handle overlay color change
  const handleOverlayColorChange = (color: string, opacity: number) => {
    setBackgroundOverlay(color);
    setBackgroundOverlayOpacity(opacity);
    if (previewRef.current) {
      const event = new CustomEvent('changeOverlayColor', { 
        detail: { color } 
      });
      previewRef.current.dispatchEvent(event);
      
      const opacityEvent = new CustomEvent('changeOverlayOpacity', { 
        detail: { opacity } 
      });
      previewRef.current.dispatchEvent(opacityEvent);
    }
  };

  // Add a new text element
  const handleAddText = () => {
    if (previewRef.current) {
      const event = new CustomEvent('addText');
      previewRef.current.dispatchEvent(event);
    }
  };

  // Add a new image element
  const handleAddImage = () => {
    if (previewRef.current) {
      const event = new CustomEvent('addImage');
      previewRef.current.dispatchEvent(event);
    }
  };

  // Change background
  const handleChangeBackground = () => {
    if (previewRef.current) {
      const event = new CustomEvent('changeBackground');
      previewRef.current.dispatchEvent(event);
    }
  };

  // Generate PDF from the editable preview
  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      // Generate the PDF blob using our PreviewToPDF component
      const pdfDoc = (
        <PreviewToPDF 
          elements={editorData.elements} 
          backgroundImage={editorData.backgroundImage}
          backgroundOverlay={backgroundOverlay}
          backgroundOverlayOpacity={backgroundOverlayOpacity}
        />
      );
      const blob = await pdf(pdfDoc).toBlob();

      // Create a URL from the blob
      const url = URL.createObjectURL(blob);

      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `cover_page_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGeneratingPDF(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Minimal Top Navigation Bar */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg py-3 text-white z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">DIU Cover Page Maker</h1>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={handleAddText}
              className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm"
              title="Add text"
            >
              <FaFont size={14} />
              <span className="hidden md:inline">Add Text</span>
            </button>
            
            <button
              onClick={handleAddImage}
              className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm"
              title="Add image"
            >
              <FaImage size={14} />
              <span className="hidden md:inline">Add Image</span>
            </button>
            
            <button
              onClick={handleChangeBackground}
              className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm"
              title="Change background"
            >
              <MdWallpaper size={14} />
              <span className="hidden md:inline">Background</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowOverlayPicker(!showOverlayPicker)}
                className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm"
                title="Background Overlay"
              >
                <MdFormatColorFill size={14} />
                <span className="hidden md:inline">Overlay</span>
              </button>
              
              {showOverlayPicker && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-3 z-50">
                  <ColorPicker
                    initialColor={backgroundOverlay}
                    initialOpacity={backgroundOverlayOpacity}
                    onChange={handleOverlayColorChange}
                    label="Overlay Color"
                  />
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm"
                title="Change theme"
              >
                <FaPalette size={14} />
                <span className="hidden md:inline">Theme</span>
              </button>
              
              {showThemeSelector && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-3 z-50">
                  <ThemeSelector onSelect={handleThemeChange} selectedTheme={theme || ''} />
                </div>
              )}
            </div>
            
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded text-sm font-medium transition-colors text-white shadow-sm"
            >
              <FaCloudDownloadAlt size={14} />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* Tips banner - only show on first visit */}
      {showTips && (
        <div className="bg-blue-50 border-b border-blue-100 py-2 px-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-800">
              <FaQuestionCircle size={16} />
              <p className="text-sm">
                <span className="font-medium">Tip:</span> Click elements to edit them. Drag to reposition. Use the toolbar for alignment.
              </p>
            </div>
            <button 
              onClick={() => setShowTips(false)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Editor Area - Full Screen */}
      <main className="flex-1 overflow-hidden relative bg-gray-100" ref={previewRef}>
        {!isLoading && (
          <div className="flex items-center justify-center h-full overflow-hidden">
            <EditablePreview
              theme={theme || 'classic'}
              initialData={formData}
              onDataChange={handleEditorDataChange}
              eventTarget={previewRef}
              backgroundOverlay={backgroundOverlay}
              backgroundOverlayOpacity={backgroundOverlayOpacity}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-inner py-3 text-white text-center text-sm">
        <p>© {new Date().getFullYear()} DIU Cover Page Maker. Created for Daffodil International University students</p>
      </footer>
    </div>
  );
}