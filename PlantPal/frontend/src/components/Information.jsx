import api from "../utils/axios.js";
import { getAge, WATER_THRESHOLD } from '../utils/common.js';

// Components
import { Button } from '../components/Interactive.jsx'
import { PlantProfile } from '../components/PlantProfile.jsx'
import { Link } from 'react-router-dom';
import { usePlants } from "../components/PlantsProvider.jsx";


// Icons
import { FiArrowRight } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosWater } from "react-icons/io";



// Hooks
import { useState, useEffect, useRef } from 'react';


export const Statistic = (props) => {
    return (
        <div className={`flex flex-col justify-center items-center gap-2 py-2 px-4 rounded-2xl ${props.style}`}>
            <h3 className="text-sm sm:text-base opacity-90">{props.name}</h3>
            <h2 className="text-xl sm:text-xl font-bold">{props.value}</h2>
        </div>
    )
}

export const MessageBox = (props) => {

    const [expanded, setExpanded] = useState(false);    

    return (
        <div className="snap-start relative min-w-[250px] max-w-[450px] shadow-lg bg-tan-100/80 backdrop-blur-sm text-zuccini-950 rounded-3xl transition-all duration-100">
            <div onClick={(event) => setExpanded(!expanded)} className="cursor-pointer flex p-4 justify-left items-center gap-4">
                { props.children}
                <div className="flex-1 flex flex-col justify-around items-start">
                    <h2 className="font-semibold">{props.header}</h2>
                    <p className={`opacity-90 ${expanded ? "" : "line-clamp-1"} `}>{props.body}</p>
                </div>
            </div>
            {props.deletable && (
                <div onClick={props.onDelete} className="cursor-pointer absolute right-3 top-3 size-[25px] hover:bg-gray-400/20 rounded-full flex justify-center items-center">
                    <RxCross2 className="size-[75%]"/>
                </div>
            )}
        </div>
    )
}

export const InfoCard = (props) => {
    const { visitPlant } = usePlants();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            // Add the 'no-scroll' class to the body when the modal is open
            document.body.classList.add('overflow-hidden');
        } else {
            // Remove the 'no-scroll' class when the modal is closed
            document.body.classList.remove('overflow-hidden');
        }

        // Cleanup when the component is unmounted or modal state changes
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isModalOpen]);

    const handleOpenModal = () => {
        visitPlant(props.plant.plant_id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    function waterPlant() {
        api.get(`/plants/${props.plant.plant_id}/water`)
        .then(res => {
            props.onWater();
        })
        .catch(error => console.log(error));
        
    }

    return (
        <div onClick={handleOpenModal} className="cursor-pointer hover:scale-[102%] no-hover:hover:scale-100 opacity-95 hover:opacity-100 hover:ring-1 ring-tan-100/50 hover:bg-zuccini-900 hover:text-tan-100 no-hover:hover:text-zuccini-900 no-hover:hover:bg-tan-100 text-zuccini-900 bg-tan-100 shadow-md rounded-2xl h-[16rem] aspect-[2/3] flex flex-col transition-all">
            <div className="relative w-full aspect-square flex justify-center items-center">
                <img
                    src={`/plants/${props.plant.image}`}
                    alt={props.plant.name}
                    className="ring-tan-100/50 m-auto size-[90%] object-cover rounded-xl border shadow-inner border-tan-100/10"
                />
            </div>
            <div className="p-4 flex flex-col justify-start flex-grow gap-1">
                <div className="flex justify-between items-center gap-2 text-nowrap">
                    <h3 className="text-lg font-semibold">{props.plant.name}</h3>
                    <p className="text-sm opacity-90">{props.sub}</p>
                </div>
                <div className="flex justify-between items-center gap-2 text-nowrap">
                    <h5 className="opacity-90">{`${getAge(props.plant.created_at)} days`}</h5>
                    { props.lastWatered > WATER_THRESHOLD && <IoIosWater className="size-4"/>}
                </div>
            </div>

            {isModalOpen && <PlantProfile lastWatered={props.lastWatered} waterPlant={waterPlant} onClose={handleCloseModal} plant={props.plant} sub={`${getAge(props.plant.created_at)} days`} />}
        </div>
    )
}

export const InfoTag = (props) => {
    return (
        <div className={`rounded-lg border ${props.color || "bg-zuccini-800"} text-tan-100 ${props.opacity || "opacity-70"} hover:opacity-90 transition-all px-2 py-1 text-lg`}>
            { props.text }
        </div>
    )
}
 