// Components
import { PageTemplate } from '../components/Structure.jsx'
import { Link } from 'react-router-dom';

// Hooks

// Icons
import { MdWifiOff } from "react-icons/md";

export default function Offline() {
    return (
        <PageTemplate headerText="Offline" >
            <div className="flex flex-col gap-4 justify-center items-center w-full h-3/4 text-white text-3xl font-semibold">
                <MdWifiOff className="size-24 drop-shadow-lg text-base"/>
                <div className="w-3/4 text-center font-base drop-shadow-lg">
                    Please check your internet connection
                </div>
                <Link to="/" className="mt-4 bg-tan-100 text-zuccini-950 rounded-lg px-2 py-1 shadow-lg">Home</Link>
            </div>
            
        </PageTemplate>
        
    )
}
