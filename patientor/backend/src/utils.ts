import { z } from "zod";
import type { NewPatient } from "./types/type.ts";
import { Gender, HealthCheckRating } from "./types/type.ts";

const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.iso.date(),
    criteria: z.string(),
  }),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ]),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.iso.date(),
      endDate: z.iso.date(),
    })
    .optional(),
});

export const EntrySchema = z.discriminatedUnion("type", [
  HospitalEntrySchema,
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

const NewHealthCheckEntrySchema = HealthCheckEntrySchema.omit({ id: true });
const NewHospitalEntrySchema = HospitalEntrySchema.omit({ id: true });
const NewOccupationalHealthcareEntrySchema =
  OccupationalHealthcareEntrySchema.omit({ id: true });


export const NewEntrySchema = z.discriminatedUnion("type", [
  NewHospitalEntrySchema,
  NewHealthCheckEntrySchema,
  NewOccupationalHealthcareEntrySchema,
]);

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  gender: z.enum(Gender),
  ssn: z.string(),
  occupation: z.string(),
  entries: z.array(EntrySchema).optional(),
});

const parseNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export const PatientIdSchema = z.object({
  id: z.string(),
});

export default parseNewPatient;
