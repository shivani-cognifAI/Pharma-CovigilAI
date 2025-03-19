import React, { useState, useEffect } from "react";

interface HeaderSelectionModalProps {
  headers: string[];
  selectedHeaders: string[];
  onClose: () => void;
  onSave: (selectedHeaders: string[]) => void;
  handleExportClickfunc: (selectedHeaders: string[], filteredTableBodyKeys: string[]) => void;
  tableBodyKeys: string[];
}

const HeaderSelectionModal: React.FC<HeaderSelectionModalProps> = ({
  headers,
  selectedHeaders,
  onClose,
  onSave,
  tableBodyKeys,
  handleExportClickfunc,
}) => {
  const [selected, setSelected] = useState<string[]>(selectedHeaders);
  const [allSelected, setAllSelected] = useState<boolean>(true);

  useEffect(() => {
    setAllSelected(selected.length === headers.length);
  }, [selected, headers.length]);

  const handleCheckboxChange = (header: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(header)
        ? prevSelected.filter((h) => h !== header)
        : [...prevSelected, header]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected([...headers]);
    }
  };

  const handleSave = () => {
    const selectedIndices = selected.map((header) => headers.indexOf(header));
    const filteredTableBodyKeys = selectedIndices.map(
      (index) => tableBodyKeys[index]
    );

    onSave(selected);
    handleExportClickfunc(selected, filteredTableBodyKeys);
    onClose();
  };

  return (
    <div className="p-11 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold  w-fit m-auto mb-4">Select Headers to Export</h2>
      <div className="w-fit m-auto">
        <p className="text-gray-600 w-fit m-auto mb-4">
          Select or deselect the checkboxes to include specific headers in your export.
        </p>
        <ol className="grid grid-cols-4 gap-x-11 w-fit m-auto mb-4 border border-gray-300 p-4">
          {headers.map((header) => (
            <li key={header} className="mb-2 min-h-[2.5rem] flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selected.includes(header)}
                  onChange={() => handleCheckboxChange(header)}
                />
                <span
                  className={`w-5 h-5 border border-gray-300 rounded flex items-center justify-center ${
                    selected.includes(header)
                      ? "bg-yellow border-black"
                      : "bg-white border-black"
                  }`}
                >
                  {selected.includes(header) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 5.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                <span className="ml-2">{header}</span>
              </label>
            </li>
          ))}
        </ol>
      </div>

      <div className="modal-actions flex justify-end space-x-4">
        <button
          onClick={toggleSelectAll}
          className="rounded-md border ml-2 cursor-pointer border-gray text-sm font-medium px-8 py-3 bg-yellow text-white"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
        <button
          onClick={onClose}
          className="rounded-md border ml-2 cursor-pointer border-gray text-sm font-medium px-8 py-3 bg-yellow text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="rounded-md border ml-2 cursor-pointer border-gray text-sm font-medium px-8 py-3 bg-yellow text-white"
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default HeaderSelectionModal;
