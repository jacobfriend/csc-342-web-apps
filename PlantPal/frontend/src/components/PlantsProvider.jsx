import { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/axios";

const PlantsContext = createContext();

export const usePlants = () => {
    return useContext(PlantsContext);
};

export const PlantsProvider = ({ children }) => {
    const [plants, setPlants] = useState(null);

    const fetchPlants = () => {
        api.get("/plants")
            .then((res) => setPlants(res.data))
            .catch((error) => console.error("Error fetching plants:", error));
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    function updateLastWatered(id) {
        setPlants((prevPlants) =>
            prevPlants.map((plant) =>
                plant.plant_id === id
                    ? { ...plant, last_watered: new Date().toISOString() }
                    : plant
            )
        );
    };

    function visitPlant(id) {
        setPlants((prevPlants) => {
            // Find the plant by its id
            const plantIndex = prevPlants.findIndex((plant) => plant.plant_id === id);

            if (plantIndex === -1) return prevPlants; // If the plant doesn't exist, return the previous array unchanged

            const updatedPlants = [...prevPlants]; // Make a shallow copy of the plants array
            const [visitedPlant] = updatedPlants.splice(plantIndex, 1); // Remove the plant from its current position
            updatedPlants.unshift(visitedPlant); // Add the plant to the front of the array

            return updatedPlants;
        });
    }

    return (
        <PlantsContext.Provider value={{ plants, updateLastWatered, visitPlant}}>
            {children}
        </PlantsContext.Provider>
    );
};