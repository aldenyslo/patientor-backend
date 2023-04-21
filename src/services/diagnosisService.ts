import diagnosisData from "../../data/diagnoses";

import { Diagnosis } from "../types";

const getAll = (): Diagnosis[] => {
  return diagnosisData;
};

export default { getAll };
