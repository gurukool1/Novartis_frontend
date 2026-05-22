import React from "react";

/**
 * RangeInput — A dual min/max input with optional preset dropdown and expert number field.
 *
 * New Payload Rules:
 * 1. Preset Mode (0, NA, BOTH): { value: 0 | "NA" | {zero:0, na:"NA"}, expertNumber? }
 * 2. Range Mode (min-max): { min, max, expertNumber? }
 */
export default function RangeInput({
  value,
  onChange,
  options = [],
  disabled = false,
  allowNA = true,
  isNonNumeric = false,
  nonNumericOpts = [],
  style = {},
  id,
    allowSimultaneous = false
}) {
  // ─── Non-numeric mode (yes/no, text fields) ───────────────────────
  if (isNonNumeric) {
    const strVal = typeof value === "object" && value !== null ? (value.value ?? "") : value ?? "";
    return (
      <select
        id={id}
        className="input sm light px-2"
        style={{ width: "82px", ...style }}
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Select</option>
        {nonNumericOpts.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    );
  }




let minVal = "";
let maxVal = "";
let expertNumber = "";
let presetValue = "";

// if (value && typeof value === "object") {
//   expertNumber = value.expertNumber ?? "";

//   const v = value.value;

//   // ───── PRESETS ─────
//   if (v === 0 || v === "0") {
//     presetValue = "0";
//   } 
//   else if (v === "NA") {
//     presetValue = "NA";
//   } 
//   else if (v && typeof v === "object") {
//     const hasZero = v.zero === 0;
//     const hasNA = v.na === "NA";

//     if (hasZero && hasNA) presetValue = "BOTH";
//     else if (hasZero) presetValue = "0";
//     else if (hasNA) presetValue = "NA";
//   }

//   // ───── RANGE ─────
//   else if ("min" in value || "max" in value) {
//     minVal = value.min ?? "";
//     maxVal = value.max ?? "";
//   }
// }


if (value && typeof value === "object") {

  expertNumber = value.expertNumber ?? "";

  // parse range ALWAYS
  if ("min" in value || "max" in value) {
    minVal = value.min ?? "";
    maxVal = value.max ?? "";
  }

  // parse preset ALSO
  const v = value.value;

  if (v === 0 || v === "0") {
    presetValue = "0";
  } 
  else if (v === "NA") {
    presetValue = "NA";
  } 
  else if (v && typeof v === "object") {
    const hasZero = v.zero === 0;
    const hasNA = v.na === "NA";

    if (hasZero && hasNA) presetValue = "BOTH";
    else if (hasZero) presetValue = "0";
    else if (hasNA) presetValue = "NA";
  }
}



  const isPresetMode = presetValue !== "";
  const isRangeEntered = (minVal !== "" || maxVal !== "");




//   const handlePresetChange = (e) => {
//   const sel = e.target.value;

//   const base = { expertNumber: expertNumber || "" };
  
//    if (allowSimultaneous) {
//     base.min = minVal === "" ? "" : Number(minVal);
//     base.max = maxVal === "" ? "" : Number(maxVal);
//   }


//   if (sel === "0") {
//     onChange({ ...base, value: 0 });
//   } 
//   else if (sel === "NA") {
//     onChange({ ...base, value: "NA" });
//   } 
//   else if (sel === "BOTH") {
//     onChange({ ...base, value: { zero: 0, na: "NA" } });
//   } 
//    else {
//     // clear dropdown only
//     if (allowSimultaneous) {
//       onChange({
//         ...base,
//         value: "",
//       });
//     }
//   else {
//     onChange({ ...base, min: "", max: "" });
//   }
// };


const handlePresetChange = (e) => {
  const sel = e.target.value;

  const base = {
    expertNumber: expertNumber || "",
  };

  // preserve range if simultaneous allowed
  if (allowSimultaneous) {
    base.min = minVal === "" ? "" : Number(minVal);
    base.max = maxVal === "" ? "" : Number(maxVal);
  }

  if (sel === "0") {
    onChange({ ...base, value: 0 });
  } 
  else if (sel === "NA") {
    onChange({ ...base, value: "NA" });
  } 
  else if (sel === "BOTH") {
    onChange({ ...base, value: { zero: 0, na: "NA" } });
  } 
  else {
    // clear dropdown only
    if (allowSimultaneous) {
      onChange({
        ...base,
        value: "",
      });
    } else {
      onChange({
        ...base,
        min: "",
        max: "",
      });
    }
  }
};




  // const handleMinChange = (e) => {
  //   let v = e.target.value;
  //   const base = { expertNumber };
  //   if (v === "") {
  //     onChange({ ...base, min: "", max: maxVal || "" });
  //     return;
  //   }
  //   v = Math.max(0, Math.min(10, Number(v)));
  //   onChange({ ...base, min: v, max: maxVal === "" ? "" : Number(maxVal) });
  // };

  const handleMinChange = (e) => {
  let v = e.target.value;

  if (v === "") {
    onChange({
      ...value,
      min: "",
      max: maxVal || "",
    });
    return;
  }

  v = Math.max(0, Math.min(10, Number(v)));

  onChange({
    ...value,
    min: v,
    max: maxVal === "" ? "" : Number(maxVal),
  });
};



  // const handleMaxChange = (e) => {
  //   let v = e.target.value;
  //   const base = { expertNumber };
  //   if (v === "") {
  //     onChange({ ...base, min: minVal || "", max: "" });
  //     return;
  //   }
  //   v = Math.max(0, Math.min(10, Number(v)));
  //   onChange({ ...base, min: minVal === "" ? "" : Number(minVal), max: v });
  // };



  const handleMaxChange = (e) => {
  let v = e.target.value;

  if (v === "") {
    onChange({
      ...value,
      min: minVal || "",
      max: "",
    });
    return;
  }

  v = Math.max(0, Math.min(10, Number(v)));

  onChange({
    ...value,
    min: minVal === "" ? "" : Number(minVal),
    max: v,
  });
};





  // const handleExpertChange = (e) => {
  //   const v = e.target.value;
  //   if (isPresetMode) {
  //     const pVal = presetValue === "BOTH" ? { zero: 0, na: "NA" } : (presetValue === "0" ? 0 : "NA");
  //     onChange({ value: pVal, expertNumber: v });
  //   } else {
  //     onChange({
  //       min: minVal === "" ? "" : Number(minVal),
  //       max: maxVal === "" ? "" : Number(maxVal),
  //       expertNumber: Number(v),
  //     });
  //   }
  // };


  const handleExpertChange = (e) => {
  const v = e.target.value;

  if (isPresetMode) {
    const pVal = presetValue === "BOTH"
      ? { zero: 0, na: "NA" }
      : (presetValue === "0" ? 0 : "NA");

    onChange({ value: pVal, expertNumber: v }); // keep internal same
  } else {
    onChange({
      min: minVal === "" ? "" : Number(minVal),
      max: maxVal === "" ? "" : Number(maxVal),
      expertNumber: v,
    });
  }
};




  // UI state for hiding/disabling
  //const showRange = !isPresetMode;
  //const showDropdown = !isRangeEntered || isPresetMode;
  const showDropdown = true;

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div id={id} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, ...style
    }}>
      {/* Row 1: Dropdown and/or Min/Max */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 4, flexWrap: "nowrap", height: "26px"
      }}>
        {/* Preset Dropdown */}
        {/* {allowNA && showDropdown && (
          <select
            className="input sm light"
            style={{
              width: 80, fontSize: 10, padding: "3px 2px",
              fontWeight: 700, color: presetValue ? "#1d4ed8" : "#9ca3af",
              borderRadius: 4, cursor: disabled ? "default" : "pointer",
              background: presetValue ? "#eff6ff" : "#fff",
              border: presetValue ? "1px solid #bfdbfe" : "1px solid #e2e8f0"
            }}
            value={presetValue}
            onChange={handlePresetChange}
            disabled={disabled}
          >
            <option value="">— Range —</option>
            <option value="0">0</option>
            <option value="NA">NA</option>
            <option value="BOTH">0 & NA</option>
          </select>
        )} */}

        {/* MIN/MAX Inputs */}
        {/* {showRange && ( */}
          <>
            <input
              type="number"
              min={0}
              max={10}
              className="input sm light px-2"
              style={{
                width: 50, fontSize: 11, padding: "3px 2px", textAlign: "center",
                borderRadius: 4,
              }}
              //value={minVal}
              value={minVal === 0 ? "0" : minVal ?? ""}

              onChange={handleMinChange}
              disabled={disabled}
              placeholder="Min"
            />
            <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700 }}>to</span>
            <input
              type="number"
              min={0}
              max={10}
              className="input sm light px-2"
              style={{
                width: 50, fontSize: 11, padding: "3px 2px", textAlign: "center",
                borderRadius: 4,
              }}
             // value={maxVal}
              value={maxVal === 0 ? "0" : maxVal ?? ""}
              onChange={handleMaxChange}
              //disabled={disabled || isPresetMode}
              disabled={disabled || (isPresetMode && !allowSimultaneous)}
              placeholder="Max"
            />
          </>
        {/* )} */}



      {allowNA && showDropdown && (
          <select
            className="input sm light"
            style={{
              width: 80, fontSize: 10, padding: "3px 2px",
              fontWeight: 700, color: presetValue ? "#1d4ed8" : "#9ca3af",
              borderRadius: 4, cursor: disabled ? "default" : "pointer",
              background: presetValue ? "#eff6ff" : "#fff",
              border: presetValue ? "1px solid #bfdbfe" : "1px solid #e2e8f0"
            }}
            value={presetValue}
            onChange={handlePresetChange}
            disabled={disabled}
          >
            <option value="">— Range —</option>
            <option value="0">0</option>
            <option value="NA">NA</option>
            <option value="BOTH">0 & NA</option>
          </select>
        )}


      </div>

      {/* Row 2: Expert Number */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
      }}>
        <span style={{ fontSize: 9, color: "#64748b", fontWeight: 600 }}>Expert Number</span>
        <input
          type="number"
          className="input sm light px-1"
          style={{
            width: 60, fontSize: 10, padding: "2px 2px", textAlign: "center",
            borderRadius: 4, color: "#334155",
            border: "1px dashed #cbd5e1",
          }}
          //value={expertNumber}
          value={expertNumber ?? ""}
          onChange={handleExpertChange}
          disabled={disabled}
          placeholder="opt"
        />
      </div>
    </div>
  );
}
