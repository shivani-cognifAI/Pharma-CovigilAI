import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/common/LoadingSpinner";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { SortOption } from "../../../../utils/sortingUtils";

import {
  GetDeduplicateAsync,
  GetDrugOfChoiceAsync,
  generalState,
} from "../general.slice";

import { IGetDeduplicate, IGetDrugOfChoice } from "../general.model";
import AddDuplicates from "./AddDuplicates";
// @ts-ignore
import { exportToExcel } from "react-easy-export";

const Deduplicates = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [openAdd, setOPenAdd] = useState<boolean>(false);
  const [nameDropdownOpen, setNameDropdownOpen] = useState(false);
  const nameDropdownRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  // IGetDrugOfChoice
  const [sortConfig, setSortConfig] = useState<{
    key: keyof any;
    direction: "ascending" | "descending" | "";
  }>({
    key: "deduplicates",
    direction: "",
  });
  const { deduplicates } = useAppSelector(generalState);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      dispatch(GetDeduplicateAsync());

      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        nameDropdownRef.current &&
        !nameDropdownRef.current.contains(event.target as Node)
      ) {
        setNameDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handelOpen = () => {
    setOPenAdd(true);
  };

  const handleClose = () => {
    setOPenAdd(false);
  };

  const sortedData =
    deduplicates && Array.isArray(deduplicates)
      ? [...deduplicates].sort((a, b) => {
          const nameA = a?.duplicate_id || ""; // Access the first choice for sorting
          const nameB = b?.duplicate_id || ""; // Access the first choice for sorting

          if (sortConfig.direction === "ascending") {
            return nameA > nameB ? 1 : -1;
          } else if (sortConfig.direction === "descending") {
            return nameA > nameB ? -1 : 1;
          } else {
            return 0;
          }
        })
      : []; // Return an empty array if deduplicates is not valid

  const requestSort = (key: keyof IGetDeduplicate) => {
    let direction: "ascending" | "descending" = "ascending"; // Default is ascending

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"; // Toggle to descending if already ascending
    }

    setSortConfig({ key, direction });
  };

  const handleMonitorNameSort = () => {
    requestSort("duplicate_id");
    setNameDropdownOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

const handleDownload = () => {
setIsLoading(true)
  const header = ["Duplicate Id"];

  const excelData = sortedData.map((item: any) => [
    item?.duplicate_id  
  ]);

  const finalData = [header, ...excelData];


  exportToExcel(finalData,'duplicate.xls');
setIsLoading(false)
};



  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container h-auto bg-white custom-box-shadow rounded-xl border border-gray-300">
          <div className="add mt-4">
            {!openAdd ? (
              <>
                <div className="ml-2 mt-2 flex">
                  <div>
                    <input
                      type="text"
                      placeholder="Search by Duplicates Id"
                      onChange={handleSearch}
                      className="w-[400px] h-[22px] text-14 rounded-md border-1 border-solid border-gray text-dimgray px-4 py-2"
                    />
                  </div>
                  <div className="ml-[-30px] mt-3">
                    <Image
                      src="/assets/icons/search-5-1.svg"
                      width={15}
                      height={15}
                      alt="search icon"
                      className=""
                    />
                  </div>
                  <div className="action-button-right  flex flex-col items-end justify-end mr-4">
<div><button
                      className="bg-yellow cursor-pointer px-4 py-3 w-40 text-white text-14 text-base font-archivo font-medium capitalize rounded"
                      onClick={handelOpen}
                    >
                      + add Duplicates
                    </button></div>
                    
                  </div>
 <div  className="mr-2">
                    <button
                      className="bg-yellow cursor-pointer px-2 py-3 w-30 text-white text-14 text-base font-archivo font-medium capitalize rounded"
                      onClick={handleDownload}
                    >
                      Export
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <AddDuplicates
                handelClose={() => {
                  handleClose();
                }}
              />
            )}
          </div>
          <section className="mt-4 bg-white custom-box-shadow">
            <div className="overflow-style">
              <table className="w-[100%] border border-collapse table-auto relative">
                <thead className="border-style text-14 text-sm text-left">
                  <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                    <th className="py-6 hover-text-style">
                      <div ref={nameDropdownRef} className="relative">
                        <span
                          className="flex px-4 py-4 hover-text-style items-center  cursor-pointer"
                          onClick={() => setNameDropdownOpen(!nameDropdownOpen)}
                        >
                          Duplicate{" "}
                          <Image
                            src="/assets/icons/sort.svg"
                            alt="sort"
                            width={15}
                            height={15}
                            className={`ml-3 ${
                              sortConfig.direction === "ascending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </span>
                        {nameDropdownOpen && (
                          <div className="absolute top-14 w-[190px] bg-white border rounded shadow-lg">
                            <SortOption
                              label="Sort Ascending"
                              direction="ascending"
                              active={sortConfig.direction}
                              onClick={handleMonitorNameSort}
                              iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                              iconAlt="arrow"
                            />
                            <SortOption
                              label="Sort Descending"
                              direction="descending"
                              active={sortConfig.direction}
                              onClick={handleMonitorNameSort}
                              iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                              iconAlt="arrow"
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-14">
                  {sortedData &&
                    sortedData
                      ?.filter((item: any) =>
                        item?.duplicate_id
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((item: any, index) => (
                        <tr
                          key={index}
                          className="border-b text-left text-sm border-style"
                        >
                          <td
                            className={`px-4 text-left py-6 ${
                              searchQuery ? "font-bold" : ""
                            }`}
                          >
                            {item?.duplicate_id}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </section>
          {isLoading && <LoadingSpinner />}
        </div>
      </section>
    </div>
  );
};

export default Deduplicates;
