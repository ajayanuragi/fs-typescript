import diagnosesData from "../data/diagnoses.ts";
import type { Diagnosis } from "../types/type.ts";
const diagnoses: Diagnosis[] = diagnosesData;
const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const addDiagnoses = () => {
  return null;
};

export default {
  getDiagnoses,
  addDiagnoses,
};
