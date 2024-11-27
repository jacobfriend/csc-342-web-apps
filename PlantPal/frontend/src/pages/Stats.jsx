import api from "../utils/axios";
import { formatDate, formatMonth, getOptionalCountString } from '../utils/common.js';

// Components
import { PageTemplate, ScrollContainer, BackHome } from '../components/Structure.jsx'

import { Line, Bar } from 'react-chartjs-2';
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);

// Hooks
import { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";

// Icons

function BarChart({title, chartData}) {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          display: false,
        },
        title: {
          display: false,
          text: title,
        },
      },
    };
  
    return (
        <div className="w-full p-2 md:p-4 text-zuccini-950 bg-tan-100 shadow-md border border-zuccini-950 rounded-lg">
            <h3 className="text-center font-light">{title}</h3>
            <Bar data={chartData} options={options} />
        </div>
    )
  };

function LineChart({title, chartData }) {
    return (
      <div className="w-full p-2 md:p-4 text-zuccini-950 bg-tan-100 shadow-md border border-zuccini-950 rounded-lg">
        <h3 className="text-center font-light">{title}</h3>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: false,
                text: ""
              },
              legend: {
                display: false,
                labels: {
                    color: '#034023',
                },
              }
            },
            scales: {
                x: {
                    display: false,
                    ticks: {
                      color: '#034023', // Color for x-axis labels
                    },
                    grid: {
                      color: 'rgba(3, 64, 35, 0.2)', // Color for x-axis grid lines
                    },
                  },
                y: {
                    ticks: {
                      color: '#034023', // Color for y-axis labels
                    },
                    grid: {
                      color: 'rgba(3, 64, 35, 0.2)', // Color for y-axis grid lines
                    },
                    beginAtZero: true,
                },
            }
          }}
        />
      </div>
    );
  }

export default function Stats() {

    const [filterOptions, setFilterOptions] = useState(null);
    const filterRef = useRef(null);

    const [chartData, setChartData] = useState(null);
    const [overallData, setOverallData] = useState(null);
    const [plantChart, setPlantChart] = useState(true);

    function getSelectedPlantData() {
        const plantId = filterRef.current?.value;
        if (!plantId) {
            console.error("Error in plant select.")
            return;
        }
        if (plantId == 0) {
            setPlantChart(false);
            api.get(`/plants/totals/monthly`)
                .then(res => {setOverallData(formatOverallData(res.data))})
                .catch(error => {
                    console.error("Error fetching overall plant data:", error);
                });
        } else {
            setPlantChart(true);
            api.get(`/plants/${plantId}/measurements`)
                .then(res => {setChartData(formatChartData(res.data));})
                .catch(error => {
                    console.error("Error fetching plant measurements:", error);
                });
        }
    }

    useEffect(() => {
        api.get("/plants")
            .then(res => {
                setFilterOptions(res.data);
                if (filterRef.current) {
                    filterRef.current.value = res.data[0]?.plant_id;
                    getSelectedPlantData();
                }
            })
            .catch(error => {
                console.error("Error fetching plants:", error);
            });
    }, []);

    const labels = new Map([["heightData", "Height (cm)"], ["soilData", "Soil (ph)"], ["leafData", "Leaf (ct)"], ["fruitData", "Fruit (ct)"]]);

    function formatChartData(data) {
        return Object.entries(data).map(([key, valueArray]) => {
            const orderedData = valueArray.reverse();
            const timestamps = orderedData.map(entry => formatDate(entry.time));
            const values = orderedData.map(entry => parseFloat(entry.value));
             return {
                    labels: timestamps,
                    datasets: [
                    {
                        label: labels.get(key),
                        data: values,
                        borderColor: '#034023',
                        backgroundColor: 'rgba(3, 64, 35, 0.2)',
                        fill: true,
                        tension: 0.4,
                    },
                    ],
                }
        });
    }

    function formatOverallData(data) {
        return Object.entries(data).map(([key, valueArray]) => {
            const timestamps = valueArray.map(entry => formatMonth(entry.month));
            const values = valueArray.map(entry => entry.count);
            return {
                labels: timestamps,
                datasets: [
                {
                    label: key,
                    data: values,
                    backgroundColor: "#034023", // Bar color
                    borderColor: "#001f11", // Border color
                    borderWidth: 1,
                },
                ],
            };
        });
    }

    function chartDataNotEmpty(chartData) {
        return chartData.some((dataSet) => dataSet.labels.length > 0);
    } 
    
    return (
        <PageTemplate headerText="Stats" navButtons={<BackHome />}>
            <div className="w-fit mx-auto pb-2">
                {filterOptions && (
                <select
                        className="block p-1 border border-zuccini-900 bg-tan-100 shadow-sm font-semibold text-zuccini-950 rounded-xl text-center text-xl"
                        ref={filterRef}
                        onChange={(e) => {getSelectedPlantData();}}
                    >
                        <option value={0}>
                            Overall
                        </option>
                        {filterOptions.map((plant, index) => (
                            <option key={index} value={plant.plant_id}>
                                {plant.name + getOptionalCountString(filterOptions, plant)}
                            </option>
                        ))}
                    </select>)}
            </div>
            <ScrollContainer style="max-w-[90%] max-h-[90%] mx-auto">
                {chartData ?  (
                    <div className="grid grid-cols-1 gap-6 w-full mx-auto py-2 px-1 md:py-4 md:px-4 h-fit lg:grid-cols-2 justify-center items-center text-white text-3xl font-bold rounded-2xl">
                        {plantChart ? (chartDataNotEmpty(chartData) ? (
                            <>
                            <LineChart title="Height" chartData={chartData[0]} /> 
                            <LineChart title="Soil" chartData={chartData[1]} /> 
                            <LineChart title="Fruit" chartData={chartData[2]} /> 
                            <LineChart title="Leaves" chartData={chartData[3]} />
                            </>) : (<div className="text-3xl font-light text-tan-100/70 self-center justify-self-center flex flex-col gap-1 col-span-2 text-center w-full mx-auto py-52">No data for this plant, <Link to="/plants" className="underline font-thin">track your plants</Link></div>)) : overallData && (
                            <>
                            <BarChart title="New Plants" chartData={overallData[0]}></BarChart>
                            <BarChart title="Total Journal Entries" chartData={overallData[1]}></BarChart>
                            <BarChart title="Total Measurements" chartData={overallData[2]}></BarChart>
                            </>
                        ) }
                    </div>
                ) : (
                    <div className="text-3xl font-light text-tan-100/70 self-center flex items-center justify-center py-52">No plants</div>
                )}
    
            </ScrollContainer>
        </PageTemplate>
        
    )
}
