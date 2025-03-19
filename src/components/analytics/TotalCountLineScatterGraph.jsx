import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { GetTotalCountGraphAsync, generalState } from "../system-settings/general.slice";
import LoadingSpinner from "@/common/LoadingSpinner";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const ChartComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { TotalCountGraphData, loading, error } = useAppSelector(generalState); // Assuming loading and error are part of state
  const options = ["Yearly", "Monthly"];
  const [selectedOption, setSelectedOption] = useState("Yearly");
  const [selectedMonth, setSelectedMonth] = useState("Jan");

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  useEffect(() => {
    const payload = {
      selectedDropdown: selectedOption,
      month_name: selectedOption === "Monthly" ? selectedMonth : undefined,
    };
    setIsLoading(true);
    dispatch(GetTotalCountGraphAsync(payload));
    setIsLoading(false);
  }, [selectedOption, selectedMonth, dispatch]);

 const transformDataForChart = (data, selectedOption) => {
  if (!data) return null;

  let labels = Object.keys(data); 
  
  if (selectedOption =="Yearly") {
    // Check if all labels are month names (Jan, Feb, Mar, ...)
    const months = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
    ];

    // Check if the labels are month names and not dates
    if (labels.every(label => months.includes(label))) {
      // Sort by the predefined month order
      labels = labels.sort((a, b) => months.indexOf(a) - months.indexOf(b));
    }
  }

  const totalAbstractProcessed = labels.map(
    (key) => data[key]["Total Abstract Processed"] || 0
  );
  const totalFullTextProcessed = labels.map(
    (key) => data[key]["Total Full Text Processed"] || 0
  );
  const totalQCProcessed = labels.map(
    (key) => data[key]["Total QC Processed"] || 0
  );

  return {
    labels,
    datasets: [
      {
        label: "Total Abstract Processed",
        data: totalAbstractProcessed,
        borderColor: "rgb(201, 186, 246)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Total Full Text Processed",
        data: totalFullTextProcessed,
        borderColor: "rgb(54, 63, 235)",
        backgroundColor: "rgba(40, 26, 51, 0.2)",
        tension: 0.4,
      },
      {
        label: "Total QC Processed",
        data: totalQCProcessed,
        borderColor: "rgb(99, 177, 255)",
        backgroundColor: "rgba(14, 76, 83, 0.2)",
        tension: 0.4,
      },
    ],
  };
};


  const chartData = transformDataForChart(TotalCountGraphData,selectedOption);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
        title: {
          display: true,
          text: 'Count', 
        },
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2>{selectedOption} Total Count</h2>

      {/* Dropdown for Yearly or Monthly */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          Select View:{" "}
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            style={{ padding: "10px", fontSize: "16px", width: "200px" }} // Increased width of dropdown
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Month Dropdown when Monthly View */}
      {selectedOption === "Monthly" && (
        <div style={{ marginBottom: "10px" }}>
          <label>
            Select Month:{" "}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: "10px", fontSize: "16px", width: "200px" }} // Increased width of dropdown
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Line Chart */}
      {chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No data available</p>
      )}

      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default ChartComponent;
