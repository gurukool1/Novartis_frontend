import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  // pushSectionTotal,
  pushSectionData,
  selectSectionData,
  setVisitPercent,
} from "../../../Redux/Actions/FormActions";

const makeKey = (section, visit) => `${section}_${visit}`;
export default function Form9({ visit = "initial", readOnly = false, FORM_COUNT }) {
    const dispatch = useDispatch();

    const key = makeKey("Physician", visit);

    const saved = useSelector(selectSectionData(key), shallowEqual);
    const savedValue = Number(saved?.["Physicianglobal"]?? 0) || 0;

    const [scores, setScores] = useState(savedValue);
    useEffect(() => setScores(savedValue), [savedValue]);
    
    // useEffect(() => {
    //     if (saved !== scores) setScores(saved);
    // }, [saved]);

    const isInitial = visit === "initial";


    // const Slider = ({ name }) => {
    //     const value =
    //     scores[name] === undefined || scores[name] === ""
    //         ? 0
    //         : Number(scores[name]);

    //     const handle = (e) => setScores((p) => ({ ...p, [name]: e.target.value }));

    //     return (
    //     <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
    //         <input
    //         type="range"
    //         min={0}
    //         max={10}
    //         step={1}
    //         value={value}
    //         onChange={handle}
    //         style={{ flex: 1 }}
    //         disabled={readOnly}
    //         />

    //         <input
    //         readOnly
    //         className="input sm light px-2"
    //         value={value}
    //         style={{ width: 34, textAlign: "center" }}
    //         />
    //     </div>
    //     );
    // };

    // // const total = useMemo(() => {
    //   return Object.values(scores).reduce((sum, v) => {
    //     if (v === "" || v === "NA") return sum;
    //     return sum + Number(v);
    //   }, 0);
    // }, [scores]);
    // const FORM_COUNT = 14;
    const percentFilled = useMemo(() => (scores > 0 ? (100 / FORM_COUNT) : 0),
    [scores, FORM_COUNT]
    )

    useEffect(() => {
        dispatch(setVisitPercent(key, visit, percentFilled));
    }, [percentFilled, dispatch, visit]);

    useEffect(() => {
        // dispatch(pushSectionTotal(key, total));
        dispatch(pushSectionData(key, { Physicianglobal: scores }));
    }, [visit, scores, dispatch]);

    return (
    <div className="form-section-wrap table-container text-center mt-4">
                            <section>
                            {isInitial ? (
                                <h5>Case Presentation: Initial </h5>
                            ) : (
                                <h5>Case Presentation: Follow up</h5>
                            )}
                            <h5>Physician Global Disease Activity</h5>
                            <strong className="text-dark">Please rate patient's global (overall) disease activity</strong>
                            <div className="slider-section text-center mt-3 px-3">
                                <div>Selected Value: <strong>{scores?? 0}</strong></div>
                                <div style={{ position: "relative", margin: "20px 0" }}>
                                <div style={{
                                    height: 6,
                                    background: "rgb(187 187 187)",
                                    borderRadius: 3,
                                    position: "relative"
                                }}>
                                    <div style={{
                                    width: `${scores* 10}%`,
                                    height: "100%",
                                    background: "var(--button-1)",
                                    borderRadius: 3
                                    }} />
                                    <div style={{
                                    position: "absolute",
                                    left: `${scores * 10}%`,
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
                                    value={scores}
                                    disabled={readOnly}
                                    onChange={(e) =>
                                    setScores(Number(e.target.value))
                                    }
                                    style={{
                                        maxWidth: "100%",
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
        </div>
    )}