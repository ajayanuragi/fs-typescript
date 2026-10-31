import React, { useState, useEffect } from "react";
import type { DiaryEntry } from "./types";
import { Weather, Visibility } from "./types";
import diaryService from "./diaryService";
import "./App.css";

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    diaryService.getAllDiaries().then((diaries) => setDiaryEntries(diaries));
  }, []);

  const newEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    diaryService
      .create({ comment, date, visibility, weather })
      .then((addedNote) => {
        setDiaryEntries((prev) => [...prev, addedNote]);
      });
  };

  return (
    <div>
      <h1>diaries</h1>
      {diaryEntries.map((diary) => (
        <div key={diary.id}>
          <p>{diary.date}</p>
          <p>{diary.weather}</p>
          <p>{diary.visibility}</p>
          <br />
        </div>
      ))}
      <form onSubmit={newEntry}>
        <input
          placeholder="add comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <select
          value={weather}
          onChange={(event) => setWeather(event.target.value as Weather)}
        >
          <option >Select Weather</option>
          {Object.entries(Weather).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </select>
        <select
          value={visibility}
          onChange={(event) => setVisibility(event.target.value as Visibility)}
        >
          <option>Select Visibility</option>
          {Object.entries(Visibility).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </select>

        <button type="submit">add new diary entry</button>
      </form>
    </div>
  );
}

export default App;
