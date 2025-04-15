/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import CoverPageForm from "@/components/CoverPageForm";
import CoverPagePDF from "@/components/CoverPagePDF";
import ThemeSelector from "@/components/ThemeSelector";
import { FaFileDownload, FaFileAlt, FaHistory } from "react-icons/fa";
import { motion } from "framer-motion";
import Head from "next/head";

export default function Home() {
  const [formData, setFormData] = useState({
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

  const [theme, setTheme] = useState<"modern" | "elegant" | "professional" | "formal" | "classic" | undefined>("classic");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(formData);
  // No need for forceRender state anymore
  const [isLoading, setIsLoading] = useState(true);
  // Mobile detection no longer needed as we're using the same approach for all devices
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);
    const savedFormData = localStorage.getItem('coverPageFormData');
    const savedTheme = localStorage.getItem('coverPageTheme');

    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      // Ensure titleExperiments exists
      if (!parsedData.titleExperiments) {
        parsedData.titleExperiments = [];
      }
      // Ensure experimentNo exists
      if (!parsedData.experimentNo) {
        parsedData.experimentNo = "";
      }
      setFormData(parsedData);
    }

    if (savedTheme && ["modern", "elegant", "professional", "formal", "classic"].includes(savedTheme)) {
      setTheme(savedTheme as "modern" | "elegant" | "professional" | "formal" | "classic");
    }

    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('coverPageFormData', JSON.stringify(formData));
      localStorage.setItem('coverPageTheme', theme || '');
    }
  }, [formData, theme, isLoading]);

  const handleFormChange = (data : any) => {
    // Just update the form data, don't affect the preview
    setFormData(data);
  };

  const handleThemeChange = (selectedTheme : any) => {
    // Just update the theme, don't affect the preview
    setTheme(selectedTheme);
  };

  const generatePDF = async () => {
    try {
      // Show loading state
      setShowPreview(true);
      setPdfUrl(null);

      // Create a deep copy of the form data to avoid reference issues
      const formDataCopy = JSON.parse(JSON.stringify(formData));
      setPreviewData(formDataCopy);

      // Generate the PDF blob using react-pdf
      const pdfDoc = <CoverPagePDF data={formDataCopy} theme={theme} />;
      const blob = await pdf(pdfDoc).toBlob();

      // Create a URL from the blob
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      // Show an error message to the user
      alert('There was an error generating the PDF preview. Please try again.');
    }
  };

  // const clearSavedData = () => {
  //   localStorage.removeItem('coverPageFormData');
  //   localStorage.removeItem('coverPageTheme');
  //   setFormData({
  //     type: "Assignment",
  //     courseCode: "",
  //     courseTitle: "",
  //     topic: "",
  //     teacherName: "",
  //     designation: "",
  //     teacherDepartment: "",
  //     studentName: "",
  //     studentId: "",
  //     section: "",
  //     studentDepartment: "",
  //     submissionDate: "",
  //   });
  //   setTheme("classic");
  //   setShowPreview(false);
  // };

  return (
    <>
      <Head>
        <title>DIU Cover Page Generator | Create Professional Cover Pages</title>
        <meta name="description" content="Generate professional cover pages for assignments and lab reports for Daffodil International University students." />
        <meta name="keywords" content="DIU, cover page, assignment, lab report, Daffodil International University" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg py-4 text-white">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/diu_logo.png"
                alt="DIU Logo"
                width={50}
                height={50}
                priority
                className="bg-white p-1 rounded-md"
              />
              <h1 className="text-xl md:text-2xl font-bold">DIU Cover Page Generator</h1>
            </div>

            {/* {!isLoading && Object.values(formData).some(value => value !== "" && value !== "Assignment") && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={clearSavedData}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                <FaTrash /> Clear Saved Data
              </motion.button>
            )} */}
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaFileAlt className="text-blue-600 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Your Cover Page</h2>
            </div>

            {!isLoading && Object.values(formData).some(value => value !== "" && value !== "Assignment") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                  <FaHistory />
                  <p className="font-medium">Previous data loaded</p>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Your previous form data has been loaded. You can continue editing or clear it using the button above.
                </p>
              </motion.div>
            )}

            <CoverPageForm
              formData={formData}
              onChange={handleFormChange}
            />

            {/* Generate button moved to fixed position at bottom */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <FaFileAlt className="text-indigo-600" />
                Preview
              </h2>

              <div className="flex items-center gap-3 mt-4">
                {/* <FaPalette className="text-indigo-600 text-xl" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mr-2">Theme:</h3> */}
                <ThemeSelector onSelect={handleThemeChange} selectedTheme={theme || ''} />
              </div>
            </div>

            {showPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4"
              >
                <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow-md p-4 flex flex-col items-center justify-center">
                  <div className="w-full h-[600px] flex flex-col items-center">
                    {pdfUrl ? (
                      <iframe
                        src={pdfUrl}
                        className="w-full h-full border-0"
                        title="PDF Preview"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <p className="text-gray-500 text-center">Click &quot;Generate PDF&quot; to see preview</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* Only render the download link when preview is ready */}
                  {pdfUrl && (
                    <PDFDownloadLink
                      document={<CoverPagePDF data={previewData} theme={theme} />}
                      fileName={`${previewData.type.toLowerCase()}_cover_page.pdf`}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-md transition-colors text-center shadow-md flex items-center justify-center gap-2"
                    >
                      {({ loading }) => loading ? 'Preparing document...' : (
                        <>
                          <FaFileDownload />
                          Download PDF
                        </>
                      )}
                    </PDFDownloadLink>
                  )}

                  {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.print()}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-4 rounded-md transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <FaPrint />
                    Print
                  </motion.button> */}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900"
              >
                <FaFileAlt className="text-gray-400 text-5xl mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-center mb-2">
                  Fill out the form and click &quot;Generate Cover Page&quot; to see a preview here
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-md px-4">
                  Your cover page will be formatted according to DIU standards with your selected theme
                </p>
              </motion.div>
            )}
          </motion.div>
        </main>

        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-inner py-6 mt-8 text-white">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} DIU Cover Page Generator. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-2">Created for Daffodil International University students</p>
          </div>
        </footer>

        {/* Fixed Generate Button */}
        <motion.div
          className="fixed bottom-6 left-0 right-0 flex justify-center z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-full shadow-lg flex items-center justify-center gap-2 w-64"
          >
            <FaFileAlt size={20} />
            Generate PDF
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}