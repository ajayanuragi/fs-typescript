import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import entryService from "../../services/entries";
import type { Entry, EntryFormValues } from "../../types";
import { isValidDate, isNotEmpty } from "../../utils/validation";

interface Props {
  onEntryAdded: (entry: Entry) => void;
}

type EntryType =
  | "HealthCheck"
  | "Hospital"
  | "OccupationalHealthcare";

const AddEntryForm = ({ onEntryAdded }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");

  // Common fields
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCode, setDiagnosisCode] = useState("");

  // HealthCheck fields
  const [healthCheckRating, setHealthCheckRating] = useState("");

  // Hospital fields
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // OccupationalHealthcare fields
  const [employerName, setEmployerName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [error, setError] = useState("");

  const { id } = useParams();

  const resetForm = () => {
    setDate("");
    setDescription("");
    setSpecialist("");
    setDiagnosisCode("");
    setHealthCheckRating("");
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
      }
    }

    return true;
  };

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError("");

    if (!id || !validateForm()) {
      return;
    }

    const commonFields = {
      date,
      description: description.trim(),
      specialist: specialist.trim(),
      diagnosisCodes: diagnosisCode
        .split(",")
        .map((code) => code.trim())
        .filter(Boolean),
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
          sickLeave:
            startDate && endDate
              ? { startDate, endDate }
              : undefined,
        };
        break;
    }

    try {
      const addedEntry = await entryService.create({ id, object });
      onEntryAdded(addedEntry);
      resetForm();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
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
        {/* Entry type */}
        <fieldset>
          <legend>Entry Type</legend>
          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value as EntryType);
              setError("");
            }}
          >
            <option value="HealthCheck">Health Check</option>
            <option value="Hospital">Hospital</option>
            <option value="OccupationalHealthcare">
              Occupational Healthcare
            </option>
          </select>
        </fieldset>

        {/* Common fields */}
        <fieldset>
          <legend>Date</legend>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </fieldset>

        <fieldset>
          <legend>Description</legend>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </fieldset>

        <fieldset>
          <legend>Specialist</legend>
          <input
            value={specialist}
            onChange={(event) => setSpecialist(event.target.value)}
            required
          />
        </fieldset>

        <fieldset>
          <legend>Diagnosis Codes (comma-separated)</legend>
          <input
            value={diagnosisCode}
            onChange={(event) => setDiagnosisCode(event.target.value)}
          />
        </fieldset>

        {/* HealthCheck-specific fields */}
        {type === "HealthCheck" && (
          <fieldset>
            <legend>Health Check Rating (0-3)</legend>
            <input
              type="number"
              min="0"
              max="3"
              step="1"
              value={healthCheckRating}
              onChange={(event) =>
                setHealthCheckRating(event.target.value)
              }
              required
            />
          </fieldset>
        )}

        {/* Hospital-specific fields */}
        {type === "Hospital" && (
          <>
            <fieldset>
              <legend>Discharge Date</legend>
              <input
                type="date"
                value={dischargeDate}
                onChange={(event) =>
                  setDischargeDate(event.target.value)
                }
                required
              />
            </fieldset>

            <fieldset>
              <legend>Discharge Criteria</legend>
              <input
                value={dischargeCriteria}
                onChange={(event) =>
                  setDischargeCriteria(event.target.value)
                }
                required
              />
            </fieldset>
          </>
        )}

        {/* OccupationalHealthcare-specific fields */}
        {type === "OccupationalHealthcare" && (
          <>
            <fieldset>
              <legend>Employer Name</legend>
              <input
                value={employerName}
                onChange={(event) =>
                  setEmployerName(event.target.value)
                }
                required
              />
            </fieldset>

            <fieldset>
              <legend>Sick Leave Start Date (Optional)</legend>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </fieldset>

            <fieldset>
              <legend>Sick Leave End Date (Optional)</legend>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </fieldset>
          </>
        )}

        <button type="submit">Add Entry</button>

        <button type="button" onClick={resetForm}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddEntryForm;
