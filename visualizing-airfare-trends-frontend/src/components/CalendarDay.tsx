import React from "react";
import "./CalendarDay.css";

interface CalendarDayProps {
  day: number;
  isToday?: boolean;
  isCurrentMonth?: boolean;
  hasEvent?: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  isToday = false,
  isCurrentMonth = true,
  hasEvent = false,
}) => {
  // Compute CSS classes for styling
  const dayCircleClass = [
    "day-circle",
    isToday ? "today-circle" : "",
    !isCurrentMonth ? "other-month-circle" : ""
  ].join(" ");

  const dayTextClass = [
    "day-text",
    isToday ? "today-text" : "",
    !isCurrentMonth ? "other-month-text" : ""
  ].join(" ");

  return (
    <div className="day-container">
      <div className={dayCircleClass}>
        <span className={dayTextClass}>{day}</span>
      </div>
      {hasEvent && <div className="event-dot" />}
    </div>
  );
};

export default CalendarDay;
