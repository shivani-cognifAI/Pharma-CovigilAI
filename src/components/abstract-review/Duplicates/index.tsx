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

import LoadingSpinner from "@/common/LoadingSpinner";
import CustomPagination from "@/common/Pagination/CustomPagination";
import { Article, MonitorData, TeamMember } from "../abstract.model";
import {
  AbstractReviewDataState,
  AbstractReviewMonitorDuplicateTotalRecordIdAsync,
  AbstractReviewMonitorIdAsync,
  AssignToAsync,
  GetTeamUserAsync,
  ReviewAbstractSendMailAsync,
} from "../abstract-review.slice";
import { LocalStorage } from "../../../../utils/localstorage";
import { Utils } from "../../../../utils/utils";
import ExportDropdown from "@/common/exportDropdowns/ExportDropdwon";
import {
  getPageCountAsync,
  productMonitorState,
} from "@/components/drug-monitor/productMonitor.slice";

interface Option {
  readonly label: string;
  readonly value: string;
}

interface IProps {
  monitor_id: string;
  label: string;
}

const Duplicates: React.FC<IProps> = ({ monitor_id, label }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isBulkUpdateDisabled, setIsBulkUpdateDisabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Article[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [updateByOptions, setUpdateByOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedUpdatedBy, setSelectedUpdatedBy] = useState<Option[]>([]);
  const [generativeAIAssistedDecision, setGenerativeAIAssistedDecision] =
    useState<Option[]>([]);
  const [causalityAssessment, setCausalityAssessment] = useState<Option[]>([]);
  const [selectedStatusValue, setSelectedStatusValue] = useState<string>("");
  const [selectedExpertDecisionValue, setSelectedExpertDecisionValue] =
    useState<string>("");
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { GetPageCount } = useAppSelector(productMonitorState);
  const [perPage, setPerPage] = useState(GetPageCount);
  const [defaultPage, setDefaultPage] = useState(GetPageCount);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Article[]>([]);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [selectedTagBy, setSelectedTagBy] = useState<Option[]>([]);
  const [fetchAbstractReviewMonitor, setFetchAbstractReviewMonitor] = useState<
    Article[]
  >([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const {
    status,
    teamUsers,
    abstractReviewMontior,
    monitorDetail,
    AbstractReviewMonitorDuplicatesTotalRecord,
  } = useAppSelector(AbstractReviewDataState);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setFetchAbstractReviewMonitor(abstractReviewMontior);
      setTotalRecords(AbstractReviewMonitorDuplicatesTotalRecord);
    } else {
      setFetchAbstractReviewMonitor([]);
    }
  }, [
    abstractReviewMontior,
    ,
    status,
    monitorDetail,
    AbstractReviewMonitorDuplicatesTotalRecord,
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
        dispatch(AbstractReviewMonitorDuplicateTotalRecordIdAsync(monitor_id));
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
    setSelectedStatusValue("");
    setSelectedExpertDecisionValue("");
    setSelectAllChecked(false);
    setSelectedTagBy([]);
    setCausalityAssessment([]);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Article;
    direction: "ascending" | "descending" | "";
  }>({
    key: "id",
    direction: "",
  });

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

  const userIsMasterAdmin = true;

  const handleSearch = (event: { target: { value: string } }) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  useEffect(() => {
    LocalStorage.setItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.DATA_STORE,
      JSON.stringify(sortedData)
    );
  }, [sortedData]);

  const headers = ["Comments"];
  const tableBodyKeys = ["comments"];

  const processData = (items: any) => {
    return items.map((item: any) => {
      const comments = item?.comments
        ? Object.keys(item?.comments || {}).length !== 0
          ? `
        Assignee: ${item?.comments?.assignee || "-"}
        Review Type: ${item?.comments?.review_type || "-"}
        Status: ${item?.comments?.status || "-"}
        Expert Decision: ${item?.comments?.expert_decision || "-"}
        Country: ${item?.comments?.country || "-"}
        Article Id: ${item?.comments?.article_id || "-"}
        Filter Type: ${item?.comments?.filter_type || "-"}
        Ai Decision: ${item?.comments?.ai_decision || "-"}
        Confidence Score: ${item?.comments?.confidence_score || "-"}
        Reason: ${item?.comments?.reason || "-"}
      `.replace(/^\s+/gm, "")
          : "-"
        : "-";
      return {
        article_id: item?.article_id,
        title: item?.title,
        comments: comments,
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

            <div className="flex absolute text-14 right-7">
              <div className="mt-2 ml-2">
                <button
                  className="text-center border bg-gray border-gray  rounded-md  py-2 px-8"
                  onClick={resetFilters}
                >
                  Reset Filter
                </button>
              </div>
              <div className="mr-4 mt-2  justify-end flex">
                <div className="relative">
                  <ExportDropdown
                    tableBodyKeys={tableBodyKeys}
                    data={data}
                    headers={headers}
                    fileNamePrefix="Duplicates List"
                    fileSavedName={`${
                      Utils.getUserData()?.user_name
                    }_DuplicateList_${Utils.getCurrentDateAndTime()}`}
                    disable={false}
                    searchRow={undefined}
                    startRow={undefined}
                    endRow={undefined}
                    mandatoryHeaders={["Article Id", "Title"]}
                    mandatoryBodyKeys={["article_id", "title"]}
                  />
                  <>
                    <div className="absolute  top-0 ml-2">
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
          </div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
          <div className="overflow-style">
            <table className="w-full text-14 border border-collapse table-auto">
              <thead className="border-style text-sm text-center">
                <tr className="font-Archivo  header-style capitalize text-style text-sm bg-gray-50">
                  <th className="px-4 py-2 w-20 hover-text-style">ID</th>
                  <th className="px-2 py-2 text-center hover-text-style w-18">
                    Title
                  </th>
                  <th className="px-2 py-4  text-center hover-text-style w-30">
                    Comments
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
                        className="border-b text-center text-sm border-style hover:bg-ghostwhite mb-2"
                        key={index}
                      >
                        <td className="px-4 w-24 text-center">
                          <div className="mt-1">
                            {item?.comments?.article_id
                              ? item?.comments?.article_id
                              : "-"}
                          </div>
                        </td>
                        <td className="px-2 w-45 text-center ">
                          <div className="flex relative w-fit m-auto  text-center">
                            <div className="relative text-center">
                              {item.title ? item.title : "-"}
                            </div>
                          </div>
                        </td>

                        <td className="px-2 text-center flex  ">
                          <div className="flex relative w-full m-auto">
                            {Object.keys(item?.comments || {}).length !== 0 ? (
                              <ul>
                                <p className="bold">
                                  Existing Records details :-
                                </p>
                                <li>
                                  Monitor Name : {item?.comments?.monitor_name}
                                </li>
                                <li>Assignee : {item?.comments?.assignee}</li>
                                <li>
                                  Review Type : {item?.comments?.review_type}
                                </li>
                                <li>Status : {item?.comments?.status}</li>
                                <li>
                                  Expert Decision :{" "}
                                  {item?.comments?.expert_decision}
                                </li>
                                <li>Country : {item?.comments?.country}</li>
                                <li>
                                  Article Id : {item?.comments?.article_id}
                                </li>
                                <li>
                                  Filter Type : {item?.comments?.filter_type}
                                </li>
                                <li>
                                  Ai Decision : {item?.comments?.ai_decision}
                                </li>
                                {/* <li>
                                  Confidence Score :{" "}
                                  {item?.comments?.confidence_score}
                                </li> */}
                                <li>Reason : {item?.comments?.reason}</li>
                              </ul>
                            ) : (
                              <div className="ml-4 mt-2">{"-"}</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                {message && (
                  <tr className="border-b  text-center text-sm border-style hover:bg-ghostwhite mb-2">
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
      {fetchAbstractReviewMonitor.length > 0 && (
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

export default Duplicates;
