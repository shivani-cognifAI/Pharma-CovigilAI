import { data } from "@/common/data";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SortOption } from "../../../utils/sortingUtils";
import EmailSenderComponent from "@/common/EmailSender";
import Modal from "@/common/modal/model";
import UploadListModal from "@/common/modal/monitorListModal";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  GetItemDownloadDataAsync,
  SentMonitorEmailAsync,
  deleteProductMonitorAsync,
  getHeaderColumnAsync,
  getProductMonitorAsync,
  getProductTotalMonitorAsync,
  productMonitorState,
  getPageCountAsync,
} from "./productMonitor.slice";
import {
  CONSTANTS,
  ProductMonitorStatusData,
  STATUS,
  StatusData,
  systemMessage,
} from "@/common/constants";
import Toast from "@/common/Toast";
import { Utils } from "../../../utils/utils";
import LoadingSpinner from "@/common/LoadingSpinner";
import { IItem } from "../abstract-review/abstract.model";
import CustomPagination from "@/common/Pagination/CustomPagination";
import ExportDropdown from "@/common/exportDropdowns/ExportDropdwon";

import { unwrapResult } from "@reduxjs/toolkit";
import CreatableSelect from "react-select/creatable";
import * as XLSX from 'xlsx';


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

interface IProps {
  setOPenEdit: any;
}

interface IUploadFile {
  index: number;
  isOpen: boolean;
  monitorData: IItem;
}
interface Option {
  readonly label: string;
  readonly value: string;
}

const ListDrugMonitor: React.FC<IProps> = ({ setOPenEdit }) => {
  const [openModals, setOpenModals] = useState(
    new Array(data.length).fill(false)
  );
  const dispatch = useAppDispatch();
  const { productMonitor, loading, TotalMonitor } =
    useAppSelector(productMonitorState);
  const [fetchedProductMonitor, setProductMonitor] = useState<IItem[]>([]);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
 const [createdByDropdownOpen, setCreatedByDropdownOpen] = useState(false);
  const [selectedStatusValue, setSelectedStatusValue] = useState<string>("");

  const [monitorDropdownOpen, setMonitorDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [dateCreatedDropdownOpen, setDateCreatedDropdownOpen] = useState(false);
  const [recordsDropdownOpen, setRecordsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<boolean | string>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<IItem[]>([]);
  const [monitorId, setMonitorId] = useState("string");
  const [formValues, setFormValues] = useState({
    selectedFile: null as File | null,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<IUploadFile>({
    index: -1,
    isOpen: false,
    monitorData: {} as IItem,
  });
const [updateByOptions, setUpdateByOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedUpdatedBy, setSelectedUpdatedBy] = useState<Option[]>([]);


  const handleFileDelete = () => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      selectedFile: null,
    }));
    //setUploadModalOpen({ index: -1, isOpen: false });
  };
  const monitorDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const dateCreatedDropdownRef = useRef<HTMLDivElement>(null);
  const recordsDropdownRef = useRef<HTMLDivElement>(null);
 const createdByDropdownRef = useRef<HTMLDivElement>(null);

  const editRef = useRef<HTMLDivElement>(null);

 

const { GetPageCount } =useAppSelector(productMonitorState);
  const [perPage, setPerPage] = useState(GetPageCount);
const[defaultPage,setDefaultPage] = useState(GetPageCount)
const refreshPage = async () => {
  setLoader(true)
const payload = {
        pageNumber: 1,
        perPage: defaultPage,
      };
     await dispatch(getProductTotalMonitorAsync());
      await dispatch(getProductMonitorAsync(payload));
 setLoader(false); 
}

  useEffect(() => {
    const processLoading = async () => {
      if (loading === STATUS.fulfilled) {
        setProductMonitor(productMonitor);
        setTotalRecords(TotalMonitor);
        setLoader(false);
      }
    };

    processLoading();

  }, [loading, productMonitor, TotalMonitor,refreshPage]);



useEffect(() => {
    const mappedUpdatedByOptions = ProductMonitorStatusData?.map((item: any) => ({
        label: item.name,
        value: item.value,
    }));
    setUpdateByOptions(mappedUpdatedByOptions);
}, [ProductMonitorStatusData]);
 useEffect(() => {
  const fetchPageCount = async () => {
    const result = await dispatch(getPageCountAsync()); // Fetch page count
    const pageCount = result?.payload || 0; // Extract the page count from the result

    if (pageCount !== 0) {
      setDefaultPage(pageCount); // Update the state if pageCount is not 0
setPerPage(pageCount)
    } else {
      // If pageCount is 0, try again or handle it as needed
      console.error("Page count is 0, re-fetching...");
    }
  };

  fetchPageCount();
}, [dispatch]);

useEffect(() => {
  const fetchData = async () => {
    if (defaultPage !== 0) {
      const payload = {
        pageNumber: 1,
        perPage: defaultPage,
      };
     await dispatch(getProductTotalMonitorAsync());
      await dispatch(getProductMonitorAsync(payload));
    }
  };

  fetchData();
}, [defaultPage, dispatch]);

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
        dateCreatedDropdownRef.current &&
        !dateCreatedDropdownRef.current.contains(event.target as Node)
      ) {
        setDateCreatedDropdownOpen(false);
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
    setDateCreatedDropdownOpen(false);
  };
 const handleCreatedBySort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "created_by" && sortConfig.direction === direction) {
      return;
    }

    requestSort("created_by", direction);
    setCreatedByDropdownOpen(false);
  }

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
    key: "created_on",
    direction: "descending",
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
      direction = direction;
    }
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const deleteItem = async (id: number, index: number) => {
    await dispatch(deleteProductMonitorAsync(id));
    const payload = {
      pageNumber: 1,
      perPage: perPage,
    };
    await dispatch(getProductMonitorAsync(payload));
    Toast(message, { type: "success" });
    const newOpenModals = [...openModals];
    newOpenModals[index] = false;
    setOpenModals(newOpenModals);
  };

  const handleEdit = (index: number, id: number) => {
    setOPenEdit(id);
    const newOpenModals = [...openModals];
    newOpenModals[index] = false;
    setOpenModals(newOpenModals);
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

  
  /**
   * Downloads abstract review records as an Excel file.
   * @param id The ID of the record to download
   * @param status The status of the record
   * @param name Optional name parameter
   */
  


const recordsDownload = async (id: string, status: string, name: string) => {
  try {
    setLoader(true);

    // Step 1: Fetch header names from the API
    const resultAction = await dispatch(getHeaderColumnAsync());
    const headersResponse = unwrapResult(resultAction);

    if (!Array.isArray(headersResponse?.product_monitor)) {
      console.error("product_monitor is not an array");
      setLoader(false);
      return;
    }

    // Headers from API response
    let csvHeaders = headersResponse.product_monitor
      .filter((item: any) => item.is_active === true) // Filter active headers
      .map((item: any) => item.Value);
 // Headers from API response
     let  csvtableBodyKeys = headersResponse.product_monitor
      .filter((item: any) => item.is_active === true) // Filter active headers
      .map((item: any) => item.key);

    // Step 2: Add MANDATORY_HEADERS to the csvHeaders if they are not already present
    const MANDATORY_HEADERS = ["Article Id", "Title"];
    MANDATORY_HEADERS.forEach((mandatoryHeader) => {
      if (!csvHeaders.includes(mandatoryHeader)) {
        csvHeaders.unshift(mandatoryHeader); // Add to the beginning of headers array
csvtableBodyKeys.unshift(mandatoryHeader)
      }
    });

    // Step 3: Fetch the data to be downloaded from the second API
    const response = await dispatch(GetItemDownloadDataAsync({ id, status }));

    if (GetItemDownloadDataAsync.fulfilled.match(response)) {
      const data = response.payload;

      if (!data || data.length === 0) {
        setIsExportLoading(false);
        setLoader(false);
        return;
      }

      // Example: Create a mapping of headers to body keys manually, including mandatory fields
      const headerKeyMap: { [key: string]: string } = {
        "Title": "title",
        "Citation": "filter_type",
        "Assignee": "assignee",
        "Review Type": "review_type",
        "Status": "status",
        "Expert Decision": "expert_decision",
        "Aggregate Reporting": "is_aggregate_reporting",
        "Safety Signal": "is_safety_signal",
        "Article of interest": "is_serious_event",
        "Categories": "categories",
        "Classifications": "classifications",
        "Comments": "comments",
        "Search Result Status": "search_result_status",
        "Monitor Status": "monitor_status",
        "Active": "is_active",
        "Country": "country",
        "Article Id": "article_id",
        "Ai decision": "ai_decision",
        "Reason": "reason",
        "Causality Decision": "causality_decision",
        "Causality Reason": "causality_reason",
        "Designated Medical Events": "designated_medical_events",
        "Created By": "created_by",
        "Date Created": "created_on",
        "Modified By": "modified_by",
        "Modified On": "modified_on",
        "Filter Type": "filter_type",
        "Published On": "updated_on",
       "Pubmed Link": "pubmed_link",
         "Affiliation": "affiliation",
        "drug": "drug",
        "Drug Of Choice": "drug_of_choice",
        "adverse_reaction": "adverse_reaction"
      };

      const isPublishedOnSelected = csvHeaders.includes('Published On');

      // Step 4: Check if all article_ids are numeric
      const allArticleIdsAreNumeric = data.every((item: any) => /^\d+$/.test(item.article_id));

    const modifiedData = data.map((item: any) => {
        const { article_id, updated_on, drug_of_choice,...rest } = item;
        const formattedPublishedOn = isPublishedOnSelected && updated_on
          ? updated_on.split('T')[0] 
          : undefined; 
        return {
          ...rest,
          article_id: article_id, 
drug_of_choice: Array.isArray(drug_of_choice) ? drug_of_choice.join(", ") : drug_of_choice,

          ...(allArticleIdsAreNumeric ? { pubmed_link: `https://pubmed.ncbi.nlm.nih.gov/${article_id}` } : {}),
          ...(isPublishedOnSelected ? { updated_on: formattedPublishedOn } : {}),

        };
      });


      // Step 5: Conditionally add "Pubmed Link" header if all article_id values are numeric
      if (allArticleIdsAreNumeric) {
        if (!csvHeaders.includes("Pubmed Link")) {
          csvHeaders.push("Pubmed Link");
          csvtableBodyKeys.push("Pubmed Link");
          // headerKeyMap["Pubmed Link"] = "pubmed_link";
  headerKeyMap["Pubmed Link"] = "pubmed_link";
        }
      } else {
        // Remove "Pubmed Link" if any article_id contains non-numeric characters
        csvHeaders = csvHeaders.filter((header:any) => header !== "Pubmed Link");
        csvtableBodyKeys = csvtableBodyKeys.filter((key:any) => key !== "pubmed_link");
      }

      // Step 6: Prepare data for export by mapping headers to table body keys

 const renderData = [
        csvHeaders, // Add headers as the first row
        ...modifiedData.map((item: any) =>csvtableBodyKeys.map((key: string) =>item[headerKeyMap[key]] || "-" )

          
        ),
      ];


       const worksheet = XLSX.utils.aoa_to_sheet(renderData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Save the Excel file as .xlsx
      XLSX.writeFile(workbook, `${name}__ArticleList__${Utils.getCurrentDateAndTime()}.xlsx`);

      setIsExportLoading(false);
      setLoader(false);
    } else {
      setLoader(false);
      console.error(CONSTANTS.errorMessage.searchFailed, response.error);
    }
  } catch (error) {
    setLoader(false);
    console.error(CONSTANTS.errorMessage.unexpectedError, error);
  }
};





// Define headers
 const headers = [
    
    "Description",
    "Date Created",
    "Due Date",
    "Total Records",
    "Monitor Status",
    "Created By",
  ];
  // Define keys
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


const handleUpdatedByTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );

    const filteredData =
      selectedTagValues.length === 0
        ? fetchedProductMonitor
        : fetchedProductMonitor?.filter((item) => {
            return selectedTagValues.some(
              (selectedTag) => item.status?.toLowerCase() === selectedTag
            );
          });

    setFilterData(filteredData);
};

  return (
    <React.Fragment>
      <section className="mt-32 bg-white custom-box-shadow">
        <div className="flex justify-between">
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
<div className=" relative">
  <div className="relative text-14 mt-2 ml-10">
    <CreatableSelect
      placeholder="Filter by Monitor Status"
      isClearable
      onChange={(newValue) => {
        setSelectedUpdatedBy(newValue as Option[]);
        handleUpdatedByTagSelect(newValue as Option[]);
      }}
      options={updateByOptions}
      isMulti
      value={selectedUpdatedBy}
      styles={{
        control: (base) => ({
          ...base,
          width: '100%',
          minHeight: '22px', 
        }),
        multiValue: (base) => ({
          ...base,
          display: 'inline-flex', 
          marginRight: '8px',
          flexWrap: 'wrap',
          maxWidth: '100%',
        }),
        multiValueLabel: (base) => ({
          ...base,
          padding: '2px 6px',
        }),
        multiValueRemove: (base) => ({
          ...base,
          padding: '2px',
        }),
        menu: (base) => ({
          ...base,
          width: '100%',
        }),
      }}
    />
  </div>
</div>

          <div className="ml-2 justify-end mr-3 px-2 py-4 flex cursor-pointer">
<div onClick={refreshPage} className=" mr-4 mt-1">
<Image src="/assets/icons/refresh.svg"
                width={17}
                height={17}
                alt="refresh icon"
               title="Refresh"
                      />
                   </div>
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
  mandatoryHeaders = {["Id","Name"]}
   mandatoryBodyKeys = {["monitor_id","name"]}
                tableBodyKeys={tableBodyKeys}
                data={fetchedProductMonitor}
                headers={headers}
                fileNamePrefix="Drug Monitor List"
                fileSavedName={`${
                  Utils.getUserData()?.user_name
                }_DrugMonitorList_${Utils.getCurrentDateAndTime()}`}
                disable={false}
                searchRow={undefined}
                startRow={undefined}
                endRow={undefined}
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
          <table className="w-full border border-collapse table-auto relative">
            <thead className="border-style text-14 text-sm text-center">
              <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                <th className="px-4 w-20 py-3 text-center hover-text-style">
                  ID
                </th>
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
                <th className="px-2 w-20 py-3 hover-text-style text-center">Description</th>
                <th className="px-2 w-20 py-3 hover-text-style text-center">
                  <div ref={dateCreatedDropdownRef} className="relative">
                    <span
                      className="flex w-full -ml-2 px-4 py-4 hover-text-style items-center text-center  cursor-pointer"
                      onClick={() =>
                        setDateCreatedDropdownOpen(!dateCreatedDropdownOpen)
                      }
                    >
                      Date created{""}
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
                      <div className="absolute text-center top-14 w-[200px] bg-white border rounded shadow-lg">
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
                <th className="px-2 w-20 py-3 text-center">
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
                <th className="px-2 w-32 py-3">
                  <div ref={recordsDropdownRef} className="relative">
                    <span
                      className="flex w-full -ml-4 px-4 text-center py-4 hover-text-style items-center  cursor-pointer"
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
                <th className="py-2 w-32 text-center hover-text-style">
                  Monitor Status
                </th>
                <th className="py-2 w-32 text-center hover-text-style">
                  Citations
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
                      {createdByDropdownOpen&& (
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
                <th className="py-2 w-20 text-center hover-text-style">
                  Frequency
                </th>
                <th className="px-4 w-20 py-3 text-center hover-text-style">
                  Export
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
                      className="border-b  text-sm border-style"
                      key={index}
                    >
                      <td className="text-left px-4 w-32 py-6">
                        {item.monitor_id}
                      </td>
                      <td className="text-left px-8 w-32 py-6">
                        <div className="flex">
                          <div
                            className={`mt-1 ${searchQuery ? "font-bold" : ""}`}
                          >
                            {item["name"]}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 w-32 py-6 text-left text-lightslategray">
                        {item.description}
                      </td>
                    <td className="w-20 py-2  pl-7 text-lightslategray date-width ">
  {item?.created_on ? item?.created_on.split("T")[0] : "-"}
</td>
                      <td className="w-20 py-6 pl-5 text-lightslategray date-width">
                        {item["to_date"]}
                      </td>
                      <td className="px-2 w-20 py-6  text-lightslategray text-center">
                        {item["total_records"]}
                      </td>
                      <td className=" w-24 py-6 text-lightslategray text-center">
                        {item.status}
                      </td>
                      <td className="px-4 py-3 text-center text-lightslategray">
                        <div className="justify-center items-center bg-gray-100">
                          <button
                            className={`bg-yellow ml-4 cursor-pointer w-30 text-white text-base font-archivo capitalize text-14 px-2 py-2 rounded font-light ${
                              item.filter_type === "PubMed Search"
                                ? "disabled-select"
                                : ""
                            }`}
                            onClick={() => {
                              setMonitorId(item.monitor_id);
                              setUploadModalOpen((prev: any) => ({
                                ...prev,
                                index,
                                isOpen: true,
                                monitorData: item,
                              }));
                            }}
                            disabled={item.filter_type === "PubMed Search"}
                          >
                            Upload
                          </button>
                        </div>
                        {formValues?.selectedFile &&
                          uploadModalOpen.index === index && (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Image
                                src="/assets/icons/check.svg"
                                alt="add document"
                                width={25}
                                height={25}
                              />
                              <p className="m-2">
                                <span className="text-silver">
                                  File Uploaded
                                </span>
                              </p>
                              <div className="flex flex-wrap items-center">
                                <p className="m-2 text-md text-gray-100">
                                  {formValues.selectedFile.name}
                                </p>
                                <Image
                                  src="/assets/icons/cross-circle.svg"
                                  alt="check"
                                  width={25}
                                  height={25}
                                  className="ml-2"
                                  onClick={handleFileDelete}
                                />
                              </div>
                            </div>
                          )}
                      </td>
                      <td className="px-4 w-20 py-6 text-lightslategray text-center">
                        {item.created_by}
                      </td>
                      <td className="px-4 w-20 py-6 text-lightslategray text-center">
                        {item.frequency ?? "-"}
                      </td>
                      <td className="px-4 text-center w-20 py-6 relative text-center ">
                        <div
                          ref={editRef}
                          className="relative"
                          onClick={() =>

                            recordsDownload(item.id, item.status, item.name)
                          }
                        >
                          {Utils.isPermissionGranted("export_files") ? (
                            <>
                              <Image
                                src="/assets/icons/download-black.svg"
                                alt="download icon"
                                width={15}
                                height={15}
                                className={`left-0 ml-2 top-0 mt-2 cursor-pointer`}
                              />
                            </>
                          ) : (
                            <>
                              <Image
                                src="/assets/icons/download-disble.svg"
                                alt="download icon"
                                width={15}
                                height={15}
                                className={`left-0 ml-2 top-0 mt-2 cursor-pointer`}
                              />
                            </>
                          )}
                          {/* <Image
                            src="/assets/icons/menu-dots-vertical.png"
                            alt="3 dots"
                            width={15}
                            height={15}
                            className="m-3 w-4"
                            onClick={() => {
                              setOpenModalIndex(index);
                              const newOpenModals = [...openModals];
                              newOpenModals[index] = openModals;
                              setOpenModals(newOpenModals);
                              setIsModalOpen(true);
                            }}
                          /> */}
                        </div>
                        {isModalOpen && (
                          <div>
                            {openModalIndex === index && openModals[index] && (
                              <div
                                className="absolute right-12 rounded-lg top-[2px] bg-white shadow-style"
                                style={{ zIndex: 10 }}
                              >
                                <div className="flex items-center px-4 py-2 space-x-2">
                                  <Image
                                    src="/assets/icons/trash(2).png"
                                    alt="trash"
                                    width={15}
                                    height={15}
                                    onClick={() => {}}
                                  />
                                  <div
                                    className="ml-4 cursor-pointer"
                                    onClick={() =>
                                      deleteItem(
                                        item.monitor_id as unknown as number,
                                        index
                                      )
                                    }
                                  >
                                    Delete
                                  </div>
                                </div>
                                <div className="border-bottom"></div>
                                <div className="flex items-center px-4 py-2 space-x-2">
                                  <Image
                                    src="/assets/icons/pencil.png"
                                    alt="pencil"
                                    width={15}
                                    height={15}
                                  />
                                  <div
                                    className="ml-4"
                                    onClick={() =>
                                      handleEdit(
                                        index,
                                        item.monitor_id as unknown as number
                                      )
                                    }
                                  >
                                    Edit
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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

export default ListDrugMonitor;
