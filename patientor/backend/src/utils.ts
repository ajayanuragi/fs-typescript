import { z } from "zod";
import type { NewPatient } from "./types/type.ts";
import { Gender } from "./types/type.ts";

const parseNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  gender: z.enum(Gender),
  ssn: z.string(),
  occupation: z.string(),
  entries: z.array(z.object({})).optional(),
});

export const PatientIdSchema = z.object({
  id: z.string(),
});

export default parseNewPatient;
