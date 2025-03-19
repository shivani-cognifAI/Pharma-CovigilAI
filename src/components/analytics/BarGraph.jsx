import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  GetMonitorStatusGraphAsync,
  GetMonitorIdDataAsync,
  generalState,
} from "../system-settings/general.slice";
import LoadingSpinner from "@/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Toast from "@/common/Toast";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MonitorStatusDashboard = () => {
  const [selectedDropdown, setSelectedDropdown] = useState("abstract");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [monitorId, setMonitorId] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { MonitorStatusGraphData, monitorIdData } = useAppSelector(generalState);

  const debounceRef = useRef(null);

  const fetchSuggestions = async (query) => {
    if (query.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    await dispatch(GetMonitorIdDataAsync());
    const filteredSuggestions = monitorIdData.filter((monitor) =>
      monitor.name.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear the previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      debounceRef.current = setTimeout(() => fetchSuggestions(query), 300); // Debounce delay
    }
  };

  const handleSuggestionClick = (monitor) => {
    setSearchQuery(monitor.name);
    setMonitorId(monitor.monitor_id);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const exactMatch = suggestions.find(
      (monitor) => monitor.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (exactMatch) {
      setMonitorId(exactMatch.monitor_id);
    } else {
      Toast("No monitor found for the given name.", { type: "error" });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setMonitorId(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const fetchProductivityData = async () => {
      const payload = {
        selectedDropdown,
        monitor_id: monitorId || null,
      };
      setIsLoading(true);
      await dispatch(GetMonitorStatusGraphAsync(payload));
      setIsLoading(false);
    };

    fetchProductivityData();
  }, [dispatch, selectedDropdown, monitorId]);

  useEffect(() => {
    if (!MonitorStatusGraphData || Object.keys(MonitorStatusGraphData).length === 0) {
      setChartData({
        labels: ["Assigned", "Completed", "Reassigned"],
        datasets: [],
      });
      return;
    }

    const dataArray = Object.entries(MonitorStatusGraphData).map(([actor, stats]) => ({
      actor,
      assigned: stats?.Assigned || 0,
      completed: stats?.Completed || 0,
      reassigned: stats?.Reassigned || 0,
    }));

    const labels = ["Assigned", "Completed", "Reassigned"];
    const datasets = dataArray.map((user) => ({
      label: user.actor,
      data: [user.assigned, user.completed, user.reassigned],
      backgroundColor: getRandomColor(),
    }));
    setChartData({ labels, datasets });
  }, [MonitorStatusGraphData]);

  // const getRandomColor = () => {
  //   const r = Math.floor(Math.random() * 256);
  //   const g = Math.floor(Math.random() * 256);
  //   const b = Math.floor(Math.random() * 256);
  //   const alpha = 0.6;
  //   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  // };
const getRandomColor = (opacity = 1) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };


  const chartOptions = {
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2>Monitor Activity Status Report</h2>
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative w-3/4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Monitor Name"
              className="border w-full px-4 py-2"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute bg-white  p-2 mt-1 max-h-40 overflow-y-auto w-full">
                {suggestions.map((monitor) => (
                  <div
                    key={monitor.monitor_id}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSuggestionClick(monitor)}
                  >
                    {monitor.name}
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={handleClearSearch}
className="absolute -right-1 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded"            >
              <FontAwesomeIcon icon={faTrash} color={"#FFFFF"} size="lg" title="Delete" />
            </button>
          </div>
        </form>
      </div>

      <div className="dropdown-container" style={{ marginTop: "20px" }}>
        <select
          value={selectedDropdown}
          onChange={(e) => setSelectedDropdown(e.target.value)}
        >
          <option value="abstract">Abstract</option>
          <option value="qc">QC</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : chartData ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default MonitorStatusDashboard;
