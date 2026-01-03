import { useState, useEffect, useRef, memo, useCallback} from "react";
import { useDispatch, useSelector,} from "react-redux";
import {
  // pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";
import { setAlert } from "../../../Redux/Actions/AlertActions";

const makeKey = (section, visit) => `${section}_${visit}`;


const Sel = memo(({ opts, name, value, onChange, readOnly, isEmpty }) => {
  const [localValue, setLocalValue] = useState(value ?? "");
  const isInternalChange = useRef(false);

  useEffect(() => {
    // Only sync from parent if it wasn't our own change
    if (!isInternalChange.current) {
      setLocalValue(value ?? "");
    }
    isInternalChange.current = false;
  }, [value]);

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    isInternalChange.current = true;
    setLocalValue(newValue); // Instant UI update
    onChange(name, newValue);
  };

  return (
    <div>
      <select
        className="input sm light px-2"
        style={{ width: "72px" }}
        value={localValue}
        onChange={handleSelectChange}
        disabled={readOnly}
      >
        <option value="">Select</option>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {!readOnly && isEmpty && (
        <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
          Required
        </div>
      )}
    </div>
  );
});


const Slider = memo(({ name, value, onChange, readOnly, isEmpty }) => {
  const parentValue = value === null || value === undefined || value === "" ? null : Number(value);
  const [localValue, setLocalValue] = useState(parentValue);

  useEffect(() => {
    setLocalValue(parentValue);
  }, [parentValue]);

  const handleCommit = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={localValue === null ? 0 : localValue}
          onChange={(e) => setLocalValue(Number(e.target.value))}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          style={{ flex: 1 }}
          disabled={readOnly}
        />
        <input
          readOnly
          className="input sm light px-2"
          value={localValue === null ? "-" : localValue}
          style={{ width: 34, textAlign: "center" }}
        />
      </div>
      {!readOnly && isEmpty && (
        <div style={{ color: "red", fontSize: "11px", marginTop: "1px", textAlign: "center" }}>
          Required
        </div>
      )}
    </div>
  );
});

export default function Form7({ visit = "initial", readOnly = false, FORM_COUNT }) {
  const dispatch = useDispatch();

  const CF_OPTS = [0, 1, 2, 3, 4, "NA"];
  const key = makeKey("MDAAT", visit);
  const saved = useSelector(selectSectionData(key));
  const [scores, setScores] = useState(() => saved || {});
  
  
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (saved && Object.keys(saved).length > 0) {
      if (JSON.stringify(saved) !== JSON.stringify(scores)) {
        setScores(saved);
      }
    }
  }, [saved]);
 
  const isInitial = visit === "initial";

  const totalFields = 51; 
  const countFilledFields = (obj) => {
    let count = 0;
    for (const k in obj) {
      const val = obj[k];
      if (val === "" || val === null || val === undefined) continue;
      if (k.endsWith(".vas")) {
        // Count as filled if value exists (including 0)
        count++;
      } else {
        count++;
      }
    }
    return count;
  };
  const filled = countFilledFields(scores);

  const percentFilled = (filled / totalFields) * 100 / FORM_COUNT;
  const isFieldEmpty = (name) => {
    const value = scores[name];
    if (name.endsWith(".vas")) {
      return value === undefined || value === "" || value === null;
    }
    return !value || value === "";
  };

  // Stable callback for child components - won't cause re-renders
  const handleFieldChange = useCallback((name, newValue) => {
    setScores(prev => ({ ...prev, [name]: newValue }));
  }, []);

  const handleChange = (name) => (e) => {
    const newValue = e.target.value;
    const next = { ...scores, [name]: newValue };
    setScores(next);
    // dispatch(pushSectionData(key, next));
  };

  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  
  useEffect(() => {
    if (scores && Object.keys(scores).length > 0) {
      // Clear the previous timer if it exists
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set a new timer
      debounceTimer.current = setTimeout(() => {
        dispatch(pushSectionData(key, scores));
      },200);
    }

    // Cleanup function to clear the timer when the component unmounts
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [scores, key, dispatch]);

  return (
    <>
      <div className="form-section-wrap panel panel-default mt-4" id="form1Mdaat">
        {/* ... Rest of your JSX is completely unchanged ... */}
        {/* The entire table structure remains the same */}
        <div className="panel-heading">
          <strong>Form MDAAT</strong>
        </div>
        <div className="panel-body mt-3">
          <div className="table-container text-center">
            {isInitial ? (
              <h5>Case Presentation: Initial </h5>
            ) : (
              <h5>Case Presentation: Follow up</h5>
            )}
            <hr className="horizontal-rule my-2" />
            <h5>Myositis Disease Activity Assessment Tool (MDAAT)</h5>


            <div className="table-outer mt-3">
              <div className="table-responsive scrollbar-clr">
                <table className="table theme-table bdr">
                  <thead>
                    <tr>
                      <th className="optional fixed-id" style={{ width: "50px" }}>S/N</th>
                      <th className="essential persist">Disease Activity</th>
                      <th className="optional" >
                        Overall Organ Disease Activity (0-10 cm) VAS
                      </th>
                      <th className="optional">
                        Clinical Features (0,1,2,3,4, NA: Not Assessed)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* Constitutional Disease Activity */}
                    <tr>
                      <td className="fixed-id"></td>
                      <td>Constitutional Disease Activity</td>
                      <td>
                        <Slider name="constitutional.vas" value={scores["constitutional.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("constitutional.vas")} />
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td className="fixed-id">1</td>
                      <td>Pyrexia</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="pyrexia.cf" value={scores["pyrexia.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("pyrexia.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">2</td>
                      <td>Weight Loss</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="weightLoss.cf" value={scores["weightLoss.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("weightLoss.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">3</td>
                      <td>Fatigue</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="fatigue.cf" value={scores["fatigue.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("fatigue.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id"></td>
                      <td>Cutaneous Disease Activity</td>
                      <td>
                        <Slider name="cutaneous.vas" value={scores["cutaneous.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("cutaneous.vas")} />
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td className="fixed-id">4</td>
                      <td>Cutaneous Ulceration</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="cutaneousUlceration.cf" value={scores["cutaneousUlceration.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("cutaneousUlceration.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">5</td>
                      <td>Erythroderma</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="erythroderma.cf" value={scores["erythroderma.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("erythroderma.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">6</td>
                      <td>Panniculitis</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="panniculitis.cf" value={scores["panniculitis.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("panniculitis.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">
                        <strong>7</strong>
                      </td>
                      <td>
                        <strong>Erythematous Rash</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        A. with secondary changes (e.g. accompanied by erosions,
                        vesiculobullous change or necrosis)
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="erythemaWithSec.cf" value={scores["erythemaWithSec.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("erythemaWithSec.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        B. without secondary changes
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="erythemaNoSec.cf" value={scores["erythemaNoSec.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("erythemaNoSec.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">8</td>
                      <td>Heliotrope rash</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="heliotrope.cf" value={scores["heliotrope.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("heliotrope.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">9</td>
                      <td>Gottron's papules/sign</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="gottrons.cf" value={scores["gottrons.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("gottrons.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">10</td>
                      <td>Periungual capillary changes</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="periungualCap.cf" value={scores["periungualCap.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("periungualCap.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">11</td>
                      <td>Alopecia</td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">A. Diffuse hair Loss</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="diffuseHair.cf" value={scores["diffuseHair.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("diffuseHair.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        B. Focal, Patchy with Erythema
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="patchyHair.cf" value={scores["patchyHair.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("patchyHair.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">12</td>
                      <td>Mechanics Hand</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="mechanicsHand.cf" value={scores["mechanicsHand.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("mechanicsHand.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id"></td>
                      <td>Skeletal Disease Activity</td>
                      <td>
                        <Slider name="skeletal.vas" value={scores["skeletal.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("skeletal.vas")} />
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td className="fixed-id">
                        <strong>13</strong>
                      </td>
                      <td>
                        <strong>Arthritis</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        A. Severe active polyarthritis
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="polyarthritis.cf" value={scores["polyarthritis.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("polyarthritis.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        B. Moderately active arthritis
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="moderateArth.cf" value={scores["moderateArth.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("moderateArth.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">C. Mild arthritis</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="mildArth.cf" value={scores["mildArth.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("mildArth.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">14</td>
                      <td>Arthralgia</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="arthralgia.cf" value={scores["arthralgia.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("arthralgia.cf")} />
                      </td>
                    </tr>

                    {/* GI Disease Activity */}
                    <tr>
                      <td className="fixed-id"></td>
                      <td>GI Disease Activity</td>
                      <td>
                        <Slider name="gi.vas" value={scores["gi.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("gi.vas")} />
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td className="fixed-id">
                        <strong>15</strong>
                      </td>
                      <td>
                        <strong>Dysphagia</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        A. Moderate/severe dysphagia
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="dysphagiaSevere.cf" value={scores["dysphagiaSevere.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("dysphagiaSevere.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">B. Mild dysphagia</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="dysphagiaMild.cf" value={scores["dysphagiaMild.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("dysphagiaMild.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">
                        <strong>16</strong>
                      </td>
                      <td>
                        <strong>Abdominal Pain</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">A. Severe</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="abdPainSevere.cf" value={scores["abdPainSevere.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("abdPainSevere.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">B. Moderate</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="abdPainModerate.cf" value={scores["abdPainModerate.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("abdPainModerate.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">C. Mild</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="abdPainMild.cf" value={scores["abdPainMild.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("abdPainMild.cf")} />
                      </td>
                    </tr>

                    {/* Pulmonary Disease Activity */}
                    <tr>
                      <td className="fixed-id"></td>
                      <td>Pulmonary Disease Activity</td>
                      <td>
                        <Slider name="pulmonary.vas" value={scores["pulmonary.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("pulmonary.vas")} />
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td className="fixed-id">
                        <strong>17</strong>
                      </td>
                      <td>
                        <strong>Resp. Muscle weakness without ILD</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">A. Dyspnea at rest</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="dyspneaRest.cf" value={scores["dyspneaRest.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("dyspneaRest.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">B. Dyspnea on exertion</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="dyspneaExert.cf" value={scores["dyspneaExert.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("dyspneaExert.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">
                        <strong>18</strong>
                      </td>
                      <td>
                        <strong>Active Reversible ILD</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        A. Dyspnea or cough due to ILD
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="dyspneaILD.cf" value={scores["dyspneaILD.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("dyspneaILD.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        B. Parenchymal abnormalities on chest x-ray or HRCT and/or
                        ground glass shadowing on HRCT
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="parenchymal.cf" value={scores["parenchymal.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("parenchymal.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        C. Pulmonary Function Tests: ≥ 10% change in FVC OR ≥ 15%
                        change in DLCO
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="pft.cf" value={scores["pft.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("pft.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">
                        <strong>19</strong>
                      </td>
                      <td>
                        <strong>Dysphonia</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">A. Moderate to severe</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="dysphoniaSevere.cf" value={scores["dysphoniaSevere.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("dysphoniaSevere.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">B. Mild</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="dysphoniaMild.cf" value={scores["dysphoniaMild.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("dysphoniaMild.cf")} />
                      </td>
                    </tr>

                    {/* Cardiovascular Disease Activity */}
                    <tr>
                      <td className="fixed-id"></td>
                      <td>Cardiovascular Disease Activity</td>
                      <td>
                        <Slider name="cardio.vas" value={scores["cardio.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("cardio.vas")} />
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td className="fixed-id">20</td>
                      <td>Pericarditis</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="pericarditis.cf" value={scores["pericarditis.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("pericarditis.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">21</td>
                      <td>Myocarditis</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="myocarditis.cf" value={scores["myocarditis.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("myocarditis.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">
                        <strong>22</strong>
                      </td>
                      <td>
                        <strong>Arrhythmias</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">A. Severe arrhythmia</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="arrhythmiaSevere.cf" value={scores["arrhythmiaSevere.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("arrhythmiaSevere.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        B. Other arrhythmia, except sinus tachycardia
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="arrhythmiaOther.cf" value={scores["arrhythmiaOther.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("arrhythmiaOther.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">23</td>
                      <td>Sinus Tachycardia</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="sinusTachy.cf" value={scores["sinusTachy.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("sinusTachy.cf")} />
                      </td>
                    </tr>

                    {/* Other Disease Activity */}
                    <tr>
                      <td className="fixed-id"></td>
                      <td>
                        Other Disease Activity
                        <br />
                        <input
                          type="text"
                          className="input sm light input sm light-sm"
                          placeholder="Specify___"
                          value={scores["oda.specify"] || ""}
                          onChange={handleChange("oda.specify")}
                          disabled={readOnly}
                        />

                        {!readOnly && isFieldEmpty("oda.specify") && (
                          <div style={{ color: "red", fontSize: "11px", marginTop: "2px" }}>
                            Required
                          </div>
                        )}

                      </td>
                      <td>
                        <Slider name="oda.vas" value={scores["oda.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("oda.vas")} />
                      </td>
                      <td>
                        <Sel opts={CF_OPTS} name="oda.cf" value={scores["oda.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("oda.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id"></td>
                      <td>Extra Muscular Global Assessment</td>
                      <td>
                        <Slider name="extraMuscular.vas" value={scores["extraMuscular.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("extraMuscular.vas")} />
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td className="fixed-id"></td>
                      <td>Muscle Disease Activity</td>
                      <td>
                        <Slider name="muscle.vas" value={scores["muscle.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("muscle.vas")} />
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td className="fixed-id">
                        <strong>24</strong>
                      </td>
                      <td>
                        <strong>Myositis</strong>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        A. Severe muscle inflammation
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="myositisSevere.cf" value={scores["myositisSevere.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("myositisSevere.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">
                        B. Moderate muscle inflammation
                      </td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="myositisModerate.cf" value={scores["myositisModerate.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("myositisModerate.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td></td>
                      <td className="sub-heading">C. Mild muscle inflammation</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="myositisMild.cf" value={scores["myositisMild.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("myositisMild.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id">25</td>
                      <td>Myalgia</td>
                      <td></td>
                      <td>
                        <Sel opts={CF_OPTS} name="myalgia.cf" value={scores["myalgia.cf"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("myalgia.cf")} />
                      </td>
                    </tr>

                    <tr>
                      <td className="fixed-id"></td>
                      <td>Global Disease Activity</td>
                      <td>
                        <Slider name="global.vas" value={scores["global.vas"]} onChange={handleFieldChange} readOnly={readOnly} isEmpty={isFieldEmpty("global.vas")} />
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}

