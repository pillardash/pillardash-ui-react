import React, { useState, useRef, useEffect } from "react";

export interface DateTimeValue {
    startDate?: Date;
    endDate?: Date;
    time?: string;
}

export interface DateTimePickerProps {
    id?: string;
    label?: string;
    value?: DateTimeValue;
    onChange?: (value: DateTimeValue) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    helpText?: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    mode?: "date" | "datetime" | "daterange" | "datetimerange";
    minDate?: Date;
    maxDate?: Date;
    format?: string;
    showWeekNumbers?: boolean;
    firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
                                                           id,
                                                           label,
                                                           value = {},
                                                           size = "md",
                                                           onChange,
                                                           placeholder,
                                                           error,
                                                           required = false,
                                                           helpText,
                                                           className = "",
                                                           disabled = false,
                                                           mode = "date",
                                                           minDate,
                                                           maxDate,
                                                           showWeekNumbers = false,
                                                           firstDayOfWeek = 1,
                                                           ...restProps
                                                       }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(value.startDate || null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(value.endDate || null);
    const [selectedTime, setSelectedTime] = useState(value.time || "12:00 PM");
    const [isEditingYear, setIsEditingYear] = useState(false);
    const [yearInput, setYearInput] = useState(currentMonth.getFullYear().toString());
    const [isSelectingEnd, setIsSelectingEnd] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
        sm: "text-xs px-3 py-1.5 text-sm min-h-[32px]",
        md: "text-sm px-4 py-2 text-base min-h-[40px]",
        lg: "text-base px-4 py-3 text-lg min-h-[48px]",
    };

    const weekDays = firstDayOfWeek === 0
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (date: Date, time?: string) => {
        const dateStr = formatDate(date);
        return time ? `${dateStr} ${time}` : dateStr;
    };

    const getDisplayValue = () => {
        if (!selectedStartDate && !selectedEndDate) return "";

        switch (mode) {
            case "date":
                return selectedStartDate ? formatDate(selectedStartDate) : "";
            case "datetime":
                return selectedStartDate ? formatDateTime(selectedStartDate, selectedTime) : "";
            case "daterange":
                if (selectedStartDate && selectedEndDate) {
                    return `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`;
                } else if (selectedStartDate) {
                    return formatDate(selectedStartDate);
                }
                return "";
            case "datetimerange":
                if (selectedStartDate && selectedEndDate) {
                    return `${formatDateTime(selectedStartDate, selectedTime)} - ${formatDateTime(selectedEndDate, selectedTime)}`;
                } else if (selectedStartDate) {
                    return formatDateTime(selectedStartDate, selectedTime);
                }
                return "";
            default:
                return "";
        }
    };

    const handleDateClick = (date: Date) => {
        if (mode === "daterange" || mode === "datetimerange") {
            if (!selectedStartDate || (selectedStartDate && selectedEndDate) || isSelectingEnd) {
                if (!isSelectingEnd) {
                    setSelectedStartDate(date);
                    setSelectedEndDate(null);
                    setIsSelectingEnd(true);
                } else {
                    if (date < selectedStartDate!) {
                        setSelectedStartDate(date);
                        setSelectedEndDate(selectedStartDate);
                    } else {
                        setSelectedEndDate(date);
                    }
                    setIsSelectingEnd(false);

                    const newValue: DateTimeValue = {
                        startDate: selectedStartDate!,
                        // @ts-ignore
                        endDate: date < selectedStartDate! ? selectedStartDate : date,
                        ...(mode === "datetimerange" && { time: selectedTime })
                    };
                    onChange?.(newValue);
                }
            }
        } else {
            setSelectedStartDate(date);
            const newValue: DateTimeValue = {
                startDate: date,
                ...(mode === "datetime" && { time: selectedTime })
            };
            onChange?.(newValue);
            if (mode === "date") {
                setIsOpen(false);
            }
        }
    };

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        const newValue: DateTimeValue = {
            startDate: selectedStartDate!,
            ...(selectedEndDate && { endDate: selectedEndDate }),
            time
        };
        onChange?.(newValue);
    };

    const isDateInRange = (date: Date) => {
        if (!selectedStartDate || !selectedEndDate) return false;
        return date >= selectedStartDate && date <= selectedEndDate;
    };

    const isDateSelected = (date: Date) => {
        if (selectedStartDate && isSameDay(date, selectedStartDate)) return true;
        if (selectedEndDate && isSameDay(date, selectedEndDate)) return true;
        return false;
    };

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.toDateString() === date2.toDateString();
    };

    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Calculate first day of week for the month
        let startDay = firstDay.getDay();
        if (firstDayOfWeek === 1) {
            startDay = startDay === 0 ? 6 : startDay - 1;
        }

        const days = [];

        // Previous month's trailing days
        for (let i = 0; i < startDay; i++) {
            const prevDate = new Date(year, month, -(startDay - 1 - i));
            days.push({ date: prevDate, isCurrentMonth: false });
        }

        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        // Next month's leading days
        const remainingDays = 42 - days.length; // 6 rows × 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return days;
    };

    const navigateMonth = (direction: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
    };

    const navigateYear = (direction: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear() + direction, currentMonth.getMonth(), 1));
    };

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 1; hour <= 12; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const minuteStr = minute.toString().padStart(2, '0');
                times.push(`${hour}:${minuteStr} AM`);
                times.push(`${hour}:${minuteStr} PM`);
            }
        }
        return times;
    };

    const handleYearEdit = (newYear: string) => {
        const year = parseInt(newYear);
        if (!isNaN(year) && year >= 1900 && year <= 2100) {
            setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
        }
        setYearInput(newYear);
    };

    const handleYearSubmit = () => {
        const year = parseInt(yearInput);
        if (!isNaN(year) && year >= 1900 && year <= 2100) {
            setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
        } else {
            setYearInput(currentMonth.getFullYear().toString());
        }
        setIsEditingYear(false);
    };

    const handleYearKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleYearSubmit();
        } else if (e.key === 'Escape') {
            setYearInput(currentMonth.getFullYear().toString());
            setIsEditingYear(false);
        }
    };

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-600">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <div
                    ref={inputRef}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`w-full rounded-[12px] border ${
                        error ? "border-red-500" : "border-gray-200"
                    } ${
                        disabled
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-gray-100 text-dark cursor-pointer hover:bg-gray-50"
                    } focus:outline-none focus:ring-1 focus:ring-primary ${className} ${sizeClasses[size]} flex items-center justify-between`}
                >
                    <span className={getDisplayValue() ? "text-gray-900" : "text-gray-400"}>
                        {getDisplayValue() || placeholder || "Select date..."}
                    </span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                {isOpen && !disabled && (
                    <div
                        ref={dropdownRef}
                        className="absolute z-[1000] mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg backdrop-blur-sm bg-white/95 p-4 min-w-[320px]"
                        style={{
                            position: 'fixed',
                            top: inputRef.current
                                ? `${inputRef.current.getBoundingClientRect().bottom + window.scrollY + 4}px`
                                : 'auto',
                            left: inputRef.current
                                ? `${inputRef.current.getBoundingClientRect().left + window.scrollX}px`
                                : 'auto',
                            // Add a small transition for smooth appearance
                            animation: 'fadeIn 0.15s ease-out',
                        }}
                    >
                        {/* Month/Year Navigation */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-1">
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(-1)}
                                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                    {months[currentMonth.getMonth()]}
                                </span>
                                <div className="flex items-center space-x-1">
                                    {isEditingYear ? (
                                        <input
                                            type="text"
                                            value={yearInput}
                                            onChange={(e) => setYearInput(e.target.value)}
                                            onBlur={handleYearSubmit}
                                            onKeyDown={handleYearKeyDown}
                                            className="w-16 text-center font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                            autoFocus
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingYear(true);
                                                setYearInput(currentMonth.getFullYear().toString());
                                            }}
                                            className="font-medium text-gray-900 hover:text-primary-600 transition-colors px-1"
                                        >
                                            {currentMonth.getFullYear()}
                                        </button>
                                    )}
                                    <div className="flex flex-col">
                                        <button
                                            type="button"
                                            onClick={() => navigateYear(1)}
                                            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigateYear(-1)}
                                            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-1">
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(1)}
                                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Week Days Header */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {getDaysInMonth().map((dayObj, index) => {
                                const { date, isCurrentMonth } = dayObj;
                                const isSelected = isDateSelected(date);
                                const isInRange = isDateInRange(date);
                                const isToday = isSameDay(date, new Date());
                                const isStartDate = selectedStartDate && isSameDay(date, selectedStartDate);
                                const isEndDate = selectedEndDate && isSameDay(date, selectedEndDate);

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleDateClick(date)}
                                        className={`
                                            w-8 h-8 text-sm transition-all duration-200 relative flex items-center justify-center
                                            ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                                            ${isSelected
                                            ? 'bg-primary-500 text-white font-medium rounded-full'
                                            : isInRange
                                                ? 'bg-primary-100 text-primary-700 rounded-sm'
                                                : 'hover:bg-gray-100 rounded-md'
                                        }
                                            ${isToday && !isSelected ? 'ring-2 ring-primary-500 ring-opacity-30' : ''}
                                            ${(isStartDate || isEndDate) ? 'rounded-full' : ''}
                                        `}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Time Picker */}
                        {(mode === "datetime" || mode === "datetimerange") && (
                            <div className="border-t border-gray-100 pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => handleTimeChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                                >
                                    {generateTimeOptions().map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    setSelectedStartDate(null);
                                    setSelectedEndDate(null);
                                    setIsSelectingEnd(false);
                                    onChange?.({});
                                }}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-1.5 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {helpText && !error && (
                <p id={`${id}-help`} className="mt-1 text-sm text-gray-500">
                    {helpText}
                </p>
            )}

            {error && (
                <p id={`${id}-error`} className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

// Demo component to show usage
export const DateTimePickerDemo = () => {
    const [singleDate, setSingleDate] = useState<DateTimeValue>({});
    const [dateTime, setDateTime] = useState<DateTimeValue>({});
    const [dateRange, setDateRange] = useState<DateTimeValue>({});
    const [dateTimeRange, setDateTimeRange] = useState<DateTimeValue>({});

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">DateTime Picker Component</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <DateTimePicker
                        id="single-date"
                        label="Single Date"
                        value={singleDate}
                        onChange={setSingleDate}
                        placeholder="Select a date"
                        mode="date"
                        helpText="Choose any single date"
                        size="md"
                    />

                    <DateTimePicker
                        id="datetime"
                        label="Date & Time"
                        value={dateTime}
                        onChange={setDateTime}
                        placeholder="Select date and time"
                        mode="datetime"
                        helpText="Choose date with specific time"
                        size="md"
                    />
                </div>

                <div className="space-y-6">
                    <DateTimePicker
                        id="date-range"
                        label="Date Range"
                        value={dateRange}
                        onChange={setDateRange}
                        placeholder="Select date range"
                        mode="daterange"
                        helpText="Choose start and end dates"
                        size="md"
                    />

                    <DateTimePicker
                        id="datetime-range"
                        label="Date & Time Range"
                        value={dateTimeRange}
                        onChange={setDateTimeRange}
                        placeholder="Select date and time range"
                        mode="datetimerange"
                        helpText="Choose date range with time"
                        size="md"
                    />
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Single Date Value:</h3>
                    <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
                        {JSON.stringify(singleDate, null, 2)}
                    </pre>

                    <h3 className="text-lg font-semibold text-gray-800">DateTime Value:</h3>
                    <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
                        {JSON.stringify(dateTime, null, 2)}
                    </pre>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Date Range Value:</h3>
                    <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
                        {JSON.stringify(dateRange, null, 2)}
                    </pre>

                    <h3 className="text-lg font-semibold text-gray-800">DateTime Range Value:</h3>
                    <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
                        {JSON.stringify(dateTimeRange, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default DateTimePicker;