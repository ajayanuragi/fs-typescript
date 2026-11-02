import { HealthAndSafety, MedicalServices, Work } from "@mui/icons-material";
import { Diagnosis, Entry } from "../../types";

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}
const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};
const ratingEmoji = {
  0: "💚",
  1: "💛",
  2: "🧡",
  3: "❤️",
};

export const EntryDetails = ({ entry, diagnoses }: Props) => {
  let entryContent;
  switch (entry.type) {
    case "Hospital":
      entryContent = (
        <>
          <MedicalServices />
          <p>Discharge Date : {entry.discharge.date}</p>
          <p>Discharge Criteria: {entry.discharge.criteria}</p>
        </>
      );
      break;
    case "HealthCheck":
      entryContent = (
        <>
          <HealthAndSafety />
        </>
      );
      break;
    case "OccupationalHealthcare":
      entryContent = (
        <>
          <Work />
          <p>Employer: {entry.employerName}</p>

          {entry.sickLeave && (
            <p>
              Sick leave: {entry.sickLeave.startDate} -{" "}
              {entry.sickLeave.endDate}
            </p>
          )}
        </>
      );
      break;
    default:
      return assertNever(entry);
  }
  return (
    <div>
      <div>
        {entry.date} {entryContent}
        <br />
       <p> {entry.description}</p>
      </div>

      <ul>
        {entry.diagnosisCodes?.map((code) => {
          const diagnosis = diagnoses.find((d) => d.code === code);

          return (
            <li key={code}>
              {code} {diagnosis?.name ?? "Unknown diagnosis"}
            </li>
          );
        })}
      </ul>
      
      {entry.type === "HealthCheck" && (
        <span>{ratingEmoji[entry.healthCheckRating]}</span>
      )}
      <p>Diagnosed by {entry.specialist}</p>
    </div>
  );
};
