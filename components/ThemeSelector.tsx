import React from "react";

const themes = [
  { id: "classic", name: "Classic", color: "bg-white" },
  { id: "modern", name: "Modern", color: "bg-blue-50" },
  { id: "elegant", name: "Elegant", color: "bg-gray-50" },
  { id: "professional", name: "Professional", color: "bg-indigo-50" },
  { id: "formal", name: "Formal", color: "bg-amber-50" },
];

const ThemeSelector = ({ onSelect, selectedTheme }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={`p-3 rounded-md border transition-all ${
            selectedTheme === theme.id
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className={`h-12 w-full rounded ${theme.color} border border-gray-200 mb-2`}></div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{theme.name}</p>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector; 