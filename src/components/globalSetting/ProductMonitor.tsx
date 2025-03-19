import React, { useState, useEffect } from "react";
import {
  GeneralSettingAsync,
  getHeaderColumnAsync,
  productMonitorState,
} from "../drug-monitor/productMonitor.slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { unwrapResult } from "@reduxjs/toolkit"; // Import this to unwrap the result of the thunk
import Toast from "@/common/Toast";

interface ProductMonitorProps {
  mandatoryHeaders?: string[];
}

interface APIResponseItem {
  key: string;
  Value: string;
  is_active: boolean;
}

const ProductMonitor: React.FC<ProductMonitorProps> = ({
  mandatoryHeaders = [],
}) => {
  const [apiData, setApiData] = useState<any>(null); // Store the full API response
  const [headerNames, setHeaderNames] = useState<string[]>([]);
  const [tempHeader, setTempHeader] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(true);
  const [tableBodyKeys, setTableBodyKeys] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { TotalColumnHeaders } = useAppSelector(productMonitorState);

  // Fetch API Data on Component Load
  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const resultAction = await dispatch(getHeaderColumnAsync());
        const data = unwrapResult(resultAction);

        const headersFromAPI: string[] = data?.product_monitor.map(
          (item: APIResponseItem) => item.Value
        );
        const keysFromAPI: string[] = data?.product_monitor.map(
          (item: APIResponseItem) => item.key
        );
        const activeHeaders: string[] = data?.product_monitor
          .filter((item: APIResponseItem) => item.is_active)
          .map((item: APIResponseItem) => item.Value);

        // Save the entire data payload for later use
        setApiData(data);

        setHeaderNames(headersFromAPI);
        setTempHeader(headersFromAPI);
        setTableBodyKeys(keysFromAPI);
        setSelectedHeaders(activeHeaders);
      } catch (error) {
        console.error("Error fetching headers:", error);
      }
    };

    fetchHeaders();
  }, [dispatch]);

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
      updatedHeaders[index] = newHeaderName || prevHeaderNames[index]; // Make sure fallback is to prevHeaderNames
      return updatedHeaders;
    });

    setSelectedHeaders((prevSelectedHeaders) => {
      const oldHeaderName = headerNames[index]; // The previous header name
      const updatedSelectedHeaders = prevSelectedHeaders.map((h) =>
        h === oldHeaderName ? newHeaderName : h
      );
      return updatedSelectedHeaders;
    });
  };
  const handleSave = async () => {
    try {
      // Get the indices of the selected headers (new header names)
      const selectedIndices = selectedHeaders.map((header) =>
        headerNames.indexOf(header)
      );

      // Get the corresponding body keys (original header names) based on the selected indices
      const selectedBodyKeys = selectedIndices.map(
        (index) => tableBodyKeys[index]
      );

      // Create a mapping of existing values from apiData
      const existingValues: { [key: string]: string } = {};
      apiData.product_monitor.forEach((item: any) => {
        existingValues[item.key] = item.Value;
      });

      // Create the updated product_monitor array for the payload
      const updatedProductMonitor = tableBodyKeys.map((key, index) => {
        const updatedValue = headerNames[index] || existingValues[key]; // Use the updated header name as the value

        return {
          key: key, // Use the original body key (i.e., the old header name)
          Value: updatedValue, // Use the updated header name as the value
          is_active: selectedBodyKeys.includes(key), // Set to true if the key is in selectedBodyKeys, otherwise false
        };
      });

      // Construct the payload with only the required fields
      const updatedPayload = {
        user_page_preference: apiData.user_page_preference, // Keep this as is
        abstract_review: apiData.abstract_review, // Keep this as is
        qc_review: apiData.qc_review, // Keep this as is
        product_monitor: updatedProductMonitor, // Replace the product_monitor section with the updated one
      };
      // Dispatch the updated payload (using the appropriate async action)
      await dispatch(GeneralSettingAsync(updatedPayload));
      Toast("Product Monitor export preference set successfully.", {
        type: "success",
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
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
    <div className="modalWidth">
      <h3 className="text-lg font-bold -mt-6">Select Headers to Export</h3>
     

      <div className="grid grid-cols-4 gap-x-2 mb-4 text-xs   m-auto">
        {headerNames.map((header, index) => (
          <div key={header} className="grid grid-cols-2  text-xs ">
            <label className="flex flex-wrap items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedHeaders.includes(header)}
                onChange={() => handleCheckboxChange(header)}
                className="hidden"
              />
              <span
                className={`w-4 h-4 rounded border-1 flex items-center justify-center ${
                  selectedHeaders.includes(header)
                    ? "bg-yellow border border-black"
                    : "bg-white border border-black"
                }`}
              >
                {selectedHeaders.includes(header) && (
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
              <span className="modalText break-words max-w-24">{header}</span>
            </label>
            <input
              type="text"
              value={tempHeader[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onBlur={() => handleBlur(index)}
              className="border rounded my-1 modalText w-40 h-3 -ml-3"
              placeholder={`Rename ${header}`}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4 -mt-2">
        <button
          onClick={toggleSelectAll}
          className="rounded-md border cursor-pointer border-gray text-sm font-medium px-8 py-3 bg-yellow text-white"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>

        <button
          onClick={handleSave}
          className="rounded-md border cursor-pointer border-gray text-sm font-medium px-8 py-3 bg-yellow text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProductMonitor;
