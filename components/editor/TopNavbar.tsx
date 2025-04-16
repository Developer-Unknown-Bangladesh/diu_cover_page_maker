import React from 'react';
import Image from 'next/image';
import { FaFileDownload, FaPlus, FaImage, FaFont, FaPalette } from 'react-icons/fa';
import ThemeSelector from '../ThemeSelector';

interface TopNavbarProps {
  onGeneratePDF: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onThemeChange: (theme: string) => void;
  selectedTheme: string;
  isGeneratingPDF: boolean;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  onGeneratePDF,
  onAddText,
  onAddImage,
  onThemeChange,
  selectedTheme,
  isGeneratingPDF
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg py-3 text-white">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/diu_logo.png"
            alt="DIU Logo"
            width={40}
            height={40}
            priority
            className="bg-white p-1 rounded-md"
          />
          <h1 className="text-xl font-bold">DIU Cover Page Maker</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onAddText}
              className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded text-sm font-medium"
              title="Add text"
            >
              <FaFont size={14} />
              <span className="hidden md:inline">Add Text</span>
            </button>
            
            <button
              onClick={onAddImage}
              className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded text-sm font-medium"
              title="Add image"
            >
              <FaImage size={14} />
              <span className="hidden md:inline">Add Image</span>
            </button>
            
            <div className="relative group">
              <button
                className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded text-sm font-medium"
                title="Change theme"
              >
                <FaPalette size={14} />
                <span className="hidden md:inline">Theme</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-3 hidden group-hover:block z-50">
                <ThemeSelector onSelect={onThemeChange} selectedTheme={selectedTheme} />
              </div>
            </div>
          </div>
          
          <button
            onClick={onGeneratePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded text-sm font-medium transition-colors"
          >
            <FaFileDownload size={14} />
            {isGeneratingPDF ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
