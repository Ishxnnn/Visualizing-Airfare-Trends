import React, { useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns';
import './CalendarComponent.css';

interface CalendarComponentProps {
  onDateChange?: (range: { startDate: Date; endDate: Date }) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateChange }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  const handleSelect = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    setState([selection]);
    
    if (onDateChange && selection.startDate && selection.endDate) {
      onDateChange({
        startDate: selection.startDate,
        endDate: selection.endDate
      });
    }
  };

  return (
    <div className="calendar-wrapper">
      <DateRange
        editableDateInputs={true}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        ranges={state}
        months={1}
        direction="horizontal"
        className="calendar-element"
        rangeColors={['#0066ff']}
      />
    </div>
  );
};

export default CalendarComponent;
