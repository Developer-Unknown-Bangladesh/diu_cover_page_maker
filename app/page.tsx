/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { FaImage, FaFont, FaPalette, FaCloudDownloadAlt } from 'react-icons/fa';
import { MdWallpaper } from 'react-icons/md';
import ThemeSelector from "@/components/ThemeSelector";

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

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [editorData, setEditorData] = useState<EditorData>({ elements: [], backgroundImage: '/background1.jpg' });
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
      localStorage.setItem('editorData', JSON.stringify(editorData));
    }
  }, [formData, theme, editorData, isLoading]);

  // Handle theme change
  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme as "modern" | "elegant" | "professional" | "formal" | "classic");
    setShowThemeSelector(false);
  };

  // Handle editor data changes
  const handleEditorDataChange = (data: EditorData) => {
    setEditorData(data);
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
      const pdfDoc = <PreviewToPDF elements={editorData.elements} backgroundImage={editorData.backgroundImage} />;
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Minimal Top Navigation Bar */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg py-2 text-white z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">DIU Cover Page Maker</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddText}
              className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded text-sm font-medium"
              title="Add text"
            >
              <FaFont size={14} />
              <span className="hidden md:inline">Add Text</span>
            </button>
            
            <button
              onClick={handleAddImage}
              className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded text-sm font-medium"
              title="Add image"
            >
              <FaImage size={14} />
              <span className="hidden md:inline">Add Image</span>
            </button>
            
            <button
              onClick={handleChangeBackground}
              className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded text-sm font-medium"
              title="Change background"
            >
              <MdWallpaper size={14} />
              <span className="hidden md:inline">Background</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded text-sm font-medium"
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
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded text-sm font-medium transition-colors"
            >
              <FaCloudDownloadAlt size={14} />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Editor Area - Full Screen */}
      <main className="flex-1 overflow-hidden relative" ref={previewRef}>
        {!isLoading && (
          <EditablePreview
            theme={theme || 'classic'}
            initialData={formData}
            onDataChange={handleEditorDataChange}
            eventTarget={previewRef}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-inner py-2 text-white text-center text-sm">
        <p>© {new Date().getFullYear()} DIU Cover Page Maker. Created for Daffodil International University students</p>
      </footer>
    </div>
  );
}