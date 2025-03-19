"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import InProgress from "./QcReviewFirstPage/InProgress";
import Completed from "./QcReviewFirstPage/Completed";
import Cancelled from "./QcReviewFirstPage/Cancelled";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  AdvanceReviewDataState,
  AdvancedReviewCancelledTotalCountAsync,
  AdvancedReviewCompletedTotalCountAsync,
  AdvancedReviewInProgressTotalCountAsync,
} from "./advance-review.slice";
import { CONSTANTS, STATUS } from "@/common/constants";

const AdvancedReview = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [inProgressCount, setInProgressCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [cancelledCount, setICancelledCount] = useState<number>(0);

  const {
    status,
    TotalInProgressCount,
    TotalCancelledCount,
    TotalCompletedCount,
  } = useAppSelector(AdvanceReviewDataState);

  useEffect(() => {
    dispatch(AdvancedReviewCompletedTotalCountAsync());
    dispatch(AdvancedReviewCancelledTotalCountAsync());
  }, []);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setInProgressCount(TotalInProgressCount);
      setCompletedCount(TotalCompletedCount);
      setICancelledCount(TotalCancelledCount);
    }
  }, [status, TotalInProgressCount, TotalCompletedCount, TotalCancelledCount]);

  const handleTabChange = (tabIndex: React.SetStateAction<number>) => {
    setActiveTab(tabIndex);
  };

  const tabs = [
    {
      label: "In Progress",
      content: (
        <InProgress
          label={CONSTANTS.MONITOR_STATUS_IN_PROGRESS}
          searchQuery={searchQuery}
        />
      ),
      count: inProgressCount,
    },
    {
      label: "Completed",
      content: (
        <Completed
          label={CONSTANTS.MONITOR_STATUS_COMPLETED}
          searchQuery={searchQuery}
        />
      ),
      count: completedCount,
    },
    {
      label: "Cancelled",
      content: (
        <Cancelled
          label={CONSTANTS.MONITOR_STATUS_CANCELLED}
          searchQuery={searchQuery}
        />
      ),
      count: cancelledCount,
    },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };
  return (
    <React.Fragment>
      <h3 className="absolute top-3 ml-2">QC Review</h3>
      <div>
        <section>
          <div className="main bg-white mt-0 w-[100%] custom-box-shadow">
            <ul className="flex flex-wrap bg-tabColor cursor-pointer text-sm font-medium text-center border-b border-gray-200 ">
              {tabs.map((tab, index) => (
                <span
                  key={index}
                  className={`inline-block pl-4 pr-12 py-4 -ml-[40px] ${
                    activeTab === index ? "bg-white" : "bg-tabColor"
                  } text-violet  text-base font-medium text-14 font-archiv rounded-tl-md rounded-tr-md `}
                  onClick={() => handleTabChange(index)}
                >
                  {tab.label}
                  {tab.count !== 0 ? (
                    <span className="bg-violet text-white rounded-2xl ml-2 px-3 py-2">
                      {tab.count}
                    </span>
                  ) : (
                    <span className="bg-violet text-white rounded-2xl ml-2 px-3 py-2">
                      {"0"}
                    </span>
                  )}
                </span>
              ))}
            </ul>
            {tabs[activeTab].content}
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};

export default AdvancedReview;
