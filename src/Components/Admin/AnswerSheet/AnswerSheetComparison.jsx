import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainWrapper from "../../../CommonComponents/MainWrapper";
import { IoArrowBackOutline } from "react-icons/io5";
import {
  MdFormatAlignRight,
  MdCheckCircleOutline,
  MdOutlineCancel,
  MdFileDownload,
} from "react-icons/md";
import { loadForm, resetSectionTotals } from "../../../Redux/Actions/FormActions";
import { exportComparisonToDocx } from "./exportComparisonToDocx";

import Form1 from "../Caseformparts.jsx/form1";
import Form2 from "../Caseformparts.jsx/form2";
import Form3 from "../Caseformparts.jsx/form3";
import Form4 from "../Caseformparts.jsx/form4";
import Form5 from "../Caseformparts.jsx/form5";
import Form6 from "../Caseformparts.jsx/form6";
import Form7 from "../Caseformparts.jsx/form7";
import Form8 from "../Caseformparts.jsx/form8";
import Form9 from "../Caseformparts.jsx/form9";
import DiscrepancyContext from "./DiscrepancyContext";

// ─── Status sets ──────────────────────────────────────────────────────────────
// Both MISMATCH and RANGED_MISMATCH and OUT_OF_RANGE are treated as "bad" (red)
const MISMATCH_STATUSES = new Set(["MISMATCH", "RANGED_MISMATCH", "OUT_OF_RANGE"]);

// ─── Maps each form component to its backend section key(s) ──────────────────
const FORM_SECTION_MAP = {
  Form1: (visit) => [`MMT_8_${visit}`],
  Form2: (visit) => [`CDASI_Activity_${visit}`],
  Form3: (visit) => [`CDASI_Damage_${visit}`],
  Form4: (visit) => [`Gottron_Hands_${visit}`],
  Form5: (visit) => [`Periungual_${visit}`],
  Form6: (visit) => [`Alopecia_${visit}`],
  Form7: (visit) => [`MDAAT_${visit}`],
  Form8: (visit) => [`form_Score_${visit}`],
  Form9: (visit) => [`Physician_${visit}`],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const hasAnyData = (keys, map) =>
  keys.some((k) => (map[k] || []).length > 0);

/** Catches BOTH MISMATCH and RANGED_MISMATCH for section-level red border */
const hasMismatch = (keys, map) =>
  keys.some((k) =>
    (map[k] || []).some((d) => MISMATCH_STATUSES.has(d.status))
  );


const isDefaultSelectionMatch = (expected, actual) => {
  if (!expected?.defaultSelection) return false;

  if (expected.defaultSelection === "NA") return actual === "NA";
  if (expected.defaultSelection === "0") return actual === "0";

  if (expected.defaultSelection === "0/NA") {
    return actual === "0" || actual === "NA";
  }

  return false;
};


// "MMT_8_initial.Biceps.left" → "Biceps · Left"
const prettyField = (fieldName = "") =>
  fieldName
    .split(".")
    .slice(1)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" · ");

// "MMT_8_initial" → "MMT-8 (Initial)"
const prettySection = (key = "") => {
  const MAP = {
    MMT_8_initial: "MMT-8 (Initial)",
    MMT_8_followUp: "MMT-8 (Follow-Up)",
    CDASI_Activity_initial: "CDASI Activity (Initial)",
    CDASI_Activity_followUp: "CDASI Activity (Follow-Up)",
    CDASI_Damage_initial: "CDASI Damage (Initial)",
    CDASI_Damage_followUp: "CDASI Damage (Follow-Up)",
    Gottron_Hands_initial: "Gottron / Hands (Initial)",
    Gottron_Hands_followUp: "Gottron / Hands (Follow-Up)",
    Periungual_initial: "Periungual (Initial)",
    Periungual_followUp: "Periungual (Follow-Up)",
    Alopecia_initial: "Alopecia (Initial)",
    Alopecia_followUp: "Alopecia (Follow-Up)",
    MDAAT_initial: "MDAAT (Initial)",
    MDAAT_followUp: "MDAAT (Follow-Up)",
    Physician_initial: "Physician Global (Initial)",
    Physician_followUp: "Physician Global (Follow-Up)",
    form_Score_initial: "CDASI Score (Initial)",
    form_Score_followUp: "CDASI Score (Follow-Up)",
  };
  return MAP[key] || key;
};
// const formatDisplayValue = (val) => {
//   if (val === null || val === undefined || val === "") return "—";
//   if (val === "NA") return "NA";
//   if (typeof val !== "object") return String(val);

//   if ("value" in val) {
//     const v = val.value;
//     if (v === 0 || v === "0") return "0";
//     if (v === "NA") return "NA";
//     if (v && typeof v === "object" && v.zero === 0 && v.na === "NA") return "0 & NA";
//     return String(v);
//   }

//   if ("min" in val || "max" in val) {
//     const minVal = val.min !== undefined && val.min !== null ? val.min : "";
//     const maxVal = val.max !== undefined && val.max !== null ? val.max : "";
//     if (minVal === maxVal && minVal !== "") return String(minVal);
//     if (minVal === "" && maxVal === "") return "—";
//     return `${minVal} – ${maxVal}`;
//   }

//   return String(val);
// };



 const formatDisplayValue = (val) => {
  if (val === null || val === undefined || val === "") return "—";

  // direct values
  if (val === "NA") return "NA";
  if (val === "0") return "0";

  if (typeof val !== "object") return String(val);

  // ✅ HANDLE DEFAULT SELECTION (IMPORTANT FIX)
  if ("defaultSelection" in val && val.defaultSelection) {
    if (val.defaultSelection === "NA") return "NA";
    if (val.defaultSelection === "0") return "0";
    if (val.defaultSelection === "0/NA") return "0 / NA";
  }

  // value object
  if ("value" in val) {
    const v = val.value;
    if (v === 0 || v === "0") return "0";
    if (v === "NA") return "NA";

    if (v && typeof v === "object" && v.zero === 0 && v.na === "NA") {
      return "0 / NA";
    }

    return String(v);
  }

  // range
  if ("min" in val || "max" in val) {
    const minVal = val.min ?? "";
    const maxVal = val.max ?? "";

    if (minVal === maxVal && minVal !== "") return String(minVal);
    if (minVal === "" && maxVal === "") return "—";

    return `${minVal} – ${maxVal}`;
  }

  return String(val);
};





// ─── Accuracy ring SVG ────────────────────────────────────────────────────────
const AccuracyRing = ({ percent }) => {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  const color = percent >= 80 ? "#10b981" : percent >= 50 ? "#f59e0b" : "#ef4444";
  const label = percent >= 80 ? "Excellent" : percent >= 50 ? "Moderate" : "Poor";

  return (
    <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
      <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e5e7eb" strokeWidth="11" />
        <circle
          cx="65" cy="65" r={r} fill="none"
          stroke={color} strokeWidth="11"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>
          {percent}%
        </span>
        <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600, marginTop: 2 }}>
          {label}
        </span>
      </div>
    </div>
  );
};

// // ─── Severity badge ───────────────────────────────────────────────────────────
// const SeverityBadge = ({ severity }) => {
//   const CFG = {
//     HIGH: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5", label: "High" },
//     MEDIUM: { bg: "#fef3c7", color: "#92400e", border: "#fde68a", label: "Medium" },
//     LOW: { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe", label: "Low" },
//   };
//   const s = CFG[severity] || { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", label: severity || "—" };
//   return (
//     <span style={{
//       display: "inline-block", padding: "1px 8px", borderRadius: 20,
//       background: s.bg, color: s.color, border: `1px solid ${s.border}`,
//       fontSize: 10, fontWeight: 700,
//     }}>
//       {s.label}
//     </span>
//   );
// };

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isMismatch = MISMATCH_STATUSES.has(status);
  const friendlyLabel =
    status === "OUT_OF_RANGE" ? "Out of Range"
      : status === "RANGED_MISMATCH" ? "Out of Range"
        : status === "MISMATCH" ? "Mismatch"
          : "Matched";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700,
      background: isMismatch ? "#fee2e2" : "#d1fae5",
      color: isMismatch ? "#991b1b" : "#065f46",
      border: `1px solid ${isMismatch ? "#fca5a5" : "#6ee7b7"}`,
    }}>
      {isMismatch
        ? <><MdOutlineCancel size={10} /> {friendlyLabel}</>
        : <><MdCheckCircleOutline size={10} /> {friendlyLabel}</>
      }
    </span>
  );
};

// ─── Global summary table (all discrepancies at the top of the page) ──────────
const GlobalSummaryTable = ({ discrepancies }) => {
  const [filterMismatch, setFilterMismatch] = useState(false);

  const rows = filterMismatch
    ? discrepancies.filter((d) => MISMATCH_STATUSES.has(d.status))
    : discrepancies;

  if (!discrepancies.length) return null;

  const totalMismatches = discrepancies.filter((d) => MISMATCH_STATUSES.has(d.status)).length;
  const totalMatched = discrepancies.length - totalMismatches;

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 24 }}>
      {/* Header bar */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b, #334155)",
        padding: "12px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 8,
      }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "0.02em" }}>
          📋 Discrepancy Summary — All Fields
        </span>
        <label style={{
          display: "flex", alignItems: "center", gap: 6,
          color: "#e2e8f0", fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>
          <input
            type="checkbox"
            checked={filterMismatch}
            onChange={(e) => setFilterMismatch(e.target.checked)}
            style={{ accentColor: "#ef4444", width: 14, height: 14 }}
          />
          Show mismatches only
        </label>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["#", "Section", "Field", "Your Answer", "Expected", "Expert#", "Deviation", "Status"].map((h) => (
                <th key={h} style={{
                  padding: "8px 12px", textAlign: "left",
                  color: "#475569", fontWeight: 700,
                  borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((d, i) => {
              //const isMismatch = MISMATCH_STATUSES.has(d.status);
              const isMismatch =
  MISMATCH_STATUSES.has(d.status) &&
  !isDefaultSelectionMatch(d.expectedValue, d.actualValue);
              return (
                <tr key={i} style={{
                  background: isMismatch
                    ? (i % 2 === 0 ? "#fff5f5" : "#fff1f2")
                    : (i % 2 === 0 ? "#f0fdf4" : "#f9fafb"),
                  borderBottom: "1px solid #e2e8f0",
                }}>
                  <td style={{ padding: "7px 12px", color: "#94a3b8", fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: "7px 12px", color: "#334155", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {prettySection(d.section)}
                  </td>
                  <td style={{ padding: "7px 12px", color: "#1e293b", fontWeight: 600 }}>
                    {prettyField(d.fieldName)}
                  </td>
                  <td style={{ padding: "7px 12px", fontWeight: 700, color: isMismatch ? "#b91c1c" : "#065f46" }}>
                    {formatDisplayValue(d.actualValue)}
                  </td>
                  <td style={{ padding: "7px 12px", color: "#374151", fontWeight: 600 }}>
                    {formatDisplayValue(d.expectedValue)}
                  </td>
                  <td style={{ padding: "7px 12px", color: "#6366f1", fontWeight: 600, fontStyle: "italic" }}>
                    {(() => {
                      if (d.expectedValue && typeof d.expectedValue === "object" && d.expectedValue.expertNumber) {
                        return d.expectedValue.expertNumber;
                      }
                      return <span style={{ color: "#cbd5e1" }}>—</span>;
                    })()}
                  </td>
                  <td style={{
                    padding: "7px 12px", fontWeight: 700,
                    color: d.deviation > 0 ? "#b45309" : d.deviation < 0 ? "#b91c1c" : "#6b7280",
                  }}>
                    {d.deviation > 0 ? `+${d.deviation}` : d.deviation != null ? String(d.deviation) : "—"}
                  </td>
                  <td style={{ padding: "7px 12px" }}>
                    <StatusBadge status={d.status} />
                  </td>
                  {/* <td style={{ padding: "7px 12px" }}>
                    <SeverityBadge severity={d.severity} />
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer stats */}
      <div style={{
        background: "#f8fafc", padding: "8px 18px",
        borderTop: "1px solid #e2e8f0",
        display: "flex", gap: 20, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
          Showing: <strong>{rows.length}</strong> of <strong>{discrepancies.length}</strong>
        </span>
        <span style={{ fontSize: 11, color: "#b91c1c", fontWeight: 600 }}>
          🔴 Mismatches: <strong>{totalMismatches}</strong>
        </span>
        {/* <span style={{ fontSize: 11, color: "#065f46", fontWeight: 600 }}>
          🟢 Matched: <strong>{totalMatched}</strong>
        </span> */}
      </div>
    </div>
  );
};

// ─── Per-section field comparison table (shown inside each SectionWrapper) ────
const FieldComparisonTable = ({ sectionKeys, discrepancyMap }) => {
  const allDiscrepancies = sectionKeys.flatMap((k) => discrepancyMap[k] || []);
  if (!allDiscrepancies.length) return null;

  return (
    <div className="px-3 pb-3 pt-2">
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#64748b",
        textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8,
      }}>
        Field-level Comparison
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px", fontSize: 12 }}>
          <thead>
            <tr>
              {["Field", "Your Answer", "Expected", "Expert#", "Deviation", "Status"].map((h) => (
                <th key={h} style={{
                  padding: "4px 10px", textAlign: "left",
                  color: "#6b7280", fontWeight: 700,
                  background: "transparent", borderBottom: "1px solid #e5e7eb",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allDiscrepancies.map((d, i) => {
              //const isMismatch = MISMATCH_STATUSES.has(d.status);
              const isMismatch =
  MISMATCH_STATUSES.has(d.status) &&
  !isDefaultSelectionMatch(d.expectedValue, d.actualValue);

              const rowBg = isMismatch ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)";
              return (
                <tr key={i}>
                  <td style={{
                    padding: "6px 10px", background: rowBg,
                    borderRadius: "6px 0 0 6px", fontWeight: 600, color: "#1e293b",
                  }}>
                    {prettyField(d.fieldName)}
                  </td>
                  <td style={{
                    padding: "6px 10px", background: rowBg,
                    color: isMismatch ? "#b91c1c" : "#065f46", fontWeight: 700,
                  }}>
                    {formatDisplayValue(d.actualValue)}
                  </td>
                  <td style={{ padding: "6px 10px", background: rowBg, color: "#374151", fontWeight: 600 }}>
                    {formatDisplayValue(d.expectedValue)}
                  </td>
                  <td style={{ padding: "6px 10px", background: rowBg, color: "#6366f1", fontWeight: 600, fontStyle: "italic" }}>
                    {(() => {
                      if (d.expectedValue && typeof d.expectedValue === "object" && d.expectedValue.expertNumber) {
                        return d.expectedValue.expertNumber;
                      }
                      return <span style={{ color: "#cbd5e1" }}>—</span>;
                    })()}
                  </td>
                  <td style={{
                    padding: "6px 10px", background: rowBg, fontWeight: 700,
                    color: d.deviation > 0 ? "#b45309" : d.deviation < 0 ? "#b91c1c" : "#6b7280",
                  }}>
                    {d.deviation > 0 ? `+${d.deviation}` : d.deviation != null ? String(d.deviation) : "—"}
                  </td>
                  <td style={{ padding: "6px 10px", background: rowBg, borderRadius: "0 6px 6px 0" }}>
                    <StatusBadge status={d.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const SectionWrapper = ({ formKey, visit, discrepancyMap, label, children }) => {
  const [expanded, setExpanded] = useState(true);

  const sections = FORM_SECTION_MAP[formKey]?.(visit) ?? [];
 // const isMismatch = hasMismatch(sections, discrepancyMap);


  const isMismatch = sections.some((k) =>
  (discrepancyMap[k] || []).some(
    (d) =>
      MISMATCH_STATUSES.has(d.status) &&
      !isDefaultSelectionMatch(d.expectedValue, d.actualValue)
  )
);
  const isMatch = !isMismatch; // green for everything that is NOT a mismatch

  const borderColor = isMismatch ? "#ef4444" : "#10b981";
  const bgColor = isMismatch ? "rgba(239,68,68,0.04)" : "rgba(16,185,129,0.04)";
  const headerBg = isMismatch ? "rgba(239,68,68,0.11)" : "rgba(16,185,129,0.11)";
  const textColor = isMismatch ? "#991b1b" : "#065f46";
  const pillBg = isMismatch ? "#fee2e2" : "#d1fae5";
  const pillBorder = isMismatch ? "#fca5a5" : "#6ee7b7";

  return (
    <div style={{
      border: `2px solid ${borderColor}`,
      borderRadius: 10, marginBottom: 20,
      background: bgColor, overflow: "hidden", position: "relative",
    }}>
      {/* accent stripe */}
      <div style={{ height: 4, background: borderColor, position: "absolute", top: 0, left: 0, right: 0 }} />

      {/* header */}
      <div
        className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2"
        style={{
          borderBottom: expanded ? `1px solid ${borderColor}` : "none",
          background: headerBg, cursor: "pointer", userSelect: "none",
        }}
        onClick={() => setExpanded((e) => !e)}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: textColor }}>{label}</span>
        <div className="d-flex align-items-center gap-2">
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 700, padding: "2px 10px",
            borderRadius: 20, background: pillBg, color: textColor,
            border: `1px solid ${pillBorder}`,
          }}>
            {isMismatch
              ? <><MdOutlineCancel size={12} /> Has Mismatches</>
              : <><MdCheckCircleOutline size={12} /> All Matched</>
            }
          </span>
          <span style={{ fontSize: 12, color: textColor, fontWeight: 600 }}>
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {expanded && (
        <>
          {/* Per-section comparison table shown above the form inputs */}
          <FieldComparisonTable sectionKeys={sections} discrepancyMap={discrepancyMap} />
          {/* Form inputs */}
          <div style={{ paddingTop: 4 }}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AnswerSheetComparison = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const [formDataLoaded, setFormDataLoaded] = useState(false);

  // ── Data from navigation state ──────────────────────────────────────────
  const evaluationData = state?.evaluationData ?? null;
  const backPath = state?.backPath ?? -1;
  const caseId = state?.caseId ?? null;
  const formId = state?.formId ?? null;
  const userCaseId = state?.userCaseId ?? null;
  const selectedForms = state?.selectedForms ?? [];

  const apiData = evaluationData?.data ?? {};
  const result = apiData.result ?? {};
  const stats = result.stats ?? {};
  const discrepancies = result.discrepancies ?? [];
  const accuracyPercent = Math.round(stats.accuracyPercentage ?? 0);

  // ── Load user's form answers into Redux ─────────────────────────────────
  useEffect(() => {
    if (!caseId || !formId) return;
    setFormDataLoaded(false);
    dispatch(resetSectionTotals());
    dispatch(loadForm({ caseId, formId, userCaseId }, token, { mirrorToLocalStorage: false }))
      .then(() => setFormDataLoaded(true));
  }, [caseId, formId, userCaseId, dispatch, token]);

  // ── Build section-keyed discrepancy lookup map ──────────────────────────
  const discrepancyMap = useMemo(() => {
    const map = {};
    discrepancies.forEach((d) => {
      if (!map[d.section]) map[d.section] = [];
      map[d.section].push(d);
    });
    return map;
  }, [discrepancies]);

  // ── Form visibility ─────────────────────────────────────────────────────
  const FORM_COMPONENT_COUNTS = {
    MMT8: 2, CDASI: 10, MDAAT: 2, Physician: 2, AllForms: 16,
  };
  const totalFormCount = selectedForms.reduce(
    (sum, f) => sum + (FORM_COMPONENT_COUNTS[f] || 0), 0
  );
  const shouldShowForm = (n) => {
    if (selectedForms.includes("AllForms")) return true;
    const formMap = { 1: "MMT8", 2: "CDASI", 3: "MDAAT", 4: "Physician" };
    return selectedForms.includes(formMap[n]);
  };
  const shouldShowForm8 =
    selectedForms.includes("CDASI") || selectedForms.includes("AllForms");

  const FP = { readOnly: true, FORM_COUNT: totalFormCount };

  // ── Guard ────────────────────────────────────────────────────────────────
  if (!evaluationData) {
    return (
      <MainWrapper>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 300 }}>
          <p className="text-muted mb-3">No evaluation data available.</p>
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            onClick={() => navigate(-1)}
          >
            <IoArrowBackOutline size={16} /> Go Back
          </button>
        </div>
      </MainWrapper>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <DiscrepancyContext.Provider value={discrepancyMap}>
      <MainWrapper>

        {/* ── Page header ── */}
        <div className="mt-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={() => navigate(backPath)}
            >
              <IoArrowBackOutline size={16} /> Back
            </button>
            <h4 className="mb-0 fw-bold">Answer Sheet Comparison</h4>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-1"
              onClick={() => exportComparisonToDocx(result, caseId ? `Case #${caseId}` : "")}
              style={{ fontWeight: 600 }}
            >
              <MdFileDownload size={18} />
              Download Report
            </button>
            {result.message && (
              <span style={{
                fontSize: 13, fontWeight: 700, padding: "5px 14px", borderRadius: 20,
                background: accuracyPercent >= 80 ? "#d1fae5" : "#fee2e2",
                color: accuracyPercent >= 80 ? "#065f46" : "#991b1b",
                border: `1px solid ${accuracyPercent >= 80 ? "#6ee7b7" : "#fca5a5"}`,
              }}>
                {result.message}
              </span>
            )}
          </div>
        </div>

        {/* ── Stats bar with accuracy ring ── */}
        <div
          className="p-4 rounded-3 mb-3 d-flex flex-wrap align-items-center gap-4"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <AccuracyRing percent={accuracyPercent} />

          <div className="d-flex flex-wrap gap-3 flex-grow-1">
            {[
              { label: "Total Fields", value: stats.totalFields ?? 0, color: "#6366f1" },
              // { label: "Exact Matches", value: stats.exactMatches ?? 0, color: "#10b981" },
              { label: "Ranged Match", value: stats.rangedMatch ?? stats.withinRange ?? 0, color: "#10b981" },
              { label: "Mismatched", value: stats.mismatchedFields ?? 0, color: "#ef4444" },
              // { label: "Ignored", value: stats.ignored ?? 0, color: "#9ca3af" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center px-3 py-2 rounded-2"
                style={{ background: "#fff", border: "1px solid #e2e8f0", minWidth: 100 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Legend ── */}
        <div
          className="mb-4 px-4 py-3 rounded-3 d-flex flex-wrap align-items-center gap-4"
          style={{ background: "#fff", border: "1px solid #e2e8f0" }}
        >
          <span style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>
            🔍 Border Legend:
          </span>
          {[
            { color: "#10b981", bg: "#ecfdf5", label: "Green border", desc: "Field matched (within range)" },
            { color: "#ef4444", bg: "#fff1f2", label: "Red border", desc: "Mismatch or out-of-range value" },
            // { color: "#d1d5db", bg: "#f9fafb", label: "Grey border (section)", desc: "No evaluation data for this section" },
          ].map(({ color, bg, label, desc }) => (
            <div key={label} className="d-flex align-items-center gap-2">
              <div style={{
                width: 28, height: 22, borderRadius: 4,
                border: `2px solid ${color}`, background: bg, flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{label}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{desc}</div>
              </div>
            </div>
          ))}

          <div style={{ marginLeft: "auto" }}>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>
              Status types:
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <StatusBadge status="MISMATCH" />
              <StatusBadge status="OUT_OF_RANGE" />
              {/* <StatusBadge status="EXACT_MATCH" /> */}
            </div>
          </div>
        </div>

        {/* ── Global discrepancy summary table ── */}
        <GlobalSummaryTable discrepancies={discrepancies} />

        {/* ── Scoring sheet ── */}
        <div className="outer-wrap">
          <div className="theme-card pe-2">
            <div className="d-flex flex-wrap gap-2 align-items-center card-title mb-2">
              <span><MdFormatAlignRight fontSize={18} /></span>
              <h5 className="mb-0">Myositis Case Scoring Sheet</h5>
            </div>
            <hr className="horizontal-rule" />

            {!formDataLoaded ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading form data…</span>
                </div>
              </div>
            ) : (
              <div className="col-sm-12 col-lg-12">

                {/* ══════════ INITIAL VISIT ══════════ */}

                {shouldShowForm(1) && (
                  <SectionWrapper formKey="Form1" visit="initial"
                    discrepancyMap={discrepancyMap} label="MMT-8 — Initial Visit">
                    <Form1 visit="initial" {...FP} />
                  </SectionWrapper>
                )}

                {shouldShowForm(2) && (
                  <>
                    <SectionWrapper formKey="Form2" visit="initial"
                      discrepancyMap={discrepancyMap} label="CDASI Activity — Initial Visit">
                      <Form2 visit="initial" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form3" visit="initial"
                      discrepancyMap={discrepancyMap} label="CDASI Damage — Initial Visit">
                      <Form3 visit="initial" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form4" visit="initial"
                      discrepancyMap={discrepancyMap} label="Gottron / Hands — Initial Visit">
                      <Form4 visit="initial" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form5" visit="initial"
                      discrepancyMap={discrepancyMap} label="Periungual — Initial Visit">
                      <Form5 visit="initial" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form6" visit="initial"
                      discrepancyMap={discrepancyMap} label="Alopecia — Initial Visit">
                      <Form6 visit="initial" {...FP} />
                    </SectionWrapper>
                  </>
                )}

                {shouldShowForm8 && (
                  <SectionWrapper formKey="Form8" visit="initial"
                    discrepancyMap={discrepancyMap} label="CDASI Score — Initial Visit">
                    <Form8 visit="initial" readOnly={true} />
                  </SectionWrapper>
                )}

                {shouldShowForm(3) && (
                  <SectionWrapper formKey="Form7" visit="initial"
                    discrepancyMap={discrepancyMap} label="MDAAT — Initial Visit">
                    <Form7 visit="initial" {...FP} />
                  </SectionWrapper>
                )}

                {shouldShowForm(4) && (
                  <SectionWrapper formKey="Form9" visit="initial"
                    discrepancyMap={discrepancyMap} label="Physician Global — Initial Visit">
                    <Form9 visit="initial" {...FP} />
                  </SectionWrapper>
                )}

                {/* ══════════ FOLLOW-UP VISIT ══════════ */}

                {shouldShowForm(1) && (
                  <SectionWrapper formKey="Form1" visit="followUp"
                    discrepancyMap={discrepancyMap} label="MMT-8 — Follow-Up Visit">
                    <Form1 visit="followUp" {...FP} />
                  </SectionWrapper>
                )}

                {shouldShowForm(2) && (
                  <>
                    <SectionWrapper formKey="Form2" visit="followUp"
                      discrepancyMap={discrepancyMap} label="CDASI Activity — Follow-Up Visit">
                      <Form2 visit="followUp" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form3" visit="followUp"
                      discrepancyMap={discrepancyMap} label="CDASI Damage — Follow-Up Visit">
                      <Form3 visit="followUp" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form4" visit="followUp"
                      discrepancyMap={discrepancyMap} label="Gottron / Hands — Follow-Up Visit">
                      <Form4 visit="followUp" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form5" visit="followUp"
                      discrepancyMap={discrepancyMap} label="Periungual — Follow-Up Visit">
                      <Form5 visit="followUp" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form6" visit="followUp"
                      discrepancyMap={discrepancyMap} label="Alopecia — Follow-Up Visit">
                      <Form6 visit="followUp" {...FP} />
                    </SectionWrapper>
                  </>
                )}

                {shouldShowForm8 && (
                  <SectionWrapper formKey="Form8" visit="followUp"
                    discrepancyMap={discrepancyMap} label="CDASI Score — Follow-Up Visit">
                    <Form8 visit="followUp" readOnly={true} />
                  </SectionWrapper>
                )}

                {shouldShowForm(3) && (
                  <SectionWrapper formKey="Form7" visit="followUp"
                    discrepancyMap={discrepancyMap} label="MDAAT — Follow-Up Visit">
                    <Form7 visit="followUp" {...FP} />
                  </SectionWrapper>
                )}

                {shouldShowForm(4) && (
                  <SectionWrapper formKey="Form9" visit="followUp"
                    discrepancyMap={discrepancyMap} label="Physician Global — Follow-Up Visit">
                    <Form9 visit="followUp" {...FP} />
                  </SectionWrapper>
                )}

              </div>
            )}
          </div>
        </div>
      </MainWrapper>
    </DiscrepancyContext.Provider>
  );
};

export default AnswerSheetComparison;