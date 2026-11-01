import type { NewEntryWithoutId, Patient } from "../types/type.ts";
import { v1 as uuid } from "uuid";
interface AddEntry {
  patient: Patient;
  entry: NewEntryWithoutId;
}

const addEntry = ({ patient, entry }: AddEntry) => {
  const id = uuid();
  const newEntry = { ...entry, id };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  addEntry,
};
