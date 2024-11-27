import api from "../utils/axios.js"

// Components
import { Link } from 'react-router-dom';

// Hooks
import { useState, useEffect, useRef } from 'react';

// Icons
import { IoMdCheckmark } from "react-icons/io";



export const Button = (props) => {
    return (
        <Link to={props.href} className={`flex flex-col p-0 gap-3 justify-center items-center rounded-full ${props.buttonStyle} active:scale-95 active:opacity-90 bg-opacity-0 hover:bg-opacity-5 duration-150 cursor-pointer transition-all ease-in`}>
            {props.children}
            {props.subText && <h2 className={`text-lg font-light opacity-90`}>{props.subText}</h2>}
         </Link>
    )
}

function AdjustableInput({ value, onSave, step = 1, min = 0, max = 100 }) {
    const [currentValue, setCurrentValue] = useState(value);
    const containerRef = useRef(null);
  
    const handleIncrement = () => {
      const newValue = Math.min(currentValue + step, max);
      const roundedValue = Math.round(newValue * (1 / step)) / (1 / step);
      setCurrentValue(roundedValue);
    };
  
    const handleDecrement = () => {
      const newValue = Math.max(currentValue - step, min);
      const roundedValue = Math.round(newValue * (1 / step)) / (1 / step);
      setCurrentValue(roundedValue);
    };
  
    const handleInputChange = (e) => {
      const newValue = Number(e.target.value);
      if (newValue >= min && newValue <= max) {
        const roundedValue = Math.round(newValue * (1 / step)) / (1 / step);
        setCurrentValue(roundedValue);
      }
    };

    const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          onSave(currentValue);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [currentValue]);
  
    return (
      <div ref={containerRef} className="flex items-center bg-zuccini-900 rounded-lg w-full h-full text-xl font-semibold">
        <button
          type="button"
          onClick={handleDecrement}
          className="py-2 px-3 bg-gray-800 text-tan-100 rounded-l-lg active:bg-gray-700"
        >
          -
        </button>
        <input
          type="number"
          value={currentValue}
          onChange={handleInputChange}
          className="bg-zuccini-900 text-tan-100 w-full h-full text-center"
          step={step}
          min={min}
          max={max}
        />
        <button
          type="button"
          onClick={handleIncrement}
          className="py-2 px-3 bg-gray-800 text-tan-100 rounded-r-lg active:bg-gray-700"
        >
          +
        </button>
      </div>
    );
  }

export const InteractiveMetric = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue ] = useState(props.value);

    function makeEdit() {
        setIsEditing(true)
    }

    function updateMetric(newValue) {
        setIsEditing(false);
        setValue(newValue);
        api.post(`/plants/${props.plant.plant_id}/tracking/${props.name}`, { value: newValue });
    }

    if (isEditing) {
        return (
            <div className="w-full h-full">
                <h4 className="text font-light">{props.name}</h4>
                <div className="flex justify-center items-center w-full">
                    <AdjustableInput value={value} onSave={updateMetric} step={props.step} max={props.max}  />
                </div>
            </div>
        )
    } else {
        return (
            <div className="w-full h-full">
                <h4 className="text font-light">{props.name}</h4>
                <div onClick={makeEdit} className="flex gap-2 justify-center items-center w-full py-2 px-8 rounded-lg m-auto bg-zuccini-900 text-tan-100 cursor-pointer hover:bg-zuccini-950">
                    <h4 className="text-xl font-semibold">{value}</h4>
                    <span className="text-xl font-thin">{props.unit}</span>
                </div>
            </div>
        )
    }
}