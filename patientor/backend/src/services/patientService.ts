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
const getPatient = (id: string): Patient => {
  const patient = patients.find((patient) => patient.id === id);
  if (!patient) {
    throw new Error("Patient not found with id: " + id);
  }
  return patient;
};

const addPatient = (patient: NewPatient): Patient => {
  const id = uuid();
  const newPatient: Patient = {
    id,
    ...patient,
    entries: patient.entries ?? [],
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPatient,
  getPatientsWithoutSSN,
  addPatient,
};
