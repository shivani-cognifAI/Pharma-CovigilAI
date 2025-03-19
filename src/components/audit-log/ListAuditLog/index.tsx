"use client";
import { data } from "@/common/data";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import EmailSenderComponent from "@/common/EmailSender";
import Modal from "@/common/modal/model";
import UploadListModal from "@/common/modal/monitorListModal";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { CONSTANTS, STATUS, systemMessage } from "@/common/constants";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import CustomPagination from "@/common/Pagination/CustomPagination";
import { IItem } from "@/components/abstract-review/abstract.model";
import {
  SentMonitorEmailAsync,
  deleteProductMonitorAsync,
  getPageCountAsync,
  getProductMonitorAsync,
  getProductTotalMonitorAsync,
  productMonitorState,
} from "@/components/drug-monitor/productMonitor.slice";
import { Utils } from "../../../../utils/utils";
import { SortOption } from "../../../../utils/sortingUtils";

import ExportDropdown from "@/common/exportDropdowns/ExportDropdwon";
import {
  ArticleIdDataAsync,
  AuditLogState,
  resetSearchResultId,
} from "../auditLogDetails/auditLog.slice";

interface Item {
  ID: number;
  new: boolean;
  "Monitor Name": string;
  Description: string;
  "Due Date": string;
  "Total Records": string;
  "Pending Case": string;
  "Monitor status": string;
}

interface IUploadFile {
  index: number;
  isOpen: boolean;
  monitorData: IItem;
}

const ListAuditLog = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { productMonitor, loading, TotalMonitor, GetPageCount } =
    useAppSelector(productMonitorState);
  const { getSearchResultId } = useAppSelector(AuditLogState);
  const [fetchedProductMonitor, setProductMonitor] = useState<IItem[]>([]);
  const [createdByDropdownOpen, setCreatedByDropdownOpen] = useState(false);

  const [monitorDropdownOpen, setMonitorDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [recordsDropdownOpen, setRecordsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<boolean | string>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<IItem[]>([]);
  const [formValues, setFormValues] = useState({
    selectedFile: null as File | null,
  });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateCreatedDropdownOpen, setdateCreatedDropdownOpen] = useState(false);

  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<IUploadFile>({
    index: -1,
    isOpen: false,
    monitorData: {} as IItem,
  });

  const [searchArticleId, setSearchArticleId] = useState<any>("");
  const monitorDropdownRef = useRef<HTMLDivElement>(null);
  const createdByDropdownRef = useRef<HTMLDivElement>(null);

  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const recordsDropdownRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const dateCreatedDropdownRef = useRef<HTMLDivElement>(null);
  const [perPage, setPerPage] = useState(GetPageCount);
  const [defaultPage, setDefaultPage] = useState(GetPageCount);

  useEffect(() => {
    const fetchData = async () => {
      if (defaultPage !== 0) {
        const payload = {
          pageNumber: 1,
          perPage: perPage,
        };
        await dispatch(getProductTotalMonitorAsync());
        await dispatch(getPageCountAsync()); // Dispatch the action to trigger the API call

        await dispatch(getProductMonitorAsync(payload));
      }
    };

    fetchData();
  }, [defaultPage, dispatch]);

  useEffect(() => {
    const fetchPageCount = async () => {
      const result = await dispatch(getPageCountAsync());
      const pageCount = result?.payload || 0;

      if (pageCount !== 0) {
        setDefaultPage(pageCount);
        setPerPage(pageCount);
      } else {
        console.error("Page count is 0, re-fetching...");
      }
    };

    fetchPageCount();
  }, [dispatch]);

  useEffect(() => {
    const updateData = async () => {
      setLoader(true);
      if (loading === STATUS.fulfilled) {
        setProductMonitor(productMonitor);
        setTotalRecords(TotalMonitor);
        setLoader(false);
      }
    };
    updateData();
  }, [loading, productMonitor, TotalMonitor]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const payload = { pageNumber, perPage };
    dispatch(getProductMonitorAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = { pageNumber: 1, perPage: newPerPage };
    dispatch(getProductMonitorAsync(payload));
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      /*if (editRef.current && !editRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }*/
      if (
        monitorDropdownRef.current &&
        !monitorDropdownRef.current.contains(event.target as Node)
      ) {
        setMonitorDropdownOpen(false);
      }
      if (
        createdByDropdownRef.current &&
        !createdByDropdownRef.current.contains(event.target as Node)
      ) {
        setCreatedByDropdownOpen(false);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setDateDropdownOpen(false);
      }
      if (
        recordsDropdownRef.current &&
        !recordsDropdownRef.current.contains(event.target as Node)
      ) {
        setRecordsDropdownOpen(false);
      }
      if (
        dateCreatedDropdownRef.current &&
        !dateCreatedDropdownRef.current.contains(event.target as Node)
      ) {
        setdateCreatedDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleMonitorNameSort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "name" && sortConfig.direction === direction) {
      return;
    }

    requestSort("name", direction);
    setMonitorDropdownOpen(false);
  };

  const handleDateSort = (direction: "ascending" | "descending" | "") => {
    if (sortConfig.key === "to_date" && sortConfig.direction === direction) {
      return;
    }

    requestSort("to_date", direction);
    setDateDropdownOpen(false);
  };
  const handleDateCreatedSort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "created_on" && sortConfig.direction === direction) {
      return;
    }

    requestSort("created_on", direction);
    setdateCreatedDropdownOpen(false);
  };

  const handleRecordsSort = (direction: "ascending" | "descending" | "") => {
    if (
      sortConfig.key === "total_records" &&
      sortConfig.direction === direction
    ) {
      return;
    }

    requestSort("total_records", direction);
    setRecordsDropdownOpen(false);
  };
  const handleCreatedBySort = (direction: "ascending" | "descending" | "") => {
    if (sortConfig.key === "created_by" && sortConfig.direction === direction) {
      return;
    }

    requestSort("created_by", direction);
    setCreatedByDropdownOpen(false);
  };
  useEffect(() => {
    if (fetchedProductMonitor.length) {
      setFilterData(fetchedProductMonitor);
      setMessage(false);
    } else {
      setMessage(systemMessage.not_found);
    }
  }, [fetchedProductMonitor]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof IItem;
    direction: "ascending" | "descending" | "" | "";
  }>({
    key: "id",
    direction: "",
  });

  /**
   * Sorts the filtered data array based on the specified sorting configuration.
   * @param a The first element for comparison.
   * @param b The second element for comparison.
   * @returns A number indicating the order of elements after sorting.
   */
  const sortedData = [...filterData].sort((a, b) => {
    let valueA: number | string = "";
    let valueB: number | string = "";

    if (typeof a[sortConfig.key] === "string") {
      valueA = a[sortConfig.key] as string;
    } else if (typeof a[sortConfig.key] === "number") {
      valueA = a[sortConfig.key] as number;
    }

    if (typeof b[sortConfig.key] === "string") {
      valueB = b[sortConfig.key] as string;
    } else if (typeof b[sortConfig.key] === "number") {
      valueB = b[sortConfig.key] as number;
    }

    if (sortConfig.direction === "ascending") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const requestSort = (
    key: keyof IItem,
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.direction == "") {
      direction;
    }
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!editRef.current) return;
      if (!isModalOpen || editRef.current.contains(event.target as Node))
        return;
      setIsModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleSearchArticleId = async() => {
    const payload = {
      article_id: searchArticleId,
    };
   await dispatch(ArticleIdDataAsync(payload));

  };
useEffect(() => {
if (getSearchResultId) {
    setLoader(true);

  router.push(
    `${CONSTANTS.ROUTING_PATHS.ListAuditLog}/${searchArticleId}/${getSearchResultId}`
  );
  dispatch(resetSearchResultId()); //  Reset Redux state after navigation
}

  }, [getSearchResultId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchArticleId(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      setSearchArticleId(e.target.value);
      handleSearchArticleId();
    }
  };

  const handleClick = (item: IItem) => {
    setLoader(true);
    let name = encodeURIComponent(item?.name);
    router.push(
      `${CONSTANTS.ROUTING_PATHS.auditLog}/${item.id}/${item.status}/${name}`
    );
  };

  const headers = [
    "Description",
    "Date Created",
    "Due Date",
    "Total Records",
    "Monitor Status",
    "Created By",
  ];
  const tableBodyKeys = [
    "description",
    "created_on",
    "to_date",
    "total_records",
    "status",
    "created_by",
  ];

  const handleEmailSend = async (tags: string[]) => {
    try {
      const payload = {
        expert_review_type: "Abstract",
        page: currentPage,
        per_page: perPage,
        count: false,
        emails: tags,
      };
      const res = await dispatch(SentMonitorEmailAsync(payload));
      if (SentMonitorEmailAsync.fulfilled.match(res)) {
        if (res.payload.status === 200) {
          Toast(systemMessage.SendMailSuccess, { type: "success" });
        } else {
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      console.error("Error occurred during download:", error);
    }
  };

  return (
    <React.Fragment>
      <h3 className="absolute top-3 ml-2">Audit Log</h3>
      <section className="mt-4 bg-white custom-box-shadow">
        <div className="flex justify-between">
          <div className="flex">
            <div className="ml-2 mt-2 flex">
              <div>
                <input
                  type="text"
                  placeholder="Search by monitor name"
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
            </div>
            <div className="ml-8 mt-2 flex">
              <div>
                <input
                  type="text"
                  placeholder="Search by Artile Id"
                  value={searchArticleId}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown} // Calls search on Enter key
                  className="w-[400px] h-[22px] text-14 rounded-md border-1 border-solid border-gray text-dimgray px-4 py-2"
                />
              </div>
              <div className="ml-[-30px] mt-3" onClick={handleSearchArticleId}>
                <Image
                  src="/assets/icons/search-5-1.svg"
                  width={15}
                  height={15}
                  alt="search icon"
                  className=""
                />
              </div>
            </div>
          </div>

          <div className="ml-2 justify-end mr-3 px-2 py-4 flex cursor-pointer">
            <div className="mt-1 mr-32">
              <EmailSenderComponent
                handleSend={(tags: string[]) => {
                  handleEmailSend(tags);
                }}
                customClasses="right-8 mt-6"
              />
            </div>
            <div className="absolute">
              <ExportDropdown
                tableBodyKeys={tableBodyKeys}
                data={sortedData}
                headers={headers}
                fileNamePrefix="Audit Log"
                fileSavedName={`${
                  Utils.getUserData()?.user_name
                }_AuditLogList_${Utils.getCurrentDateAndTime()}`}
                disable={false}
                searchRow={undefined}
                startRow={undefined}
                endRow={undefined}
                mandatoryHeaders={["Id", "Name"]}
                mandatoryBodyKeys={["monitor_id", "name"]}
              />
              <>
                <div className="absolute cursor-pointer top-0 ml-2">
                  <Image
                    src="/assets/icons/download-white.svg"
                    alt="download icon"
                    width={15}
                    height={15}
                    className={`left-0 ml-2 top-0 mt-2 `}
                  />
                </div>
              </>
            </div>
            {isExportLoading && <LoadingSpinner text={"Downloading"} />}
          </div>
        </div>
        <div className="border-style"></div>
        <div className="overflow-style">
          <table className="w-[100%] border border-collapse table-auto relative">
            <thead className="border-style text-14 text-sm text-center">
              <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                <th className="px-4 py-3 w-20 hover-text-style">ID</th>
                <th className="w-32">
                  <div ref={monitorDropdownRef} className="relative">
                    <span
                      className="flex ml-4 px-4 py-4 hover-text-style items-center  cursor-pointer"
                      onClick={() =>
                        setMonitorDropdownOpen(!monitorDropdownOpen)
                      }
                    >
                      Monitor Name{" "}
                      <Image
                        src="/assets/icons/sort.svg"
                        alt="sort"
                        width={12}
                        height={12}
                        className={`ml-3 ${
                          sortConfig.direction === "ascending"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </span>
                    {monitorDropdownOpen && (
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
                <th className="px-2 py-3 w-32 hover-text-style">Description</th>
                <th className="px-2 py-3 w-32 hover-text-style date-created-width">
                  <div ref={dateCreatedDropdownRef} className="relative">
                    <span
                      className="flex w-full -ml-2 px-4 py-4 hover-text-style items-center  cursor-pointer"
                      onClick={() =>
                        setdateCreatedDropdownOpen(!dateCreatedDropdownOpen)
                      }
                    >
                      {" "}
                      Date created
                      <Image
                        src="/assets/icons/sort.svg"
                        alt="sort"
                        width={12}
                        height={12}
                        className={`ml-3 ${
                          sortConfig.direction === "ascending"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </span>

                    {dateCreatedDropdownOpen && (
                      <div className="absolute top-14 w-[190px] bg-white border rounded-lg shadow-lg">
                        <SortOption
                          label="Sort Ascending"
                          direction="ascending"
                          active={sortConfig.direction}
                          onClick={handleDateCreatedSort}
                          iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                          iconAlt="arrow"
                        />
                        <SortOption
                          label="Sort Descending"
                          direction="descending"
                          active={sortConfig.direction}
                          onClick={handleDateCreatedSort}
                          iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                          iconAlt="arrow"
                        />
                      </div>
                    )}
                  </div>
                </th>
                <th className="px-2 w-20 py-3">
                  <div ref={dateDropdownRef} className="relative">
                    <span
                      className="flex w-full -ml-2 px-4 py-4 hover-text-style items-center  cursor-pointer"
                      onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                    >
                      Due Date{" "}
                      <Image
                        src="/assets/icons/sort.svg"
                        alt="sort"
                        width={12}
                        height={12}
                        className={`ml-3 ${
                          sortConfig.direction === "ascending"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </span>
                    {dateDropdownOpen && (
                      <div className="absolute text-center top-14 w-[200px] bg-white border rounded shadow-lg">
                        <SortOption
                          label="Sort Ascending"
                          direction="ascending"
                          active={sortConfig.direction}
                          onClick={handleDateSort}
                          iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                          iconAlt="arrow"
                        />
                        <SortOption
                          label="Sort Descending"
                          direction="descending"
                          active={sortConfig.direction}
                          onClick={handleDateSort}
                          iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                          iconAlt="arrow"
                        />
                      </div>
                    )}
                  </div>
                </th>
                <th className="px-4 w-20 py-3 ml-8">
                  <div ref={recordsDropdownRef} className="relative">
                    <span
                      className="flex w-full -ml-4 px-4 py-4 hover-text-style items-center  cursor-pointer"
                      onClick={() =>
                        setRecordsDropdownOpen(!recordsDropdownOpen)
                      }
                    >
                      Total records{" "}
                      <Image
                        src="/assets/icons/sort.svg"
                        alt="sort"
                        width={12}
                        height={12}
                        className={`ml-3 ${
                          sortConfig.direction === "ascending"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </span>
                    {recordsDropdownOpen && (
                      <div className="absolute top-14 text-center w-[190px] bg-white border rounded shadow-lg">
                        <SortOption
                          label="Sort Ascending"
                          direction="ascending"
                          active={sortConfig.direction}
                          onClick={handleRecordsSort}
                          iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                          iconAlt="arrow"
                        />
                        <SortOption
                          label="Sort Descending"
                          direction="descending"
                          active={sortConfig.direction}
                          onClick={handleRecordsSort}
                          iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                          iconAlt="arrow"
                        />
                      </div>
                    )}
                  </div>
                </th>
                <th className="ml-2 py-2 w-20 text-center hover-text-style">
                  Monitor Status
                </th>
                <th className="px-3 w-24 py-3 text-center hover-text-style">
                  <div ref={createdByDropdownRef} className="relative">
                    <span
                      className="flex w-full ml-2 px-2 py-4 hover-text-style items-center  cursor-pointer"
                      onClick={() =>
                        setCreatedByDropdownOpen(!createdByDropdownOpen)
                      }
                    >
                      Created By{" "}
                      <Image
                        src="/assets/icons/sort.svg"
                        alt="sort"
                        width={12}
                        height={12}
                        className={`ml-1 ${
                          sortConfig.direction === "ascending"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </span>
                    {createdByDropdownOpen && (
                      <div className="absolute top-14 w-[190px] bg-white border rounded-lg shadow-lg">
                        <SortOption
                          label="Sort Ascending"
                          direction="ascending"
                          active={sortConfig.direction}
                          onClick={handleCreatedBySort}
                          iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                          iconAlt="arrow"
                        />
                        <SortOption
                          label="Sort Descending"
                          direction="descending"
                          active={sortConfig.direction}
                          onClick={handleCreatedBySort}
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
                  ?.filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item, index) => (
                    <tr
                      className="border-b cursor-pointer text-center text-sm border-style hover:bg-ghostwhite"
                      key={index}
                      onClick={() => handleClick(item)}
                    >
                      <td className="text-center px-4 py-6">
                        {item.monitor_id}
                      </td>
                      <td className="text-center px-6 py-6">
                        <div
                          className={`mt-1 ${
                            searchQuery ? "font-bold" : ""
                          } overflow-hidden text-ellipsis whitespace-nowrap`}
                          style={{ textAlign: "left" }}
                        >
                          {item["name"]}
                        </div>
                      </td>
                      <td className="text-center px-2 py-6 text-lightslategray">
                        {item.description}
                      </td>
                      <td className="text-center px-4 py-2 text-lightslategray date-width">
                        {item?.created_on
                          ? item?.created_on.split("T")[0]
                          : "-"}
                      </td>
                      <td className="px-4 text-center py-6 text-lightslategray date-width">
                        {item["to_date"]}
                      </td>
                      <td className="px-4 py-6 text-lightslategray text-center">
                        {item["total_records"]}
                      </td>
                      <td className="px-1 py-6 text-lightslategray text-center">
                        {item.status}
                      </td>
                      <td className="px-1 py-6 text-lightslategray text-center">
                        {item.created_by}
                      </td>
                    </tr>
                  ))}
              {message && (
                <tr className="border-b cursor-pointer text-center text-sm border-style hover:bg-ghostwhite mb-2">
                  {" "}
                  <td
                    className="px-2 py-2 capitalize col-span-9 text-center"
                    colSpan={9}
                  >
                    {message}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={uploadModalOpen.isOpen}
          childElement={
            <UploadListModal
              isOpen={uploadModalOpen.isOpen}
              onClose={() =>
                setUploadModalOpen({
                  index: -1,
                  isOpen: false,
                  monitorData: {} as IItem,
                })
              }
              monitorData={uploadModalOpen.monitorData}
              onFileUpload={(status) => setLoader(status)}
            />
          }
        />
        {loader && <LoadingSpinner />}
      </section>
      {filterData.length > 0 && (
        <CustomPagination
          currentPage={currentPage}
          perPage={perPage}
          totalRecords={Number(totalRecords)}
          handlePageChange={handlePageChange}
          handlePerPageChange={handlePerPageChange}
        />
      )}
    </React.Fragment>
  );
};

export default ListAuditLog;
