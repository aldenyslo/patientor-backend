import {
  NewPatient,
  Gender,
  Diagnosis,
  NewEntry,
  Discharge,
  SickLeave,
} from "./types";

const isNumber = (value: unknown): value is number => {
  return typeof value === "number" || value instanceof Number;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (text: unknown): string => {
  if (!isString(text)) {
    throw new Error(`Invalid value: ${text}`);
  }
  return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing date: ${date}`);
  }
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error(`Invalid or missing gender`);
  }
  return gender;
};

const parseHealthCheckRating = (value: unknown): 0 | 1 | 2 | 3 => {
  if (
    isNumber(value) &&
    (value === 0 || value === 1 || value === 2 || value === 3)
  ) {
    return value;
  }
  throw new Error(`Value of health check rating incorrect: ${value}`);
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const parseDischarge = (object: unknown): Discharge | undefined => {
  if (!object || typeof object !== "object" || !("discharge" in object)) {
    return undefined;
  }

  const discharge = object.discharge;

  if (!discharge || typeof discharge !== "object") {
    throw new Error("invalid discharge");
  }
  if (
    !("date" in discharge) ||
    !isString(discharge.date) ||
    !isDate(discharge.date)
  ) {
    throw new Error("invalid discharge date");
  }
  if (!("criteria" in discharge) || !isString(discharge.criteria)) {
    throw new Error("invalid discharge criteria");
  }

  return {
    date: discharge.date,
    criteria: discharge.criteria,
  };
};

const parseSickLeave = (object: unknown): SickLeave | undefined => {
  if (!object || typeof object !== "object" || !("sickLeave" in object)) {
    return undefined;
  }

  const sickLeave = object.sickLeave;

  if (!sickLeave || typeof sickLeave !== "object") {
    throw new Error("invalid sick leave");
  }
  if (
    !("startDate" in sickLeave) ||
    !isString(sickLeave.startDate) ||
    !isDate(sickLeave.startDate)
  ) {
    throw new Error("invalid sick leave start date");
  }
  if (
    !("endDate" in sickLeave) ||
    !isString(sickLeave.endDate) ||
    !isDate(sickLeave.endDate)
  ) {
    throw new Error("invalid sick leave end date");
  }

  return {
    startDate: sickLeave.startDate,
    endDate: sickLeave.endDate,
  };
};

export const toNewPatientEntry = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newEntry: NewPatient = {
      name: parseString(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation),
      entries: [],
    };
    return newEntry;
  }

  throw new Error("Incorrect data: some fields are missing");
};

export const parseEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (!("type" in object)) throw new Error("type missing");
  if (!("date" in object)) throw new Error("date missing");
  if (!("specialist" in object)) throw new Error("specialist missing");
  if (!("description" in object)) throw new Error("description missing");

  const common = {
    description: parseString(object.description),
    date: parseDate(object.date),
    specialist: parseString(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  if (object.type === "HealthCheck") {
    if (!("healthCheckRating" in object)) {
      throw new Error("health check rating missing");
    }

    return {
      ...common,
      type: "HealthCheck",
      healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
    };
  } else if (object.type === "OccupationalHealthcare") {
    if (!("employerName" in object)) {
      throw new Error("employer name missing");
    }

    return {
      ...common,
      type: "OccupationalHealthcare",
      employerName: parseString(object.employerName),
      sickLeave: parseSickLeave(object),
    };
  } else if (object.type === "Hospital") {
    return {
      ...common,
      type: "Hospital",
      discharge: parseDischarge(object),
    };
  }

  throw new Error(`Incorrect type: ${object.type}`);
};
