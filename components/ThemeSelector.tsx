import React from "react";
import { FaLeaf, FaRegBuilding, FaFeatherAlt, FaBriefcase, FaGraduationCap } from "react-icons/fa";

const themes = [
  { 
    id: "classic", 
    name: "Classic", 
    color: "bg-white", 
    icon: <FaRegBuilding className="text-gray-700" />,
    border: "border-gray-300",
    description: "Clean and traditional"
  },
  { 
    id: "modern", 
    name: "Modern", 
    color: "bg-gradient-to-br from-blue-50 to-indigo-100", 
    icon: <FaBriefcase className="text-blue-600" />,
    border: "border-blue-300",
    description: "Contemporary and sleek"
  },
  { 
    id: "elegant", 
    name: "Elegant", 
    color: "bg-gradient-to-br from-gray-50 to-gray-200", 
    icon: <FaFeatherAlt className="text-gray-600" />,
    border: "border-gray-300",
    description: "Refined and sophisticated"
  },
  { 
    id: "professional", 
    name: "Professional", 
    color: "bg-gradient-to-br from-indigo-50 to-purple-100", 
    icon: <FaGraduationCap className="text-indigo-600" />,
    border: "border-indigo-300",
    description: "Polished and authoritative"
  },
  { 
    id: "formal", 
    name: "Formal", 
    color: "bg-gradient-to-br from-amber-50 to-yellow-100", 
    icon: <FaLeaf className="text-amber-600" />,
    border: "border-amber-300",
    description: "Traditional and dignified"
  },
];

const ThemeSelector = ({ onSelect, selectedTheme }) => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`p-2 rounded-lg border transition-all transform hover:scale-105 hover:shadow-md ${
            selectedTheme === theme.id
              ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
              : `${theme.border} dark:border-gray-700`
          }`}
        >
          <div className={`h-8 w-full rounded-md ${theme.color} ${theme.border} mb-3 flex items-center justify-center`}>
            <div className="text-xl">{theme.icon}</div>
          </div>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{theme.name}</p>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector; 