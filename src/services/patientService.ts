import { v1 as uuid } from "uuid";
import patients from "../../data/patients";

import { NonSensitivePatient, Patient, NewPatientEntry } from "../types";

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

const add = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatientEntry);

  return newPatientEntry;
};

export default { getAll, getNonSensitive, getPatientById, add };
