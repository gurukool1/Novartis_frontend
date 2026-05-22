import React from "react";
import RangeInput from "./RangeInput";
import { isRangeValue } from "./rangeUtils";

export default function Form7({
  visit = "initial",
  readOnly = false,
  scores = {},
  onChange,
  FORM_COUNT = 1,
}) {
  const CF_OPTS = [0, 1, 2, 3, 4]; // NA handled via allowNA
  const totalFields = 51;

  // Stable handler for changes
  const handleChange = (name) => (newValue) => {
    onChange({
      ...scores,
      [name]: newValue,
    });
  };

  // Handler for text input fields (like oda.specify)
  const handleTextChange = (name) => (e) => {
    onChange({
      ...scores,
      [name]: e.target.value,
    });
  };

  const percentFilled =
    (Object.values(scores).filter(
      (v) => {
        if (v === "" || v === undefined || v === null) return false;
        if (v === "NA") return true;
        if (isRangeValue(v) && (v.min === "" || v.max === "")) return false;
        return true;
      }
    ).length / totalFields) *
    (100 / FORM_COUNT);

  const isInitial = visit === "initial";

  // Range-based Slider Component (two sliders for min/max)
  const RangeSlider = ({ name }) => {
    const val = scores[name];
    let initialMin = 0;
    let initialMax = 0;
    let expertNumber = "";

    if (isRangeValue(val)) {
      initialMin = Number(val.min) || 0;
      initialMax = Number(val.max) || 0;
      expertNumber = val.expertNumber ?? "";
    } else if (val !== "" && val !== null && val !== undefined) {
      initialMin = Number(val) || 0;
      initialMax = Number(val) || 0;
    }

    const [localMin, setLocalMin] = React.useState(initialMin);
    const [localMax, setLocalMax] = React.useState(initialMax);

    React.useEffect(() => {
      setLocalMin(initialMin);
      setLocalMax(initialMax);
    }, [initialMin, initialMax]);

    const onMinSliderChange = (e) => {
      setLocalMin(Number(e.target.value));
    };

    const onMaxSliderChange = (e) => {
      setLocalMax(Number(e.target.value));
    };

    const commitMinChange = () => {
      const currentMax = isRangeValue(scores[name]) ? Number(scores[name].max) || 0 : initialMax;
      onChange({
        ...scores,
        [name]: { min: localMin, max: Math.max(localMin, currentMax), expertNumber },
      });
    };

    const commitMaxChange = () => {
      const currentMin = isRangeValue(scores[name]) ? Number(scores[name].min) || 0 : initialMin;
      onChange({
        ...scores,
        [name]: { min: Math.min(currentMin, localMax), max: localMax, expertNumber },
      });
    };

    const onExpertChange = (e) => {
      const v = e.target.value;
      const currentMin = isRangeValue(scores[name]) ? Number(scores[name].min) || 0 : initialMin;
      const currentMax = isRangeValue(scores[name]) ? Number(scores[name].max) || 0 : initialMax;
      onChange({
        ...scores,
        [name]: { min: currentMin, max: currentMax, expertNumber: v },
      });
    };

    return (
      <div id={`${visit}_${name}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "#888", fontWeight: 600, minWidth: 24 }}>Min</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={localMin}
            disabled={readOnly}
            onChange={onMinSliderChange}
            onMouseUp={commitMinChange}
            onTouchEnd={commitMinChange}
            onKeyUp={commitMinChange}
            style={{ flex: 1 }}
          />
          <input
            readOnly
            className="input sm light px-2"
            value={localMin}
            style={{ width: 34, textAlign: "center" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "#888", fontWeight: 600, minWidth: 24 }}>Max</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={localMax}
            disabled={readOnly}
            onChange={onMaxSliderChange}
            onMouseUp={commitMaxChange}
            onTouchEnd={commitMaxChange}
            onKeyUp={commitMaxChange}
            style={{ flex: 1 }}
          />
          <input
            readOnly
            className="input sm light px-2"
            value={localMax}
            style={{ width: 34, textAlign: "center" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
          <span style={{ fontSize: 9, color: "#64748b", fontWeight: 600 }}>Expert Number</span>
          <input
            type="number"
            className="input sm light px-1"
            style={{
              width: 60, fontSize: 10, padding: "2px 2px", textAlign: "center",
              borderRadius: 4, color: "#334155",
              border: "1px dashed #cbd5e1",
            }}
            value={expertNumber}
            onChange={onExpertChange}
            disabled={readOnly}
            placeholder="opt"
          />
        </div>
      </div>
    );
  };

  // Select Component (Range-based)
  const Sel = ({ name }) => (
    <div id={`${visit}_${name}`}>
      <RangeInput
        id={`${visit}_${name}`}
        value={scores[name]}
        onChange={handleChange(name)}
        options={CF_OPTS}
        disabled={readOnly}
        allowNA={true}
      />
    </div>
  );

  return (
    <div className="form-section-wrap panel panel-default mt-4" id="form1Mdaat">
      <div className="panel-heading">
        <strong>Form MDAAT</strong>
      </div>
      <div className="panel-body mt-3">
        <div className="table-container text-center">
          {isInitial ? <h5>Case Presentation: Initial</h5> : <h5>Case Presentation: Follow up</h5>}
          <hr className="horizontal-rule my-2" />
          <h5>Myositis Disease Activity Assessment Tool (MDAAT)</h5>

          <div className="table-outer mt-3">
            <div className="table-responsive scrollbar-clr">
              <table className="table theme-table bdr">
                <thead>
                  <tr>
                    <th className="optional fixed-id" style={{ width: "50px" }}>S/N</th>
                    <th className="essential persist">Disease Activity</th> 
                    <th className="optional">Overall Organ Disease Activity (0-10 cm) VAS</th>
                    <th className="optional">Clinical Features (0,1,2,3,4, NA: Not Assessed)</th>
                  </tr>
                </thead>
          
               <tbody>
                  {/* Constitutional Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>Constitutional Disease Activity</td>
                    <td>
                      <RangeSlider name="constitutional.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">1</td>
                    <td>Pyrexia</td>
                    <td></td>
                    <td>
                      <Sel name="pyrexia.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">2</td>
                    <td>Weight Loss</td>
                    <td></td>
                    <td>
                      <Sel name="weightLoss.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">3</td>
                    <td>Fatigue</td>
                    <td></td>
                    <td>
                      <Sel name="fatigue.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Cutaneous Disease Activity</td>
                    <td>
                      <RangeSlider name="cutaneous.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">4</td>
                    <td>Cutaneous Ulceration</td>
                    <td></td>
                    <td>
                      <Sel name="cutaneousUlceration.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">5</td>
                    <td>Erythroderma</td>
                    <td></td>
                    <td>
                      <Sel name="erythroderma.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">6</td>
                    <td>Panniculitis</td>
                    <td></td>
                    <td>
                      <Sel name="panniculitis.cf" />
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
                      <Sel name="erythemaWithSec.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. without secondary changes
                    </td>
                    <td></td>
                    <td>
                      <Sel name="erythemaNoSec.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">8</td>
                    <td>Heliotrope rash</td>
                    <td></td>
                    <td>
                      <Sel name="heliotrope.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">9</td>
                    <td>Gottron's papules/sign</td>
                    <td></td>
                    <td>
                      <Sel name="gottrons.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">10</td>
                    <td>Periungual capillary changes</td>
                    <td></td>
                    <td>
                      <Sel name="periungualCap.cf" />
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
                      <Sel name="diffuseHair.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Focal, Patchy with Erythema
                    </td>
                    <td></td>
                    <td>
                      <Sel name="patchyHair.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">12</td>
                    <td>Mechanics Hand</td>
                    <td></td>
                    <td>
                      <Sel name="mechanicsHand.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Skeletal Disease Activity</td>
                    <td>
                      <RangeSlider name="skeletal.vas" />
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
                      <Sel name="polyarthritis.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Moderately active arthritis
                    </td>
                    <td></td>
                    <td>
                      <Sel name="moderateArth.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">C. Mild arthritis</td>
                    <td></td>
                    <td>
                      <Sel name="mildArth.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">14</td>
                    <td>Arthralgia</td>
                    <td></td>
                    <td>
                      <Sel name="arthralgia.cf" />
                    </td>
                  </tr>

                  {/* GI Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>GI Disease Activity</td>
                    <td>
                      <RangeSlider name="gi.vas" />
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
                      <Sel name="dysphagiaSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Mild dysphagia</td>
                    <td></td>
                    <td>
                      <Sel name="dysphagiaMild.cf" />
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
                      <Sel name="abdPainSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Moderate</td>
                    <td></td>
                    <td>
                      <Sel name="abdPainModerate.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">C. Mild</td>
                    <td></td>
                    <td>
                      <Sel name="abdPainMild.cf" />
                    </td>
                  </tr>

                  {/* Pulmonary Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>Pulmonary Disease Activity</td>
                    <td>
                      <RangeSlider name="pulmonary.vas" />
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
                      <Sel name="dyspneaRest.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Dyspnea on exertion</td>
                    <td></td>
                    <td>
                      <Sel name="dyspneaExert.cf" />
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
                      <Sel name="dyspneaILD.cf" />
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
                      <Sel name="parenchymal.cf" />
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
                      <Sel name="pft.cf" />
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
                      <Sel name="dysphoniaSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Mild</td>
                    <td></td>
                    <td>
                      <Sel name="dysphoniaMild.cf" />
                    </td>
                  </tr>

                  {/* Cardiovascular Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>Cardiovascular Disease Activity</td>
                    <td>
                      <RangeSlider name="cardio.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">20</td>
                    <td>Pericarditis</td>
                    <td></td>
                    <td>
                      <Sel name="pericarditis.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">21</td>
                    <td>Myocarditis</td>
                    <td></td>
                    <td>
                      <Sel name="myocarditis.cf" />
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
                      <Sel name="arrhythmiaSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Other arrhythmia, except sinus tachycardia
                    </td>
                    <td></td>
                    <td>
                      <Sel name="arrhythmiaOther.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">23</td>
                    <td>Sinus Tachycardia</td>
                    <td></td>
                    <td>
                      <Sel name="sinusTachy.cf" />
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
                        onChange={handleTextChange("oda.specify")}
                        disabled={readOnly}
                      />
                    </td>
                    <td>
                      <RangeSlider name="oda.vas" />
                    </td>
                    <td>
                      <Sel name="oda.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Extra Muscular Global Assessment</td>
                    <td>
                      <RangeSlider name="extraMuscular.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Muscle Disease Activity</td>
                    <td>
                      <RangeSlider name="muscle.vas" />
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
                      <Sel name="myositisSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Moderate muscle inflammation
                    </td>
                    <td></td>
                    <td>
                      <Sel name="myositisModerate.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">C. Mild muscle inflammation</td>
                    <td></td>
                    <td>
                      <Sel name="myositisMild.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">25</td>
                    <td>Myalgia</td>
                    <td></td>
                    <td>
                      <Sel name="myalgia.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Global Disease Activity</td>
                    <td>
                      <RangeSlider name="global.vas" />
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
  );
}
