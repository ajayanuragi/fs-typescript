import express from "express";
import { calculateBmi } from "./bmiCalculator.ts";
import { calculateExercises, type Result } from "./exerciseCalculator.ts";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (
    !req.query.height ||
    !req.query.weight ||
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    height <= 0 ||
    weight <= 0
  ) {
    res.status(400).json({
      error: "malformatted parameters",
    });
    return;
  }

  const bmi = calculateBmi(height, weight);
  console.log(bmi);
  res.json({
    weight,
    height,
    bmi,
  });
});


app.post("/exercises", (req, res) => {
  const body: unknown = req.body;

  if (typeof body !== "object" || body === null) {
    res.status(400).json({ error: "parameters missing" });
    return;
  }

  if (!("daily_exercises" in body) || !("target" in body)) {
    res.status(400).json({ error: "parameters missing" });
    return;
  }

  const daily_exercises = body.daily_exercises;
  const target = body.target;

  if (
    !Array.isArray(daily_exercises) ||
    !daily_exercises.every(
      (value: unknown): value is number =>
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0
    ) ||
    typeof target !== "number" ||
    !Number.isFinite(target) ||
    target <= 0
  ) {
    res.status(400).json({ error: "malformatted parameters" });
    return;
  }

  const result: Result = calculateExercises(daily_exercises, target);
  res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
