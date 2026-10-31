import React, { useState, useEffect } from "react";
import axios from "axios";
import type { DiaryEntry } from "./types";
import { Weather, Visibility } from "./types";
import diaryService from "./diaryService";
import "./App.css";

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weather, setWeather] = useState<Weather>(Weather.Cloudy);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<boolean | string>(false);

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      setError(error.response?.data?.error || error.message);
    } else {
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const diaries = await diaryService.getAllDiaries();
        setDiaryEntries(diaries);
      } catch (error) {
        handleError(error);
      }
    };

    fetchDiaries();
  }, []);

  const newEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const addedNote = await diaryService.create({
        comment,
        date,
        visibility,
        weather,
      });
      setDiaryEntries((prev) => [...prev, addedNote]);
      setComment("");
      setError(false);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>New Entry</h3>
      <form onSubmit={newEntry}>
        <div>
          <label>Comment</label>
          <input
            placeholder="add comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        {/*Weather*/}
        <div>
          <fieldset>
            <legend>Select Weather:</legend>

            {Object.entries(Weather).map(([key, value]) => (
              <div key={key}>
                <input
                  type="radio"
                  id={value}
                  name="weather"
                  value={value}
                  checked={weather === value}
                  onChange={() => setWeather(value as Weather)}
                />

                <label htmlFor={value}>{key}</label>
              </div>
            ))}
          </fieldset>
        </div>
        {/*Visibility*/}

        <div>
          <fieldset>
            <legend>Select Visibility</legend>
            {Object.entries(Visibility).map(([key, value]) => (
              <div key={key}>
                <input
                  type="radio"
                  id={value}
                  name="visibility"
                  value={value}
                  checked={visibility === value}
                  onChange={() => setVisibility(value as Visibility)}
                />
                <label htmlFor={value}>{key}</label>
              </div>
            ))}
          </fieldset>
        </div>
        <button type="submit">add new diary entry</button>
      </form>

      <h3>All Entries</h3>
      {diaryEntries.map((diary) => (
        <div key={diary.id}>
          <p>{diary.date}</p>
          <p>{diary.weather}</p>
          <p>{diary.visibility}</p>
          <br />
        </div>
      ))}
    </div>
  );
}

export default App;
