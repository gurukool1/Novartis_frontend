import { useContext } from "react";
import DiscrepancyContext from "./DiscrepancyContext";

// Statuses that cause a red border on the field input
const MISMATCH_STATUSES = new Set(["MISMATCH", "RANGED_MISMATCH", "OUT_OF_RANGE"]);

export const useDiscrepancyStyles = (sectionKey) => {
  const discrepancyMap = useContext(DiscrepancyContext);

  // If no DiscrepancyContext.Provider is present (e.g. normal SubmittedForm view),
  // the context value will be null → return no styles at all.
  if (!discrepancyMap) return () => ({});

  const sectionData = discrepancyMap[sectionKey] || [];

  return (fieldKey) => {
    const fullKey = `${sectionKey}.${fieldKey}`;
    const entry = sectionData.find((d) => d.fieldName === fullKey);

    if (entry && MISMATCH_STATUSES.has(entry.status)) {
      // Red → explicitly mismatched field
      return {
        border: "2px solid #ef4444",
        boxShadow: "0 0 4px rgba(239,68,68,0.55)",
        backgroundColor: "#fff1f2",
        borderRadius: "4px",
      };
    }

    // Green → matched field OR section has no discrepancy data (all matched)
    return {
      border: "2px solid #10b981",
      boxShadow: "0 0 4px rgba(16,185,129,0.4)",
      backgroundColor: "#ecfdf5",
      borderRadius: "4px",
    };
  };
};
