import type { NewEntryWithoutId, Patient } from "../types/type.ts";
import { v1 as uuid } from "uuid";
interface AddEntry {
  patient: Patient;
  entry: NewEntryWithoutId;
}

const addEntry = ({ patient, entry }: AddEntry) => {
  const id = uuid();
  patient.entries.push({ ...entry, id });
  return patient;
};

export default {
  addEntry,
};
