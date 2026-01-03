import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  // pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";

const makeKey = (section, visit) => `${section}_${visit}`;
export default function Form7({ visit = "initial", readOnly = false, FORM_COUNT }) {
  const dispatch = useDispatch();

  const CF_OPTS = [0, 1, 2, 3, 4, "NA"];
  const key = makeKey("MDAAT", visit);

  const saved = useSelector(selectSectionData(key), shallowEqual);

  const [scores, setScores] = useState(saved);
  useEffect(() => {
    if (saved !== scores) setScores(saved);
  }, [saved]);

  const isInitial = visit === "initial";

  const Sel = ({ opts, name }) => (
    <select
      className="input sm light px-2"
      style={{ width: "72px" }}
      value={scores[name] ?? ""}
      onChange={(e) => setScores((p) => ({ ...p, [name]: e.target.value }))}
      disabled={readOnly}
    >
      <option value="">Select</option>
      {opts.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  const Slider = ({ name }) => {
    const value =
      scores[name] === undefined || scores[name] === ""
        ? 0
        : Number(scores[name]);

    const handle = (e) => setScores((p) => ({ ...p, [name]: e.target.value }));

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 3}}>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={handle}
          style={{ flex: 1 }}
          disabled={readOnly}
        />

        <input
          readOnly
          className="input sm light px-2"
          value={value}
          style={{ width: 34, textAlign: "center" }}
        />
      </div>
    );
  };

  // const total = useMemo(() => {
  //   return Object.values(scores).reduce((sum, v) => {
  //     if (v === "" || v === "NA") return sum;
  //     return sum + Number(v);
  //   }, 0);
  // }, [scores]);
  // const FORM_COUNT = 14;
  const percentFilled = useMemo(() => {
    const totalFields = 50;
    const filled = Object.entries(scores).filter(([key, val]) => {
      if (val === "") return false;
      if (key.endsWith(".vas")) {
        return Number(val) > 0;
      }
      if (key.endsWith(".cf")) {
        return true;
      }
      return true;
    }).length;

    const rawPercent = (filled / totalFields) * 100;
    const scaled = rawPercent * (1 / FORM_COUNT);
    return scaled;
  }, [scores]);

  useEffect(() => {
    dispatch(setVisitPercent(key, visit, percentFilled));
  }, [percentFilled, dispatch, visit]);

  useEffect(() => {
    // dispatch(pushSectionTotal(key, total));
    dispatch(pushSectionData(key, scores));
  }, [visit, scores, dispatch]);

  return (
    <>
    <div className="form-section-wrap panel panel-default mt-4" id="form1Mdaat">
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
                    <th className="optional">
                      Overall Organ Disease Activity (0-10 cm) VAS
                    </th>
                    <th className="optional" >
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
                      <Slider name="constitutional.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">1</td>
                    <td>Pyrexia</td>
                    <td></td>
                    <td>
                      <Sel
                        opts={CF_OPTS}
                        name="pyrexia.cf"
                        disabled={readOnly}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">2</td>
                    <td>Weight Loss</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="weightLoss.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">3</td>
                    <td>Fatigue</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="fatigue.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Cutaneous Disease Activity</td>
                    <td>
                      <Slider name="cutaneous.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">4</td>
                    <td>Cutaneous Ulceration</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="cutaneousUlceration.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">5</td>
                    <td>Erythroderma</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="erythroderma.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">6</td>
                    <td>Panniculitis</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="panniculitis.cf" />
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
                      <Sel opts={CF_OPTS} name="erythemaWithSec.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. without secondary changes
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="erythemaNoSec.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">8</td>
                    <td>Heliotrope rash</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="heliotrope.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">9</td>
                    <td>Gottron's papules/sign</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="gottrons.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">10</td>
                    <td>Periungual capillary changes</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="periungualCap.cf" />
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
                      <Sel opts={CF_OPTS} name="diffuseHair.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Focal, Patchy with Erythema
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="patchyHair.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">12</td>
                    <td>Mechanics Hand</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="mechanicsHand.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Skeletal Disease Activity</td>
                    <td>
                      <Slider name="skeletal.vas" />
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
                      <Sel opts={CF_OPTS} name="polyarthritis.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Moderately active arthritis
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="moderateArth.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">C. Mild arthritis</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="mildArth.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">14</td>
                    <td>Arthralgia</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="arthralgia.cf" />
                    </td>
                  </tr>

                  {/* GI Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>GI Disease Activity</td>
                    <td>
                      <Slider name="gi.vas" />
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
                      <Sel opts={CF_OPTS} name="dysphagiaSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Mild dysphagia</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="dysphagiaMild.cf" />
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
                      <Sel opts={CF_OPTS} name="abdPainSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Moderate</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="abdPainModerate.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">C. Mild</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="abdPainMild.cf" />
                    </td>
                  </tr>

                  {/* Pulmonary Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>Pulmonary Disease Activity</td>
                    <td>
                      <Slider name="pulmonary.vas" />
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
                      <Sel opts={CF_OPTS} name="dyspneaRest.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Dyspnea on exertion</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="dyspneaExert.cf" />
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
                      <Sel opts={CF_OPTS} name="dyspneaILD.cf" />
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
                      <Sel opts={CF_OPTS} name="parenchymal.cf" />
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
                      <Sel opts={CF_OPTS} name="pft.cf" />
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
                      <Sel opts={CF_OPTS} name="dysphoniaSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">B. Mild</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="dysphoniaMild.cf" />
                    </td>
                  </tr>

                  {/* Cardiovascular Disease Activity */}
                  <tr>
                    <td className="fixed-id"></td>
                    <td>Cardiovascular Disease Activity</td>
                    <td>
                      <Slider name="cardio.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id">20</td>
                    <td>Pericarditis</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="pericarditis.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">21</td>
                    <td>Myocarditis</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="myocarditis.cf" />
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
                      <Sel opts={CF_OPTS} name="arrhythmiaSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Other arrhythmia, except sinus tachycardia
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="arrhythmiaOther.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">23</td>
                    <td>Sinus Tachycardia</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="sinusTachy.cf" />
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
                        onChange={(e) => setScores((p) => ({ ...p, ["oda.specify"]: e.target.value }))}
                        disabled={readOnly}
                      />
                    </td>
                    <td>
                      <Slider name="oda.vas" />
                    </td>
                    <td>
                      <Sel opts={CF_OPTS} name="oda.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Extra Muscular Global Assessment</td>
                    <td>
                      <Slider name="extraMuscular.vas" />
                    </td>
                    <td></td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Muscle Disease Activity</td>
                    <td>
                      <Slider name="muscle.vas" />
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
                      <Sel opts={CF_OPTS} name="myositisSevere.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">
                      B. Moderate muscle inflammation
                    </td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="myositisModerate.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="sub-heading">C. Mild muscle inflammation</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="myositisMild.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id">25</td>
                    <td>Myalgia</td>
                    <td></td>
                    <td>
                      <Sel opts={CF_OPTS} name="myalgia.cf" />
                    </td>
                  </tr>

                  <tr>
                    <td className="fixed-id"></td>
                    <td>Global Disease Activity</td>
                    <td>
                      <Slider name="global.vas" />
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
    {/* <div className="form-section-wrap table-container text-center mt-4">
                        <section>
                          {isInitial ? (
                            <h5>Case Presentation: Initial </h5>
                          ) : (
                            <h5>Case Presentation: Follow up</h5>
                          )}
                          <h5>Physician Global Disease Activity</h5>
                          <strong>Please rate patient's global (overall) disease activity</strong>
                          <div className="slider-section text-center mt-3 px-3">
                            <div>Selected Value: <strong>{scores["physicianGlobal.vas"] ?? 0}</strong></div>
                            <div style={{ position: "relative", margin: "20px 0" }}>
                              <div style={{
                                height: 6,
                                background: "#e9ecef",
                                borderRadius: 3,
                                position: "relative"
                              }}>
                                <div style={{
                                  width: `${(scores["physicianGlobal.vas"] ?? 0) * 10}%`,
                                  height: "100%",
                                  background: "var(--button-1)",
                                  borderRadius: 3
                                }} />
                                <div style={{
                                  position: "absolute",
                                  left: `${(scores["physicianGlobal.vas"] ?? 0) * 10}%`,
                                  top: -7,
                                  transform: "translateX(-50%)"
                                }}>
                                  <div style={{
                                    width: 20,
                                    height: 20,
                                    background: "var(--button-1)",
                                    borderRadius: "50%",
                                    border: "2px solid white"
                                  }} />
                                </div>
                              </div>
                              <input
                                type="range"
                                min={0}
                                max={10}
                                step={1}
                                value={scores["physicianGlobal.vas"] ?? 0}
                                disabled={readOnly}
                                onChange={(e) =>
                                  setScores((p) => ({ ...p, ["physicianGlobal.vas"]: (e.target.value) }))
                                }
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: 20,
                                  opacity: 0,
                                  cursor: "pointer"
                                }}
                              />
                            </div>
                          </div>
                        </section>
    </div> */}

  </>

  );
}
