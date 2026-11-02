import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import entryService from "../../services/entries";
import type { Diagnosis, Entry, EntryFormValues } from "../../types";
import { isValidDate, isNotEmpty } from "../../utils/validation";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
} from "@mui/material";

interface Props {
  onEntryAdded: (entry: Entry) => void;
  diagnoses: Diagnosis[];
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const AddEntryForm = ({ onEntryAdded, diagnoses }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState("0");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const { id } = useParams();

  const resetForm = () => {
    setDate("");
    setDescription("");
    setSpecialist("");
    setDiagnosisCodes([]);
    setHealthCheckRating("0");
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setStartDate("");
    setEndDate("");
    setError("");
  };

  const validateForm = (): boolean => {
    if (!isValidDate(date)) {
      setError("Please enter a valid entry date");
      return false;
    }

    if (!isNotEmpty(description) || !isNotEmpty(specialist)) {
      setError("Description and specialist are required");
      return false;
    }

    const invalidCodes = diagnosisCodes.filter(
      (code) => !diagnoses.some((diagnosis) => diagnosis.code === code),
    );

    if (invalidCodes.length > 0) {
      setError("Please select valid diagnosis codes");
      return false;
    }

    if (type === "HealthCheck") {
      const rating = Number(healthCheckRating);

      if (
        healthCheckRating === "" ||
        !Number.isInteger(rating) ||
        rating < 0 ||
        rating > 3
      ) {
        setError("Health Check Rating must be between 0 and 3");
        return false;
      }
    }

    if (type === "Hospital") {
      if (!isValidDate(dischargeDate)) {
        setError("Please enter a valid discharge date");
        return false;
      }

      if (dischargeDate < date) {
        setError("Discharge date cannot be before entry date");
        return false;
      }

      if (!isNotEmpty(dischargeCriteria)) {
        setError("Discharge criteria is required");
        return false;
      }
    }

    if (type === "OccupationalHealthcare") {
      if (!isNotEmpty(employerName)) {
        setError("Employer name is required");
        return false;
      }

      if (startDate || endDate) {
        if (!startDate || !endDate) {
          setError("Both sick leave dates are required");
          return false;
        }

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
          setError("Please enter valid sick leave dates");
          return false;
        }

        if (startDate > endDate) {
          setError("Sick leave start date cannot be after end date");
          return false;
        }

        if (startDate < date) {
          setError("Sick leave cannot start before the entry date");
          return false;
        }
      }
    }

    return true;
  };

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError("");

    if (!id) {
      setError("Patient ID is missing");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const commonFields = {
      date,
      description: description.trim(),
      specialist: specialist.trim(),
      diagnosisCodes,
    };

    let object: EntryFormValues;

    switch (type) {
      case "HealthCheck":
        object = {
          ...commonFields,
          type: "HealthCheck",
          healthCheckRating: Number(healthCheckRating) as 0 | 1 | 2 | 3,
        };
        break;

      case "Hospital":
        object = {
          ...commonFields,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria.trim(),
          },
        };
        break;

      case "OccupationalHealthcare":
        object = {
          ...commonFields,
          type: "OccupationalHealthcare",
          employerName: employerName.trim(),
          sickLeave: startDate && endDate ? { startDate, endDate } : undefined,
        };
        break;
    }

    try {
      const addedEntry = await entryService.create({ id, object });
      onEntryAdded(addedEntry);
      resetForm();
    } catch (error: unknown) {
      console.error("Entry submission error:", error);

      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        setError(error.response?.data?.error ?? "Failed to add entry");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div>
      <h2>New Patient Entry</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={addEntry}>
        <FormControl fullWidth required>
          <InputLabel id="entry-type-label">Entry Type</InputLabel>

          <Select
            labelId="entry-type-label"
            value={type}
            label="Entry Type"
            onChange={(event) => {
              setType(event.target.value as EntryType);
              setError("");
            }}
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">
              Occupational Healthcare
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Entry date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          fullWidth
          required
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Specialist"
          value={specialist}
          onChange={(event) => setSpecialist(event.target.value)}
          required
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="diagnosis-label">Diagnosis Codes</InputLabel>

          <Select<string[]>
            labelId="diagnosis-label"
            multiple
            value={diagnosisCodes}
            onChange={(event) => {
              const value = event.target.value;

              setDiagnosisCodes(
                typeof value === "string" ? value.split(",") : value,
              );
            }}
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) =>
              selected
                .map((code) => {
                  const diagnosis = diagnoses.find((d) => d.code === code);

                  return diagnosis
                    ? `${diagnosis.code} - ${diagnosis.name}`
                    : code;
                })
                .join(", ")
            }
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                <Checkbox checked={diagnosisCodes.includes(diagnosis.code)} />

                <ListItemText
                  primary={`${diagnosis.code} - ${diagnosis.name}`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {type === "HealthCheck" && (
          <FormControl fullWidth required>
            <InputLabel>Health Check Rating</InputLabel>

            <Select
              value={healthCheckRating}
              label="Health Check Rating"
              onChange={(event) => setHealthCheckRating(event.target.value)}
            >
              <MenuItem value="0">0 - Healthy 💚</MenuItem>
              <MenuItem value="1">1 - Low Risk 💛</MenuItem>
              <MenuItem value="2">2 - High Risk 🧡</MenuItem>
              <MenuItem value="3">3 - Critical Risk ❤️</MenuItem>
            </Select>
          </FormControl>
        )}

        {type === "Hospital" && (
          <>
            <TextField
              label="Discharge Date"
              type="date"
              value={dischargeDate}
              onChange={(event) => setDischargeDate(event.target.value)}
              fullWidth
              required
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              label="Discharge Criteria"
              value={dischargeCriteria}
              onChange={(event) => setDischargeCriteria(event.target.value)}
              fullWidth
              required
            />
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer Name"
              value={employerName}
              onChange={(event) => setEmployerName(event.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Sick Leave Start Date (Optional)"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              label="Sick Leave End Date (Optional)"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </>
        )}

        <Button type="submit" variant="contained">
          Add
        </Button>

        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={resetForm}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default AddEntryForm;
