import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Diagnosis, Patient } from "../../types";
import patientService from "../../services/patients";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  Chip,
  Box,
} from "@mui/material";
import { EntryDetails } from "../EntryDetails";

interface Props {
  diagnoses: Diagnosis[];
}

export const PatientPage = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const params = useParams<Record<string, string | undefined>>();
  const id = params.id;
  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchPatient = async () => {
      const patient = await patientService.getById(id);
      setPatient(patient);
    };

    fetchPatient();
  }, [id]);

  if (!patient) {
    return (
      <Container>
        <Typography>Loading patient information...</Typography>
      </Container>
    );
  }
  const getGenderIcon = () => {
    switch (patient.gender) {
      case "male":
        return <MaleIcon />;
      case "female":
        return <FemaleIcon />;
      default:
        return <TransgenderIcon />;
    }
  };

  return (
    <div className="app">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h4" component="h1">
              {patient.name}{" "}
              <Chip
                icon={getGenderIcon()}
                label={patient.gender}
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Typography>

            <Divider />
            <Typography variant="body1">
              <strong>SSN:</strong> {patient.ssn}
            </Typography>

            <Typography variant="body1">
              <strong>Occupation:</strong> {patient.occupation}
            </Typography>

            <Typography variant="body1">
              <strong>Date of birth:</strong> {patient.dateOfBirth}
            </Typography>
            <br />
            {patient.entries && patient.entries?.length > 0 && (
              <>
                <Typography variant="h5" component="h4">
                  entries
                </Typography>
                {patient?.entries.map((entry) => (
                  <EntryDetails
                    entry={entry}
                    diagnoses={diagnoses}
                    key={entry.id}
                  />
                ))}
              </>
            )}
          </Box>
        </Stack>
      </Paper>
    </div>
  );
};
