import React from 'react';

const IconBtn = ({ children, text, onClickHandler, disabled, outline = false, customClasses, type }) => {
    return (
        // Removed unnecessary wrapper div
        <button
            onClick={onClickHandler}
            disabled={disabled}
            type={type}
            className={`${customClasses} rounded-md py-2 px-5 font-semibold tracking-wider
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${outline ? 'border border-yellow-50 bg-transparent text-yellow-50' : 'bg-yellow-50 text-richblack-900'}
                `}
        >
            {/* Conditional rendering for children/text */}
            {children ? (
                <div className="flex items-center gap-x-2">
                    {text}
                    {children}
                </div>
            ) : (
                <span>{text}</span>
            )}
        </button>
    );
};

export default IconBtn;
