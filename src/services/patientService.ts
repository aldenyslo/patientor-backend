import { v1 as uuid } from "uuid";
import patients from "../../data/patients";

import { NonSensitivePatient, Patient, NewPatient, NewEntry } from "../types";

const nonSensitivePatients: NonSensitivePatient[] = patients.map(
  ({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  })
);

const getAll = (): Patient[] => {
  return patients;
};

const getNonSensitive = (): NonSensitivePatient[] => {
  return nonSensitivePatients;
};

const getPatientById = (id: string) => {
  return patients.find((p) => p.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatient);

  return newPatient;
};

const addEntry = (id: string, entry: NewEntry) => {
  const patient = patients.find((p) => p.id === id);

  if (patient) {
    const newEntry = {
      ...entry,
      id: uuid(),
    };
    patient.entries = patient.entries.concat(newEntry);
  }

  return patient;
};

export default {
  getAll,
  getNonSensitive,
  getPatientById,
  addPatient,
  addEntry,
};
