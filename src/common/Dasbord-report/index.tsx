import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { DashboardDataAsync, getReportAsync, reportState } from '@/components/report/report.slice';
import {
  STATUS,
  SelectReporting,
  systemMessage,
} from "@/common/constants";
import { IDashboardData, IReportResponse } from '@/components/report/report.model';
import Image from "next/image";
import CardDataStats from '@/components/report/widgets/CardDataStats';
import { faAlignLeft, faCircleCheck, faFileExport, faFileLines, faUserCheck, faUserXmark, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';



function Dashboard() {
 const {
    loading,
    status,
    DashboardData,
    Report,
    GetReport,
    GetAllReport,
    TotalReport,
  } = useAppSelector(reportState);
const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<IDashboardData>();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [getReport, setGetReport] = useState<IReportResponse>();
  const [totalRecords, setTotalRecords] = useState<number>(0);





const [selectedDate, setSelectedDate] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
const [selectedReportDate, setSelectedReportDate] = useState<{
    startReportDate: Date | string;
    endReportDate: Date | string;
  }>({
    startReportDate: format(
      new Date(new Date().setDate(new Date().getDate() - 30)),
      "yyyy-MM-dd"
    ),
    endReportDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { startDate, endDate } = selectedDate;
  const { startReportDate, endReportDate } = selectedReportDate;

  useEffect(() => {
    const payload = {
      from_date: format(selectedDate.startDate, "yyyy-MM-dd"),
      to_date: format(selectedDate.endDate, "yyyy-MM-dd"),
    };
    dispatch(DashboardDataAsync(payload));
  }, []);

  const handleDateChange = async (date: Date | null, dateType: string) => {
    setIsLoading(true);
    let newSelectedDate = { ...selectedDate };
    if (dateType === "startDate") {
      newSelectedDate.startDate = date || new Date();
    } else if (dateType === "endDate") {
      newSelectedDate.endDate = date || new Date();
    }
    setSelectedDate(newSelectedDate);
    const payload = {
      from_date: format(newSelectedDate.startDate, "yyyy-MM-dd"),
      to_date: format(newSelectedDate.endDate, "yyyy-MM-dd"),
    };

    await dispatch(DashboardDataAsync(payload));
    if (selectedCategory) {
      await dispatch(getReportAsync(getReport!.data!.id));
    }
    setIsLoading(false);
  };
 const data = [
    {
      title: "Valid ICSR - Generative AI",
      total: dashboardData?.gen_ai_review_valid ?? 0,
      icon: faCircleCheck,
    },
    {
      title: "Invalid ICSR - Generative AI",
      total: dashboardData?.gen_ai_review_invalid ?? 0,
      icon: faXmarkCircle,
    },
    {
      title: "Valid ICSR - Expert Review",
      total: dashboardData?.expert_review_valid ?? 0,
      icon: faUserCheck,
    },
    {
      title: "Invalid ICSR - Expert Review",
      total: dashboardData?.expert_review_invalid ?? 0,
      icon: faUserXmark,
    },
    {
      title: "Full Text Search - Expert Review",
      total: dashboardData?.full_text_expert_review ?? 0,
      icon: faFileLines,
    },
    {
      title: "XML Generated E2B R3 - ",
      total: dashboardData?.xml_generated_e2b ?? 0,
      icon: faFileExport,
     },
    {
      title: "Abstract Screened -",
      total: dashboardData?.abstract_screened ?? 0,
      icon: faAlignLeft,
    },
 {
      title: "Duplicates Identified",
      total: dashboardData?.duplicate_record?? 0,
      icon: faXmarkCircle,
 }
  ];

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  useEffect(() => {
    const updateData = async () => {
      setIsLoading(true)
      if (loading === STATUS.fulfilled) {
        setDashboardData(DashboardData);
        setTotalRecords(TotalReport);
        setIsLoading(false)
      }
    }
    updateData()
  }, [loading, DashboardData, TotalReport]);
useEffect(() => {
    setGetReport(undefined);
  }, [loading]);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setGetReport(Report);
     
    }
  }, [status, GetReport, Report, GetAllReport]);
  return (
   
       <div className="main bg-white mt-0 w-100 custom-box-shadow card-box">
        <div className="mt-2 p-2">
          <div className="divide-y-2">
            <div className="ml-5 mt-3 flex">
              <h3 className="mt-2 mr-5">Dashboard</h3>
              <DatePicker
                selected={startDate}
                onChange={(date: Date) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  handleDateChange(new Date(formattedDate), "startDate");
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="From Date"
                className="w-full relative text-14 rounded-md"
                maxDate={endDate || new Date()}
                isClearable
              />
              <Image
                className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
                alt=""
                width={10}
                height={10}
                src="/assets/icons/calendarday-1.svg"
              />
              <div className="ml-8 flex">
                <DatePicker
                  selected={endDate}
                  isClearable
                  onChange={(date: Date) => {
                    const formattedDate = format(date, "yyyy-MM-dd");
                    handleDateChange(new Date(formattedDate), "endDate");
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End Date"
                  className="w-full relative text-14 rounded-md"
                  minDate={startDate}
                  maxDate={new Date()}
                />
                <Image
                  className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
                  alt=""
                  width={10}
                  height={10}
                  src="/assets/icons/calendarday-1.svg"
                />
              </div>
            </div>
            <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
            <div className="flex">
              {/* <div className="px-2 py-2 mt-4">
                <DatePicker
                  selected={startDateRange}
                  onChange={onChange}
                  startDate={startDateRange}
                  endDate={endDate}
                  selectsRange
                  inline
                />
              </div> */}
              <div className="grid grid-cols-2 text-14 gap-3 md:grid-cols-8 pr-5 mb-2 ml-1 mt-2">
                {data.map((item, index) => (
                  <CardDataStats
                    key={index}
                    title={item.title}
                    total={item.total}
                    icon={item.icon}
                  ></CardDataStats>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}

export default Dashboard
