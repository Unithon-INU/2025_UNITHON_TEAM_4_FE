// src/components/PeriodSelectorBar.tsx
"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import { Calendar } from "../components/Calendar";
import { addMonths, format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion } from "framer-motion";
// import { pre } from 'framer-motion/client';

interface PeriodSelectorBarProps {
  isCompact: boolean;
  isExpanded: boolean;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  selectedRegion: string;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onRegionChange: (region: string) => void;
  onExpandClick: () => void;
  onCollapseClick: () => void;
  onSearch: () => void;
}

const regions = [
  { value: "all", label: "전체 지역" },
  { value: "서울", label: "서울" },
  { value: "부산", label: "부산" },
  { value: "경기", label: "경기도" },
  { value: "강원", label: "강원도" },
  { value: "충청", label: "충청도" },
  { value: "전라", label: "전라도" },
  { value: "경상", label: "경상도" },
  { value: "제주", label: "제주도" },
];

export function PeriodSelectorBar({
  isCompact,
  isExpanded,
  selectedStartDate,
  selectedEndDate,
  selectedRegion,
  onStartDateChange,
  onEndDateChange,
  onRegionChange,
  onExpandClick,
  // onCollapseClick,
  onSearch,
}: PeriodSelectorBarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const formatDateRange = () => {
    if (!selectedStartDate) return "날짜를 선택하세요";
    if (!selectedEndDate) return format(selectedStartDate, "M월 d일", { locale: ko });
    return `${format(selectedStartDate, "M월 d일", { locale: ko })} ~ ${format(
      selectedEndDate,
      "M월 d일",
      { locale: ko }
    )}`;
  };

  const handleDateRangeChange = (range: { start: Date | null; end: Date | null }) => {
    onStartDateChange(range.start);
    onEndDateChange(range.end);
  };

  const isMinimized = isCompact && !isExpanded;

  return (
    <div className="w-full py-6 bg-transparent">
      <div className="mx-auto max-w-4xl">
        <motion.div
          animate={{
            width: isMinimized ? 250 : 720,
            height: isMinimized ? 44 : 64,
            opacity: 1,
          }}
          initial={false}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="mx-auto"
        >
          <div
            className={`w-full h-full ${isMinimized ? "cursor-pointer" : ""}`}
            onClick={isMinimized ? onExpandClick : undefined}
          >
            {isMinimized ? (
              <div className="flex items-center bg-[#fffefb] rounded-full shadow-lg border border-gray-300 hover:shadow-lg hover:scale-[102%] transition-transform w-full h-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }} // ← 여기로 지연을 주는 것
                  className="flex-1 min-w-[33.3%] h-full px-4 text-sm font-medium text-gray-700 flex items-center justify-center"
                >
                  {selectedRegion === "all"
                    ? "어디서?"
                    : regions.find((r) => r.value === selectedRegion)?.label}
                </motion.div>
                <div className="w-px h-5 bg-gray-200" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }} // ← 여기로 지연을 주는 것
                  className="flex-1 min-w-[33.3%] h-full px-4 text-sm font-medium text-gray-700 flex items-center justify-center"
                >
                  언제?
                </motion.div>
                <div className="w-px h-5 bg-gray-200" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }} // ← 여기로 지연을 주는 것
                  className="flex-1 min-w-[33.3%] h-full text-sm font-medium text-white bg-[#ff651b] flex items-center rounded-r-full justify-center"
                >
                  <Search className="h-4 w-4" />
                </motion.div>
              </div>
            ) : (
              <div className="bg-[#fffefb] rounded-full shadow-lg border border-gray-200 p-2 h-auto">
                <div className="flex items-center" style={{ height: "60px" }}>
                  <div className="flex-1 px-6 py-3">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }} // ← 여기로 지연을 주는 것
                      className="space-y-1 text-gray-600 mt-1"
                    >
                      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide px-3">
                        어디서
                      </label>
                      <Select value={selectedRegion} onValueChange={onRegionChange} className="shadow-none">
                        <SelectTrigger className=" p-0 h-auto  -my-1">
                          <SelectValue placeholder="지역을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="flex-1 px-6 py-3">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }} // ← 여기로 지연을 주는 것
                      className="space-y-1"
                    >
                      <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                        언제
                      </label>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
  <PopoverTrigger>
    <div role="button" tabIndex={0} className="text-start w-full cursor-pointer">
      <div
        className={`text-sm ${
          selectedStartDate ? "text-gray-900" : "text-gray-500"
        }`}
      >
        {formatDateRange()}
      </div>
    </div>
  </PopoverTrigger>
                        <PopoverContent
                          onClick={(e) => e.stopPropagation()}
                          className="absolute left-[43%]  transform -translate-x-1/2 w-[720px]  bg-[#fffefb] rounded-xl shadow-lg z-50"
                        >
                          <div className="flex">
                            <div className="p-4 w-1/2 border-r">
                              <div className="flex items-center justify-between mb-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <h3 className="font-semibold">
                                  {format(currentMonth, "yyyy년 M월", { locale: ko })}
                                </h3>
                                <div className="w-4" />
                              </div>
                              <Calendar
                                month={currentMonth}
                                onMonthChange={setCurrentMonth}
                                onDateRangeChange={handleDateRangeChange}
                                selectedStart={selectedStartDate}
                                selectedEnd={selectedEndDate}
                                setSelectedStart={onStartDateChange}
                                setSelectedEnd={onEndDateChange}
                                hoveredDate={hoveredDate}
                                setHoveredDate={setHoveredDate}
                              />
                            </div>
                            <div className="p-4 w-1/2">
                              <div className="flex items-center justify-between mb-2">
                                <div className="w-4" />
                                <h3 className="font-semibold">
                                  {format(addMonths(currentMonth, 1), "yyyy년 M월", { locale: ko })}
                                </h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                              <Calendar
                                month={addMonths(currentMonth, 1)}
                                onMonthChange={setCurrentMonth}
                                onDateRangeChange={handleDateRangeChange}
                                selectedStart={selectedStartDate}
                                selectedEnd={selectedEndDate}
                                setSelectedStart={onStartDateChange}
                                setSelectedEnd={onEndDateChange}
                                hoveredDate={hoveredDate}
                                setHoveredDate={setHoveredDate}
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </motion.div>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center"
                  >
                    <div className="flex-1 px-6 py-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                          검색
                        </label>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm">축제를 즐기세요!</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      className="bg-[#ff651b]/90 hover:bg-[#ff651b] text-[#fffefb] rounded-[90px] h-10 w-6 ml-0"
                      onClick={onSearch}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
