/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export interface TitleExperiment {
  title: string;
  experimentNo: string;
}

export interface CoverPageFormProps {
  formData: {
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
    titleExperiments: TitleExperiment[];
  };
  onChange: (updatedFormData: Record<string, any>) => void;
}

const CoverPageForm: React.FC<CoverPageFormProps> = ({ formData, onChange }) => {
  const handleChange = (e : any) => {
    const { name, value } = e.target;

    // If changing document type to Lab Report, ensure titleExperiments is initialized
    if (name === 'type' && value === 'Lab Report') {
      const currentExperiments = Array.isArray(formData.titleExperiments) && formData.titleExperiments.length > 0
        ? formData.titleExperiments
        : [{ title: "", experimentNo: "" }];

      onChange({
        ...formData,
        [name]: value,
        titleExperiments: currentExperiments
      });
    } else {
      onChange({ ...formData, [name]: value });
    }
  };

  const addTitleExperiment = () => {
    try {
      // Create a deep copy of the current experiments
      const currentExperiments = Array.isArray(formData.titleExperiments) ?
        JSON.parse(JSON.stringify(formData.titleExperiments)) : [];

      // Add a new empty experiment
      const newTitleExperiments = [...currentExperiments, { title: "", experimentNo: "" }];

      // Create a completely new form data object
      const newFormData = JSON.parse(JSON.stringify(formData));
      newFormData.titleExperiments = newTitleExperiments;

      // Update the form data with the new object
      onChange(newFormData);
    } catch (error) {
      console.error("Error adding experiment:", error);
      // Initialize with a new array if there's an error
      const newFormData = {...formData};
      newFormData.titleExperiments = [{ title: "", experimentNo: "" }];
      onChange(newFormData);
    }
  };

  const removeTitleExperiment = (index: number) => {
    try {
      // Create a deep copy of the current experiments
      const currentExperiments = Array.isArray(formData.titleExperiments) ?
        JSON.parse(JSON.stringify(formData.titleExperiments)) : [];

      // Remove the item at the specified index
      const newTitleExperiments = currentExperiments.filter((_: any, i: number) => i !== index);

      // Create a completely new form data object to avoid any reference issues
      const newFormData = JSON.parse(JSON.stringify(formData));
      newFormData.titleExperiments = newTitleExperiments;

      // Update the form data with the new object
      onChange(newFormData);
    } catch (error) {
      console.error("Error removing experiment:", error);
      // If there's an error, just set to an empty array
      const newFormData = {...formData};
      newFormData.titleExperiments = [];
      onChange(newFormData);
    }
  };

  const handleTitleExperimentChange = (index: number, field: string, value: string) => {
    try {
      // Create a deep copy of the current experiments
      const currentExperiments = Array.isArray(formData.titleExperiments) ?
        JSON.parse(JSON.stringify(formData.titleExperiments)) : [];

      // Make sure the item exists before trying to update it
      if (!currentExperiments[index]) {
        currentExperiments[index] = { title: "", experimentNo: "" };
      }

      // Update the specific field
      currentExperiments[index] = {
        ...currentExperiments[index],
        [field]: value
      };

      // Create a new form data object
      const newFormData = {...formData};
      newFormData.titleExperiments = currentExperiments;

      // Update immediately for responsive typing
      onChange(newFormData);
    } catch (error) {
      console.error("Error updating experiment:", error);
    }
  };

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document Type</label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="Assignment"
              checked={formData.type === "Assignment"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Assignment</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="Lab Report"
              checked={formData.type === "Lab Report"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Lab Report</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course Code</label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course Title</label>
          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-4 border p-4 rounded-md bg-gray-50 dark:bg-gray-800">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {formData.type === "Lab Report" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experiment No:</label>
            <input
              type="text"
              name="experimentNo"
              value={formData.experimentNo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}
      </div>

      {formData.type === "Lab Report" && (
        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Additional Experiments</h3>
            <button
              type="button"
              onClick={(e) => {
                // Prevent event propagation
                e.preventDefault();
                e.stopPropagation();
                // Call the add function
                addTitleExperiment();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm flex items-center gap-2"
              aria-label="Add new experiment"
            >
              <FaPlus /> Add Experiment
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add additional titles and experiment numbers to generate separate PDF pages with the same information but different titles.
          </p>

          {Array.isArray(formData.titleExperiments) && formData.titleExperiments.length > 0 ? formData.titleExperiments.map((item, index) => item && (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md space-y-4 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Additional Page #{index + 1}</h4>
                <button
                  type="button"
                  onClick={(e) => {
                    // Prevent event propagation
                    e.preventDefault();
                    e.stopPropagation();
                    // Call the remove function
                    removeTitleExperiment(index);
                  }}
                  className="text-red-500 hover:text-red-700 p-2"
                  aria-label={`Remove experiment ${index + 1}`}
                >
                  <FaTrash />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleTitleExperimentChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Alternative title for this page"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Experiment No:</label>
                  <input
                    type="text"
                    value={item.experimentNo}
                    onChange={(e) => handleTitleExperimentChange(index, 'experimentNo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Experiment number for this page"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">This will create an additional page with the same information but different title/experiment number.</p>
            </div>
          )) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-center text-gray-500 dark:text-gray-400">
              No additional experiments added yet. Click &quot;Add Experiment&quot; to create one.
            </div>
          )}
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Teacher Information</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teacher&apos;s Name</label>
            <input
              type="text"
              name="teacherName"
              value={formData.teacherName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <input
                type="text"
                name="teacherDepartment"
                value={formData.teacherDepartment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Student Information</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student Name</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student ID</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <input
                type="text"
                name="studentDepartment"
                value={formData.studentDepartment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Submission</label>
            <input
              type="date"
              name="submissionDate"
              value={formData.submissionDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CoverPageForm;