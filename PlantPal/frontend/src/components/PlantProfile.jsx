import api from "../utils/axios";
import { formatDate, getAge, WATER_THRESHOLD } from "../utils/common";

// Components
import { Modal, ScrollContainer } from "./Structure"
import { InfoTag, MessageBox } from "./Information"
import { InteractiveMetric } from "./Interactive"


// Icons
import { RxCross2 } from "react-icons/rx";
import { IoIosWater } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoNotifications, IoRainy, IoSunny } from "react-icons/io5";
import { BiTestTube } from "react-icons/bi";
import { LiaTemperatureLowSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";



// Hooks
import { useState, useEffect, useRef } from 'react';


export const PlantProfile = (props) => {

    const [info, setInfo] = useState("");
    const [journal, setJournal] = useState(null);
    const [measurements, setMeasurements] = useState(null);

    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const [successMessage, setSuccessMessage] = useState(""); // Success message state

    function getJournal() {
        api.get(`/plants/${props.plant.plant_id}/journal`)
        .then(res => {setJournal(res.data);})
        .catch(error => {
            console.log("Error fetching journal:", error);
        });
    }
    
    const handleClose = (event) => {
        event.stopPropagation();
        props.onClose();
    };
    
    const [showInfo, setShowInfo] = useState(false);
    
    const showInfoBox = () => {
        setShowInfo(true);
    };
    
    const hideInfoBox = () => {
        setShowInfo(false);
    };
    
    function getCurrentMeasurement(name, fallback) {
        if (measurements && measurements[name].length > 0) {
            return parseFloat(measurements[name][0].value);
        }
        return parseFloat(fallback);
    }
    
    const journalRef = useRef(null);
    
    function postJournal() {
        const inputValue = journalRef.current?.value;
        if (inputValue) {
            api.post(`/plants/${props.plant.plant_id}/journal`, { content: inputValue.trim() })
            .then((res) => {
                journalRef.current.value = "";
                getJournal();
            });
        }
    }

    useEffect(() => {
        getJournal();
        api.get(`/plants/${props.plant.plant_id}/info`)
            .then(res => {setInfo(res.data);})
            .catch(error => {
                console.info("Error fetching info:", error);
            });
        api.get(`/plants/${props.plant.plant_id}/measurements`)
            .then(res => {setMeasurements(res.data);})
            .catch(error => {
                console.info("Error fetching measurements:", error);
        });
    }, []);

    const [promptDelete, setPromptDelete] = useState(false);

    function deletePlant(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Deleting plant: " + props.plant.plant_id);
        api.delete(`/plants/${props.plant.plant_id}`)
            .then((res) => {
                setSuccessMessage(`${props.plant.name} successfully deleted.`);
                console.log(res);
                setPromptDelete(false);
                window.location.reload();
            })
            .catch(error => {
                setErrorMessage(`Error deleting ${props.plant.name}.`);
                console.info("Error deleting plant:", error);
            });
    }
    
    return (
        <Modal onClose={handleClose}>
            <div onClick={(event) => event.stopPropagation()} className="bg-gradient-to-t from-tan-200 to-tan-100 cursor-default scrollbar-hide rounded-xl fixed inset-0 m-auto z-[102] w-[90%] max-w-[1000px] h-[90%] shadow-lg overflow-y-scroll">
                {successMessage && (
                    <div className="bg-green-500 p-2 rounded mb-4">
                        {successMessage}
                    </div>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className="bg-red-500 p-2 rounded mb-4">
                        {errorMessage}
                    </div>
                )}
                {/* Header */}
                <div className="sticky top-0 backdrop-blur-sm bg-tan-100/80 z-[100]">
                    <button onClick={handleClose} className="absolute top-5 right-5 text-3xl font-semibold text-zuccini-950/90">
                        <RxCross2 className=""/>
                    </button>
                    <div className="w-full h-[10%] text-zuccini-950 flex items-center gap-2 justify-start p-4">
                        <h1 className='text-3xl'>{props.plant.name}</h1>
                        <h3 className='text-xl text-zuccini-900 font-light border-l border-l-zuccini-900 px-2 mt-1'>{props.sub}</h3>
                    </div>
                </div>
                {/* Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-5 px-10">
                    
                    {/* Image + Tags */}
                    <div className="flex flex-col gap-2 items-center justify-center w-full max-w-[400px] mx-auto px-2">
                        <div className="w-full mx-auto">
                            <img src={`/plants/${props.plant.image}`} className="w-full rounded-xl object-cover"></img>
                        </div>
                        <div className="relative flex gap-4 w-full overflow-hidden rounded">
                            <div className="flex gap-1 w-full animate-marquee whitespace-nowrap scrollbar-hide rounded-md">
                                { props.plant.tags?.map((tag, index) => (
                                    <InfoTag key={index} text={tag} />
                                ))}
                                {/* Duplicate for animation */}
                                { props.plant.tags?.map((tag, index) => (
                                    <InfoTag key={index} text={tag} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tracking */}
                    <div className="flex flex-col items-center justify-center gap-2 text-zuccini-900">
                        <h4 className="py-1 relative self-start text-xl font-light text-zuccini-90 border-b-zuccini-900 border-b">Recommendations</h4>
                        <div className="mt-2 flex gap-8 items-center justify-center">
     
                            <div className="relative group flex flex-col items-center">
                                <div className="size-10 flex justify-center items-center">
                                    <IoSunny className="size-9 text-yellow-600"/>
                                </div>    
                                <p className="text-[1.15rem] text-gray-800 font-semibold">{props.plant.sun} <span className="font-extralight">hrs</span></p>
                                <span className="z-[200] absolute text-nowrap top-full opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-gray-800 text-white rounded-md px-2 py-1 shadow-md">
                                    per day
                                </span>
                            </div>

                            <div className="relative group flex flex-col items-center">
                                <div className="size-10 flex justify-center items-center">
                                    <LiaTemperatureLowSolid className="size-9 text-red-700"/>
                                </div>    
                                <p className="text-[1.15rem] text-gray-800 font-semibold">{props.plant.temp} <span className="font-extralight">°F</span></p>
                                <span className="z-[200] absolute text-nowrap top-full opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-gray-800 text-white rounded-md px-2 py-1 shadow-md">
                                    year-round
                                </span>
                            </div>

                           <div className="relative group flex flex-col items-center">
                                <div className="size-10 flex justify-center items-center">
                                    <BiTestTube className="size-8 text-brown-600"/>
                                </div>
                                <p className="text-[1.15rem] text-gray-800 font-semibold">{props.plant.soil} <span className="font-extralight">ph</span></p>
                                <span className="z-[200] absolute text-nowrap top-full opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-gray-800 text-white rounded-md px-2 py-1 shadow-md">
                                    year-round
                                </span>
                            </div>

                            <div className="relative group flex flex-col items-center">
                                <div className="size-10 flex justify-center items-center">
                                    <IoIosWater className="size-[1.85rem] text-blue-600"/>
                                </div>
                                <p className="text-[1.15rem] text-gray-800 font-semibold">{Number(props.plant.water).toFixed(1)} <span className="font-extralight">in</span></p>
                                <span className="z-[200] absolute text-nowrap top-full opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-gray-800 text-white rounded-md px-2 py-1 shadow-md">
                                    per week
                                </span>
                            </div>

                        </div>
                        <h4 className="py-1 relative self-start text-xl font-light text-zuccini-90 border-b-zuccini-900 border-b">Tracking</h4>
                        {measurements && (
                            <div className="lg:px-8 w-full mt-2 grid grid-cols-2 gap-y-3 gap-x-8">
                                <InteractiveMetric plant={props.plant} name="Height" unit="cm" value={getCurrentMeasurement('heightData', 0)} step={1} max={500}/>
                                <InteractiveMetric plant={props.plant} name="Soil" unit="ph" value={getCurrentMeasurement('soilData', props.plant.soil)} step={0.1} max={14.0}/>
                                <InteractiveMetric plant={props.plant} name="Leaves" unit="ct" value={getCurrentMeasurement('leafData', 0)} step={1} max={100}/>
                                <InteractiveMetric plant={props.plant} name="Fruit" unit="ct" value={getCurrentMeasurement('fruitData', 0)} step={1} max={100}/>
                                <div className="col-span-2">
                                    <h4 className="text font-light">Last Watered</h4>
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                                        <h4 className="text-xl text-center py-2 px-4 rounded-lg font-light border border-dashed border-zuccini-950 "><span className="font-semibold">{props.lastWatered}</span> day(s)</h4>
                                        <button onClick={props.waterPlant} className="relative flex gap-2 items-center justify-center text-xl font-light bg-zuccini-900 text-tan-100 h-full py-[0.6rem] px-4 rounded-lg active:bg-zuccini-950">
                                            <IoIosWater /> Water
                                            {props.lastWatered > WATER_THRESHOLD ? 
                                                (<div className="absolute animate-bounce text-2xl -top-2 -right-2 text-tan-100 rounded-full bg-zuccini-950">
                                                    <RiErrorWarningFill />
                                                </div>) : ""}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Journal */}
                    <div className="w-full mb-10 flex flex-col items-center md:col-span-2">
                        <h4 className="self-start py-1 text-xl font-light text-zuccini-900 border-b-zuccini-900 border-b w-fit">Journal</h4>
                        <div className="p-1 mt-4 flex flex-wrap justify-center items-center gap-2 mx-auto">
                            {/* New Journal entry */}
                            <div className="snap-start relative w-full min-w-[250px] max-w-[450px] shadow-lg h-20 bg-tan-100/80 backdrop-blur-sm text-zuccini-950 rounded-3xl transition-all duration-100">
                                <div className="flex px-4 py-3 justify-left items-center gap-4">
                                    <div className="flex-1 flex flex-col justify-around items-start">
                                        <h2 className="font-semibold">Today</h2>
                                        <div className="w-full flex gap-2">
                                            <input ref={journalRef} className="p-1 rounded-none bg-transparent border-b border-zuccini-900 w-full h-full"/>
                                            <button onClick={postJournal} className="p-1 rounded-full hover:bg-gray-800/10">
                                                <FaCheck />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Existing Journal entries */}
                            { (journal && journal.length > 0) ? journal.map((journalEntry, index) => (
                                <MessageBox key={index} header={formatDate(journalEntry.time)} body={journalEntry.content} />
                            )) : (<h4 className="text-zuccini-950/80 p-2 mt-2 font-extralight">Your <span className="font-medium">{props.plant.name.toLowerCase()}</span> plant doesn't have any journal entries, consider adding one above!</h4>)}
                        </div>
                    </div>
                </div>

                {/* DELETE PLANT OPTION */}
                {promptDelete ? (
                    <div className="flex flex-col gap-2 items-center justify-center text-red-600 font-extralight text-lg w-fit mx-auto col-span-2">
                        <p>This action is permanent</p>
                        <div className="flex gap-6">
                            <div onClick={() => setPromptDelete(false)} className="cursor-pointer flex justify-center items-center bg-slate-600 p-3 rounded-full text-white">
                                <RiArrowGoBackLine className="text-2xl"/>
                            </div>
                            <div onClick={deletePlant} className="cursor-pointer flex justify-center items-center bg-red-600 p-3 rounded-full text-white">
                                <MdDelete className="text-2xl"/>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div onClick={() => setPromptDelete(true)} className="cursor-pointer text-lg font-light text-red-600 w-fit mx-auto px-2 mb-10 col-span-2">
                        Delete <span className="font-semibold">{props.plant.name}</span>
                    </div>
                )}

                <div className="sticky w-fit left-full right-0 bottom-0 p-2 flex justify-end items-center text-zuccini-950 ">
                    <button onClick={(event) => {event.stopPropagation(); showInfoBox()}} className="opacity-90 transition-all hover:opacity-100">
                        <BsInfoCircleFill className="size-8" />
                    </button>
                </div>
            </div>

            {/* Info Box */}
            { showInfo && (
                <div onClick={(event) => {event.stopPropagation(); hideInfoBox()}} className="z-[200] bg-gradient-to-t from-tan-200 to-tan-100 absolute inset-0 w-[90%] max-w-[1000px] h-[90%] shadow-lg m-auto rounded-xl scrollbar-hide overflow-y-scroll">
                    <p className="text-lg text-zuccini-950 p-8">
                        {info ? info.info : "Loading..."}
                    </p>
                </div> 
            )}
        </Modal>
    )
}