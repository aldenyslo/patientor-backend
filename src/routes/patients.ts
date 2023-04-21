import express from "express";
import patientService from "../services/patientService";
import { toNewPatientEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNonSensitive());
});

router.get("/:id", (req, res) => {
  const foundPatient = patientService.getPatientById(req.params.id);
  if (foundPatient) {
    res.json(foundPatient);
  } else {
    res.status(404).end();
  }
});

router.post("/", (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);

    const addedEntry = patientService.add(newPatientEntry);
    res.json(addedEntry);
  } catch (err: unknown) {
    let errorMessage = "Something went wrong.";
    if (err instanceof Error) {
      errorMessage += " Error: " + err.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
