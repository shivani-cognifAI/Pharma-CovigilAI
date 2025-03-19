import React, { useEffect, useRef, useState } from "react";
import { STATUS} from "@/common/constants";
import Image from "next/image";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  TeamStatusActivateAsync,
  TeamStatusDeactivateAsync,
  getTeamAsync,
  getTeamCountAsync,
  teamState,
} from "./team.slice";
import { useDispatch } from "react-redux";
import { ITenants, Team, TeamPayload } from "./team.model";
import LoadingSpinner from "@/common/LoadingSpinner";
import { tenantState } from "../Tenant/tenant.slice";
import { userState } from "../User/user.slice";
import AddTeam from "./AddTeam";
import { SortOption } from "../../../../utils/sortingUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faToggleOn,
  faToggleOff,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import CustomPagination from "@/common/Pagination/CustomPagination";
import Toast from "@/common/Toast";
import { Utils } from "../../../../utils/utils";
import {
  getPageCountAsync,
  productMonitorState,
} from "@/components/drug-monitor/productMonitor.slice";

interface ProfileSettingProps {
  customerName: string[];
}

const MyTeam: React.FC<ProfileSettingProps> = ({ customerName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [openAdd, setOPenAdd] = useState<boolean>(false);
  const [teamId, setTeamId] = useState<string>("");
  const [nameDropdownOpen, setNameDropdownOpen] = useState(false);
  const nameDropdownRef = useRef<HTMLDivElement>(null);
  const [totalRecords, setTotalRecords] = useState<Number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [teamStates, setTeamStates] = useState<Record<string, boolean>>({});
  const [teamDetail, setTeamDetail] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
const { GetPageCount } =useAppSelector(productMonitorState);
  const [perPage, setPerPage] = useState(GetPageCount);
const[defaultPage,setDefaultPage] = useState(GetPageCount)

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Team;
    direction: "ascending" | "descending" | "";
  }>({
    key: "name",
    direction: "",
  });
  const { loading, teamData, teamDataById, teamTotal } =
    useAppSelector(teamState);

  useEffect(() => {
    setTeamStates(
      teamDetail.reduce((acc, status) => {
        acc[status.id] = status.is_active;
        return acc;
      }, {} as Record<string, boolean>)
    );
  }, [teamDetail]);

  useEffect(() => {
    const updateData = async () => {
      setIsLoading(true)
      if (loading === STATUS.fulfilled) {
        setTeamDetail(teamData);
        setTotalRecords(teamTotal);
        setIsLoading(false)
      }
    }
    updateData();
  }, [loading, teamData, teamTotal]);

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

  useEffect(() => {
 const fetchData = async () => {
    if (defaultPage !== 0) {
    dispatch(getTeamCountAsync());
    setIsLoading(true);
    const payload = {
      pageNumber: 1,
      perPage: defaultPage,
    };
    dispatch(getTeamAsync(payload));
    setIsLoading(false);
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
    setPerPage(pageCount)
    } else {
     
      console.error("Page count is 0, re-fetching...");
    }
  };

  fetchPageCount();
}, [dispatch]);

  /**
 * Sorts Data array based on a specified key and sort direction.
 * @returns The sorted Data array or an empty array if Data is falsy.
 */
  const sortedData =
    Array.isArray(teamData) &&
    [...teamData].sort((a, b) => {
      const nameA = (a[sortConfig.key] as string).toLowerCase();
      const nameB = (b[sortConfig.key] as string).toLowerCase();

      if (sortConfig.direction === "ascending") {
        return nameA > nameB ? 1 : -1;
      } else {
        return nameA < nameB ? 1 : -1;
      }
    });

  const requestSort = (
    key: keyof Team,
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

  const handleMonitorNameSort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "name" && sortConfig.direction === direction) {
      return;
    }
    requestSort("name", direction);
    setNameDropdownOpen(false);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handelOpen = () => {
    setTeamId("");
    setOPenAdd(true);
  };

  const handleClose = () => {
    setOPenAdd(false);
    setTeamId("");
  };

  const handleOpenEdit = (id: React.SetStateAction<string>) => {
    setTeamId(id);
    setOPenAdd(true);
  };

  const handleToggle = async (id: string) => {
    const isActive = teamStates[id];
    setIsLoading(true);
    const payload = {
      id: id,
    };
    const response = isActive
      ? await dispatch(
          TeamStatusDeactivateAsync(payload as unknown as TeamPayload)
        )
      : await dispatch(
          TeamStatusActivateAsync(payload as unknown as TeamPayload)
        );

    if (response.payload.status === "success") {
      Toast(response.payload.message, { type: "success" });
    } else {
      Toast(response.payload.data.message, { type: "error" });
    }
    const PaginationPayload = {
      pageNumber: 1,
      perPage: perPage,
    };
    setCurrentPage(1);
    dispatch(getTeamAsync(PaginationPayload));
    setIsLoading(false);
  };

  const handlePageChange = (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    const payload = { pageNumber, perPage };
    dispatch(getTeamAsync(payload));
    setIsLoading(false);
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = { pageNumber: 1, perPage: newPerPage };
    dispatch(getTeamAsync(payload));
    setIsLoading(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container h-auto bg-white custom-box-shadow rounded-xl border border-gray-300">
          <div className="add mt-4">
            {!openAdd ? (
              <>
                <div className="ml-2 mt-2 flex">
                  <div>
                    <input
                      type="text"
                      placeholder="Search by team"
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
                    <button
                      className="bg-yellow cursor-pointer px-4 py-3 w-40 text-white text-14 text-base font-archivo font-medium capitalize rounded"
                      onClick={handelOpen}
                    >
                      + add Team
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <AddTeam
                handelClose={() => {
                  handleClose();
                }}
                currentPage={currentPage}
                editTeamId={teamId}
              />
            )}
          </div>
          <section className="mt-4 bg-white custom-box-shadow">
            <div className="border-style"></div>
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
                          Team{" "}
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
                    <th className="px-2 py-6 hover-text-style">Description</th>
                    <th className="px-2 py-6 hover-text-style">Type</th>
                    <th className="px-2 py-6 hover-text-style">Active</th>
                    <th className="px-2 py-6 hover-text-style">Action</th>
                  </tr>
                </thead>
                <tbody className="text-14">
                  {sortedData &&
                    sortedData
                      ?.filter((item) =>
                        item.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((item, index) => (
                        <tr
                          key={index}
                          className="border-b text-left text-sm border-style"
                        >
                          <td
                            className={`px-4 text-left py-6 ${
                              searchQuery ? "font-bold" : ""
                            }`}
                          >
                            {item.name}
                          </td>
                          <td className="px-2 text-left py-6">
                            {item.description}
                          </td>
                          <td className="px-2 text-left py-6">
                            {item.team_type}
                          </td>
                          <td className="px-2 text-left py-6">
                            <div
                              className="mt-2 cursor-pointer flex"
                              onClick={(e: any) => handleToggle(item.id)}
                            >
                              <div>
                                <FontAwesomeIcon
                                  icon={
                                    teamStates[item.id]
                                      ? faToggleOn
                                      : faToggleOff
                                  }
                                  color={"#F39200"}
                                  size="2x"
                                />
                              </div>
                              <span className="ml-2 mt-2 text-14">
                                {teamStates[item.id] ? "Yes" : "No"}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 mt-4 cursor-pointer text-left py-3">
                            <div
                              onClick={() => {
                                Utils.scrollToTopSmooth();
                                handleOpenEdit(item.id);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faEdit}
                                color={"#F39200"}
                                size="xl"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </section>
          {isLoading && <LoadingSpinner />}
        </div>
        {teamData.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            perPage={perPage}
            totalRecords={Number(totalRecords)}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
          />
        )}
      </section>
    </>
  );
};

export default MyTeam;
