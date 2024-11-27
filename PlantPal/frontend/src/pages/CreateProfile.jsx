// Components
import { PageTemplate, BackHome } from '../components/Structure.jsx'
import { Button } from '../components/Interactive.jsx'

// Hooks
import api from "../utils/axios";
import { useState, useEffect } from 'react';

export default function CreateProfile() {

    const [data, setData] = useState(null);
    useEffect(() => {
        api.get('/templates')
            .then((res) => {
                setData(res.data);
            })
            .catch(err => {
                console.log(err)
            });
    }, []);

    const [plant, setPlant] = useState(null);

    // Local state for name if new plant
    const [localName, setLocalName] = useState(plant?.name || '');
    const [localWater, setLocalWater] = useState(plant?.water || '');
    const [localSoil, setLocalSoil] = useState(plant?.soil || '');
    const [localSun, setLocalSun] = useState(plant?.sun || '');
    const [localTemp, setLocalTemp] = useState(plant?.temp || '');
    const [localInfo, setLocalInfo] = useState(plant?.temp || '');

    const [previewImage, setPreviewImage] = useState(null); // State for preview image URL

    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const [successMessage, setSuccessMessage] = useState(""); // Success message state

    const NEW_PLANT_ID = 999;

    useEffect(() => {
        // When a new plant is selected, initialize local name and water
        if (plant?.id === NEW_PLANT_ID) {
            setLocalName(plant.name);
            setLocalSoil(plant.soil);
        }
    }, [plant]);
    
    if (data) {
        
        
        const newPlantHandler = async (event) => {
            event.preventDefault();
          
            setErrorMessage("");
            setSuccessMessage("");
          
            try {
              let newPlant = plant; // Default to the current plant
          
              // If the current plant is the new plant template, create a new template
              if (plant.id === NEW_PLANT_ID) {
                const formData = new FormData();
                formData.append("name", localName);
                formData.append("water", localWater);
                formData.append("sun", localSun);
                formData.append("soil", localSoil);
                formData.append("temp", localTemp);
                formData.append("info", localInfo);
                formData.append("tags", null);
                if (plant.image) {
                  formData.append("image", plant.image);
                }
          
                const templateResponse = await api.post(`/templates`, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });
          
                if (templateResponse.status === 201) {
                  newPlant = templateResponse.data; // Update newPlant with the response data
                  setSuccessMessage(`${localName} template successfully added!`);
                } else {
                  setErrorMessage("Failed to create new plant template. Please try again.");
                  return; // Exit on failure to create template
                }
              }
          
              // Post the plant to /plants
              const plantResponse = await api.post(`/plants`, { plant: newPlant });
          
              if (plantResponse.status === 201) {
                setSuccessMessage(`${newPlant.name} successfully added!`);
              } else {
                setErrorMessage("Failed to add the plant. Please try again.");
              }
          
              // Update the state to reflect the new plant and redirect
              setPlant(newPlant);
              setTimeout(() => {
                window.location.href = "/plants";
              }, 1000);
            } catch (error) {
              console.error(error);
              if (error.response) {
                setErrorMessage(error.response.data.error || "An error occurred. Please try again.");
              } else {
                setErrorMessage("An unexpected error occurred. Please try again later.");
              }
            }
          };          
                  

        const removeProfile = (event) => {
            event.preventDefault();
            api.delete(`/templates/${plant.name}`)
            .then((res) => {
                setSuccessMessage(`${plant.name} template successfully deleted.`);
                console.log(res);
                window.location.reload();
            })
            .catch(error => {
                setErrorMessage(`Error deleting ${plant.name} template.`);
                console.info("Error deleting plant:", error);
            });
        }
        
        const handleSelectChange = (value) => {
            if (value == "New Plant") {
                setPlant({
                    id: NEW_PLANT_ID,
                    name: "New Plant",
                    image: null,
                    water: 0,
                    sun: 0,
                    soil: 6.5,
                    temp: 0,
                    info: null,
                    tags: null
                });
                setPreviewImage(null);
                return;
            }
            const selectedPlant = data.find(plant => plant.name === value) || null;
            setPlant(selectedPlant);
            if (!value) {
                setPreviewImage(null); // reset to blurred image
            } else {
                setPreviewImage(`/plants/${selectedPlant.image}`);
            }
        };

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            const validTypes = ["image/png", "image/jpeg", "image/jpg"];
            if (file) {

                // Check if the file type is valid
                if (!validTypes.includes(file.type)) {
                    alert("Please upload a valid PNG or JPG image.");
                    return;
                }

                // Create a preview URL
                plant.image = file;
                const previewURL = URL.createObjectURL(file);
                setPreviewImage(previewURL);
            }
        };

        const isNewPlant = plant?.id === NEW_PLANT_ID;

        return (
            
            <PageTemplate headerText="New Plant" navButtons={<BackHome />}>
                <div className="flex flex-col gap-4 justify-center items-center text-white">
                    {/* Success message */}
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
                </div>
                <div className="mx-auto w-[75%] h-full max-w-96 flex flex-col items-center justify-start gap-4 overflow-scroll scrollbar-hide">
                    {
                        <PlantImagePreview plant={plant} previewImage={previewImage} />
                    }                    
                    <form onSubmit={(event) => newPlantHandler(event)} className="flex flex-col justify-center items-center w-full gap-2">
                        {/* Select plant type */}
                        <select
                            id="plantName"
                            className="block p-1 border border-zuccini-900 bg-tan-100 shadow-sm font-semibold text-zuccini-950 rounded-xl text-center text-xl"
                            value={plant?.name || ""}
                            onChange={(e) => handleSelectChange(e.target.value)}
                        >
                            <option value="">Select Type</option>
                            <option value="New Plant">New Plant Type</option>
                            {data.map((option, index) => (
                                <option key={index} value={option.plantName}>
                                    {option.name}
                                </option>
                            ))}
                        </select>

                        {plant === null ? 
                            <div className="text-tan-100 pt-10 text-xl text-center font-bold p-2 rounded mb-4"> Select a plant to add to your garden! </div> 
                            : null 
                        }
                        
                        {plant && (
                            <>
                                <TextField
                                    label="Name"
                                    formId="name"
                                    value={plant.id === NEW_PLANT_ID ? localName : plant.name}
                                    isEditable={isNewPlant}
                                    onChange={(e) => {
                                            (plant.id === NEW_PLANT_ID) ?
                                            setLocalName(e.target.value)
                                            :
                                            setPlant((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                    }
                                />
                                <InputField
                                    label="Water"
                                    formId="water"
                                    units="inches per week"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={plant.id === NEW_PLANT_ID ? localWater : plant.water}
                                    isEditable={isNewPlant}
                                    onChange={(e) => {
                                            (plant.id === NEW_PLANT_ID) ? 
                                            setLocalWater(e.target.value)
                                            :
                                            setPlant((prev) => ({ ...prev, water: e.target.value }))
                                        }
                                    }
                                />
                                <InputField
                                    label="Sunlight"
                                    formId="sunlight"
                                    units="hours per day"
                                    min="0"
                                    max="24"
                                    step="1"
                                    value={plant.id === NEW_PLANT_ID ? localSun : plant.sun}
                                    isEditable={isNewPlant}
                                    onChange={(e) => {
                                            (plant.id === NEW_PLANT_ID) ? 
                                            setLocalSun(e.target.value)
                                            :
                                            setPlant((prev) => ({ ...prev, sun: e.target.value }))
                                        }
                                    }
                                />
                                <InputField
                                    label="Soil Quality"
                                    formId="soil"
                                    units="pH"
                                    min="5"
                                    max="9"
                                    step="0.1"
                                    value={plant.id === NEW_PLANT_ID ? localSoil : plant.soil}
                                    isEditable={isNewPlant}
                                    onChange={(e) => {
                                            (plant.id === NEW_PLANT_ID) ? 
                                            setLocalSoil(e.target.value)
                                            :
                                            setPlant((prev) => ({ ...prev, soil: e.target.value }))
                                        }
                                    }
                                />
                                <InputField
                                    label="Temperature"
                                    formId="climate"
                                    units="°F"
                                    min="32"
                                    max="100"
                                    step="1"
                                    value={plant.id === NEW_PLANT_ID ? localTemp : plant.temp}
                                    isEditable={isNewPlant}
                                    onChange={(e) => {
                                            (plant.id === NEW_PLANT_ID) ? 
                                            setLocalTemp(e.target.value)
                                            :
                                            setPlant((prev) => ({ ...prev, temp: e.target.value }))
                                        }
                                    }
                                />
                                {/* Plant Info + Image Upload --> Only available for new plant templates */}
                                {
                                    plant.name === "New Plant" ?
                                        <div>
                                            <label htmlFor="info" className="self-start text-lg font-semibold text-tan-100">
                                                More Information
                                            </label>
                                            <textarea
                                                id="info"
                                                className="w-full p-2 border border-zuccini-950 text-zuccini-950 bg-tan-100 rounded-lg text-lg font-semibold"
                                                rows="2" // Specifies the number of rows
                                                placeholder="Care tips and plant information"
                                                onChange={(e) => setLocalInfo(e.target.value)} />
                                            <div className="mt-4 flex items-center gap-4">
                                                {/* Hidden file input */}
                                                <input 
                                                    id="imageUpload" 
                                                    type="file" 
                                                    className="hidden"
                                                    accept="image/*"
                                                    required
                                                    onChange={handleImageUpload}
                                                />
                                                {/* Upload button */}
                                                <label htmlFor="imageUpload" required className="inline-flex text-center items-center px-6 py-2 bg-zuccini-700 text-tan-100 font-semibold rounded-lg cursor-pointer hover:bg-zuccini-800 transition duration-200 ease-in-out">
                                                    {plant.id === NEW_PLANT_ID ? "Select Plant Image" : "Change Plant Image"}
                                                </label>
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {/* Submit button */}
                                <button type="submit" className="mt-4 px-8 py-4 bg-zuccini-700 text-tan-100 text-lg rounded-lg hover:bg-zuccini-800 transition duration-200 ease-in-out font-semibold">
                                    { plant.name == "New Plant" ? "Add Plant & Create Template" : "Add Plant" }
                                </button>
                                {/* Delete Template button */}
                                {
                                    plant.id === NEW_PLANT_ID ?
                                        null
                                        :
                                        (<button onClick={(e) => removeProfile(e)} className="mt-4 px-8 py-4 bg-red-600 text-white text-lg rounded-lg hover:bg-red-700 transition duration-200 ease-in-out font-semibold">
                                            Delete Template
                                        </button>) 
                                }
                            </>
                        )}

                    </form>
                </div>
            </PageTemplate>
        );
    }
}

export function InputField({ label, units, formId, min, max, step, value, onChange, isEditable }) {
    return (
        <div className="flex flex-col w-full">
            <label htmlFor={formId} className="self-start text-lg font-semibold text-tan-100">
                {label} <span className="italic text-sm text-tan-200">{units}</span>
            </label>
            <input
                id={formId}
                type="number"
                min={min}
                max={max}
                step={step}
                value={value || ""}
                disabled={!isEditable}
                onChange={isEditable ? onChange : undefined}
                required
                className="block px-2 py-1 border border-zuccini-900 bg-tan-100 shadow-sm font-semibold text-zuccini-950 rounded-lg text-left text-xl"
            />
        </div>
    );
}

export function TextField({ label, formId, value, onChange, isEditable }) {
    return (
        <div className="flex flex-col w-full">
            <label htmlFor={formId} className="self-start text-lg font-semibold text-tan-100">
                {label}
            </label>
            <input
                id={formId}
                type="text"
                value={value || ""}
                onChange={isEditable ? onChange : undefined}
                disabled={!isEditable}
                required
                className="shadow-md border border-zuccini-950 w-full px-2 py-1 bg-tan-100 text-zuccini-950 rounded-lg text-lg font-semibold"
            />
        </div>
    );
}

export function PlantImagePreview({ plant, previewImage }) {
    if (previewImage) {
        return (
            <img
                src={previewImage}
                alt="Preview"
                className="rounded-2xl shadow-md aspect-square w-3/4 object-cover"
            />
        );
    }

    return plant ? (
        plant.id === 999 ? (
            <BlurImage />
        ) : (
            <img
                src={`/plants/${plant.image}`}
                alt={plant.name}
                className="rounded-2xl shadow-md aspect-square w-3/4 object-cover"
            />
        )
    ) : (
        <BlurImage />
    );
}


export function BlurImage() {
    return (
        <div className="border border-white/20 backdrop-blur-md rounded-2xl shadow-md aspect-square w-3/4"></div>
    )
}