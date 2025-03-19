import React, { useState, useEffect } from "react";
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
import { GetUserProductivityAsync, generalState } from "../system-settings/general.slice";
import LoadingSpinner from "@/common/LoadingSpinner";


// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ReportingDashboard = () => {
  const [selectedReportType, setSelectedReportType] = useState("Monthly");
  const [selectedMonth, setSelectedMonth] = useState("Sep");
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { UserProductivityGraphData } = useAppSelector(generalState);
  // Fetch data from the API
  useEffect(() => {
    const fetchProductivityData = async () => {
      const payload = {
        selectedDropdown: selectedReportType,
        month_name: selectedMonth, // Dynamically send the selected month
      };
      setIsLoading(true);
      await dispatch(GetUserProductivityAsync(payload));
      setIsLoading(false);
    };

    fetchProductivityData();
  }, [dispatch, selectedReportType, selectedMonth]);

  // Generate dynamic labels for the days of the month
  const generateDaysInMonth = (month, year) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth(); // Convert month name to index
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
  };

  // Generate labels for all months (for yearly view)
  const generateMonths = () => {
    return ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  };
useEffect(() => {
  // Check if the data is empty or not provided
  if (!UserProductivityGraphData || UserProductivityGraphData.length === 0) {
    setChartData({
      labels: [],
      datasets: [],
    });
    return;
  }

  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  if (selectedReportType === "Monthly") {
    // Generate days for the selected month in the current year
    const labels = generateDaysInMonth(selectedMonth, currentYear);

    // Prepare datasets dynamically
    const datasets = UserProductivityGraphData.map((user) => ({
      label: user.actor,
      data: labels.map((label) => {
        const record = UserProductivityGraphData.find(
          (data) =>
            data.actor === user.actor &&
            data.date.split("-")[2] === label // Match day in the date
        );
        return record ? record.hours_spent : 0;
      }),
      backgroundColor: getRandomColor(),
    }));

    setChartData({
      labels,
      datasets,
    });
  }
}, [UserProductivityGraphData, selectedMonth, selectedReportType]);


useEffect(() => {
  if (UserProductivityGraphData?.length && selectedReportType === "Yearly") {
    const labels = generateMonths(); // Generate months for yearly view

    const datasets = UserProductivityGraphData.reduce((acc, user) => {
      const existingUser = acc.find((dataset) => dataset.label === user.actor);
      if (!existingUser) {
        acc.push({
          label: user.actor,
          data: labels.map((label) => (generateMonths().includes(user.date) ? user.hours_spent : 0)),
          backgroundColor: getRandomColor(),
        });
      }
      return acc;
    }, []);
    setChartData({
      labels,
      datasets,
    });
  }
}, [UserProductivityGraphData, selectedReportType]);



  // Generate a random RGBA color
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const alpha = 0.6; // Adjust transparency
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 20,
          padding: 10,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      max: selectedReportType === "Yearly" ? 300 : undefined, // Dynamically set max value

      },
    },
  };
  return (
    <div className="p-4" style={{ width: "80%", margin: "0 auto" }}>
  <h2>User productivity report</h2>
      <div className="mb-4">
        <label htmlFor="report-type-select" className="block font-medium mb-2">
          Select Report Type:
        </label>
        <select
          id="report-type-select"
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {selectedReportType === "Monthly" && (
        <div className="mb-4">
          <label htmlFor="month-select" className="block font-medium mb-2">
            Select Month:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
              (month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              )
            )}
          </select>
        </div>
      )}

    { chartData ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>No data available for the selected report type and time period.</p>
      )}
    {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default ReportingDashboard;
