import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  firstDayOfWeek?: 0 | 1;
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
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    value.startDate || null,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    value.endDate || null,
  );
  const [selectedTime, setSelectedTime] = useState(value.time || "12:00 PM");
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [showYearMonthPicker, setShowYearMonthPicker] = useState(false);
  const [tempYear, setTempYear] = useState(currentMonth.getFullYear());
  const [tempMonth, setTempMonth] = useState(currentMonth.getMonth());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 text-sm min-h-[32px]",
    md: "text-sm px-4 py-2 text-base min-h-[40px]",
    lg: "text-base px-4 py-3 text-lg min-h-[48px]",
  };

  const weekDays =
    firstDayOfWeek === 0
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    if (value.startDate) {
      setSelectedStartDate(value.startDate);
      setCurrentMonth(
        new Date(value.startDate.getFullYear(), value.startDate.getMonth()),
      );
    }
    if (value.endDate) {
      setSelectedEndDate(value.endDate);
    }
    if (value.time) {
      setSelectedTime(value.time);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowYearMonthPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
        return selectedStartDate
          ? formatDateTime(selectedStartDate, selectedTime)
          : "";
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
    // Create date at noon to avoid timezone issues
    const selectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
    );

    if (mode === "daterange" || mode === "datetimerange") {
      if (
        !selectedStartDate ||
        (selectedStartDate && selectedEndDate) ||
        isSelectingEnd
      ) {
        if (!isSelectingEnd) {
          setSelectedStartDate(selectedDate);
          setSelectedEndDate(null);
          setIsSelectingEnd(true);
        } else {
          if (selectedDate < selectedStartDate!) {
            setSelectedStartDate(selectedDate);
            setSelectedEndDate(selectedStartDate);
          } else {
            setSelectedEndDate(selectedDate);
          }
          setIsSelectingEnd(false);

          const newValue: DateTimeValue = {
            startDate: selectedStartDate!,
            endDate:
              selectedDate < selectedStartDate!
                ? selectedStartDate || undefined
                : selectedDate,
            ...(mode === "datetimerange" && { time: selectedTime }),
          };
          onChange?.(newValue);
        }
      }
    } else {
      setSelectedStartDate(selectedDate);
      const newValue: DateTimeValue = {
        startDate: selectedDate,
        ...(mode === "datetime" && { time: selectedTime }),
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
      time,
    };
    onChange?.(newValue);
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const checkDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const start = new Date(
      selectedStartDate.getFullYear(),
      selectedStartDate.getMonth(),
      selectedStartDate.getDate(),
    );
    const end = new Date(
      selectedEndDate.getFullYear(),
      selectedEndDate.getMonth(),
      selectedEndDate.getDate(),
    );
    return checkDate >= start && checkDate <= end;
  };

  const isDateSelected = (date: Date) => {
    if (selectedStartDate && isSameDay(date, selectedStartDate)) return true;
    if (selectedEndDate && isSameDay(date, selectedEndDate)) return true;
    return false;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay();
    if (firstDayOfWeek === 1) {
      startDay = startDay === 0 ? 6 : startDay - 1;
    }

    const days = [];

    for (let i = 0; i < startDay; i++) {
      const prevDate = new Date(year, month, -(startDay - 1 - i));
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1,
      ),
    );
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const minuteStr = minute.toString().padStart(2, "0");
        times.push(`${hour}:${minuteStr} AM`);
        times.push(`${hour}:${minuteStr} PM`);
      }
    }
    return times;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 100; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const handleYearMonthSelect = () => {
    setCurrentMonth(new Date(tempYear, tempMonth, 1));
    setShowYearMonthPicker(false);
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-gray-600"
        >
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
          <span
            className={getDisplayValue() ? "text-gray-900" : "text-gray-400"}
          >
            {getDisplayValue() || placeholder || "Select date..."}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {isOpen && !disabled && (
          // <div
          //   ref={dropdownRef}
          //   className="absolute z-[1000] mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg backdrop-blur-sm bg-white/95 p-4 min-w-[320px]"
          // >
          <div
            ref={dropdownRef}
            className="absolute z-[1000] mt-1 bg-white border border-gray-200 rounded-[12px] shadow-lg backdrop-blur-sm bg-white/95 p-4 min-w-[320px] max-h-[600px] overflow-y-auto"
          >
            {!showYearMonthPicker ? (
              <>
                {/* Month/Year Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowYearMonthPicker(true);
                      setTempYear(currentMonth.getFullYear());
                      setTempMonth(currentMonth.getMonth());
                    }}
                    className="px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {months[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-semibold text-gray-600 py-2"
                    >
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
                    const isStartDate =
                      selectedStartDate && isSameDay(date, selectedStartDate);
                    const isEndDate =
                      selectedEndDate && isSameDay(date, selectedEndDate);

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateClick(date)}
                        disabled={!isCurrentMonth}
                        className={`
                          w-9 h-9 text-sm transition-all duration-200 relative flex items-center justify-center font-medium
                          ${isCurrentMonth ? "text-gray-900" : "text-gray-300 cursor-not-allowed"}
                          ${
                            isSelected
                              ? "bg-primary-500 text-white font-semibold rounded-full shadow-md"
                              : isInRange
                                ? "bg-primary-100 text-primary-700"
                                : "hover:bg-gray-100 rounded-lg"
                          }
                          ${isToday && !isSelected ? "ring-2 ring-primary-400" : ""}
                          ${isStartDate || isEndDate ? "rounded-full" : ""}
                          ${!isCurrentMonth ? "opacity-40" : ""}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
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
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              /* Year & Month Picker */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Select Month & Year
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowYearMonthPicker(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Year Selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    value={tempYear}
                    onChange={(e) => setTempYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white font-medium"
                  >
                    {generateYears().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month Grid */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {monthsShort.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => setTempMonth(index)}
                        className={`
                          px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          ${
                            tempMonth === index
                              ? "bg-primary-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }
                        `}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  type="button"
                  onClick={handleYearMonthSelect}
                  className="w-full px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
            )}
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

export default DateTimePicker;

// Demo component
export const DateTimePickerDemo = () => {
  const [singleDate, setSingleDate] = useState<DateTimeValue>({});
  const [dateTime, setDateTime] = useState<DateTimeValue>({});
  const [dateRange, setDateRange] = useState<DateTimeValue>({});
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeValue>({});

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        DateTime Picker Component
      </h1>

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
          <h3 className="text-lg font-semibold text-gray-800">Single Date:</h3>
          <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
            {JSON.stringify(singleDate, null, 2)}
          </pre>

          <h3 className="text-lg font-semibold text-gray-800">DateTime:</h3>
          <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
            {JSON.stringify(dateTime, null, 2)}
          </pre>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Date Range:</h3>
          <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
            {JSON.stringify(dateRange, null, 2)}
          </pre>

          <h3 className="text-lg font-semibold text-gray-800">
            DateTime Range:
          </h3>
          <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
            {JSON.stringify(dateTimeRange, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
