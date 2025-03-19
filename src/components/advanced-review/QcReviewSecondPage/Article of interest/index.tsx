import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CONSTANTS,
  STATUS,
  StatusData,
  systemMessage,
} from "@/common/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Modal from "@/common/modal/model";
import CreatableSelect from "react-select/creatable";
import Image from "next/image";
import EmailSenderComponent from "@/common/EmailSender";
import E2br2 from "@/common/modal/e2br2";
import UploadFileInTableModal from "@/common/modal/uploadFileInTableModal";
import AssignToTeamMember from "@/common/helper/AssignToTeamMember";
import {
  MonitorData,
  TeamMember,
} from "@/components/abstract-review/abstract.model";
import CustomPagination from "@/common/Pagination/CustomPagination";
import Toast from "@/common/Toast";
import {
  AbstractReviewDataState,
  GetTeamUserAsync,
  PreviewURlAsync,
} from "@/components/abstract-review/abstract-review.slice";
import {
  AdvanceMonitorDetailsCountsAsync,
  AdvanceReviewDataState,
  AdvanceReviewMonitorDetailAsync,
  AdvanceReviewMonitorIdAsync,
  AdvanceReviewMonitorAOITotalRecordIdAsync,
  AssignToAsync,
  ReviewQcSendMailAsync,
} from "../../advance-review.slice";
import { LocalStorage } from "../../../../../utils/localstorage";
import LoadingSpinner from "@/common/LoadingSpinner";
import { Utils } from "../../../../../utils/utils";
import ExportDropdown from "@/common/exportDropdowns/ExportDropdwon";
import {
  getPageCountAsync,
  productMonitorState,
} from "@/components/drug-monitor/productMonitor.slice";
import Legend from "@/common/Legend";

interface Option {
  readonly label: string;
  readonly value: string;
}

interface IUploadFile {
  index: number;
  isOpen: boolean;
}

interface IProps {
  monitor_id: string;
  label: string;
}

const ArticleOfInterest: React.FC<IProps> = ({ monitor_id, label }) => {
  // state
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [openAdd, setOPenAdd] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<MonitorData[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [selectedUpdatedBy, setSelectedUpdatedBy] = useState<Option[]>([]);
  const [message, setMessage] = useState("");
  const [formValues, setFormValues] = useState({
    selectedFile: null as File | null,
  });
  const [uploadModalOpen, setUploadModalOpen] = useState<IUploadFile>({
    index: -1,
    isOpen: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatusValue, setSelectedStatusValue] = useState<string>("");
  const [updateByOptions, setUpdateByOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const { status, teamUsers, monitorDetail } = useAppSelector(
    AbstractReviewDataState
  );

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState<MonitorData[]>([]);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [selectedSamplingPercentage, setSelectedSamplingPercentage] =
    useState<number>(0);
  const [fetchAdvanceReviewMonitor, setFetchAdvanceReviewMonitor] = useState<
    MonitorData[]
  >([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const {
    advanceReviewMonitor,
    AdvanceReviewMonitorAOITotalRecord,
  } = useAppSelector(AdvanceReviewDataState);
  const { GetPageCount } = useAppSelector(productMonitorState);
  const [perPage, setPerPage] = useState(GetPageCount);
  const [defaultPage, setDefaultPage] = useState(GetPageCount);

  useEffect(() => {
    const fetchData = async () => {
      if (defaultPage !== 0) {
        setIsLoading(true);
        const payload = {
          monitor_id,
          pageNumber: 1,
          perPage: defaultPage,
          label,
        };
        dispatch(AdvanceReviewMonitorAOITotalRecordIdAsync(monitor_id));
        dispatch(AdvanceReviewMonitorIdAsync(payload));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [defaultPage, dispatch, monitor_id]);

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
    if (status === STATUS.fulfilled) {
      setFetchAdvanceReviewMonitor(advanceReviewMonitor);
      setTotalRecords(AdvanceReviewMonitorAOITotalRecord);
    } else {
      setFetchAdvanceReviewMonitor([]);
    }
  }, [
    advanceReviewMonitor,
    status,
    monitorDetail,
    AdvanceReviewMonitorAOITotalRecord,
  ]);

  useEffect(() => {
    if (monitorDetail.abstract_team_id) {
      dispatch(GetTeamUserAsync(monitorDetail.abstract_team_id));
    }
  }, [monitorDetail.abstract_team_id]);

  useEffect(() => {
    const mappedUpdatedByOptions = teamUsers.map((cat: TeamMember) => ({
      label: cat.user_name,
      value: cat.id,
    }));
    setUpdateByOptions(mappedUpdatedByOptions);
  }, [teamUsers]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectAllChecked(false);
    setSelectedItems([]);
    const payload = { monitor_id, pageNumber, perPage, label };
    dispatch(AdvanceReviewMonitorIdAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setSelectAllChecked(false);
    setSelectedItems([]);
    setCurrentPage(1);
    const payload = { monitor_id, pageNumber: 1, perPage: newPerPage, label };
    dispatch(AdvanceReviewMonitorIdAsync(payload));
  };

  useEffect(() => {
    if (fetchAdvanceReviewMonitor.length) {
      setFilteredData(fetchAdvanceReviewMonitor);
      setMessage("");
    } else {
      setFilteredData([]);
      setMessage(systemMessage.not_found);
    }
  }, [fetchAdvanceReviewMonitor]);

  useEffect(() => {
    setSearchQuery("");
    setFilteredData(fetchAdvanceReviewMonitor);
    setSelectedItems([]);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedUpdatedBy([]);
    setSelectAllChecked(false);
    setSelectedStatusValue("");
    setSelectedSamplingPercentage(0);
  }, [fetchAdvanceReviewMonitor]);

  const resetFilters = () => {
    setSearchQuery("");
    setFilteredData(fetchAdvanceReviewMonitor);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedStatusValue("");
    setSelectedUpdatedBy([]);
    setSelectAllChecked(false);
    setSelectedItems([]);
  };

  const toggleRowSelection = (index: number) => {
    LocalStorage.setItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.RecordIndex,
      JSON.stringify(index)
    );
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof MonitorData;
    direction: "ascending" | "descending" | "";
  }>({
    key: "id",
    direction: "",
  });

  const handleCheckboxChange = (item: MonitorData, checked: boolean) => {
    let updatedSelectedItems;
    if (checked) {
      updatedSelectedItems = [...selectedItems, item];
    } else {
      updatedSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem !== item
      );
    }
    setSelectedItems(updatedSelectedItems);
    setSelectAllChecked(updatedSelectedItems.length === filteredData.length);
  };

  const handleSelectAllChange = (isCheck: boolean) => {
    setSelectAllChecked(isCheck);
    const updatedSelectedItems = isCheck ? filteredData : [];
    setSelectedItems(updatedSelectedItems);
  };

  /**
   * Sorts filteredData based on sortConfig.
   */
  const sortedData = [...filteredData].sort((a, b) => {
    let nameA = "";
    let nameB = "";

    if (typeof a[sortConfig.key] === "string") {
      nameA = a[sortConfig.key] as string;
    } else if (typeof a[sortConfig.key] === "number") {
      nameA = a[sortConfig.key].toString();
    }

    if (typeof b[sortConfig.key] === "string") {
      nameB = b[sortConfig.key] as string;
    } else if (typeof b[sortConfig.key] === "number") {
      nameB = b[sortConfig.key].toString();
    }

    if (sortConfig.direction === "ascending") {
      return nameA > nameB ? 1 : -1;
    } else {
      return nameA < nameB ? 1 : -1;
    }
  });

  const handleStatusTagSelect = (value: string) => {
    if (value) {
      const filteredData = fetchAdvanceReviewMonitor?.filter(
        (item) => item.status === value
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(fetchAdvanceReviewMonitor);
    }
  };

  const handleUpdatedByTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? fetchAdvanceReviewMonitor
        : fetchAdvanceReviewMonitor?.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.assignee?.toLowerCase().includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };

  const handleSearch = (event: { target: { value: any } }) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  function handleClose() {
    setOPenAdd(false);
  }
  const userIsMasterAdmin = true;

  const handleClick = (item: MonitorData) => {
    setIsLoading(true);
    router.push(
      `${CONSTANTS.ROUTING_PATHS.advancedReview3}/${monitor_id}/${item.id}`
    );
  };

  const handleLink = async (item: MonitorData) => {
    try {
      setIsLoading(true);
      if (item.search_result_id) {
        const response = await dispatch(PreviewURlAsync(item.search_result_id));
        if (PreviewURlAsync.fulfilled.match(response)) {
          if (response.payload.status === 400) {
            setIsLoading(false);
            Toast(systemMessage.FreeFullTextLinkNotAvailable, {
              type: "error",
            });
            return;
          } else {
            router.push(
              `${CONSTANTS.ROUTING_PATHS.PDFReaderFromTable}/${monitor_id}`
            );
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleAssign = async (selectedTeamMember: string) => {
    const id = selectedItems.map((item, index) => {
      return item.id;
    });
    try {
      const payload = {
        expert_review_ids: id,
        user_id: selectedTeamMember,
      };
      const response = await dispatch(AssignToAsync(payload));
      if (AssignToAsync.fulfilled.match(response)) {
        Toast(systemMessage.AssignSuccessFully, { type: "success" });
      }
      const paginationPayload = {
        monitor_id,
        pageNumber: 1,
        perPage,
        label,
      };
      await dispatch(AdvanceReviewMonitorIdAsync(paginationPayload));
      await dispatch(AdvanceMonitorDetailsCountsAsync(monitor_id as string));
      await dispatch(AdvanceReviewMonitorDetailAsync(monitor_id as string));
    } catch (error: unknown) {
      console.error("Error in Assign:", error);
    }
  };

  useEffect(() => {
    LocalStorage.setItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.DATA_STORE,
      JSON.stringify(sortedData)
    );
  }, [sortedData]);

  const handleEmailSend = async (tags: string[]) => {
    try {
      setIsLoading(true);
      const payload = {
        emails: tags,
        col: "abstract_review_decision",
        value: label,
        monitor_id: monitor_id,
        page: currentPage,
        per_page: perPage,
        count: false,
      };
      const res = await dispatch(ReviewQcSendMailAsync(payload));
      if (ReviewQcSendMailAsync.fulfilled.match(res)) {
        setIsLoading(false);
        if (res.payload.status === 200) {
          Toast(systemMessage.SendMailSuccess, { type: "success" });
        } else {
          setIsLoading(false);
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      console.error("Error occurred during download:", error);
      setIsLoading(false);
    }
  };
  const headers = [
    "Published On",
    "Medications",
    "Designated Medical Event",
    "Literature Source",
    "Status",
    "Decision",
    "Assign To",
    "Updated By",
  ];
  const tableBodyKeys = [
    "updated_on",
    "medications",
    "DesignatedMedicalEvent",
    "LiteratureSource",
    "status",
    "ai_decision",
    "assignee",
    "modified_by",
  ];

  /**
   * Downloads abstract review records as an Excel file.
   * @param id The ID of the record to download
   * @param status The status of the record
   * @param name Optional name parameter
   */
  const processData = (items: any) => {
    return items.map((item: any) => {
      const DesignatedMedicalEvent =
        item?.designated_medical_events?.toString() || "-";
      const LiteratureSource = item?.filter_type || "-";
      const updated_on = item?.updated_on || "-";
      const country = item?.country || "-";
      const assignee = item?.assignee || "-";
      const status = item?.status || "-";
      const modifiedBy = item?.modified_by || "-";

      const medications = item?.ai_tags?.Medications
        ? item?.ai_tags?.Medications?.flatMap((medication: any) =>
            medication?.entity?.map((entity: any) => entity)
          ).join(", ")
        : "-";

      return {
        article_id: item?.article_id,
        title: item?.title,
        updated_on: updated_on,
        medications: medications,
        DesignatedMedicalEvent: DesignatedMedicalEvent,
        LiteratureSource: LiteratureSource,
        status: status,
        ai_decision: item?.ai_decision,
        assignee: assignee,
        modified_by: modifiedBy,
      };
    });
  };

  const data = processData(sortedData);
  const getClass = (tag: string) => {
    let className = "";
    switch (tag) {
      case "Animal/In-Vitro":
        className = "animal-case-style";
        break;
      case "Pregnancy/fetus/foetus":
        className = "pregnancy-case-style";
        break;
      case "Elderly":
        className = "elderly-style";
        break;
      case "Pediatric":
        className = "pediatric-style";
        break;
      case "Suspected Adverse Event(AE)":
        className = "suspected-adverse-style";
        break;
      case "Abuse/Drug misuse/drug dependence":
        className = "abuse-drug-style";
        break;
      case "Occupational exposure(OC exposure)":
        className = "occupational-exposure-style";
        break;
      case "Patient":
        className = "patient-identified-style";
        break;
      case "Suspected Case":
        className = "suspected-case-style";
        break;
      default:
        className = "pregnancy-case-style";
        break;
    }
    return className;
  };
  return (
    <React.Fragment>
      <div>
        <div className="divide-y-2">
          <div className="flex relative">
            <div className="relative">
              <div className="ml-2 mt-2 text-14 flex">
                <div>
                  <input
                    type="text"
                    placeholder="Search by title"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-[200px] h-[22px] rounded-md border-1 border-solid border-gray text-dimgray px-4 py-2"
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
            </div>
           

            <div className="w-[18%] relative text-14 ml-6 mt-2">
              <CreatableSelect
                placeholder="Filter by assign"
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => {
                  setSelectedUpdatedBy(newValue as Option[]);
                  handleUpdatedByTagSelect(newValue as Option[]);
                }}
                options={updateByOptions}
                isMulti
                value={selectedUpdatedBy}
              />
            </div>
            <div className="w-[20%] relative text-14 ml-2 mt-3 ">
              <select
                className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => {
                  setSelectedStatusValue(e.target.value);
                  handleStatusTagSelect(e.target.value);
                }}
                value={selectedStatusValue}
              >
                <option value={""}>Filter By Status</option>
                {StatusData?.map((name, index) => (
                  <option key={index} value={name.value}>
                    {name.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-2 mt-3">
              <button
                className="text-12 bg-gray border-none rounded-md cursor-pointer px-8 py-3"
                onClick={resetFilters}
              >
                Reset Filter
              </button>
            </div>
          </div>
          <div className="flex mt-3 justify-between text-14">
            <div className="flex w-full">
              {userIsMasterAdmin && (
                <AssignToTeamMember onAssign={handleAssign} />
              )}
            </div>
            <div className="mr-4 cursor-pointer justify-end flex">
              <div className="mt-1 mr-32">
                <EmailSenderComponent
                  handleSend={(tags: string[]) => {
                    handleEmailSend(tags);
                  }}
                  customClasses="right-8"
                />
              </div>
              <div className="absolute">
                <ExportDropdown
                  mandatoryHeaders={["Article Id", "Title"]}
                  mandatoryBodyKeys={["article_id", "title"]}
                  tableBodyKeys={tableBodyKeys}
                  data={data}
                  headers={headers}
                  fileNamePrefix="Qc InValid ICSR List"
                  fileSavedName={`${
                    Utils.getUserData()?.user_name
                  }_QcInValidICSRList"_${Utils.getCurrentDateAndTime()}`}
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
            <div className="absolute right-64 text-14  p-2   rounded-md  ">
              <Legend />
            </div>
          </div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>

        <div>
          <div className="overflow-style">
            <table className="w-full text-14 border border-collapse table-auto">
              <thead className="border-style text-sm text-center">
                <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                  <th className="cursor-pointer w-12">
                    <input
                      type="checkbox"
                      checked={selectAllChecked}
                      className="border cursor-pointer ml-4 border-black text-violet bg-white-900 rounded-md"
                      onChange={(event) => {
                        const { checked } = event.target;
                        handleSelectAllChange(checked);
                      }}
                    />
                  </th>
                  <th className="px-8 w-12 py-2 hover-text-style">ID</th>
                  <th className="px-2 py-2 w-40 text-center">
                    <div className="px-2 py-2 w-40 text-center hover-text-style">
                      Title
                    </div>
                  </th>
                  <th className="px-2 py-4 w-32 hover-text-style">AI Tags</th>

                  <th className="px-2 w-40 py-4 text-center hover-text-style">
                    Medications
                  </th>
                  <th className="px-2 w-40 py-4 text-center hover-text-style">
                    Designated Medical Events
                  </th>
                  <th className="px-2 w-20 py-4 text-center hover-text-style">
                    Article Published Country
                  </th>
                  <th className="px-2 w-20 py-2 text-center hover-text-style">
                    Status
                  </th>
                  <th className="px-2 w-20 py-2 text-center hover-text-style">
                    Decision
                  </th>
                  <th className="px-2 w-20 py-4 text-center hover-text-style">
                    Assign To
                  </th>
                  <th className="px-2 w-20 py-4 text-center hover-text-style">
                    Updated By
                  </th>

                  <th className="px-2 w-20 py-2 text-center hover-text-style">
                    Processed Fulltext Links
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData &&
                  sortedData
                    .filter((item) =>
                      item.title
                        ? item.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : "".includes(searchQuery.toLowerCase())
                    )
                    .map((item, index) => (
                      <tr
                        className="border-b cursor-pointer text-center text-sm border-style hover:bg-ghostwhite"
                        key={index}
                        onClick={() => {
                          toggleRowSelection(index);

                          handleClick(item);
                        }}
                      >
                        <td className="text-center cursor-pointer">
                          <div>
                            <input
                              onClick={(event) => event?.stopPropagation()}
                              disabled={item.status === "Completed"}
                              type="checkbox"
                              checked={selectedItems.includes(item)}
                              onChange={(event) => {
                                const { checked } = event.target;
                                handleCheckboxChange(item, checked);
                              }}
                              className={`${
                                item.status === "Completed"
                                  ? "disabled-select"
                                  : ""
                              } border cursor-pointer ml-4 border-black text-violet bg-white-900 rounded-md`}
                            />
                          </div>
                        </td>
                        <td className="px-2 text-center">
                          <div className="mt-1">
                            {item?.article_id ? item?.article_id : "-"}
                          </div>
                        </td>
                        <td className="w-40 py-4 cursor-pointer break-words text-center">
                          <div className="flex relative">
                            <div className="relative">
                              {item.title ? item.title : "-"}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="mt-2 table-date-font text-dimgray">
                              Published on:{" "}
                              {item?.updated_on
                                ? item?.updated_on.split("T")[0]
                                : "-"}
                            </div>
                          </div>
                        </td>
                        <td className="w-40 py-4 cursor-pointer break-words text-center">
                          {item &&
                          item.tags &&
                          Object.keys(item.tags).length > 0
                            ? Object.keys(item.tags).map(
                                (tag: string, index: number) => {
                                  const entities = (
                                    item.tags as Record<string, any>
                                  )[tag]?.[0]?.entity;
                                  return (
                                    <div
                                      title={entities}
                                      key={index}
                                      className={`text-center px-3 flex-wrap mr-2 mb-1 py-1 ${getClass(
                                        tag
                                      )}`}
                                    >
                                      {tag}
                                    </div>
                                  );
                                }
                              )
                            : null}

                         
                          {item && item.drug ? (
                            <div className="py-1 text-center px-3 flex-wrap mr-2 mb-1 drug-case-style">
                              <span
                                title={item.adverse_reaction || ""}
                                className=""
                              >
                                {`${item.drug}`}
                              </span>
                            </div>
                          ) : null}

                          {/* Fallback: show hyphen only if no tags, drug, or adverse_reaction */}
                          {!(item?.tags && Object.keys(item.tags).length > 0) &&
                            !item?.drug &&
                            !item?.adverse_reaction && (
                              <div className={`text-center`}>-</div>
                            )}
                        </td>

                        <td className="px-2 w-40 text-dimgray text-center capitalize">
                          <>
                            {item?.drug_of_choice &&
                            item.drug_of_choice.length > 0 ? (
                              item.drug_of_choice
                                .filter(
                                  (value, index, self) =>
                                    self.indexOf(value) === index
                                )
                                .map((choice: string, index: number) => (
                                  <div key={index}>
                                    <span className="drug-of-choice-selected mt-2 drug-of-choice-tagging ml-1 cursor-pointer">
                                      {choice}
                                    </span>
                                  </div>
                                ))
                            ) : (
                              <div className={`text-center`}></div>
                            )}

                            {item?.ai_tags?.Medications ? (
                              item.ai_tags.Medications.map(
                                (medication, index: number) => {
                                  const entitiesToShow =
                                    medication.entity.slice(0, 5);

                                  const drugOfChoiceNormalized =
                                    item.drug_of_choice?.map((choice) =>
                                      choice.toLowerCase()
                                    ) || [];

                                  const uniqueEntities = entitiesToShow.filter(
                                    (entity) =>
                                      entity.length > 0 &&
                                      !drugOfChoiceNormalized.includes(
                                        entity.toLowerCase()
                                      )
                                  );

                                  const uniqueMedicationEntities =
                                    uniqueEntities.filter(
                                      (value, index, self) =>
                                        self.indexOf(value) === index
                                    );

                                  return uniqueMedicationEntities.length > 0 ? (
                                    <div key={index}>
                                      {uniqueMedicationEntities.map(
                                        (entity, entityIndex) => (
                                          <span
                                            key={entityIndex}
                                            className="medications-selected mt-2 medications-tagging ml-1 cursor-pointer"
                                          >
                                            {entity}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <div
                                      key={index}
                                      className={`text-center`}
                                    ></div>
                                  );
                                }
                              )
                            ) : (
                              <div className={`text-center`}></div>
                            )}
                          </>
                        </td>
                        <td className="w-40 text-center">
                          <>
                            {item?.designated_medical_events.length ? (
                              item.designated_medical_events.map(
                                (dme, index: number) => {
                                  return (
                                    <div key={index}>
                                      <span
                                        key={index}
                                        className="designated-medical-event-selected mt-2 medications-tagging text-center ml-1 cursor-pointer"
                                      >
                                        {dme}
                                      </span>
                                    </div>
                                  );
                                }
                              )
                            ) : (
                              <div className={`text-center`}></div>
                            )}
                          </>
                        </td>
                        <td
                          className="text-lightslategray w-20 text-center"
                          onClick={() => {
                            handleClick(item);
                            toggleRowSelection(index);
                          }}
                        >
                          {item?.country ? item.country : "-"}
                        </td>
                        <td
                          className="text-lightslategray w-20 text-center"
                          onClick={() => {
                            handleClick(item);
                            toggleRowSelection(index);
                          }}
                        >
                          {item.status}
                        </td>
                        <td
                          className="pl-3 text-lightslategray w-20 text-center"
                          onClick={() => {
                            handleClick(item);
                            toggleRowSelection(index);
                          }}
                        >
                          {item.expert_decision}
                        </td>
                        <td className="p-3 text-black capitalize w-20 text-center">
                          {item?.assignee?.indexOf("@") !== -1
                            ? item?.assignee?.substring(
                                0,
                                item?.assignee?.indexOf("@")
                              )
                            : item?.assignee}
                        </td>
                        <td className="p-3 text-black capitalize w-20 text-center">
                          {item.modified_by}
                        </td>

                        <td className="py-3 text-center w-20 text-lightslategray">
                          <div
                            className="ml-3 mt-4 cursor-pointer"
                            onClick={() => handleLink(item)}
                          >
                            <Image
                              alt="link"
                              src="/assets/icons/linkicon.png"
                              width={20}
                              height={20}
                              title="preview"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                {message && (
                  <tr className="border-b cursor-pointer text-center text-sm border-style hover:bg-ghostwhite mb-2">
                    {" "}
                    <td
                      className="px-2 py-2 capitalize col-span-3 text-center"
                      colSpan={9}
                    >
                      {message}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Modal
          isOpen={openAdd}
          childElement={
            <E2br2
              isOpen={false}
              handelClose={() => {
                handleClose();
              }}
            />
          }
        />
        <Modal
          isOpen={uploadModalOpen.isOpen}
          childElement={
            <UploadFileInTableModal
              isOpen={uploadModalOpen.isOpen}
              onClose={() => setUploadModalOpen({ index: -1, isOpen: false })}
              onFileUpload={(file) =>
                setFormValues({
                  ...formValues,
                  selectedFile: file,
                })
              }
            />
          }
        />
      </div>
      {isLoading && <LoadingSpinner />}
      {fetchAdvanceReviewMonitor?.length > 0 && (
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

export default ArticleOfInterest;
