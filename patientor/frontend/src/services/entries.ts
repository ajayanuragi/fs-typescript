import axios from "axios";
import type {  EntryFormValues, Entry } from "../types";
import { apiBaseUrl } from "../constants";

interface Create {
  id: string;
  object: EntryFormValues;
}
const create = async ({ id, object }: Create): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object,
  );

  return data;
};

export default { create };
