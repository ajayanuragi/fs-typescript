import express from "express";
import diagnosesService from "../services/diagnosesService.ts";
const router = express.Router();

router.get("/", (_req, res) => {
  const data = diagnosesService.getDiagnoses();
  res.send(data);
});

router.post("/", (_req, res) => {
  res.send("saving a diagnosis");
});

export default router;
