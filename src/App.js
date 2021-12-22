import logo from "./logo.svg";
import "./App.css";
import moment from "moment";
import { useEffect, useState } from "react";
const addRealMonth = (d, n) => {
  const current = moment(d);
  const newDate = moment(d);
  while (true) {
    if (newDate.format("MM") !== current.format("MM")) return newDate;
    newDate.add(n, "day");
  }
};
function App() {
  const [currentMonth, setCurrentMonth] = useState(moment().format("MM.YYYY"));
  const [currentMonthTime, setCurrentMonthTime] = useState(moment());
  const [data, setData] = useState([]);
  const [showingMonth, setShowingMonth] = useState([]);

  useEffect(() => {
    updateShowingMonth();
    const get = localStorage.getItem("data");
    if (get) {
      try {
        const json = JSON.parse(get);
        setData(json);
      } catch (err) {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    updateShowingMonth(currentMonthTime);
  }, [currentMonthTime]);
  const updateShowingMonth = (now = moment()) => {
    now = moment(now);
    now.set("date", 1);
    console.log(now.toDate());
    setCurrentMonth(now.format("MM.YYYY"));
    const days = [];
    for (let i = 1; i < now.day(); i++) {
      days.push({ dontShow: true });
    }
    let firstChanged = false;
    while (true) {
      if (now.format("DD") === "01" && firstChanged) break;
      days.push({ title: now.format("DD"), data: [] });
      firstChanged = true;
      now.add(1, "day");
    }
    const reduced = days.reduce((initialValue = [], item, index) => {
      if (index === 1) {
        return [[initialValue, item]];
      } else if (initialValue[initialValue.length - 1].length === 7) {
        initialValue.push([item]);
      } else {
        initialValue[initialValue.length - 1].push(item);
      }
      return initialValue;
    });
    setShowingMonth(reduced);
  };
  const [dataAdding, setDataAdding] = useState(false);
  const startAddData = (date) => {
    setDataAdding(true);
    setSelectedDate(date);
  };
  const [newTitle, setNewTitle] = useState("");
  const [hour, setHour] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const addData = (newData) => {
    setData([...data, newData]);
    setHour("");
    setNewTitle("");
    setDataAdding(false);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "700px",
        height: "600px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={() =>
            setCurrentMonthTime(addRealMonth(currentMonthTime, -1))
          }
        >
          Önceki Ay
        </div>
        <div>{currentMonth}</div>
        <div
          onClick={() => setCurrentMonthTime(addRealMonth(currentMonthTime, 1))}
        >
          Sonraki Ay
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {showingMonth.map((dayRow, dayKey) => (
          <div
            key={dayKey}
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {dayRow.map((day, key) => (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  flexDirection: "column",
                }}
                key={key}
              >
                {!day.dontShow && (
                  <>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        startAddData(day.title);
                      }}
                    >
                      {day.title}
                    </div>
                    {data
                      .filter(
                        (item2) => item2.date === day.title + "." + currentMonth
                      )
                      .map((item2, key2) => (
                        <div key={key2}>
                          {item2.title + "( " + item2.hour + " )"}
                        </div>
                      ))}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {dataAdding && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <h3>Yeni Hatırlatıcı</h3>
          </div>
          <div>
            Başlık :{" "}
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            Saat :{" "}
            <select value={hour} onChange={(e) => setHour(e.target.value)}>
              <option>Saat Seçiniz</option>
              {[...new Array(24)].map((item, key) => (
                <option
                  value={(key < 10 ? "0" + key : key) + ":" + "00"}
                  key={key}
                >
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={() =>
                addData({
                  hour,
                  title: newTitle,
                  date: selectedDate + "." + currentMonth,
                })
              }
            >
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
