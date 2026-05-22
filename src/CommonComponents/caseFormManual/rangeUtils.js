/**
 * Utility functions for range-based answer sheet data
 */

export const FORM_SCHEMAS = {
  MMT_8: [
    "Deltoid.right", "Deltoid.left", "Biceps.right", "Biceps.left",
    "Quadriceps.right", "Quadriceps.left", "Gluteus Medius.right", "Gluteus Medius.left",
    "Gluteus Maximus.right", "Gluteus Maximus.left", "Wrist Extensor.right", "Wrist Extensor.left",
    "Ankle Dorsiflexion.right", "Ankle Dorsiflexion.left", "Neck Flexor.axial"
  ],
  CDASI_Activity: [
    "Scalp", "Malar Area", "Periorbital", "Rest of the Face", "V‑area Neck (Frontal)",
    "Posterior Neck", "Upper Back & Shoulders", "Rest of Back & Buttocks", "Abdomen",
    "Lateral Upper Thigh", "Rest of Leg & Feet", "Arm", "Mechanic's Hand",
    "Dorsum of Hands (Not Over Joints)", "Gottron's - Not on Hands"
  ].flatMap(loc => [`${loc}.erythema`, `${loc}.scale`, `${loc}.erosion`]),
  CDASI_Damage: [
    "Scalp", "Malar Area", "Periorbital", "Rest of the Face", "V‑area Neck (Frontal)",
    "Posterior Neck", "Upper Back & Shoulders", "Rest of Back & Buttocks", "Abdomen",
    "Lateral Upper Thigh", "Rest of Leg and feet", "Arm", "Mechanic's Hand",
    "Dorsums of hands (Not Over Joints)", "Gottron's - Not on Hands"
  ].flatMap(loc => [`${loc}.poikilo`, `${loc}.calcinosis`]),
  Gottron_Hands: [
    "score", "ulcer", "damage"
  ],
  Periungual: ["peri"],
  Alopecia: ["hairLoss"],
  MDAAT: [
    "constitutional.vas", "pyrexia.cf", "weightLoss.cf", "fatigue.cf",
    "cutaneous.vas", "cutaneousUlceration.cf", "erythroderma.cf", "panniculitis.cf",
    "erythemaWithSec.cf", "erythemaNoSec.cf", "heliotrope.cf", "gottrons.cf", "periungualCap.cf",
    "diffuseHair.cf", "patchyHair.cf", "mechanicsHand.cf",
    "skeletal.vas", "polyarthritis.cf", "moderateArth.cf", "mildArth.cf", "arthralgia.cf",
    "gi.vas", "dysphagiaSevere.cf", "dysphagiaMild.cf", "abdPainSevere.cf", "abdPainModerate.cf", "abdPainMild.cf",
    "pulmonary.vas", "dyspneaRest.cf", "dyspneaExert.cf", "dyspneaILD.cf", "parenchymal.cf", "pft.cf", "dysphoniaSevere.cf", "dysphoniaMild.cf",
    "cardio.vas", "pericarditis.cf", "myocarditis.cf", "arrhythmiaSevere.cf", "arrhythmiaOther.cf", "sinusTachy.cf",
    "oda.vas", "oda.cf", "extraMuscular.vas", "muscle.vas", "myositisSevere.cf", "myositisModerate.cf", "myositisMild.cf", "myalgia.cf", "global.vas"
  ],
  Physician: ["physicianGlobal.vas"]
};

/**
 * Check if a value is a range object { min, max }
 */
export const isRangeValue = (val) =>
  val && typeof val === "object" && ("min" in val || "max" in val);

/**
 * Check if a value is a preset object { value }
 */
export const isPresetValue = (val) =>
  val && typeof val === "object" && "value" in val;

/**
 * Check if a value is non-numeric (yes/no, text)
 */
export const isNonNumericValue = (val) => {
  if (val === "NA" || val === "" || val === undefined || val === null) return false;
  if (isRangeValue(val) || isPresetValue(val)) return false;
  return isNaN(Number(val));
};



export const normalizeScoresToRange = (scores) => {
  if (!scores || typeof scores !== "object") return scores;

  const result = {};

  for (const [key, val] of Object.entries(scores)) {

    // ── Primitive / null — pass through as-is ──────────────────────────────
    if (!val || typeof val !== "object") {
      result[key] = val;
      continue;
    }

    const expertNumber = val.expertNumber ?? "";

    // ── 1.  NEW API format: { min, max, expertNumber, defaultSelection } ────
    //        defaultSelection takes priority over min/max because the backend
    //        stores BOTH in the same record but only one branch is "active".
    // if ("defaultSelection" in val) {
    //   const ds = val.defaultSelection;

    //   if (ds === "0/NA") {
    //     // Both 0 and NA selected
    //     result[key] = { value: { zero: 0, na: "NA" }, expertNumber };
    //     continue;
    //   }
    //   if (ds === "0") {
    //     result[key] = { value: 0, expertNumber };
    //     continue;
    //   }
    //   if (ds === "NA") {
    //     result[key] = { value: "NA", expertNumber };
    //     continue;
    //   }

    //   // defaultSelection is null / "" / unknown → fall through to range logic
    //   result[key] = {
    //     min: val.min ?? "",
    //     max: val.max ?? "",
    //     expertNumber,
    //   };
    //   continue;
    // }


    if ("defaultSelection" in val) {

  result[key] = {
    min: val.min ?? "",
    max: val.max ?? "",
    expertNumber,
  };

  const ds = val.defaultSelection;

  if (ds === "0/NA") {
    result[key].value = { zero: 0, na: "NA" };
  }
  else if (ds === "0") {
    result[key].value = 0;
  }
  else if (ds === "NA") {
    result[key].value = "NA";
  }

  continue;
}








    // ── 2.  Pure range object: { min, max } ────────────────────────────────
    if ("min" in val || "max" in val) {
      result[key] = {
        min: val.min ?? "",
        max: val.max ?? "",
        expertNumber,
      };
      continue;
    }

    // ── 3.  Direct zero/na keys (older backend shape) ──────────────────────
    const hasZero = val.zero === 0;
    const hasNA   = val.na === "NA";

    if ("value" in val) {
      result[key] = { value: val.value, expertNumber };
      continue;
    }
    if (hasZero && hasNA) {
      result[key] = { value: { zero: 0, na: "NA" }, expertNumber };
      continue;
    }
    if (hasZero) {
      result[key] = { value: 0, expertNumber };
      continue;
    }
    if (hasNA) {
      result[key] = { value: "NA", expertNumber };
      continue;
    }

    // ── 4.  Fallback: spread the object and ensure expertNumber ────────────
    result[key] = { ...val, expertNumber };
  }

  return result;
};








/**
 * Flatten range scores back to a payload format for submission.
 */
export const flattenRangeScores = (scores) => {
  if (!scores || typeof scores !== "object") return scores;
  return { ...scores };
};

/**
 * Compute total for range scores.
 */
export const computeRangeTotal = (scores) => {
  let total = 0;
  for (const val of Object.values(scores || {})) {
    if (!val || val === "NA") continue;

    if (isPresetValue(val)) {
      const v = val.value;
      if (v === 0) total += 0;
      else if (v && typeof v === 'object' && v.zero === 0) total += 0;
      // "NA" adds nothing
    } else if (isRangeValue(val)) {
      const min = Number(val.min) || 0;
      const max = Number(val.max) || 0;
      total += (min + max) / 2;
    } else if (!isNaN(Number(val)) && typeof val !== 'object') {
      total += Number(val);
    }
  }
  return Math.round(total * 100) / 100;
};






export const transformPayload = (data) => {
  if (!data || typeof data !== "object") return data;

  const result = {};

  for (const [key, val] of Object.entries(data)) {

    let min = null;
    let max = null;
    let defaultSelection = null;
    let expertNumber = "";

    if (val && typeof val === "object") {

      expertNumber = val.expertNumber ?? "";

      // ─── RANGE CASE ─────────────────────────
      if ("min" in val || "max" in val) {
        if (val.min !== "" && val.max !== "") {
          min = Number(val.min);
          max = Number(val.max);
          defaultSelection = null; // important rule
        }
      }

      // ─── PRESET CASE ────────────────────────
      // if ("value" in val) {
      //   const v = val.value;

      //   if (v === 0) {
      //     defaultSelection = "0";
      //   } 
      //   else if (v === "NA") {
      //     defaultSelection = "NA";
      //   } 
      //   else if (typeof v === "object") {
      //     const hasZero = v.zero === 0;
      //     const hasNA = v.na === "NA";

      //     if (hasZero && hasNA) {
      //       defaultSelection = "0/NA";
      //     } else if (hasZero) {
      //       defaultSelection = "0";
      //     } else if (hasNA) {
      //       defaultSelection = "NA";
      //     }
      //   }

      //   // enforce rule
      //   min = null;
      //   max = null;
      // }


    if ("value" in val) {
  const v = val.value;

  if (v === 0) {
    defaultSelection = "0";
  } 
  else if (v === "NA") {
    defaultSelection = "NA";
  } 
  else if (typeof v === "object") {
    const hasZero = v.zero === 0;
    const hasNA = v.na === "NA";

    if (hasZero && hasNA) {
      defaultSelection = "0/NA";
    } else if (hasZero) {
      defaultSelection = "0";
    } else if (hasNA) {
      defaultSelection = "NA";
    }
  }

  // DO NOT wipe min/max anymore
}







      // ─── DIRECT zero/na CASE (from API normalize) ─────
      if ("zero" in val || "na" in val) {
        const hasZero = val.zero === 0;
        const hasNA = val.na === "NA";

        if (hasZero && hasNA) {
          defaultSelection = "0/NA";
        } else if (hasZero) {
          defaultSelection = "0";
        } else if (hasNA) {
          defaultSelection = "NA";
        }

        min = null;
        max = null;
      }

    }

    // ✅ ALWAYS SEND ALL KEYS
    result[key] = {
      min,
      max,
      defaultSelection,
      expertNumber: expertNumber !== undefined ? String(expertNumber) : ""
    };
  }

  return result;
};








/**
 * Validate that every field in a form's scores object has at least one of:
 *   1. A complete range  — both min AND max are filled (non-empty, non-null)
 *   2. A preset/dropdown — a "value" key OR direct "zero"/"na" keys are present
 *
 * Primitive values (e.g. expertNumber stored as a top-level key) are skipped
 * because they are metadata, not answer fields.
 *
 * Used ONLY for new submissions (not updates).
 */
export const validateRequiredFields = (scores, formName) => {
  const errors = [];
  
  const baseFormName = formName ? formName.replace(/_(initial|followUp)$/, '') : '';
  const expectedKeys = FORM_SCHEMAS[baseFormName] || Object.keys(scores || {});

  for (const key of expectedKeys) {
    const val = scores ? scores[key] : null;

    // Check if the value is completely missing or not an object
    if (!val || typeof val !== "object") {
      errors.push(`${key}: Required`);
      continue;
    }

    // ── 1. Range satisfied: both min AND max are filled ──────────────────
    const hasRange =
      ("min" in val || "max" in val) &&
      val.min !== "" &&
      val.max !== "" &&
      val.min !== null &&
      val.max !== null &&
      val.min !== undefined &&
      val.max !== undefined;

    // ── 2a. Preset via "value" key (set by RangeInput dropdown) ──────────
    const hasPresetValue =
      "value" in val &&
      val.value !== "" &&
      val.value !== null &&
      val.value !== undefined;

    // ── 2b. Preset via direct "zero"/"na" keys (from normalizeScoresToRange)
    const hasDirectPreset =
      ("zero" in val && val.zero === 0) ||
      ("na" in val && val.na === "NA");

    const hasPreset = hasPresetValue || hasDirectPreset;

    // ── MAIN RULE: must satisfy at least one ─────────────────────────────
    if (!hasRange && !hasPreset) {
      errors.push(`${key}: Required`);
    }
  }

  return errors;
};