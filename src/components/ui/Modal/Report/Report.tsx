import { FC, useEffect, useState, memo, useRef } from "react";
import { Tabs as ATSTabs } from "./Tabs";
import ActivityAchivement from "./ActivityAchivement/ActivityAchivement";
import ReportDetail from "./ReportDetail/ReportDetail";
import axios from "axios";
import useStore from "@/hooks/useStore";
import moment from "moment";
import _ from "lodash";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import styles from "./Report.module.scss";
import classNames from "classnames/bind";
import { Button } from "antd";
const cx = classNames.bind(styles);

export interface ReportProps {
  handleCloseReport?: any;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Focus Hours Chart",
    },
  },
  maintainAspectRatio: false,
};

const yearList = [
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

const chartStyle = [
  {
    data: [],
    backgroundColor: "ffeceb",
    borderColor: "grey",
    borderWidth: 0.5,
  },
];
const reportTabs = ["Summary", "Detail"];
const reportFocusHoursTabs = ["Week", "Month", "Year"];
const getActivityAchivementData = (data: any) => {
  const { activitySummary } = data;
  const { focusedHours, accessedDays, streakDays } = activitySummary;
  const result = [
    {
      icon: "ic-alarm",
      value: focusedHours,
      desc: "focused hours",
    },
    {
      icon: "ic-calendar",
      value: accessedDays,
      desc: "accessed days",
    },
    {
      icon: "ic-fire",
      value: streakDays,
      desc: "streaked days",
    },
  ];
  return result;
};

const Report: FC<ReportProps> = ({ ...props }) => {
  const [selectedTab, setSelectedTab] = useState("Summary");
  const [state, dispatch] = useStore();
  const pageIndexRef = useRef(0);
  const filterTypeRef = useRef("Week");
  const { user } = state;
  const [reportData, setReportData] = useState();
  const [reportDetailData, setReporDetailtData] = useState();
  const [activityAchivementData, setActivityAchivementData] = useState<any>([]);
  const [time, setTime] = useState("This Week");
  const { handleCloseReport } = props

  const { access_token } = user;
  const getSummaryData = () => {
    axios
      .get("/apiDetail/getSummaryReport", {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + access_token, //the token is a variable which holds the token
        },
      })
      .then((response) => {
        const summary = response.data.data;
        setReportData(summary);
        setActivityAchivementData(getActivityAchivementData(summary));
      })
      .catch((e) => {
        console.log(111, "Get Summary Data error !!!", e);
      });
  };
  const getReportDetailData = () => {
    axios
      .get("/apiDetail/getDetailReport", {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + access_token, //the token is a variable which holds the token
        },
      })
      .then((response) => {
        const data = response.data.data;
        setReporDetailtData(data);
        // console.log(1111, "REPORT DETAIL >>>", data);
      })
      .catch((e) => {
        console.log(111, "Get Report Detail Data error !!!", e);
      });
  };
  const [dataChart, setDataChart] = useState({
    labels: [],
    datasets: chartStyle,
  });

  const displayChart = (value: string) => {
    switch (value) {
      case "Week":
        handleShowWeek();
        break;
      case "Month":
        handleShowMonth();
        break;
      case "Year":
        handleShowYear();
        break;
      default:
        break;
    }
  };
  const getWeekLabels = (start: any) => {
    const startDate = moment(start);
    const result: any = [];
    _.times(7, function (n) {
      startDate.add(1, "day");
      result.push(startDate.format("YYYY-MM-DD"));
    });
    return result;
  };
  const getWeekValues = (start: any, end: any) => {
    const result: any = [];
    if (reportData) {
      const focusHours: [any] = reportData!["focusHours"];
      focusHours &&
        focusHours.map((item) => {
          const date = moment(item.createdDate);
          if (
            date.isBetween(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"))
          ) {
            const timeFocus = item.timeFocus;
            !result[`${date.format("YYYY-MM-DD")}`]
              ? (result[`${date.format("YYYY-MM-DD")}`] = timeFocus)
              : (result[`${date.format("YYYY-MM-DD")}`] += timeFocus);
          }
        });
    }
    return result;
  };
  //get api
  useEffect(() => {
    getSummaryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    pageIndexRef.current = 0;
    displayChart(filterTypeRef.current);
    getReportDetailData();
  }, []);

  //change chart to week chart
  const handleShowWeek = () => {
    const start = moment().add(pageIndexRef.current - 1, "weeks");
    const end = moment().add(pageIndexRef.current, "weeks").add(1, "day");
    const labels = getWeekLabels(start);
    const data = getWeekValues(start, end);

    const values: any = [];
    labels.map((item: any, index: any) => {
      values[index] = 0;
      if (data[item]) {
        values[index] = data[item];
      }
    });
    const dataC: any = {
      labels: labels,
      datasets: [{ ...{ label: "Week Dataset", data: values }, ...chartStyle }],
    };
    setDataChart(dataC);
  };
  const sumValues = (previousValue: any, currentValue: any) => {
    return previousValue + currentValue;
  };
  const getYearValues = (months: any, year: any) => {
    const result: any = [];
    months.map((month: any) => {
      const monthNumber = moment().month(month).get("M") + 1;
      result[`${month}`] = 0;
      if (reportData) {
        const focusHours: [any] = reportData!["focusHours"];
        focusHours &&
          focusHours.map((item) => {
            const date = moment(item.createdDate);
            if (date.get("M") === monthNumber && date.get("year") === year) {
              const timeFocus = item.timeFocus;
              !result[`${month}`]
                ? (result[`${month}`] = timeFocus)
                : (result[`${month}`] += timeFocus);
            }
          });
      }
    });
    return result;
  };
  const getMonthValues = (startdaysInMonth: any) => {
    let result: any = [];
    startdaysInMonth.map((item: any) => {
      const start = moment(item);
      const endDate = moment(item).add(7, "days");
      const values = Object.values(getWeekValues(start, endDate));
      let sum = 0;
      values.map((x: any) => (sum += x));
      result.push(sum);
    });
    return result;
  };
  //change chart to month chart
  const handleShowMonth = () => {
    const currentmonth = moment().get("M");
    let daysInMonth: any = [];
    let momentDaysInMonth: any = [];
    const nextMonth = currentmonth + pageIndexRef.current;
    const monthDate = moment().month(nextMonth).startOf("month");
    _.times(monthDate.daysInMonth(), function (n) {
      if (monthDate.format("DD-ddd").includes("Mon")) {
        daysInMonth.push(monthDate.format("(ddd), D MMM"));
        momentDaysInMonth.push(monthDate.format("YYYY-MM-DD"));
      }
      monthDate.add(1, "day");
    });

    const monthsData = getMonthValues(momentDaysInMonth);
    if (pageIndexRef.current == 0) setTime("This Month");
    else setTime(moment().month(nextMonth).format("MM/YYYY"));
    const dataC: any = {
      labels: daysInMonth,
      datasets: [
        {
          ...{ label: "Month Dataset", data: monthsData },
          ...chartStyle,
        },
      ],
    };
    setDataChart(dataC);
  };

  //change chart to year chart
  const handleShowYear = () => {
    const selectedYear = moment().get("year");
    if (pageIndexRef.current === 0) {
      setTime("This Year");
    } else {
      setTime(`${selectedYear + pageIndexRef.current}`);
    }

    const values = getYearValues(yearList, selectedYear + pageIndexRef.current);
    const dataC: any = {
      labels: yearList,
      datasets: [
        {
          ...{ label: "Year Dataset", data: Object.values(values) },
          ...chartStyle,
        },
      ],
    };
    setDataChart(dataC);
  };

  return (
    <div className={cx("modal-report")}>
      <div className="modal-heading">
        <span>REPORT</span>
        <Button
          size="middle"
          className={cx("btn-close-custom")}
          onClick={handleCloseReport}
        >
          <div>x</div>
        </Button>
      </div>
      <div>
        <ATSTabs
          selectedIndex={0}
          data={reportTabs}
          onChange={(value) => {
            value && setSelectedTab(value);
            if (selectedTab == "Detail") {
              getReportDetailData();
            }
          }}
        ></ATSTabs>
        {selectedTab && selectedTab == "Summary" ? (
          <>
            <div>
              <div className={styles.bottomWrapper}>
                <div className={styles.activitySummary}>Activity Summary</div>
              </div>
              <div className={styles.iconDetailWrapper}>
                {activityAchivementData.map((item: any, index: number) => {
                  return (
                    <ActivityAchivement
                      icon={item.icon}
                      value={item.value}
                      desc={item.desc}
                      key={"item" + index}
                    />
                  );
                })}
              </div>
              <div>
                <div className={styles.activitySummary2}>Focus Hours</div>
              </div>
              <div>
                <div>
                  <div className={styles.navItemTime}>
                    <ATSTabs
                      selectedIndex={0}
                      data={reportFocusHoursTabs}
                      onChange={(value) => {
                        pageIndexRef.current = 0;
                        filterTypeRef.current = value;
                        displayChart(value);
                      }}
                      style={{ height: 35 }}
                    ></ATSTabs>
                    <ATSTabs
                      data={["<", `${time}`, ">"]}
                      disableIndex={1}
                      style={{ width: "70%", scale: "0.85" }}
                      onChange={(value) => {
                        if (value == "<") {
                          pageIndexRef.current--;
                        } else if (value == ">") {
                          pageIndexRef.current >= 0
                            ? (pageIndexRef.current = 0)
                            : pageIndexRef.current++;
                        }

                        if (pageIndexRef.current >= 0) {
                          setTime("This Week");
                        } else {
                          setTime(
                            moment()
                              .add(pageIndexRef.current * 7, "days")
                              .format("YYYY-MM-DD")
                          );
                        }
                        displayChart(filterTypeRef.current);
                      }}
                    ></ATSTabs>
                  </div>
                  {/* Bar Char */}
                  <div className={styles.char}>
                    <Bar data={dataChart} options={options} />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {selectedTab && selectedTab == "Detail" ? (
          <>
            <div className={styles.bottomWrapper}>
              <div className={styles.activitySummary}>Focus Time Detail</div>
            </div>
            <ReportDetail data={{ reportDetailData }}></ReportDetail>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Report);
