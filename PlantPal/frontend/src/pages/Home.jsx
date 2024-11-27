import api from "../utils/axios";
import axios from "axios";

import { getCountString, getLastWatered } from '../utils/common.js';
import { usePlants } from "../components/PlantsProvider.jsx";


// Components
import { Statistic, MessageBox, InfoCard } from '../components/Information.jsx'
import { Button } from '../components/Interactive.jsx'
import { PageTemplate, ScrollContainer } from '../components/Structure.jsx'
import { Link } from 'react-router-dom';

// Hooks
import { useState, useEffect, useContext } from 'react';

// Assets
import profileImage from '../assets/images/profile.webp';

// Icons
import { MdAdd } from "react-icons/md";
import { PiPlantFill, PiGraph } from "react-icons/pi";
import { AiOutlineNotification } from "react-icons/ai";
import { IoNotifications, IoRainy, IoSunny } from "react-icons/io5";
import { FaLightbulb } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";
import { IoMdCreate } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";


export default function Home() {
    
    const [weather, setWeather] = useState({
        temp: null,
        rain: null,
        wind: null,
    });
    
    useEffect(() => {
        fetch('https://api.weather.gov/gridpoints/RAH/75,57/forecast')
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch weather data");
                }
                return res.json();
            })
            .then((data) => {
                const firstPeriod = data.properties.periods[0];
                const updatedWeather = {
                    temp: firstPeriod.temperature,
                    rain: firstPeriod.probabilityOfPrecipitation.value,
                    wind: firstPeriod.windSpeed,
                };
                setWeather(updatedWeather);
            })
            .catch((error) => {
                console.error("Error fetching weather data:", error);
            });
    }, []);

    const navButtons = (
        <>
            <Button href="/plants" subText="Plants" buttonStyle={"pt-3 size-[5rem] bg-gray-100"}>
                <PiPlantFill className="scale-[3]" />
            </Button>
            <Button href="/create" buttonStyle={ "bg-gray-100"}>
                <IoAddCircle className="size-[5rem]" />
            </Button>
            <Button href="/stats" subText="Stats" buttonStyle={"pt-3 size-[5rem] bg-gray-100"}>
                <PiGraph className="scale-[3]" />
            </Button>
        </>
    )

    return (
        <PageTemplate headerText="PlantPal" showProfile={true} navButtons={navButtons}>
            <Top weather={weather} />
            <Bottom />
        </PageTemplate>
    )
}

function Top({ weather }) {
    return (
        <div className='relative flex flex-col w-full h-[45%] items-center justify-start gap-2'>
                <div className="w-fit h-full flex gap-4">
                    <RecentPlants />
                    <Conditions weather={weather} />
                </div>
            </div>
    )
}

function Bottom(props) {
    return (
        <div className="relative flex flex-col justify-between gap-4 items-center p-4 w-full h-[55%]">
            <Alerts />
        </div>
    )
}



const Conditions = ({ weather }) => {
    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <Statistic 
                name="Temp"
                value={`${weather.temp} F°` ?? "Loading..."} 
                style="text-zuccini-950 bg-tan-100/60 backdrop-blur-md shadow-md border border-white/30" />
            <Statistic 
                name="Rain"
                value={weather.rain === null ? "0%" : `${weather.rain}%` ?? "Loading..."}
                style=" text-zuccini-950 bg-tan-100/60 backdrop-blur-md shadow-md border border-white/30" />
            <Statistic 
                name="Wind"
                value={weather.wind ?? "Loading..."}
                style="text-zuccini-950 bg-tan-100/60 backdrop-blur-md shadow-md border border-white/30 text-center" />
        </div>
    )
}

const RecentPlants = () => {

    const { plants, updateLastWatered } = usePlants();

    // State to control whether the second card is visible
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Effect to watch for screen size changes
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Listen for resize event
        window.addEventListener('resize', handleResize);

        // Clean up event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="p-2 w-full flex justify-center items-center gap-4">
            { plants && plants.length > 0 && plants.slice(0, isMobile ? 1 : 2).map((plant) => (
                    <InfoCard key={plant.plant_id} plant={plant} sub={getCountString(plants, plant)} lastWatered={getLastWatered(plant)} onWater={() => updateLastWatered(plant.plant_id)} />
                )) || (
                    <Link to="/create" className="backdrop-blur-md font-light text-xl cursor-pointer hover:bg-zuccini-900 hover:text-tan-100 text-zuccini-900/70 bg-tan-100/40 shadow-md rounded-2xl h-[16rem] aspect-[2/3] border border-tan-100/20 transition-all p-4">
                        You have no plants, press the <IoAddCircle className="inline align-middle size-6"/> below to start your gardening journey!
                    </Link>
                )}
        </div>
    )
}

const Alerts = (props) => {

    const [messageBoxes, setMessageBoxes] = useState([
        {
          deletable: true,
          header: "Tomato",
          body: "This plant needs water (100ml)",
          icon: <IoIosWater className="flex-none text-blue-400 size-[40px]" />,
        },
        {
          deletable: true,
          header: "Storm",
          body: "Adverse weather this weekend (10/7). This is an example of overflowing text.",
          icon: <IoRainy className="flex-none text-gray-400 size-[40px]" />,
        },
        {
          deletable: true,
          header: "Sun",
          body: "Make sure to water your plants often",
          icon: <IoSunny className="flex-none text-yellow-500 size-[40px]" />,
        },
        {
          deletable: true,
          header: "Sun",
          body: "Make sure to water your plants often your plants often",
          icon: <IoSunny className="flex-none text-yellow-500 size-[40px]" />,
        },
        {
          deletable: true,
          header: "Notification",
          body: "Example of a plant notification or reminder here.",
          icon: <IoNotifications className="flex-none text-gray-600 size-[35px]" />,
        },
        {
          deletable: true,
          header: "Notification",
          body: "Example of a plant notification or reminder here.",
          icon: <IoNotifications className="flex-none text-gray-600 size-[35px]" />,
        },
    ]);

    const [notifications, setNotifications] = useState([]);

    // Load the notifications from localStorage when the component mounts
    useEffect(() => {
        api.get("/notifications")
            .then((res) => {
                setNotifications(res.data);
            })
            .catch((err) => {
                console.log("Error fetching notifications " + err);
            });
    }, []);
    
    function deleteMessage(index) {
        api.delete(`/notifications/${index}`)
        .then((res) => {
            setNotifications(res.data);
        })
        .catch((err) => {
            console.log("Error deleting notification " + err);
        });
    }

    return (
        <ScrollContainer style="max-w-[90%]">
            <div className="w-full flex flex-wrap p-2 gap-4 gap-y-2 justify-center items-center content-start rounded-m">
                {notifications.length > 0 && notifications.map((message, index) => (
                    <MessageBox
                        key={index}
                        deletable={true}
                        onDelete={(e) => deleteMessage(index)}
                        header={message.title}
                        body={message.body}
                        >
                        <IoIosWater className="flex-none text-blue-400 size-[40px]" />
                    </MessageBox>
                )) || (
                    <div className="font-light text-tan-100/70 text-2xl w-full py-28 text-center">
                        No notifications
                    </div>
                )}
            </div>
        </ScrollContainer>
    )
}