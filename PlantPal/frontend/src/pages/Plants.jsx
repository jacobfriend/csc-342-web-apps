import api from "../utils/axios";

import { getCountString, getAge, getLastWatered, WATER_THRESHOLD } from '../utils/common.js';


// Components
import { InfoCard } from '../components/Information.jsx'
import { PageTemplate, BackHome, ScrollContainer } from '../components/Structure.jsx'
import { Button } from '../components/Interactive.jsx'
import { Link } from 'react-router-dom';

import { usePlants } from "../components/PlantsProvider.jsx";

// Hooks
import { useState, useEffect, useContext } from 'react';

// Icons

export default function Plants() {
    return (
        <PageTemplate headerText="Your Plants" navButtons={<BackHome />}>
            <div className="w-full h-full py-2">
                <PlantCards />
            </div>
        </PageTemplate>
    )
}


const PlantCards = () => {
    const { plants, updateLastWatered } = usePlants();
    
    const [filteredPlants, setFilteredPlants] = useState(null);
    
    const filterOptions = ['all', 'new', 'vegetables', 'flowers', 'edible', 'needs water'];
    const [filter, setFilter] = useState('all');

    const [search, setSearch] = useState("");

    
    useEffect(() => {
        // Filter plants whenever `plants` or `filter` or `search` changes
        if (plants) {
            const filteredPlants = plants.filter(plant => {
                if (filter === 'all') return true;
                if (filter === 'new') return  getAge(plant.created_at) <= 21; // 3 Weeks
                if (filter === 'vegetables') return plant.tags.includes("Vegetable");
                if (filter === 'flowers') return plant.tags.includes("Flower");
                if (filter === 'edible') return plant.tags.includes("Edible");
                if (filter === 'needs water') return getLastWatered(plant) > WATER_THRESHOLD;
                return true;
            });
            if (search) {
                setFilteredPlants(filteredPlants.filter((plant => {return plant.name.toLowerCase().includes(search.toLowerCase())})));
            } else {
                setFilteredPlants(filteredPlants);
            }
        }
    }, [ plants, filter, search ]);
    
    return (
        <div className="flex w-full h-full flex-col items-center gap-2">
            <div className="flex gap-2">
                <select
                    id="filter"
                    className="block p-1 border border-zuccini-900 bg-tan-100 shadow-sm font-semibold text-zuccini-950 rounded-xl text-center text-xl"
                    value={filter}
                    onChange={(e) => {setFilter(e.target.value)}}
                    >
                    {filterOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                    ))}
                </select>

                <input
                    id="search"
                    className="placeholder-zuccini-950/60 block p-1 border max-w-48 border-zuccini-900 bg-tan-100 shadow-sm font-semibold text-zuccini-950 rounded-xl text-center text-xl"
                    value={search}
                    placeholder="Find by name..."
                    autoComplete="off"
                    onChange={(e) => {setSearch(e.target.value)}}
                />
            </div>

            <ScrollContainer style="max-w-[98%]">
                <div className="w-full py-2 flex flex-wrap gap-2 content-start justify-center">
                    {filteredPlants && filteredPlants.length > 0 ? filteredPlants.map((plant) => (
                        <InfoCard
                        key={plant.plant_id}
                        plant={plant}
                        sub={getCountString(plants, plant)}
                        lastWatered={getLastWatered(plant)} onWater={() => updateLastWatered(plant.plant_id)}
                        />
                    )) : <div className="text-3xl font-light text-tan-100/70 self-center flex items-center justify-center py-52">No plants</div> }
                </div>
            </ScrollContainer>
        </div>
    );


}