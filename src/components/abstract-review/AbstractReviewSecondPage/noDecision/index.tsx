import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CONSTANTS,
  ExpertDecision,
  STATUS,
  StatusData,
  defaultPerPage,
  systemMessage,
} from "@/common/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import CreatableSelect from "react-select/creatable";
import EmailSenderComponent from "@/common/EmailSender";
import AssignToTeamMember from "@/common/helper/AssignToTeamMember";
import LoadingSpinner from "@/common/LoadingSpinner";
import Toast from "@/common/Toast";
import CustomPagination from "@/common/Pagination/CustomPagination";
import { MonitorData, TeamMember } from "../../abstract.model";
import {
  AbstractMonitorDetailsAsync,
  AbstractMonitorDetailsCountsAsync,
  AbstractReviewDataState,
  AbstractReviewMonitorIdAsync,
  AbstractReviewMonitorNoDecsionTotalRecordIdAsync,
  AssignToAsync,
  GetTeamUserAsync,
  ReviewAbstractSendMailAsync,
} from "../../abstract-review.slice";
import { LocalStorage } from "../../../../../utils/localstorage";
import { AbstractReviewAsync } from "../../inQueue/selectedItemsSlice";
import { SortOption } from "../../../../../utils/sortingUtils";
import { Utils } from "../../../../../utils/utils";
import ExportDropdown from "@/common/exportDropdowns/ExportDropdwon";
import {
  getPageCountAsync,
  productMonitorState,
} from "@/components/drug-monitor/productMonitor.slice";
import productMonitor from "../../../../../pages/api/productMonitor";
import Legend from "@/common/Legend";

interface Option {
  readonly label: string;
  readonly value: string;
}

interface IProps {
  monitor_id: string;
  label: string;
}

const NoDecision: React.FC<IProps> = ({ monitor_id, label }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<MonitorData[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [updateByOptions, setUpdateByOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedUpdatedBy, setSelectedUpdatedBy] = useState<Option[]>([]);
  const [selectedTagBy, setSelectedTagBy] = useState<Option[]>([]);
  const [generativeAIAssistedDecision, setGenerativeAIAssistedDecision] =
    useState<Option[]>([]);
  const [causalityAssessment, setCausalityAssessment] = useState<Option[]>([]);
  const [selectedStatusValue, setSelectedStatusValue] = useState<string>("");
  const [selectedExpertDecisionValue, setSelectedExpertDecisionValue] =
    useState<string>("");
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState<MonitorData[]>([]);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [fetchAbstractReviewMonitor, setFetchAbstractReviewMonitor] = useState<
    MonitorData[]
  >([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const {
    status,
    teamUsers,
    abstractReviewMontior,
    monitorDetail,
    AbstractReviewMonitorNoDecisionTotalRecord,
  } = useAppSelector(AbstractReviewDataState);
const { GetPageCount } =useAppSelector(productMonitorState);
  const [perPage, setPerPage] = useState(GetPageCount);
const[defaultPage,setDefaultPage] = useState(GetPageCount)

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setFetchAbstractReviewMonitor(abstractReviewMontior);
      setTotalRecords(AbstractReviewMonitorNoDecisionTotalRecord);
    } else {
      setFetchAbstractReviewMonitor([]);
    }
  }, [
    abstractReviewMontior,
    ,
    status,
    monitorDetail,
    AbstractReviewMonitorNoDecisionTotalRecord,
  ]);

  useEffect(() => {
 const fetchData = async () => {
    if (defaultPage !== 0) {
    setIsLoading(true);
    const payload = {
      monitor_id,
      pageNumber: 1,
      perPage: defaultPerPage,
      label: label,
    };
    dispatch(AbstractReviewMonitorIdAsync(payload));
    dispatch(AbstractReviewMonitorNoDecsionTotalRecordIdAsync(monitor_id));
    setIsLoading(false);
   }
  };

  fetchData();
}, [defaultPage, dispatch,monitor_id]);
 useEffect(() => {
  const fetchPageCount = async () => {
    const result = await dispatch(getPageCountAsync()); 
    const pageCount = result?.payload || 0; 

    if (pageCount !== 0) {
      setDefaultPage(pageCount); 
    setPerPage(pageCount)
    } else {
     
      console.error("Page count is 0, re-fetching...");
    }
  };

  fetchPageCount();
}, [dispatch]);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectAllChecked(false);
    setSelectedItems([]);
    const payload = { monitor_id, pageNumber, perPage, label };
    dispatch(AbstractReviewMonitorIdAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    setSelectAllChecked(false);
    setSelectedItems([]);
    const payload = { monitor_id, pageNumber: 1, perPage: newPerPage, label };
    dispatch(AbstractReviewMonitorIdAsync(payload));
  };

  useEffect(() => {
    setSearchQuery("");
    setFilteredData(fetchAbstractReviewMonitor);
    setSelectedItems([]);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedUpdatedBy([]);
    setSelectedStatusValue("");
    setSelectAllChecked(false);
    setSelectedExpertDecisionValue("");
    setCausalityAssessment([]);
    setSelectedTagBy([]);
  }, [fetchAbstractReviewMonitor]);

  useEffect(() => {
    setIsLoading(true);
    if (fetchAbstractReviewMonitor.length) {
      setFilteredData(fetchAbstractReviewMonitor);
      setMessage("");
      setIsLoading(false);
    } else {
      setFilteredData([]);
      setIsLoading(false);
      setMessage(systemMessage.not_found);
    }
  }, [fetchAbstractReviewMonitor]);

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

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

  const handleUpdateByChange = (newValue: any) => {
    setSelectedUpdatedBy(newValue as Option[]);
    handleUpdatedByTagSelect(newValue as Option[]);
  };

  const defaultOptions = [
    createOption("Suspected Adverse Event(AE)"),
    createOption("Suspected Case"),
    createOption("Animal/In-Vitro"),
    createOption("Pregnancy/fetus/foetus"),
    createOption("Elderly"),
    createOption("Pediatric"),
    createOption("Branding"),
    createOption("Patient"),
    createOption("Abuse/Drug misuse/drug dependence"),
    createOption("Occupational exposure(OC exposure)"),
    createOption("Medication error"),
    createOption("Lack of efficacy"),
    createOption("Overdose"),
    createOption("Drug interaction"),
    // createOption("Important medical event(IME)"),
    createOption("Off label"),
  ];

  const CausalityAssessmentOption = [
    createOption("Certain"),
    createOption("Possible"),
    createOption("Probable/Likely"),
    createOption("Unlikely"),
    createOption("Conditional/Unclassified"),
    createOption("Unassessable/Unclassifiable"),
  ];

  const resetFilters = () => {
    setSearchQuery("");
    setFilteredData(fetchAbstractReviewMonitor);
    setSelectedItems([]);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedUpdatedBy([]);
    setSelectedTagBy([]);
    setSelectedStatusValue("");
    setSelectedExpertDecisionValue("");
    setSelectAllChecked(false);
    setCausalityAssessment([]);
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
    const updatedSelectedItems = isCheck
      ? filteredData.filter((item) => item.status !== "Completed")
      : [];
    setSelectedItems(updatedSelectedItems);
  };

  const handleBulkUpdate = () => {
    if (selectedItems.length === 0) {
      Toast(systemMessage.PleaseSelectValidRecord, { type: "error" });
      return;
    }
    setIsLoading(true);
    dispatch(AbstractReviewAsync(selectedItems as unknown as MonitorData));
    router.push(CONSTANTS.ROUTING_PATHS.AbstractReview4);
  };

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

  const handleTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? fetchAbstractReviewMonitor
        : fetchAbstractReviewMonitor?.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              Object.keys(item?.tags)
                .map((tag) => tag.toLowerCase())
                .includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };

  const handleUpdatedByTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? fetchAbstractReviewMonitor
        : fetchAbstractReviewMonitor?.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.assignee?.toLowerCase().includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };

  const handleCausalityAssessmentTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? fetchAbstractReviewMonitor
        : fetchAbstractReviewMonitor?.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.causality_decision.toLowerCase().includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };
  const handleStatusTagSelect = (value: string) => {
    if (value) {
      const filteredData = fetchAbstractReviewMonitor?.filter(
        (item) => item.status === value
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(fetchAbstractReviewMonitor);
    }
  };
  const handleExpertDecisionTagSelect = (value: string) => {
    if (value) {
      const filteredData = fetchAbstractReviewMonitor?.filter(
        (item) => item.expert_decision === value
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(fetchAbstractReviewMonitor);
    }
  };

  const userIsMasterAdmin = true;

  const handleSearch = (event: { target: { value: string } }) => {
    const query = event.target.value;
    setSearchQuery(query);
  };
  const handleClick = async (item: MonitorData) => {
    setIsLoading(true);
    router.push(
      `${CONSTANTS.ROUTING_PATHS.AbstractReview3}/${monitor_id}/${item.id}`
    );
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
      await dispatch(AbstractReviewMonitorIdAsync(paginationPayload));
      await dispatch(AbstractMonitorDetailsCountsAsync(monitor_id));
      await dispatch(AbstractMonitorDetailsAsync(monitor_id));
    } catch (error: unknown) {
      console.error("Error in Assign:", error);
    }
  };

  /**
   * Determines and returns a CSS class name based on the provided tag.
   * @param tag The tag string to determine the CSS class for.
   * @returns The CSS class name corresponding to the tag.
   */
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
        col: "ai_decision",
        value: label,
        monitor_id: monitor_id,
        page: currentPage,
        per_page: perPage,
        count: false,
      };
      const res = await dispatch(ReviewAbstractSendMailAsync(payload));
      if (ReviewAbstractSendMailAsync.fulfilled.match(res)) {
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
    
    "AI Tags",
    "Medications",
    "Designated Medical Event",
    "Literature Source",
    "Country",
    "Generative AI Assisted Reason",
    // "Generative Confidence Score",
    "Generative Reason",
    "Causality Assessment",
    // "Causality Assessment Confidence Score",
    "Causality Assessment Reason",
    "Assign To",
    "Status",
    "Updated By",
  ];
  const tableBodyKeys = [
    
    "tags",
    "medications",
    "DesignatedMedicalEvent",
    "LiteratureSource",
    "country",
    "ai_decision",
    // "confidence_score",
    "reason",
    "causality_decision",
    // "causality_confidence_score",
    "causality_reason",
    "assignee",
    "status",
    "modifiedBy",
  ];
  const processData = (items: any) => {
    return items.map((item: any) => {
      const tags = item?.tags ? Object.keys(item?.tags)?.join(", ") : "-";

      const DesignatedMedicalEvent =
        item?.designated_medical_events?.toString() || "-";
      const LiteratureSource = item?.filter_type || "-";

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
        tags: tags,
        medications: medications,
        DesignatedMedicalEvent: DesignatedMedicalEvent,
        LiteratureSource: LiteratureSource,
        country: country,
        ai_decision: item?.ai_decision,
        confidence_score: item?.confidence_score,
        reason: item?.reason,
        causality_decision: item?.causality_decision,
        causality_confidence_score: item?.causality_confidence_score,
        causality_reason: item?.causality_reason,
        assignee: assignee,
        status: status,
        modifiedBy: modifiedBy,
      };
    });
  };

  const data = processData(sortedData);

  return (
    <React.Fragment>
      <div>
        <div className="divide-y-2">
          <div className="flex">
            <div className="ml-2 mt-2 flex">
              <div>
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-[200px] h-[22px] text-14 rounded-md border-1 border-solid border-gray text-dimgray px-4 py-2"
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
            <div className="w-[25%] relative text-14 mt-2 ml-6">
              <CreatableSelect
                placeholder="Filter by Assign"
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
            <div className="w-[25%] relative text-14 mt-2 ml-4">
              <CreatableSelect
                placeholder="Filter by Causality Assessment"
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => {
                  setCausalityAssessment(newValue as Option[]);
                  handleCausalityAssessmentTagSelect(newValue as Option[]);
                }}
                options={CausalityAssessmentOption}
                isMulti
                value={causalityAssessment}
              />
            </div>
            <div className="flex absolute text-14 right-7">
              <div className="rounded-md text-14 mt-6 mr-3 text-violet">
                {selectedItems.length} Item Selected
              </div>
              <div className="mt-2 ml-2">
                <button
                  className={`rounded-md border border-none cursor-pointer text-sm font-medium font-archivo w-[90px] h-[38px] ${
                    selectedItems.length === 0 && !selectAllChecked
                      ? "disabled-select"
                      : "bg-yellow text-white"
                  }`}
                  onClick={handleBulkUpdate}
                  disabled={selectedItems.length === 0 && !selectAllChecked}
                >
                  Bulk Update
                </button>
              </div>
              <div className="mt-2 ml-2">
                <button
                  className="text-center border bg-gray border-gray  rounded-md cursor-pointer w-[90px] h-[38px]"
                  onClick={resetFilters}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
 <div className="absolute text-14 right-60 p-2  rounded-md ">
      
      <Legend/>
    </div>
          <div className="flex text-14">
            <div className="w-[25%] relative ml-0.5 p-2">
              <CreatableSelect
                placeholder="Filter by AI Tags"
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => {
                  setSelectedTagBy(newValue as Option[]);
                  handleTagSelect(newValue as Option[]);
                }}
                options={defaultOptions}
                isMulti
                value={selectedTagBy}
              />
            </div>
            <div className="w-[20%] relative ml-2 mt-3">
              <select
                className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => {
                  setSelectedStatusValue(e.target.value);
                  handleStatusTagSelect(e.target.value);
                }}
                value={selectedStatusValue}
              >
                <option className="text-14" value={""}>
                  Filter By Status
                </option>
                {StatusData?.map((name, index) => (
                  <option className="text-14" key={index} value={name.value}>
                    {name.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-[20%] relative ml-2 mt-3">
              <select
                className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => {
                  setSelectedExpertDecisionValue(e.target.value);
                  handleExpertDecisionTagSelect(e.target.value);
                }}
                value={selectedExpertDecisionValue}
              >
                <option className="text-14" value={""}>
                  Filter By Expert Decision
                </option>
                {ExpertDecision?.map((name, index) => (
                  <option className="text-14" key={index} value={name.value}>
                    {name.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="justify-between">
            <div className="flex mt-4 text-14 ml-2">
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
 mandatoryHeaders = {["Article Id","Title"]}
   mandatoryBodyKeys = {["article_id","title"]}
                  tableBodyKeys={tableBodyKeys}
                  data={data}
                  headers={headers}
                  fileNamePrefix="noDecision"
                  fileSavedName={`${
                    Utils.getUserData()?.user_name
                  }_MonitorList_${Utils.getCurrentDateAndTime()}`}
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
          <div className="flex"></div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
          <div className="overflow-style">
            <table className="w-full text-14 border border-collapse table-auto">
              <thead className="border-style text-sm text-center">
                <tr className="font-Archivo cursor-pointer header-style capitalize text-style text-sm bg-gray-50">
                  <th className="cursor-pointer w-12">
                    <input
                      onClick={(event) => event?.stopPropagation()}
                      type="checkbox"
                      checked={selectAllChecked}
                      className="border cursor-pointer ml-4 border-black text-violet bg-white-900 rounded-md"
                      onChange={(event) => {
                        const { checked } = event.target;
                        handleSelectAllChange(checked);
                      }}
                    />
                  </th>
                  <th className="px-2 py-2 w-20 hover-text-style">ID</th>
                  <th className="px-2 py-2 w-40 ">
                    <div className="relative">
                      <span className="flex hover-text-style title-width text-center items-end  cursor-pointer py-2">
                        Title{" "}
                      </span>
                    </div>
                  </th>
                  <th className="px-2 py-4 w-32 text-center hover-text-style">
                    AI Tags
                  </th>
                  <th className="px-2 py-4 w-32 text-center hover-text-style">
                    Medications
                  </th>
                  <th className="px-2 py-4 w-32 text-center hover-text-style">
                    Designated Medical Events
                  </th>
                  <th className="px-2 py-4 w-24 text-center hover-text-style">
                    Article Published Country
                  </th>
                  <th className="px-2 py-4 w-32 text-center hover-text-style">
                    Generative AI Assisted Reason
                  </th>
                  <th className="px-2 py-4 w-32 text-center hover-text-style">
                    Causality Assessment
                  </th>
                  <th className="px-2 py-4 w-20 text-center hover-text-style">
                    Assign To
                  </th>
                  <th className="px-2 py-4 w-20 text-center hover-text-style">
                    Status
                  </th>
                  <th className="px-2 py-4 w-20 text-center hover-text-style">
                    Updated By
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData &&
                  sortedData
                    .filter((item) =>
                      item?.title
                        ? item.title
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : "".includes(searchQuery.toLowerCase())
                    )
                    .map((item, index) => (
                      <tr
                        className="border-b cursor-pointer text-center text-sm border-style hover:bg-ghostwhite mb-2"
                        key={index}
                        onClick={() => {
                          toggleRowSelection(index);
                          handleClick(item);
                        }}
                      >
                        <td className="text-center cursor-pointer">
                          <div>
                            <input
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
                        <td className="px-2 w-24 text-center">
                          <div className="mt-1">
                            {item?.article_id ? item?.article_id : "-"}
                          </div>
                        </td>
                        <td className="px-2 w-20 text-center">
                          <div className="flex relative">
                            <div className="relative">
                              {item.title ? item.title : "-"}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="mt-2 table-date-font text-dimgray">
                              Published on:{" "}
                              {item?.updated_on
                                ? item?.updated_on?.split("T")[0]
                                : "-"}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 w-40 text-dimgray text-center capitalize">
                          <>
                            {item &&
                              item.tags &&
                              Object.keys(item.tags).map(
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
                              )}

                            {item &&
                              item.tags &&
                              !Object?.keys(item?.tags).length && <> - </>}
                          </>
                        </td>
                        <td className="px-2 w-40 text-dimgray text-center capitalize">
                           <>
  {item?.drug_of_choice && item.drug_of_choice.length > 0 ? (
    item.drug_of_choice.filter((value, index, self) => self.indexOf(value) === index).map((choice: string, index: number) => (
      <div key={index}>
        <span
          className="drug-of-choice-selected mt-2 drug-of-choice-tagging ml-1 cursor-pointer"
        >
          {choice}
        </span>
      </div>
    ))
  ) : (
    <div className={`text-center`}></div>
  )}

  
  {item?.ai_tags?.Medications ? (
    item.ai_tags.Medications.map((medication, index: number) => {
      const entitiesToShow = medication.entity.slice(0, 5); 

      const drugOfChoiceNormalized = item.drug_of_choice?.map(choice => choice.toLowerCase()) || [];

      const uniqueEntities = entitiesToShow.filter(entity => 
        entity.length > 0 && !drugOfChoiceNormalized.includes(entity.toLowerCase())
      );

      const uniqueMedicationEntities = uniqueEntities.filter((value, index, self) => self.indexOf(value) === index);

      return uniqueMedicationEntities.length > 0 ? (
        <div key={index}>
          {uniqueMedicationEntities.map((entity, entityIndex) => (
            <span
              key={entityIndex}
              className="medications-selected mt-2 medications-tagging ml-1 cursor-pointer"
            >
              {entity}
            </span>
          ))}
        </div>
      ) : (
        <div key={index} className={`text-center`}>
          
        </div>
      );
    })
  ) : (
    <div className={`text-center`}>{"-"}</div>
  )}
</>
                        </td>
                        <td className="text-center w-40">
                          <>
                            {item &&
                            item.designated_medical_events &&
                            item.designated_medical_events.length ? (
                              item.designated_medical_events.map(
                                (dme, index) => (
                                  <div key={index}>
                                    <span className="designated-medical-event-selected mt-2 medications-tagging ml-1 text-center cursor-pointer">
                                      {dme}
                                    </span>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="text-center">{"-"}</div>
                            )}
                          </>
                        </td>
                        <td className="px-2 w-20 text-center capitalize">
                          {item.country}
                        </td>
                        <td className="px-2 py-4 text-center capitalize">
                          <div className="w-40">
                            <div>{item.ai_decision}</div>
                            {/* <div className="mt-2 table-date-font text-dimgray">
                              Confidence Score : {item?.confidence_score}%
                            </div> */}
                            <div className="mt-2 table-date-font text-dimgray">
                              {item?.reason}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 text-center capitalize">
                          <div className=" w-40">
                            <div>{item.causality_decision}</div>
                            {/* <div className="mt-2 table-date-font text-dimgray">
                              Confidence Score :{" "}
                              {item?.causality_confidence_score}%
                            </div> */}
                            <div className="mt-2 table-date-font text-dimgray">
                              {item?.causality_reason}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 w-20 text-center capitalize">
                          {item?.assignee?.indexOf("@") !== -1
                            ? item?.assignee?.substring(
                                0,
                                item?.assignee?.indexOf("@")
                              )
                            : item?.assignee}
                        </td>
                        <td className="px-2 w-24 text-center capitalize">
                          {item?.status}
                        </td>
                        <td className="px-2 w-20 text-center capitalize">
                          {item.modified_by}
                        </td>
                      </tr>
                    ))}
                {message && (
                  <tr className="border-b cursor-pointer text-center text-sm border-style hover:bg-ghostwhite mb-2">
                    <td
                      className="px-2 py-2 capitalize col-span-3 text-center"
                      colSpan={8}
                    >
                      {message}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
      {fetchAbstractReviewMonitor?.length > 0 && (
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

export default NoDecision;
