import patientData from "../../data/patients.ts";
import type { NonSensitivePatient, Patient } from "../../types/type.ts";

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

const addPatient = () => {
  return null;
};

export default {
  getPatients,
  getPatientsWithoutSSN,
  addPatient,
};
