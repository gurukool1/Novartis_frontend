// import React, { useMemo, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import MainWrapper from "../../../CommonComponents/MainWrapper";
// import { IoArrowBackOutline } from "react-icons/io5";
// import { MdFormatAlignRight } from "react-icons/md";
// import { MdCheckCircleOutline, MdOutlineCancel } from "react-icons/md";
// import { loadForm, resetSectionTotals } from "../../../Redux/Actions/FormActions";

// import Form1 from "../Caseformparts.jsx/form1";
// import Form2 from "../Caseformparts.jsx/form2";
// import Form3 from "../Caseformparts.jsx/form3";
// import Form4 from "../Caseformparts.jsx/form4";
// import Form5 from "../Caseformparts.jsx/form5";
// import Form6 from "../Caseformparts.jsx/form6";
// import Form7 from "../Caseformparts.jsx/form7";
// import Form8 from "../Caseformparts.jsx/form8";
// import Form9 from "../Caseformparts.jsx/form9";

// // ─── Section → backend key mapping ───────────────────────────────────────────
// const FORM_SECTION_MAP = {
//   Form1: (visit) => [`MMT_8_${visit}`],
//   Form2: (visit) => [`CDASI_Activity_${visit}`],
//   Form3: (visit) => [`CDASI_Damage_${visit}`],
//   Form4: (visit) => [`Gottron_Hands_${visit}`],
//   Form5: (visit) => [`Periungual_${visit}`],
//   Form6: (visit) => [`Alopecia_${visit}`],
//   Form7: (visit) => [`MDAAT_${visit}`],
//   Form8: (visit) => [`form_Score_${visit}`],
//   Form9: (visit) => [`Physician_${visit}`],
// };

// const SECTION_LABELS = {
//   MMT_8_initial: "MMT-8 (Initial)",
//   MMT_8_followUp: "MMT-8 (Follow-Up)",
//   CDASI_Activity_initial: "CDASI Activity (Initial)",
//   CDASI_Activity_followUp: "CDASI Activity (Follow-Up)",
//   CDASI_Damage_initial: "CDASI Damage (Initial)",
//   CDASI_Damage_followUp: "CDASI Damage (Follow-Up)",
//   Gottron_Hands_initial: "Gottron / Hands (Initial)",
//   Gottron_Hands_followUp: "Gottron / Hands (Follow-Up)",
//   Periungual_initial: "Periungual (Initial)",
//   Periungual_followUp: "Periungual (Follow-Up)",
//   Alopecia_initial: "Alopecia (Initial)",
//   Alopecia_followUp: "Alopecia (Follow-Up)",
//   MDAAT_initial: "MDAAT (Initial)",
//   MDAAT_followUp: "MDAAT (Follow-Up)",
//   Physician_initial: "Physician Global (Initial)",
//   Physician_followUp: "Physician Global (Follow-Up)",
//   form_Score_initial: "Form Score (Initial)",
//   form_Score_followUp: "Form Score (Follow-Up)",
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const hasMismatchInSections = (sectionKeys, discrepancyMap) =>
//   sectionKeys.some((key) =>
//     (discrepancyMap[key] || []).some((d) => d.status === "MISMATCH")
//   );

// const hasAnyDataInSections = (sectionKeys, discrepancyMap) =>
//   sectionKeys.some((key) => (discrepancyMap[key] || []).length > 0);

// // ─── SectionWrapper ───────────────────────────────────────────────────────────
// /**
//  * Wraps a Form component with:
//  *   - Green border + bg  → section has data and ALL fields matched
//  *   - Red border + bg    → section has MISMATCH discrepancies
//  *   - Grey border + bg   → no evaluation data for this section
//  */
// const SectionWrapper = ({ formKey, visit, discrepancyMap, label, children }) => {
//   const sections = FORM_SECTION_MAP[formKey]?.(visit) || [];
//   const hasData = hasAnyDataInSections(sections, discrepancyMap);
//   const isMismatch = hasData && hasMismatchInSections(sections, discrepancyMap);
//   const isMatch = hasData && !isMismatch;

//   // colour tokens
//   const borderColor = isMatch ? "#10b981" : isMismatch ? "#ef4444" : "#d1d5db";
//   const bgColor = isMatch
//     ? "rgba(16,185,129,0.07)"
//     : isMismatch
//     ? "rgba(239,68,68,0.07)"
//     : "#f9fafb";
//   const headerBg = isMatch
//     ? "rgba(16,185,129,0.1)"
//     : isMismatch
//     ? "rgba(239,68,68,0.1)"
//     : "#f3f4f6";
//   const pillBg = isMatch ? "#d1fae5" : isMismatch ? "#fee2e2" : "#f3f4f6";
//   const pillColor = isMatch ? "#065f46" : isMismatch ? "#991b1b" : "#6b7280";
//   const pillBorder = isMatch ? "#6ee7b7" : isMismatch ? "#fca5a5" : "#e5e7eb";
//   const sectionTitle =
//     label ||
//     sections.map((s) => SECTION_LABELS[s] || s).join(" / ");

//   return (
//     <div
//       style={{
//         border: `2px solid ${borderColor}`,
//         borderRadius: 10,
//         marginBottom: 20,
//         background: bgColor,
//         overflow: "hidden",
//         position: "relative",
//       }}
//     >
//       {/* top accent stripe */}
//       <div
//         style={{
//           height: 4,
//           background: borderColor,
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//         }}
//       />

//       {/* header row */}
//       <div
//         className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2"
//         style={{
//           borderBottom: `1px solid ${borderColor}`,
//           background: headerBg,
//         }}
//       >
//         <span style={{ fontSize: 13, fontWeight: 700, color: pillColor }}>
//           {sectionTitle}
//         </span>

//         <span
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 4,
//             fontSize: 11,
//             fontWeight: 700,
//             padding: "2px 10px",
//             borderRadius: 20,
//             background: pillBg,
//             color: pillColor,
//             border: `1px solid ${pillBorder}`,
//           }}
//         >
//           {isMatch && <><MdCheckCircleOutline size={12} /> Matched</>}
//           {isMismatch && <><MdOutlineCancel size={12} /> Mismatch</>}
//           {!hasData && "No Data"}
//         </span>
//       </div>

//       {/* form content */}
//       <div style={{ opacity: hasData ? 1 : 0.65, paddingTop: 4 }}>
//         {children}
//       </div>
//     </div>
//   );
// };

// // ─── Accuracy ring ────────────────────────────────────────────────────────────
// const AccuracyRing = ({ percent }) => {
//   const r = 42;
//   const circ = 2 * Math.PI * r;
//   const dash = (percent / 100) * circ;
//   const color =
//     percent >= 80 ? "#10b981" : percent >= 50 ? "#f59e0b" : "#ef4444";
//   return (
//     <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
//       <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
//         <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
//         <circle
//           cx="60" cy="60" r={r} fill="none"
//           stroke={color} strokeWidth="10"
//           strokeDasharray={`${dash} ${circ}`}
//           strokeLinecap="round"
//           style={{ transition: "stroke-dasharray 0.8s ease" }}
//         />
//       </svg>
//       <div
//         style={{
//           position: "absolute", inset: 0, display: "flex",
//           flexDirection: "column", alignItems: "center", justifyContent: "center",
//         }}
//       >
//         <span style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>
//           {percent}%
//         </span>
//         <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>
//           Accuracy
//         </span>
//       </div>
//     </div>
//   );
// };

// // ─── Main component ───────────────────────────────────────────────────────────
// const AnswerSheetComparison = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const token = useSelector((s) => s.auth.token);

//   // All context passed from SubmittedForm via navigate(path, { state: {...} })
//   const evaluationData = state?.evaluationData || null;
//   const backPath       = state?.backPath       || -1;
//   const caseId         = state?.caseId         || null;
//   const formId         = state?.formId         || null;
//   const userCaseId     = state?.userCaseId     || null;
//   const selectedForms  = state?.selectedForms  || [];

//   // Load form answers into Redux so Form1–Form9 render with the user's data
//   useEffect(() => {
//     if (!caseId || !formId) return;
//     dispatch(resetSectionTotals());
//     dispatch(
//       loadForm(
//         { caseId, formId, userCaseId },
//         token,
//         { mirrorToLocalStorage: false }
//       )
//     );
//   }, [caseId, formId, userCaseId, dispatch]);

//   // ── guard ──────────────────────────────────────────────────────────────────
//   if (!evaluationData) {
//     return (
//       <MainWrapper>
//         <div
//           className="d-flex flex-column align-items-center justify-content-center"
//           style={{ minHeight: 300 }}
//         >
//           <p className="text-muted mb-3">No evaluation data available.</p>
//           <button
//             className="btn btn-outline-secondary d-flex align-items-center gap-1"
//             onClick={() => navigate(-1)}
//           >
//             <IoArrowBackOutline size={16} /> Go Back
//           </button>
//         </div>
//       </MainWrapper>
//     );
//   }

//   const { result } = evaluationData;
//   const { stats = {}, discrepancies = [] } = result || {};
//   const accuracyPercent = Math.round(stats.accuracyPercentage ?? 0);

//   // Build lookup: section key → list of discrepancy objects
//   const discrepancyMap = useMemo(() => {
//     const map = {};
//     discrepancies.forEach((d) => {
//       if (!map[d.section]) map[d.section] = [];
//       map[d.section].push(d);
//     });
//     return map;
//   }, [discrepancies]);

//   // Mirror SubmittedForm's form-visibility logic
//   const FORM_COMPONENT_COUNTS = {
//     MMT8: 2, CDASI: 10, MDAAT: 2, Physician: 2, AllForms: 16,
//   };
//   const totalFormCount = selectedForms.reduce(
//     (sum, f) => sum + (FORM_COMPONENT_COUNTS[f] || 0),
//     0
//   );
//   const shouldShowForm = (n) => {
//     if (selectedForms.includes("AllForms")) return true;
//     const map = { 1: "MMT8", 2: "CDASI", 3: "MDAAT", 4: "Physician" };
//     return selectedForms.includes(map[n]);
//   };
//   const shouldShowForm8 =
//     selectedForms.includes("CDASI") || selectedForms.includes("AllForms");

//   const FORM_PROPS = { readOnly: true };

//   // ── render ─────────────────────────────────────────────────────────────────
//   return (
//     <MainWrapper>

//       {/* ── Page header ── */}
//       <div className="mt-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
//         <div className="d-flex align-items-center gap-3">
//           <button
//             className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
//             onClick={() => navigate(backPath)}
//           >
//             <IoArrowBackOutline size={16} /> Back
//           </button>
//           <h4 className="mb-0 fw-bold">Answer Sheet Comparison</h4>
//         </div>
//       </div>

//       {/* ── Stats bar ── */}
//       <div
//         className="p-4 rounded-3 mb-3 d-flex flex-wrap align-items-center gap-4"
//         style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
//       >
//         <AccuracyRing percent={accuracyPercent} />

//         <div className="d-flex flex-wrap gap-3 flex-grow-1">
//           {[
//             { label: "Total Fields",   value: stats.totalFields      ?? 0, color: "#6366f1" },
//             { label: "Exact Matches",  value: stats.exactMatches     ?? 0, color: "#10b981" },
//             { label: "Within Range",   value: stats.withinRange      ?? 0, color: "#3b82f6" },
//             { label: "Mismatched",     value: stats.mismatchedFields ?? 0, color: "#ef4444" },
//             { label: "Ignored",        value: stats.ignored          ?? 0, color: "#9ca3af" },
//           ].map(({ label, value, color }) => (
//             <div
//               key={label}
//               className="text-center px-3 py-2 rounded-2"
//               style={{ background: "#fff", border: "1px solid #e2e8f0", minWidth: 100 }}
//             >
//               <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
//               <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{label}</div>
//             </div>
//           ))}
//         </div>

//         {result?.message && (
//           <div
//             className="px-3 py-2 rounded-2 text-center"
//             style={{
//               background: accuracyPercent >= 80 ? "#d1fae5" : "#fee2e2",
//               color: accuracyPercent >= 80 ? "#065f46" : "#991b1b",
//               fontWeight: 700, fontSize: 13, maxWidth: 240,
//             }}
//           >
//             {result.message}
//           </div>
//         )}
//       </div>

//       {/* ── Legend ── */}
//       <div className="d-flex align-items-center gap-4 mb-4 flex-wrap">
//         <span style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>Legend:</span>
//         {[
//           { color: "#10b981", label: "Green border — All fields matched" },
//           { color: "#ef4444", label: "Red border — Has mismatched fields" },
//           { color: "#d1d5db", label: "Grey border — No data submitted" },
//         ].map(({ color, label }) => (
//           <span
//             key={label}
//             className="d-flex align-items-center gap-2"
//             style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}
//           >
//             <span style={{
//               width: 14, height: 14, borderRadius: 3,
//               background: color, display: "inline-block", flexShrink: 0,
//             }} />
//             {label}
//           </span>
//         ))}
//       </div>

//       {/* ── Scoring sheet ── */}
//       <div className="outer-wrap">
//         <div className="theme-card pe-2">
//           <div className="d-flex flex-wrap gap-2 align-items-center card-title mb-2">
//             <span><MdFormatAlignRight fontSize={18} /></span>
//             <h5 className="mb-0">Myositis Case Scoring Sheet</h5>
//           </div>
//           <hr className="horizontal-rule" />

//           <div className="col-sm-12 col-lg-12">

//             {/* ════════════ INITIAL VISIT ════════════ */}

//             {shouldShowForm(1) && (
//               <SectionWrapper formKey="form1" visit="initial"
//                 discrepancyMap={discrepancyMap} label="MMT-8 — Initial Visit">
//                 <Form1 visit="initial" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(2) && (
//               <>
//                 <SectionWrapper formKey="form2" visit="initial"
//                   discrepancyMap={discrepancyMap} label="CDASI Activity — Initial Visit">
//                   <Form2 visit="initial" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="form3" visit="initial"
//                   discrepancyMap={discrepancyMap} label="CDASI Damage — Initial Visit">
//                   <Form3 visit="initial" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="form4" visit="initial"
//                   discrepancyMap={discrepancyMap} label="Gottron / Hands — Initial Visit">
//                   <Form4 visit="initial" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="form5" visit="initial"
//                   discrepancyMap={discrepancyMap} label="Periungual — Initial Visit">
//                   <Form5 visit="initial" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="form6" visit="initial"
//                   discrepancyMap={discrepancyMap} label="Alopecia — Initial Visit">
//                   <Form6 visit="initial" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>
//               </>
//             )}

//             {shouldShowForm8 && (
//               <SectionWrapper formKey="form8" visit="initial"
//                 discrepancyMap={discrepancyMap} label="CDASI Score — Initial Visit">
//                 <Form8 visit="initial" {...FORM_PROPS} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(3) && (
//               <SectionWrapper formKey="form7" visit="initial"
//                 discrepancyMap={discrepancyMap} label="MDAAT — Initial Visit">
//                 <Form7 visit="initial" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(4) && (
//               <SectionWrapper formKey="form9" visit="initial"
//                 discrepancyMap={discrepancyMap} label="Physician Global — Initial Visit">
//                 <Form9 visit="initial" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//               </SectionWrapper>
//             )}

//             {/* ════════════ FOLLOW-UP VISIT ════════════ */}

//             {shouldShowForm(1) && (
//               <SectionWrapper formKey="form1" visit="followUp"
//                 discrepancyMap={discrepancyMap} label="MMT-8 — Follow-Up Visit">
//                 <Form1 visit="followUp" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(2) && (
//               <>
//                 <SectionWrapper formKey="form2" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="CDASI Activity — Follow-Up Visit">
//                   <Form2 visit="followUp" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="form3" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="CDASI Damage — Follow-Up Visit">
//                   <Form3 visit="followUp" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="form4" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="Gottron / Hands — Follow-Up Visit">
//                   <Form4 visit="followUp" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="form5" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="Periungual — Follow-Up Visit">
//                   <Form5 visit="followUp" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="form6" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="Alopecia — Follow-Up Visit">
//                   <Form6 visit="followUp" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//                 </SectionWrapper>
//               </>
//             )}

//             {shouldShowForm8 && (
//               <SectionWrapper formKey="form8" visit="followUp"
//                 discrepancyMap={discrepancyMap} label="CDASI Score — Follow-Up Visit">
//                 <Form8 visit="followUp" {...FORM_PROPS} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(3) && (
//               <SectionWrapper formKey="form7" visit="followUp"
//                 discrepancyMap={discrepancyMap} label="MDAAT — Follow-Up Visit">
//                 <Form7 visit="followUp" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(4) && (
//               <SectionWrapper formKey="form9" visit="followUp"
//                 discrepancyMap={discrepancyMap} label="Physician Global — Follow-Up Visit">
//                 <Form9 visit="followUp" FORM_COUNT={totalFormCount} {...FORM_PROPS} />
//               </SectionWrapper>
//             )}

//           </div>
//         </div>
//       </div>
//     </MainWrapper>
//   );
// };

// export default AnswerSheetComparison;



// import React, { useState,useMemo, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import MainWrapper from "../../../CommonComponents/MainWrapper";
// import { IoArrowBackOutline } from "react-icons/io5";
// import { MdFormatAlignRight, MdCheckCircleOutline, MdOutlineCancel } from "react-icons/md";
// import { loadForm, resetSectionTotals } from "../../../Redux/Actions/FormActions";

// import Form1 from "../Caseformparts.jsx/form1";
// import Form2 from "../Caseformparts.jsx/form2";
// import Form3 from "../Caseformparts.jsx/form3";
// import Form4 from "../Caseformparts.jsx/form4";
// import Form5 from "../Caseformparts.jsx/form5";
// import Form6 from "../Caseformparts.jsx/form6";
// import Form7 from "../Caseformparts.jsx/form7";
// import Form8 from "../Caseformparts.jsx/form8";
// import Form9 from "../Caseformparts.jsx/form9";

// // ─── Maps each form component to its backend section key(s) ──────────────────
// // These keys must exactly match what comes back in result.discrepancies[].section
// const FORM_SECTION_MAP = {
//   Form1: (visit) => [`MMT_8_${visit}`],
//   Form2: (visit) => [`CDASI_Activity_${visit}`],
//   Form3: (visit) => [`CDASI_Damage_${visit}`],
//   Form4: (visit) => [`Gottron_Hands_${visit}`],
//   Form5: (visit) => [`Periungual_${visit}`],
//   Form6: (visit) => [`Alopecia_${visit}`],
//   Form7: (visit) => [`MDAAT_${visit}`],
//   Form8: (visit) => [`form_Score_${visit}`],
//   Form9: (visit) => [`Physician_${visit}`],
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// /** true if any of the given section keys has at least one discrepancy entry */
// const hasAnyData = (keys, map) =>
//   keys.some((k) => (map[k] || []).length > 0);

// /** true if any of the given section keys contains a MISMATCH discrepancy */
// const hasMismatch = (keys, map) =>
//   keys.some((k) => (map[k] || []).some((d) => d.status === "MISMATCH"));


 
// const SectionWrapper = ({ formKey, visit, discrepancyMap, label, children }) => {
//   const sections = FORM_SECTION_MAP[formKey]?.(visit) ?? [];
//   const dataExists = hasAnyData(sections, discrepancyMap);
//   const isMismatch = dataExists && hasMismatch(sections, discrepancyMap);
//   const isMatch    = dataExists && !isMismatch;

//   const borderColor = isMatch ? "#10b981" : isMismatch ? "#ef4444" : "#d1d5db";
//   const bgColor     = isMatch ? "rgba(16,185,129,0.07)"
//                     : isMismatch ? "rgba(239,68,68,0.07)"
//                     : "#f9fafb";
//   const headerBg    = isMatch ? "rgba(16,185,129,0.12)"
//                     : isMismatch ? "rgba(239,68,68,0.12)"
//                     : "#f3f4f6";
//   const textColor   = isMatch ? "#065f46" : isMismatch ? "#991b1b" : "#6b7280";
//   const pillBg      = isMatch ? "#d1fae5" : isMismatch ? "#fee2e2" : "#f3f4f6";
//   const pillBorder  = isMatch ? "#6ee7b7" : isMismatch ? "#fca5a5" : "#e5e7eb";

//   return (
//     <div
//       style={{
//         border: `2px solid ${borderColor}`,
//         borderRadius: 10,
//         marginBottom: 20,
//         background: bgColor,
//         overflow: "hidden",
//         position: "relative",
//       }}
//     >
//       {/* coloured top accent stripe */}
//       <div style={{
//         height: 4, background: borderColor,
//         position: "absolute", top: 0, left: 0, right: 0,
//       }} />

//       {/* section header */}
//       <div
//         className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2"
//         style={{ borderBottom: `1px solid ${borderColor}`, background: headerBg }}
//       >
//         <span style={{ fontSize: 13, fontWeight: 700, color: textColor }}>
//           {label}
//         </span>
//         <span style={{
//           display: "inline-flex", alignItems: "center", gap: 4,
//           fontSize: 11, fontWeight: 700, padding: "2px 10px",
//           borderRadius: 20, background: pillBg, color: textColor,
//           border: `1px solid ${pillBorder}`,
//         }}>
//           {isMatch    && <><MdCheckCircleOutline size={12} /> Matched</>}
//           {isMismatch && <><MdOutlineCancel size={12} /> Mismatch</>}
//           {!dataExists && "No Data"}
//         </span>
//       </div>

//       {/* form content — slightly dim when no data */}
//       <div style={{ opacity: dataExists ? 1 : 0.6, paddingTop: 4 }}>
//         {children}
//       </div>
//     </div>
//   );
// };

// // ─── Accuracy ring ────────────────────────────────────────────────────────────
// const AccuracyRing = ({ percent }) => {
//   const r    = 42;
//   const circ = 2 * Math.PI * r;
//   const dash = (percent / 100) * circ;
//   const color = percent >= 80 ? "#10b981" : percent >= 50 ? "#f59e0b" : "#ef4444";

//   return (
//     <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
//       <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
//         <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
//         <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
//           strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
//           style={{ transition: "stroke-dasharray 0.8s ease" }} />
//       </svg>
//       <div style={{
//         position: "absolute", inset: 0, display: "flex",
//         flexDirection: "column", alignItems: "center", justifyContent: "center",
//       }}>
//         <span style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>
//           {percent}%
//         </span>
//         <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>Accuracy</span>
//       </div>
//     </div>
//   );
// };

// // ─── Main component ───────────────────────────────────────────────────────────
// const AnswerSheetComparison = () => {
//   const { state } = useLocation();
//   const navigate  = useNavigate();
//   const dispatch  = useDispatch();
//   const token     = useSelector((s) => s.auth.token);
// const [formDataLoaded, setFormDataLoaded] = useState(false);
//   /*

//    */
//   const evaluationData = state?.evaluationData ?? null;
//   const backPath       = state?.backPath       ?? -1;
//   const caseId         = state?.caseId         ?? null;
//   const formId         = state?.formId         ?? null;
//   const userCaseId     = state?.userCaseId     ?? null;
//   const selectedForms  = state?.selectedForms  ?? [];


//   const apiData    = evaluationData?.data ?? {};
//   const result     = apiData.result       ?? {};
//   const stats      = result.stats         ?? {};
//   const discrepancies = result.discrepancies ?? [];
//   const accuracyPercent = Math.round(stats.accuracyPercentage ?? 0);

//   // useEffect(() => {
//   //   if (!caseId || !formId) return;
//   //   dispatch(resetSectionTotals());
//   //   dispatch(
//   //     loadForm(
//   //       { caseId, formId, userCaseId },
//   //       token,
//   //       { mirrorToLocalStorage: false }
//   //     )
//   //   );
//   // }, [caseId, formId, userCaseId, dispatch, token]);




//   useEffect(() => {
//   if (!caseId || !formId) return;
//   setFormDataLoaded(false);
//   dispatch(resetSectionTotals());
//   dispatch(
//     loadForm(
//       { caseId, formId, userCaseId },
//       token,
//       { mirrorToLocalStorage: false }
//     )
//   ).then(() => setFormDataLoaded(true));
// }, [caseId, formId, userCaseId, dispatch, token]);

//   // ── Build section-keyed discrepancy lookup ─────────────────────────────────
//   const discrepancyMap = useMemo(() => {
//     const map = {};
//     discrepancies.forEach((d) => {
//       if (!map[d.section]) map[d.section] = [];
//       map[d.section].push(d);
//     });
//     return map;
//   }, [discrepancies]);

//   // ── Mirror SubmittedForm's form-visibility logic ───────────────────────────
//   const FORM_COMPONENT_COUNTS = {
//     MMT8: 2, CDASI: 10, MDAAT: 2, Physician: 2, AllForms: 16,
//   };
//   const totalFormCount = selectedForms.reduce(
//     (sum, f) => sum + (FORM_COMPONENT_COUNTS[f] || 0),
//     0
//   );
//   const shouldShowForm = (n) => {
//     if (selectedForms.includes("AllForms")) return true;
//     const formMap = { 1: "MMT8", 2: "CDASI", 3: "MDAAT", 4: "Physician" };
//     return selectedForms.includes(formMap[n]);
//   };
//   const shouldShowForm8 =
//     selectedForms.includes("CDASI") || selectedForms.includes("AllForms");

//   // shared props for every form component
//   const FP = { readOnly: true, FORM_COUNT: totalFormCount };

//   // ── Guard — no data ────────────────────────────────────────────────────────
//   if (!evaluationData) {
//     return (
//       <MainWrapper>
//         <div className="d-flex flex-column align-items-center justify-content-center"
//           style={{ minHeight: 300 }}>
//           <p className="text-muted mb-3">No evaluation data available.</p>
//           <button className="btn btn-outline-secondary d-flex align-items-center gap-1"
//             onClick={() => navigate(-1)}>
//             <IoArrowBackOutline size={16} /> Go Back
//           </button>
//         </div>
//       </MainWrapper>
//     );
//   }

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <MainWrapper>

//       {/* ── Page header ── */}
//       <div className="mt-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
//         <div className="d-flex align-items-center gap-3">
//           <button
//             className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
//             onClick={() => navigate(backPath)}
//           >
//             <IoArrowBackOutline size={16} /> Back
//           </button>
//           <h4 className="mb-0 fw-bold">Answer Sheet Comparison</h4>
//         </div>
//       </div>

//       {/* ── Stats bar ── */}
//       <div className="p-4 rounded-3 mb-3 d-flex flex-wrap align-items-center gap-4"
//         style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
//         <AccuracyRing percent={accuracyPercent} />

//         <div className="d-flex flex-wrap gap-3 flex-grow-1">
//           {[
//             { label: "Total Fields",  value: stats.totalFields      ?? 0, color: "#6366f1" },
//             { label: "Exact Matches", value: stats.exactMatches     ?? 0, color: "#10b981" },
//             { label: "Within Range",  value: stats.withinRange      ?? 0, color: "#3b82f6" },
//             { label: "Mismatched",    value: stats.mismatchedFields ?? 0, color: "#ef4444" },
//             { label: "Ignored",       value: stats.ignored          ?? 0, color: "#9ca3af" },
//           ].map(({ label, value, color }) => (
//             <div key={label} className="text-center px-3 py-2 rounded-2"
//               style={{ background: "#fff", border: "1px solid #e2e8f0", minWidth: 100 }}>
//               <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
//               <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{label}</div>
//             </div>
//           ))}
//         </div>

//         {result?.message && (
//           <div className="px-3 py-2 rounded-2 text-center"
//             style={{
//               background: accuracyPercent >= 80 ? "#d1fae5" : "#fee2e2",
//               color: accuracyPercent >= 80 ? "#065f46" : "#991b1b",
//               fontWeight: 700, fontSize: 13, maxWidth: 240,
//             }}>
//             {result.message}
//           </div>
//         )}
//       </div>

//       {/* ── Legend ── */}
//       <div className="d-flex align-items-center gap-4 mb-4 flex-wrap">
//         <span style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>Legend:</span>
//         {[
//           { color: "#10b981", label: "Green — All fields matched" },
//           { color: "#ef4444", label: "Red — Has mismatched fields" },
//           { color: "#d1d5db", label: "Grey — No data / not evaluated" },
//         ].map(({ color, label }) => (
//           <span key={label} className="d-flex align-items-center gap-2"
//             style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
//             <span style={{
//               width: 14, height: 14, borderRadius: 3,
//               background: color, display: "inline-block", flexShrink: 0,
//             }} />
//             {label}
//           </span>
//         ))}
//       </div>

//       {/* ── Scoring sheet (same structure as SubmittedForm) ── */}
//       <div className="outer-wrap">
//         <div className="theme-card pe-2">
//           <div className="d-flex flex-wrap gap-2 align-items-center card-title mb-2">
//             <span><MdFormatAlignRight fontSize={18} /></span>
//             <h5 className="mb-0">Myositis Case Scoring Sheet</h5>
//           </div>
//           <hr className="horizontal-rule" />


//        {!formDataLoaded ? (
//             <div className="d-flex justify-content-center align-items-center py-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading form data…</span>
//               </div>
//             </div>
//       ) : (




//           <div className="col-sm-12 col-lg-12">

//             {/* ══════════ INITIAL VISIT ══════════ */}

//             {shouldShowForm(1) && (
//               <SectionWrapper formKey="Form1" visit="initial"
//                 discrepancyMap={discrepancyMap} label="MMT-8 — Initial Visit">
//                 <Form1 visit="initial" {...FP} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(2) && (
//               <>
//                 <SectionWrapper formKey="Form2" visit="initial"
//                   discrepancyMap={discrepancyMap} label="CDASI Activity — Initial Visit">
//                   <Form2 visit="initial" {...FP} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="Form3" visit="initial"
//                   discrepancyMap={discrepancyMap} label="CDASI Damage — Initial Visit">
//                   <Form3 visit="initial" {...FP} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="Form4" visit="initial"
//                   discrepancyMap={discrepancyMap} label="Gottron / Hands — Initial Visit">
//                   <Form4 visit="initial" {...FP} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="Form5" visit="initial"
//                   discrepancyMap={discrepancyMap} label="Periungual — Initial Visit">
//                   <Form5 visit="initial" {...FP} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="Form6" visit="initial"
//                   discrepancyMap={discrepancyMap} label="Alopecia — Initial Visit">
//                   <Form6 visit="initial" {...FP} />
//                 </SectionWrapper>
//               </>
//             )}

//             {shouldShowForm8 && (
//               <SectionWrapper formKey="Form8" visit="initial"
//                 discrepancyMap={discrepancyMap} label="CDASI Score — Initial Visit">
//                 <Form8 visit="initial" readOnly={true} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(3) && (
//               <SectionWrapper formKey="Form7" visit="initial"
//                 discrepancyMap={discrepancyMap} label="MDAAT — Initial Visit">
//                 <Form7 visit="initial" {...FP} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(4) && (
//               <SectionWrapper formKey="Form9" visit="initial"
//                 discrepancyMap={discrepancyMap} label="Physician Global — Initial Visit">
//                 <Form9 visit="initial" {...FP} />
//               </SectionWrapper>
//             )}

//             {/* ══════════ FOLLOW-UP VISIT ══════════ */}

//             {shouldShowForm(1) && (
//               <SectionWrapper formKey="Form1" visit="followUp"
//                 discrepancyMap={discrepancyMap} label="MMT-8 — Follow-Up Visit">
//                 <Form1 visit="followUp" {...FP} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(2) && (
//               <>
//                 <SectionWrapper formKey="Form2" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="CDASI Activity — Follow-Up Visit">
//                   <Form2 visit="followUp" {...FP} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="Form3" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="CDASI Damage — Follow-Up Visit">
//                   <Form3 visit="followUp" {...FP} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="Form4" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="Gottron / Hands — Follow-Up Visit">
//                   <Form4 visit="followUp" {...FP} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="Form5" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="Periungual — Follow-Up Visit">
//                   <Form5 visit="followUp" {...FP} />
//                 </SectionWrapper>

//                 <SectionWrapper formKey="Form6" visit="followUp"
//                   discrepancyMap={discrepancyMap} label="Alopecia — Follow-Up Visit">
//                   <Form6 visit="followUp" {...FP} />
//                 </SectionWrapper>
//               </>
//             )}

//             {shouldShowForm8 && (
//               <SectionWrapper formKey="Form8" visit="followUp"
//                 discrepancyMap={discrepancyMap} label="CDASI Score — Follow-Up Visit">
//                 <Form8 visit="followUp" readOnly={true} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(3) && (
//               <SectionWrapper formKey="Form7" visit="followUp"
//                 discrepancyMap={discrepancyMap} label="MDAAT — Follow-Up Visit">
//                 <Form7 visit="followUp" {...FP} />
//               </SectionWrapper>
//             )}

//             {shouldShowForm(4) && (
//               <SectionWrapper formKey="Form9" visit="followUp"
//                 discrepancyMap={discrepancyMap} label="Physician Global — Follow-Up Visit">
//                 <Form9 visit="followUp" {...FP} />
//               </SectionWrapper>
//             )}
  
//           </div>
//       )}
//         </div>
  
//       </div>
//     </MainWrapper>
//   );
// };

// export default AnswerSheetComparison;









import React, { useState, useMemo, useEffect, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainWrapper from "../../../CommonComponents/MainWrapper";
import { IoArrowBackOutline } from "react-icons/io5";
import {
  MdFormatAlignRight,
  MdCheckCircleOutline,
  MdOutlineCancel,
} from "react-icons/md";
import { loadForm, resetSectionTotals } from "../../../Redux/Actions/FormActions";

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
// ─── Discrepancy Context (form components can consume this to self-highlight) ─
//export const DiscrepancyContext = createContext({});

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

const hasMismatch = (keys, map) =>
  keys.some((k) =>
    (map[k] || []).some((d) => d.status === "MISMATCH")
  );

// ─── Pretty field name (strip section prefix) ────────────────────────────────
const prettyFieldName = (fieldName = "") => {
  // e.g. "MMT_8_initial.Biceps.left" → "Biceps · Left"
  const parts = fieldName.split(".");
  const meaningful = parts.slice(1);
  return meaningful
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" · ");
};

// ─── Field-level comparison table ────────────────────────────────────────────
const FieldComparisonTable = ({ sectionKeys, discrepancyMap }) => {
  const allDiscrepancies = sectionKeys.flatMap((k) => discrepancyMap[k] || []);
  if (!allDiscrepancies.length) return null;

  return (
    <div className="px-3 pb-3 pt-2">
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 8,
        }}
      >
        Field-level Comparison
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 4px",
            fontSize: 12,
          }}
        >
          <thead>
            <tr>
              {["Field", "Your Answer", "Expected Answer", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "4px 10px",
                      textAlign: "left",
                      color: "#6b7280",
                      fontWeight: 700,
                      background: "transparent",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {allDiscrepancies.map((d, i) => {
              const isMatch = d.status !== "MISMATCH";
              const rowBg = isMatch
                ? "rgba(16,185,129,0.10)"
                : "rgba(239,68,68,0.10)";
              const statusColor = isMatch ? "#065f46" : "#991b1b";
              const statusBg = isMatch ? "#d1fae5" : "#fee2e2";
              const statusBorder = isMatch ? "#6ee7b7" : "#fca5a5";

              return (
                <tr key={i}>
                  <td
                    style={{
                      padding: "6px 10px",
                      background: rowBg,
                      borderRadius: "6px 0 0 6px",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {prettyFieldName(d.fieldName)}
                  </td>
                  <td
                    style={{
                      padding: "6px 10px",
                      background: rowBg,
                      color: isMatch ? "#065f46" : "#b91c1c",
                      fontWeight: 700,
                    }}
                  >
                    {d.actualValue != null ? (
                      String(d.actualValue)
                    ) : (
                      <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                        not submitted
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "6px 10px",
                      background: rowBg,
                      color: "#374151",
                      fontWeight: 600,
                    }}
                  >
                    {d.expectedValue != null ? String(d.expectedValue) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "6px 10px",
                      background: rowBg,
                      borderRadius: "0 6px 6px 0",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: statusBg,
                        color: statusColor,
                        border: `1px solid ${statusBorder}`,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      {isMatch ? (
                        <>
                          <MdCheckCircleOutline size={11} /> Match
                        </>
                      ) : (
                        <>
                          <MdOutlineCancel size={11} /> Mismatch
                        </>
                      )}
                    </span>
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

// ─── Section wrapper with coloured border + field table ──────────────────────
const SectionWrapper = ({
  formKey,
  visit,
  discrepancyMap,
  label,
  children,
}) => {
  const [expanded, setExpanded] = useState(true);

  const sections = FORM_SECTION_MAP[formKey]?.(visit) ?? [];
  const dataExists = hasAnyData(sections, discrepancyMap);
  const isMismatch = dataExists && hasMismatch(sections, discrepancyMap);
  const isMatch = dataExists && !isMismatch;

  const borderColor = isMatch
    ? "#10b981"
    : isMismatch
    ? "#ef4444"
    : "#d1d5db";
  const bgColor = isMatch
    ? "rgba(16,185,129,0.05)"
    : isMismatch
    ? "rgba(239,68,68,0.05)"
    : "#f9fafb";
  const headerBg = isMatch
    ? "rgba(16,185,129,0.12)"
    : isMismatch
    ? "rgba(239,68,68,0.12)"
    : "#f3f4f6";
  const textColor = isMatch
    ? "#065f46"
    : isMismatch
    ? "#991b1b"
    : "#6b7280";
  const pillBg = isMatch ? "#d1fae5" : isMismatch ? "#fee2e2" : "#f3f4f6";
  const pillBorder = isMatch ? "#6ee7b7" : isMismatch ? "#fca5a5" : "#e5e7eb";

  return (
    <div
      style={{
        border: `2px solid ${borderColor}`,
        borderRadius: 10,
        marginBottom: 20,
        background: bgColor,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* top accent stripe */}
      <div
        style={{
          height: 4,
          background: borderColor,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      />

      {/* section header — click to collapse/expand */}
      <div
        className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2"
        style={{
          borderBottom: expanded ? `1px solid ${borderColor}` : "none",
          background: headerBg,
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setExpanded((e) => !e)}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: textColor }}>
          {label}
        </span>
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 10px",
              borderRadius: 20,
              background: pillBg,
              color: textColor,
              border: `1px solid ${pillBorder}`,
            }}
          >
            {isMatch && (
              <>
                <MdCheckCircleOutline size={12} /> All Matched
              </>
            )}
            {isMismatch && (
              <>
                <MdOutlineCancel size={12} /> Has Mismatches
              </>
            )}
            {!dataExists && "No Data"}
          </span>
          <span style={{ fontSize: 12, color: textColor, fontWeight: 600 }}>
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {expanded && (
        <>
          {/* field-level comparison table */}
          {dataExists && (
            <FieldComparisonTable
              sectionKeys={sections}
              discrepancyMap={discrepancyMap}
            />
          )}

          {/* divider between table and form */}
          {dataExists && (
            <div
              style={{
                height: 1,
                background: borderColor,
                opacity: 0.3,
                margin: "0 16px 8px",
              }}
            />
          )}

          {/* form content */}
          <div style={{ opacity: dataExists ? 1 : 0.55, paddingTop: 4 }}>
            {children}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Accuracy ring ────────────────────────────────────────────────────────────
const AccuracyRing = ({ percent }) => {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  const color =
    percent >= 80 ? "#10b981" : percent >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div
      style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}
    >
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>
          {percent}%
        </span>
        <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>
          Accuracy
        </span>
      </div>
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

  useEffect(() => {
    if (!caseId || !formId) return;
    setFormDataLoaded(false);
    dispatch(resetSectionTotals());
    dispatch(
      loadForm({ caseId, formId, userCaseId }, token, {
        mirrorToLocalStorage: false,
      })
    ).then(() => setFormDataLoaded(true));
  }, [caseId, formId, userCaseId, dispatch, token]);

  // ── Build section-keyed discrepancy lookup ──────────────────────────────
  const discrepancyMap = useMemo(() => {
    const map = {};
    discrepancies.forEach((d) => {
      if (!map[d.section]) map[d.section] = [];
      map[d.section].push(d);
    });
    return map;
  }, [discrepancies]);

  // ── Form visibility helpers ─────────────────────────────────────────────
  const FORM_COMPONENT_COUNTS = {
    MMT8: 2,
    CDASI: 10,
    MDAAT: 2,
    Physician: 2,
    AllForms: 16,
  };
  const totalFormCount = selectedForms.reduce(
    (sum, f) => sum + (FORM_COMPONENT_COUNTS[f] || 0),
    0
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
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: 300 }}
        >
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
        {/* Page header */}
        <div className="mt-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={() => navigate(backPath)}
            >
              <IoArrowBackOutline size={16} /> Back
            </button>
            <h4 className="mb-0 fw-bold">Answer Sheet Comparison</h4>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="p-4 rounded-3 mb-3 d-flex flex-wrap align-items-center gap-4"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <AccuracyRing percent={accuracyPercent} />

          <div className="d-flex flex-wrap gap-3 flex-grow-1">
            {[
              { label: "Total Fields",  value: stats.totalFields      ?? 0, color: "#6366f1" },
              { label: "Exact Matches", value: stats.exactMatches     ?? 0, color: "#10b981" },
              // { label: "Within Range",  value: stats.withinRange      ?? 0, color: "#3b82f6" },
              { label: "Mismatched",    value: stats.mismatchedFields ?? 0, color: "#ef4444" },
              // { label: "Ignored",       value: stats.ignored          ?? 0, color: "#9ca3af" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="text-center px-3 py-2 rounded-2"
                style={{ background: "#fff", border: "1px solid #e2e8f0", minWidth: 100 }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>

          {result?.message && (
            <div
              className="px-3 py-2 rounded-2 text-center"
              style={{
                background: accuracyPercent >= 80 ? "#d1fae5" : "#fee2e2",
                color: accuracyPercent >= 80 ? "#065f46" : "#991b1b",
                fontWeight: 700,
                fontSize: 13,
                maxWidth: 240,
              }}
            >
              {result.message}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="d-flex align-items-center gap-4 mb-4 flex-wrap">
          <span style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>
            Legend:
          </span>
          {[
            { color: "#10b981", label: "Green — All fields matched" },
            { color: "#ef4444", label: "Red — Has mismatched fields" },
            { color: "#d1d5db", label: "Grey — No data / not evaluated" },
          ].map(({ color, label }) => (
            <span
              key={label}
              className="d-flex align-items-center gap-2"
              style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: color,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {label}
            </span>
          ))}
        </div>

        {/* Scoring sheet */}
        <div className="outer-wrap">
          <div className="theme-card pe-2">
            <div className="d-flex flex-wrap gap-2 align-items-center card-title mb-2">
              <span>
                <MdFormatAlignRight fontSize={18} />
              </span>
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
                  <SectionWrapper
                    formKey="Form1" visit="initial"
                    discrepancyMap={discrepancyMap}
                    label="MMT-8 — Initial Visit"
                  >
                    <Form1 visit="initial" {...FP} />
                  </SectionWrapper>
                )}

                {shouldShowForm(2) && (
                  <>
                    <SectionWrapper formKey="Form2" visit="initial" discrepancyMap={discrepancyMap} label="CDASI Activity — Initial Visit">
                      <Form2 visit="initial" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form3" visit="initial" discrepancyMap={discrepancyMap} label="CDASI Damage — Initial Visit">
                      <Form3 visit="initial" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form4" visit="initial" discrepancyMap={discrepancyMap} label="Gottron / Hands — Initial Visit">
                      <Form4 visit="initial" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form5" visit="initial" discrepancyMap={discrepancyMap} label="Periungual — Initial Visit">
                      <Form5 visit="initial" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form6" visit="initial" discrepancyMap={discrepancyMap} label="Alopecia — Initial Visit">
                      <Form6 visit="initial" {...FP} />
                    </SectionWrapper>
                  </>
                )}

                {shouldShowForm8 && (
                  <SectionWrapper formKey="Form8" visit="initial" discrepancyMap={discrepancyMap} label="CDASI Score — Initial Visit">
                    <Form8 visit="initial" readOnly={true} />
                  </SectionWrapper>
                )}

                {shouldShowForm(3) && (
                  <SectionWrapper formKey="Form7" visit="initial" discrepancyMap={discrepancyMap} label="MDAAT — Initial Visit">
                    <Form7 visit="initial" {...FP} />
                  </SectionWrapper>
                )}

                {shouldShowForm(4) && (
                  <SectionWrapper formKey="Form9" visit="initial" discrepancyMap={discrepancyMap} label="Physician Global — Initial Visit">
                    <Form9 visit="initial" {...FP} />
                  </SectionWrapper>
                )}

                {/* ══════════ FOLLOW-UP VISIT ══════════ */}

                {shouldShowForm(1) && (
                  <SectionWrapper formKey="Form1" visit="followUp" discrepancyMap={discrepancyMap} label="MMT-8 — Follow-Up Visit">
                    <Form1 visit="followUp" {...FP} />
                  </SectionWrapper>
                )}

                {shouldShowForm(2) && (
                  <>
                    <SectionWrapper formKey="Form2" visit="followUp" discrepancyMap={discrepancyMap} label="CDASI Activity — Follow-Up Visit">
                      <Form2 visit="followUp" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form3" visit="followUp" discrepancyMap={discrepancyMap} label="CDASI Damage — Follow-Up Visit">
                      <Form3 visit="followUp" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form4" visit="followUp" discrepancyMap={discrepancyMap} label="Gottron / Hands — Follow-Up Visit">
                      <Form4 visit="followUp" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form5" visit="followUp" discrepancyMap={discrepancyMap} label="Periungual — Follow-Up Visit">
                      <Form5 visit="followUp" {...FP} />
                    </SectionWrapper>
                    <SectionWrapper formKey="Form6" visit="followUp" discrepancyMap={discrepancyMap} label="Alopecia — Follow-Up Visit">
                      <Form6 visit="followUp" {...FP} />
                    </SectionWrapper>
                  </>
                )}

                {shouldShowForm8 && (
                  <SectionWrapper formKey="Form8" visit="followUp" discrepancyMap={discrepancyMap} label="CDASI Score — Follow-Up Visit">
                    <Form8 visit="followUp" readOnly={true} />
                  </SectionWrapper>
                )}

                {shouldShowForm(3) && (
                  <SectionWrapper formKey="Form7" visit="followUp" discrepancyMap={discrepancyMap} label="MDAAT — Follow-Up Visit">
                    <Form7 visit="followUp" {...FP} />
                  </SectionWrapper>
                )}

                {shouldShowForm(4) && (
                  <SectionWrapper formKey="Form9" visit="followUp" discrepancyMap={discrepancyMap} label="Physician Global — Follow-Up Visit">
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

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO ADD FIELD-LEVEL HIGHLIGHTING TO YOUR FORM COMPONENTS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Inside any form component (e.g. Form1, Form9 …) import and use the context:
 *
 *   import { useContext } from "react";
 *   import { DiscrepancyContext } from "path/to/AnswerSheetComparison";
 *
 *   // inside the component:
 *   const discrepancyMap = useContext(DiscrepancyContext);
 *
 *   // build the section key that matches the API response
 *   // e.g. visit = "initial"  →  section = "MMT_8_initial"
 *   const section = `MMT_8_${visit}`;
 *   const sectionDisc = discrepancyMap[section] ?? [];
 *
 *   // for each field input, find its discrepancy entry:
 *   //   fieldName format from API:  "MMT_8_initial.Biceps.left"
 *   //   your local key might be:   "Biceps.left"
 *   const getFieldStyle = (localKey) => {
 *     const fullKey = `${section}.${localKey}`;
 *     const disc = sectionDisc.find((d) => d.fieldName === fullKey);
 *     if (!disc) return {};
 *     return disc.status === "MISMATCH"
 *       ? { background: "#fee2e2", borderColor: "#fca5a5" }
 *       : { background: "#d1fae5", borderColor: "#6ee7b7" };
 *   };
 *
 *   // Apply to your input:
 *   <input style={getFieldStyle("Biceps.left")} ... />
 * ─────────────────────────────────────────────────────────────────────────────
 */