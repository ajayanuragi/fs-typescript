import type { NewPatient } from "../types/type.ts";
import { Gender } from "../types/type.ts";

const parseNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "gender" in object &&
    "occupation" in object &&
    "ssn" in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      ssn: parseSsn(object.ssn),
    };
    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error("Incorrect or missing name");
  }
  return name;
};
const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error("Incorrect or missing dateOfBirth " + dateOfBirth);
  }
  return dateOfBirth;
};
const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Incorrect or missing ssn " + ssn);
  }
  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error("Incorrect or missing occupation " + occupation);
  }
  return occupation;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing Gender " + gender);
  }
  return gender;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return (Object.values(Gender) as string[]).includes(param);
};

export default parseNewPatient;
