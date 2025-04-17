import React from 'react';
import './BubbleSelect.css';

const BubbleSelect = ({ options, selected, onChange, multi = false }) => {
    const handleClick = (value) => {
        if (multi) {
            if (selected.includes(value)) {
                onChange(selected.filter((v) => v !== value));
            } else {
                onChange([...selected, value]);
            }
        } else {
            // Toggle for single select
            onChange(selected === value ? '' : value);
        }
    };

    return (
        <div className="bubble-container">
            {options.map((option) => (
                <button
                    key={option}
                    type="button"
                    className={`bubble ${multi ? selected.includes(option) ? 'selected' : '' : selected === option ? 'selected' : ''}`}
                    onClick={() => handleClick(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default BubbleSelect;