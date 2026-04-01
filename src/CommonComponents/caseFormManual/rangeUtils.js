/**
 * Utility functions for range-based answer sheet data
 */

/**
 * Check if a value is a range object  { min, max }
 */
export const isRangeValue = (val) =>
  typeof val === "object" && val !== null && ("min" in val || "max" in val);

/**
 * Check if a value is non-numeric (yes/no, text)
 */
export const isNonNumericValue = (val) => {
  if (val === "NA" || val === "" || val === undefined || val === null) return false;
  if (isRangeValue(val)) return false;
  return isNaN(Number(val));
};

/**
 * Convert legacy single-value data to range format for display.
 * Leaves non-numeric values and "NA" untouched.
 * 
 * { "Scalp.erythema": "2" }  →  { "Scalp.erythema": { min: 2, max: 2 } }
 * { "papule": "yes" }        →  { "papule": "yes" } (unchanged)
 * { "Neck Flexor.axial": "NA" } → { "Neck Flexor.axial": "NA" } (unchanged)
 */
export const normalizeScoresToRange = (scores) => {
  if (!scores || typeof scores !== "object") return scores;

  const result = {};
  for (const [key, val] of Object.entries(scores)) {
    if (isRangeValue(val)) {
      // Already a range
      result[key] = val;
    } else if (val === "NA" || val === "" || val === undefined || val === null) {
      result[key] = val;
    } else if (isNaN(Number(val))) {
      // Non-numeric (yes/no) → keep as-is
      result[key] = val;
    } else {
      // Single numeric → convert to range
      const num = Number(val);
      result[key] = { min: num, max: num };
    }
  }
  return result;
};

/**
 * Flatten range scores back to a payload format for submission.
 * Already range objects are kept as-is.
 * { "Scalp.erythema": { min: 1, max: 3 } } → kept as-is
 */
export const flattenRangeScores = (scores) => {
  if (!scores || typeof scores !== "object") return scores;

  const result = {};
  for (const [key, val] of Object.entries(scores)) {
    result[key] = val; // Keep range objects as { min, max }
  }
  return result;
};

/**
 * Compute total for range scores — uses the average of min and max for display.
 * If value is NA or empty, skips it.
 */
export const computeRangeTotal = (scores) => {
  let total = 0;
  for (const val of Object.values(scores || {})) {
    if (val === "" || val === "NA" || val === undefined || val === null) continue;
    if (isRangeValue(val)) {
      const min = Number(val.min) || 0;
      const max = Number(val.max) || 0;
      total += (min + max) / 2;
    } else if (!isNaN(Number(val))) {
      total += Number(val);
    }
  }
  return Math.round(total * 100) / 100;
};

/**
 * Validate range data. Returns array of error strings.
//  */
export const validateRangeScores = (scores) => {
  const errors = [];
  for (const [key, val] of Object.entries(scores || {})) {
    if (val === "" || val === "NA" || val === undefined || val === null) continue;
    if (isRangeValue(val)) {
      if (val.min === "" || val.min === undefined || val.min === null) {
        errors.push(`${key}: Min value is empty`);
      }
      if (val.max === "" || val.max === undefined || val.max === null) {
        errors.push(`${key}: Max value is empty`);
      }
      if (val.min !== "" && val.max !== "" && Number(val.min) > Number(val.max)) {
        errors.push(`${key}: Min (${val.min}) is greater than Max (${val.max})`);
      }
    }
  }
  return errors;
};
