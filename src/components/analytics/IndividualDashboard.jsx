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
import { GetIndividualtGraphAsync, generalState } from "../system-settings/general.slice";
import LoadingSpinner from "@/common/LoadingSpinner";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const IndividualDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { IndividualGraphData } = useAppSelector(generalState); 

  

  const transformDataForChart = (data) => {
    if (!data || !data.abstract_screened) return null;

    // Get the months for labels 
    const labels = data.abstract_screened.map((item) => item.month);

    // Dynamic dataset creation
    const datasets = Object.keys(data).map((key) => {
      // Ensure the key is valid and contains relevant data
      if (Array.isArray(data[key])) {
        return {
          label: key.replace(/_/g, " ").toUpperCase(), // Format the key for labels
          data: data[key].map((item) => item.count), // Extract counts
          borderColor: getRandomColor(), // Random color generator
          backgroundColor: getRandomColor(0.2),
          tension: 0.4,
        };
      }
      return null;
    }).filter(Boolean); // Remove invalid datasets

    return {
      labels,
      datasets,
    };
  };

  // Helper function to generate random colors
const getRandomColor =(opacity = 1) => {
  const r = Math.floor(Math.random() * 20); 
  const g = Math.floor(Math.random() * 20); 
  const b = [50, 100, 150, 200, 255][Math.floor(Math.random() * 5)];
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

  useEffect(() => {
    const payload = {
      selectedDropdown: "Yearly", 
    };

    setIsLoading(true);
    dispatch(GetIndividualtGraphAsync(payload))
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  const chartData = transformDataForChart(IndividualGraphData);

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
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2>Individual Data</h2>

    

      {/* Line Chart */}
      {isLoading ? (
        <LoadingSpinner />
      ) : chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default IndividualDashboard;
