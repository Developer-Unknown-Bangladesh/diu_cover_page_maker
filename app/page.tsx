'use client';

import { useState } from "react";
import Image from "next/image";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import CoverPageForm from "@/components/CoverPageForm";
import CoverPagePDF from "@/components/CoverPagePDF";
import ThemeSelector from "@/components/ThemeSelector";
import Head from "next/head";

export default function Home() {
  const [formData, setFormData] = useState({
    type: "Assignment",
    courseCode: "",
    courseTitle: "",
    topic: "",
    teacherName: "",
    designation: "",
    teacherDepartment: "",
    studentName: "",
    studentId: "",
    section: "",
    studentDepartment: "",
    submissionDate: "",
  });

  const [theme, setTheme] = useState("classic");
  const [showPreview, setShowPreview] = useState(false);

  const handleFormChange = (data) => {
    setFormData(data);
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const generatePDF = () => {
    setShowPreview(true);
  };

  return (
    <>
      <Head>
        <title>DIU Cover Page Generator | Create Professional Cover Pages</title>
        <meta name="description" content="Generate professional cover pages for assignments and lab reports for Daffodil International University students." />
        <meta name="keywords" content="DIU, cover page, assignment, lab report, Daffodil International University" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/diu_logo.png"
                alt="DIU Logo"
                width={50}
                height={50}
                priority
              />
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">DIU Cover Page Generator</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create Your Cover Page</h2>
            
            <CoverPageForm 
              formData={formData} 
              onChange={handleFormChange} 
            />
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Select Theme</h3>
              <ThemeSelector onSelect={handleThemeChange} selectedTheme={theme} />
            </div>
            
            <button
              onClick={generatePDF}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Generate Cover Page
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Preview</h2>
            
            {showPreview ? (
              <div className="flex flex-col gap-4">
                <div className="h-[600px] border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                  <PDFViewer width="100%" height="100%" className="border-0">
                    <CoverPagePDF data={formData} theme={theme} />
                  </PDFViewer>
                </div>
                
                <div className="flex gap-4">
                  <PDFDownloadLink 
                    document={<CoverPagePDF data={formData} theme={theme} />} 
                    fileName={`${formData.type.toLowerCase()}_cover_page.pdf`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors text-center"
                  >
                    {({ loading }) => loading ? 'Preparing document...' : 'Download PDF'}
                  </PDFDownloadLink>
                  
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                  >
                    Print
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[600px] flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Fill out the form and click "Generate Cover Page" to see a preview here
                </p>
              </div>
            )}
          </div>
        </main>
        
        <footer className="bg-white dark:bg-gray-800 shadow-sm py-6 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} DIU Cover Page Generator. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
