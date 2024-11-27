import api from "../utils/axios.js";

// Components
import { Button } from '../components/Interactive.jsx'
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';

// Icons
import { MdAccountCircle } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { PiPlantFill, PiGraph } from "react-icons/pi";
import { FaCircleArrowLeft } from "react-icons/fa6";



export function Background(props) {
    return (
        <div id="background" className="relative w-screen h-screen min-w-[375px] min-h-[650px] overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-mountains filter brightness-[0.7]"></div>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-zuccini-950/90 via-zuccini-900/10 via-50%">
                {props.children}
            </div>
        </div>
    )
}

const Header = ({headerText, showProfile}) => {
    
    function triggerLogout(event)  {
        event.preventDefault();
        api.get("/logout").then((res) => {
            window.location.href = "/login";
        }).catch(err => {
            console.log("Failed to logout.");
        });
    }
    
    return (
        <div className="w-full h-full justify-between items-center flex gap-4 text-tan-100">
            <Link to="/" className="z-[100] bg-zuccini-950 py-2 pl-3 pr-6 rounded-r-full drop-shadow-sm w-fit text-5xl font-semibold select-none flex justify-center gap-2 items-start">
                {headerText}
            </Link>
        {showProfile ? (
            <button onClick={triggerLogout} className="rounded-l-full bg-zuccini-950 size-16 flex justify-center items-center">
                <IoMdLogOut className="p-2 w-full h-full drop-shadow-sm" />
            </button>
        ) : null}
        </div>
    )
}

export const Navigation = (props) => {
    return (
        <div className="z-[100] w-full h-full text-tan-100/90 px-10 py-2 flex justify-center items-center gap-12">
            {props.children}
        </div>
    )
}

export const BackHome = () => {
    return (
        <>
            {/* <Button href="/plants" subText="Plants" buttonStyle={"pt-3 size-[5rem] bg-gray-100"}>
                <PiPlantFill className="scale-[3]" />
            </Button> */}
            <Button href="/" buttonStyle={"drop-shadow-sm size-[5rem]"}>
                <FaCircleArrowLeft className="scale-[4]" />
            </Button>
            {/* <Button href="/stats" subText="Stats" buttonStyle={"pt-3 size-[5rem] bg-gray-100"}>
                <PiGraph className="scale-[3]" />
            </Button> */}
        </>
    )
}

export function PageTemplate(props) {
    return (
        <Background>
            <div className="w-full h-full py-2">
                <div className="w-full h-[10%]">
                    <Header headerText={props.headerText} showProfile={props.showProfile}></Header>
                </div>
            { props.navButtons ? ( <>
                <div className="w-full h-[80%]">
                    {props.children}
                </div>
                <div className="w-full h-[10%]">
                    <Navigation>
                        {props.navButtons}
                    </Navigation>
                </div> </>) : (
                <div className="w-full h-[90%]">
                    {props.children}
                </div>
                ) }
            </div>
        </Background>
    )
}

export function ScrollContainer(props) {
    return (
        <div className={`border border-white/20 bg-gradient-to-tr from-gray-600/20 to-tan-100/20 p-2 rounded-3xl scrollbar-hide shadow-lg w-full h-full ${props.style} overflow-x-auto snap-y scroll-p-2`}>
            {props.children}
        </div>
    )
}

export function Modal(props) {
    return (
        <>
        {createPortal(
            <>
                <div className="cursor-default fixed inset-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-20 z-[101]" onClick={props.onClose}>
                    {props.children}
                </div>
            </>,
            document.getElementById("background")
          )}
        </>
    )
}