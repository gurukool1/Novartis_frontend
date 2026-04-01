import React from "react";

/**
 * RangeInput — A dual min/max input for admin manual answer sheet.
 *
 * Props:
 *   value      – current value. Can be:
 *                  { min, max }    → range object (new format)
 *                  "3"             → legacy single value (backward compat)
 *                  "NA" | "yes"    → non-numeric string
 *                  "" | undefined  → empty
 *   onChange    – (newValue) => void
 *   options     – array of valid numeric option values, e.g. [0,1,2,3]
 *   disabled    – whether the input is read-only
 *   allowNA     – whether "NA" is a valid option (default false)
 *   isNonNumeric – if true, render a single <select> (for yes/no fields)
 *   nonNumericOpts – options for non-numeric select, e.g. ["yes","no"]
 *   style       – extra CSS to apply to the wrapper
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
}) {
  // ─── Non-numeric mode (yes/no, text fields) ───────────────────────
  if (isNonNumeric) {
    const strVal = typeof value === "object" && value !== null ? "" : value ?? "";
    return (
      <select
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

  // ─── Parse current value into min/max ─────────────────────────────
  let minVal = "";
  let maxVal = "";
  let isNA = false;
  let isZero = false;

  if (value === "NA") {
    isNA = true;
  } else if (typeof value === "object" && value !== null && ("min" in value || "max" in value)) {
    // New range format
    minVal = value.min !== undefined && value.min !== null ? String(value.min) : "";
    maxVal = value.max !== undefined && value.max !== null ? String(value.max) : "";
    
    // Check if it's explicitly explicitly {min: 0, max: 0}
    if (minVal === "0" && maxVal === "0") {
      isZero = true;
    }
  } else if (value !== undefined && value !== null && value !== "" && value !== "NA") {
    // Legacy single value → treat as both min and max
    minVal = String(value);
    maxVal = String(value);
  }

  // const handleMinChange = (e) => {
  //   const v = e.target.value;
  //   if (v === "NA") {
  //     onChange("NA");
  //     return;
  //   }
  //   const newMin = v === "" ? "" : v;
  //   const currentMax = isNA ? "" : maxVal;
  //   if (newMin === "" && currentMax === "") {
  //     onChange("");
  //   } else {
  //     onChange({ min: newMin === "" ? "" : Number(newMin), max: currentMax === "" ? "" : Number(currentMax) });
  //   }
  // };

const handleMinChange = (e) => {
  let v = e.target.value;

  if (v === "") {
    onChange({ min: "", max: maxVal || "" });
    return;
  }

  v = Math.max(0, Math.min(10, Number(v))); // clamp 0–10

  onChange({
    min: v,
    max: maxVal === "" ? "" : Number(maxVal),
  });
};

  // const handleMaxChange = (e) => {
  //   const v = e.target.value;
  //   if (v === "NA") {
  //     onChange("NA");
  //     return;
  //   }
  //   const newMax = v === "" ? "" : v;
  //   const currentMin = isNA ? "" : minVal;
  //   if (currentMin === "" && newMax === "") {
  //     onChange("");
  //   } else {
  //     onChange({ min: currentMin === "" ? "" : Number(currentMin), max: newMax === "" ? "" : Number(newMax) });
  //   }
  // };


const handleMaxChange = (e) => {
  let v = e.target.value;

  if (v === "") {
    onChange({ min: minVal || "", max: "" });
    return;
  }

  v = Math.max(0, Math.min(10, Number(v)));

  onChange({
    min: minVal === "" ? "" : Number(minVal),
    max: v,
  });
};

  const handleNAClick = () => {
    if (isNA) {
      onChange("");
    } else {
      onChange("NA");
    }
  };

  const handleZeroClick = () => {
    if (isZero) {
      onChange("");
    } else {
      onChange({ min: 0, max: 0 });
    }
  };

  // Build combined options list (numbers)
  const numOptions = options.filter((o) => o !== "NA");

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, flexWrap: "nowrap", ...style }}>
      {/* MIN INPUT */}
    <input
      type="number"
      min={0}
      max={10}
      className="input sm light px-2"
      style={{ width: "60px", fontSize: "11px", padding: "3px 2px" }}
      value={isNA ? "" : minVal}
      onChange={handleMinChange}
      disabled={disabled || isNA || isZero}
      placeholder="Min"
    />

    <span style={{ fontSize: 10, color: "#666", fontWeight: 700 }}>to</span>

    {/* MAX INPUT */}
    <input
      type="number"
      min={0}
      max={10}
      className="input sm light px-2"
      style={{ width: "60px", fontSize: "11px", padding: "3px 2px" }}
      value={isNA ? "" : maxVal}
      onChange={handleMaxChange}
      disabled={disabled || isNA || isZero}
      placeholder="Max"
    />
      {allowNA && (
        <>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              fontSize: 10,
              color: "#666",
              cursor: disabled ? "default" : "pointer",
              userSelect: "none",
              marginLeft: 2,
            }}
          >
            <input
              type="checkbox"
              checked={isZero}
              onChange={handleZeroClick}
              disabled={disabled || isNA}
              style={{ width: 13, height: 13 }}
            />
            0
          </label>

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              fontSize: 10,
              color: "#666",
              cursor: disabled ? "default" : "pointer",
              userSelect: "none",
              marginLeft: 2,
            }}
          >
            <input
              type="checkbox"
              checked={isNA}
              onChange={handleNAClick}
              disabled={disabled || isZero}
              style={{ width: 13, height: 13 }}
            />
            NA
          </label>
        </>
      )}
    </div>
  );
}
