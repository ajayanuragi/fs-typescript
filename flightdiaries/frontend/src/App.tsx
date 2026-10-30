import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
interface DiaryEntry {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    axios.get<DiaryEntry[]>("/api/diaries").then((response) => {
      setDiaryEntries(response.data);
    });
  }, []);

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
    </div>
  );
}

export default App;
