import React from "react";

const InputField = ({ type, placeholder, value, onchange }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onchange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-pruple-500"

        />
    );
};
export default InputField;