import type { z } from "zod";
import type { NewPatientSchema } from "../utils.ts";

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {}

export const Gender = {
  Male: "male",
  Female: "female",
  Other: "other",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];
export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;
export type NewPatient = z.infer<typeof NewPatientSchema>;
export interface Patient extends NewPatient {
  id: string;
}
