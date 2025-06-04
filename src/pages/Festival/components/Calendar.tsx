// src/components/Calendar.tsx
import styles from "./Calendar.module.css";
import {
  format,
  isSameDay,
  isBefore,
  isAfter,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";

interface CalendarProps {
  month: Date;
  onMonthChange: (date: Date) => void; // 이 줄을 추가!
  selectedStart: Date | null;
  selectedEnd: Date | null;
  setSelectedStart: (date: Date | null) => void;
  setSelectedEnd: (date: Date | null) => void;
  hoveredDate: Date | null;
  setHoveredDate: (date: Date | null) => void;
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
}

export function Calendar({
  month,
  selectedStart,
  selectedEnd,
  hoveredDate,
  setHoveredDate,
  setSelectedStart,
  setSelectedEnd,
}: CalendarProps) {
  const generateCalendar = () => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    const days = [];
    let current = start;
    while (current <= end) {
      days.push(current);
      current = addDays(current, 1);
    }
    return days;
  };

  const handleDateClick = (date: Date) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else if (date < selectedStart) {
      setSelectedStart(date);
    } else {
      setSelectedEnd(date);
    }
  };

  const renderDay = (date: Date) => {
    const isSelectedStart = selectedStart && isSameDay(date, selectedStart);
    const isSelectedEnd = selectedEnd && isSameDay(date, selectedEnd);
    const isInRange =
      selectedStart && selectedEnd && isAfter(date, selectedStart) && isBefore(date, selectedEnd);

    const isHoveredRange =
      selectedStart &&
      !selectedEnd &&
      hoveredDate &&
      ((date > selectedStart && date <= hoveredDate) ||
        (date < selectedStart && date >= hoveredDate));

    const className = `
      ${styles.date_box}
      ${isSelectedStart || isSelectedEnd ? styles.selected : ""}
      ${isInRange || isHoveredRange ? styles.included : ""}
    `;

    const style = isSelectedStart
  ? {
      backgroundColor: "#ff651b",
      color: "#fffefb",
      borderRadius: "45% 0% 0% 45%",
    }
  : isSelectedEnd
  ? {
      backgroundColor: "#ff651b",
      color: "#fffefb",
      borderRadius: "0% 45% 45% 0%",
    }
  : {
    };

    return (
      <td key={date.toString()} className="date_row">
        <div
          className={className.trim()}
          style={style}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoveredDate(date)}
        >
          {format(date, "d")}
        </div>
      </td>
    );
  };

  const weeks = [];
  const days = generateCalendar();
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className={styles.calendar} style={{ width: "100%", maxWidth: "720px" }}>
      <div
        className={styles.container}
        style={{ width: "100%", padding: "20px", paddingLeft: "8px" }}
      >
        <table className="table">
          <thead>
            <tr className="yoil">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, i) => (
              <tr key={i} className="date_row cursor-pointer">
                {week.map((day) => renderDay(day))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
