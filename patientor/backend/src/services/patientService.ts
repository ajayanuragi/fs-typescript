import patientData from "../data/patients.ts";
import { v1 as uuid } from "uuid";
import type {
  NonSensitivePatient,
  Patient,
  NewPatient,
} from "../types/type.ts";

const patients: Patient[] = patientData;
const getPatients = (): Patient[] => {
  return patients;
};

const getPatientsWithoutSSN = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPatientsWithoutSSN,
  addPatient,
};
