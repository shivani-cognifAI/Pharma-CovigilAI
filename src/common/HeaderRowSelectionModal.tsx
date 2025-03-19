import React, { useState } from "react";

interface HeaderRowSelectionComponentProps {
  headers: string[];
  tableBodyKeys: string[];
  onExport: (selectedHeaders: string[], selectedBodyKeys: string[]) => void;
  onClose: () => void;
  mandatoryHeaders?: string[];
}

const HeaderRowSelectionComponent: React.FC<HeaderRowSelectionComponentProps> = ({
  headers,
  tableBodyKeys,
  onExport,
  onClose,
  mandatoryHeaders = [],
}) => {
  const visibleHeaders = headers.filter(
    (header) => !mandatoryHeaders.includes(header)
  );
  const visibleBodyKeys = tableBodyKeys.filter(
    (_, index) => !mandatoryHeaders.includes(headers[index])
  );

  const [headerNames, setHeaderNames] = useState<string[]>([...headers]);
  const [tempHeader, setTempHeader] = useState<string[]>([...headers]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([
    ...headers,
  ]);
  const [allSelected, setAllSelected] = useState<boolean>(true);

  const handleCheckboxChange = (header: string) => {
    setSelectedHeaders((prevSelectedHeaders) =>
      prevSelectedHeaders.includes(header)
        ? prevSelectedHeaders.filter((h) => h !== header)
        : [...prevSelectedHeaders, header]
    );
  };

  const handleInputChange = (index: number, newValue: string) => {
    setTempHeader((prevTempHeaders) => {
      const updatedHeaders = [...prevTempHeaders];
      updatedHeaders[index] = newValue;
      return updatedHeaders;
    });
  };

  const handleBlur = (index: number) => {
    const newHeaderName = tempHeader[index].trim();

    setHeaderNames((prevHeaderNames) => {
      const updatedHeaders = [...prevHeaderNames];
      updatedHeaders[index] = newHeaderName || headers[index];
      return updatedHeaders;
    });

    setSelectedHeaders((prevSelectedHeaders) => {
      const oldHeaderName = headers[index];
      if (prevSelectedHeaders.includes(oldHeaderName)) {
        const updatedSelectedHeaders = prevSelectedHeaders.filter(
          (h) => h !== oldHeaderName
        );
        return [...updatedSelectedHeaders, newHeaderName];
      } else {
        return prevSelectedHeaders;
      }
    });
  };

  const handleSave = () => {
    const selectedIndices = selectedHeaders.map((header) =>
      headerNames.indexOf(header)
    );
    const selectedBodyKeys = selectedIndices.map(
      (index) => tableBodyKeys[index]
    );

    onExport(selectedHeaders, selectedBodyKeys);
    onClose();
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedHeaders(mandatoryHeaders);
    } else {
      setSelectedHeaders([...headerNames]);
    }
    setAllSelected(!allSelected);
  };

  return (
    <div className="p-4 rounded-lg shadow-lg border border-gray-200 bg-white">
      <h2 className="text-xl font-bold mb-4">Select Headers to Export</h2>
      <p className="text-gray-200 mb-4">
        Select or deselect the checkboxes to include specific headers or
        customize the headers in export.
      </p>

      <div className="grid grid-cols-3 gap-x-3 mb-4 text-xs">
        {visibleHeaders.map((header, index) => {
          const originalIndex = headers.indexOf(header);
          return (
            <div key={header} className="grid grid-cols-2 text-xs">
              <label className="flex flex-wrap items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedHeaders.includes(
                    headerNames[originalIndex]
                  )}
                  onChange={() =>
                    handleCheckboxChange(headerNames[originalIndex])
                  }
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 rounded border-1 flex items-center justify-center ${
                    selectedHeaders.includes(headerNames[originalIndex])
                      ? "bg-yellow border border-black"
                      : "bg-white border border-black"
                  }`}
                >
                  {selectedHeaders.includes(headerNames[originalIndex]) && (
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
                <span className="text-xs break-words max-w-40">
                  {headerNames[originalIndex]}
                </span>
              </label>
              <input
                type="text"
                value={tempHeader[originalIndex]}
                onChange={(e) =>
                  handleInputChange(originalIndex, e.target.value)
                }
                onBlur={() => handleBlur(originalIndex)}
                className="border rounded my-1 text-xs w-40 h-4"
                placeholder={`Rename ${headers[index]}`}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={toggleSelectAll}
          className="rounded-md border cursor-pointer border-gray text-sm font-medium px-8 py-3 bg-yellow text-white"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
        <button
          onClick={onClose}
          className="rounded-md border cursor-pointer border-gray text-sm font-medium px-8 py-3 bg-yellow text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="rounded-md border cursor-pointer border-gray text-sm font-medium px-8 py-3 bg-yellow text-white"
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default HeaderRowSelectionComponent;
