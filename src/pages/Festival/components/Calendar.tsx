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
  Locale,
} from "date-fns";
import { useTranslation } from 'react-i18next';

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
  locale?: Locale; // 선택적 locale prop
}

export function Calendar({
  month,
  selectedStart,
  selectedEnd,
  hoveredDate,
  setHoveredDate,
  setSelectedStart,
  setSelectedEnd,
  locale,
}: CalendarProps) {
  const { i18n } = useTranslation();

   // 언어별 요일 배열
  const weekdaysMap: Record<string, string[]> = {
    kor: ["일", "월", "화", "수", "목", "금", "토"],
    eng: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    jpn: ["日", "月", "火", "水", "木", "金", "土"],
    // 기타 언어 추가
  };
  const lang = i18n.language || "kor";
  const weekdays = weekdaysMap[lang] || weekdaysMap["kor"];

  // 오늘 날짜
  const today = new Date();

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

    const isToday = isSameDay(date, today);


    const className = `
      ${styles.date_box}
      ${isSelectedStart || isSelectedEnd ? styles.selected : ""}
      ${isInRange || isHoveredRange ? styles.included : ""}
      ${isToday ? styles.today : ""}
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
          aria-label={format(date, "yyyy-MM-dd", { locale })}
        >
          <span
            style={isToday ? { borderBottom: "2px solid #ff651b", fontWeight: 600 } : {}}
          >
            {format(date, "d", { locale })}
          </span>
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
              {weekdays.map((day, idx) => (
                <th key={day + idx}>{day}</th>
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
