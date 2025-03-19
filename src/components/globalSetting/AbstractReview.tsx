import React, { useState, useEffect } from "react";
import {
  GeneralSettingAsync,
  getHeaderColumnAsync,
  productMonitorState,
} from "../drug-monitor/productMonitor.slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { unwrapResult } from "@reduxjs/toolkit";
import Toast from "@/common/Toast";

interface AbstractReviewProps {
  mandatoryHeaders?: string[];
}

interface APIResponseItem {
  key: string;
  Value: string;
  is_active: boolean;
}

const AbstractReview: React.FC<AbstractReviewProps> = ({
  mandatoryHeaders = [],
}) => {
  const [apiData, setApiData] = useState<any>(null);
  const [headerNames, setHeaderNames] = useState<string[]>([]);
  const [tempHeader, setTempHeader] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(true);
  const [tableBodyKeys, setTableBodyKeys] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const resultAction = await dispatch(getHeaderColumnAsync());
        const data = unwrapResult(resultAction);

        const headersFromAPI: string[] = data?.abstract_review.map(
          (item: APIResponseItem) => item.Value
        );
        const keysFromAPI: string[] = data?.abstract_review.map(
          (item: APIResponseItem) => item.key
        );
        const activeHeaders: string[] = data?.abstract_review
          .filter((item: APIResponseItem) => item.is_active)
          .map((item: APIResponseItem) => item.Value);

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
      updatedHeaders[index] = newHeaderName || headerNames[index];
      return updatedHeaders;
    });

    setSelectedHeaders((prevSelectedHeaders) => {
      const oldHeaderName = headerNames[index];
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

  const handleSave = async () => {
    try {
      const selectedIndices = selectedHeaders.map((header) =>
        headerNames.indexOf(header)
      );

      const selectedBodyKeys = selectedIndices.map(
        (index) => tableBodyKeys[index]
      );

      const existingValues: { [key: string]: string } = {};
      apiData.product_monitor.forEach((item: any) => {
        existingValues[item.key] = item.Value;
      });

      const updatedabstractReview = tableBodyKeys.map((key, index) => {
        const updatedValue = headerNames[index] || existingValues[key];

        return {
          key: key,
          Value: updatedValue,
          is_active: selectedBodyKeys.includes(key),
        };
      });

      const updatedPayload = {
        user_page_preference: apiData.user_page_preference,
        product_monitor: apiData.product_monitor,
        qc_review: apiData.qc_review,
        abstract_review: updatedabstractReview,
      };

      await dispatch(GeneralSettingAsync(updatedPayload));
      Toast("Abstract Review export preference set successfully.", {
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
      <h3 className="text-lg font-bold -mt-8">Select Headers to Export</h3>
     

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

export default AbstractReview;
