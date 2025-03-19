import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { authState } from "@/components/auth/auth.slice";

import LoadingSpinner from "@/common/LoadingSpinner";
import Toast from "@/common/Toast";
import {
  GeneralSettingAsync,
  getHeaderColumnAsync,
} from "../drug-monitor/productMonitor.slice";
import { useDispatch } from "react-redux";

interface PagePreferenceProps {}

const PagePreference: React.FC<PagePreferenceProps> = ({}) => {
  const [selectedPerPage, setSelectedPerPage] = useState<number>(10);
  const { isUserLoggedIn } = useAppSelector(authState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    const fetchPagePreference = async () => {
      try {
        setIsLoading(true);
        const resultAction = await dispatch(getHeaderColumnAsync());
        const data = resultAction.payload;
        setApiData(data);
        if (data?.user_page_preference) {
          setSelectedPerPage(data.user_page_preference);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching page preference:", error);
        setIsLoading(false);
      }
    };

    if (isUserLoggedIn) {
      fetchPagePreference();
    }
  }, [dispatch]);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const updatedPayload = {
        user_page_preference: selectedPerPage,
        product_monitor: apiData.product_monitor,
        qc_review: apiData.qc_review,
        abstract_review: apiData.abstract_review,
      };

      await dispatch(GeneralSettingAsync(updatedPayload));
      Toast("Page preference set successfully.", { type: "success" });
     
    } catch (error) {
      console.error("Error saving page preference:", error);
      Toast("Failed to save page preference.", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-transparent flex modalWidth">
      <div className="p-5">
        <h3 className="ml-3 w-fit m-auto">Set Items per page</h3>
        <div className="flex justify-between text-14 w-fit m-auto mt-3 ">
          <div className="ml-3 mt-4">
            <span className="text-violet">Page preference:</span>
            <select
              value={selectedPerPage}
              onChange={(e: any) => setSelectedPerPage(Number(e.target.value))}
              className="ml-3 cursor-pointer border text-14 px-4 py-1 border-violet rounded-md"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
<option value={500}>500</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-7">
          <button
            onClick={handleSave}
            className="bg-yellow text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default PagePreference;
