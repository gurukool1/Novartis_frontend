import { useState, useEffect, useRef } from "react";
import { MdFormatAlignRight } from "react-icons/md";
import MainWrapper from "../../CommonComponents/MainWrapper";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";
import Form1 from "./Caseformparts.jsx/form1";
import Form2 from "./Caseformparts.jsx/form2";
import Form3 from "./Caseformparts.jsx/form3";
import Form4 from "./Caseformparts.jsx/form4";
import Form5 from "./Caseformparts.jsx/form5";
import Form6 from "./Caseformparts.jsx/form6";
import Form7 from "./Caseformparts.jsx/form7";
import Form8 from "./Caseformparts.jsx/form8";
import Form9 from "./Caseformparts.jsx/form9";
import { getAssignedCases } from "../../Redux/Actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import CommonAlert from "../../CommonComponents/CommonAlert";
import { setAlert } from "../../Redux/Actions/AlertActions";
import {
  submitForm,
  loadForm,
  setFormId,
  editForm,
  resetSectionTotals,
} from "../../Redux/Actions/FormActions";
import { useParams, useLocation, useNavigate } from "react-router";
import { LuFileSpreadsheet } from "react-icons/lu";
import { HiOutlineArrowsPointingIn } from "react-icons/hi2";
import mammoth from "mammoth";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const SubmitForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    caseid: caseIdParam,
    formid: formIdParam,
    id: userCaseIdParam,
  } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const isReadOnly = queryParams.get("view") !== null;
  const caseId = Number(caseIdParam) || null;
  const userCaseId = Number(userCaseIdParam) || null;
   const formId = Number(formIdParam) || null;
   console.log("SubmitForm params - caseId:", caseId, "formId:", formId, "userCaseId:", userCaseId, "isReadOnly:", isReadOnly);

  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const initialPercent = useSelector((state) => state.forms.initialPercent);
  const followUpPercent = useSelector((state) => state.forms.followUpPercent);

  const totals = useSelector((state) => state.forms.totals);
  const formData = useSelector((state) => state.forms.data);
  const token = useSelector((state) => state.auth.token);

  const [docUrl, setDocUrl] = useState(null);
  const [docType, setDocType] = useState("");
  const [selectedForms, setSelectedForms] = useState([]);
  const latestPayload = useRef(null);
  const skipAutosaveOnUnmount = useRef(false);

  let FORM_COUNT;

  const { assignedCases } = useSelector((state) => state.users);

  const caseItem = assignedCases.find((item) => item.id === userCaseId) || {};
  const { fileUrl, formType, Case, pdfUrl, title } = caseItem;
  useEffect(() => {
    dispatch(getAssignedCases());
  }, []);


  useEffect(() => {
    setIsLoading(true);
  }, []);


  useEffect(() => {
    if (!pdfUrl && !fileUrl) return;
    if (fileUrl.toLowerCase().endsWith('.pdf')) {
      setDocUrl(fileUrl)
    } else {
      setDocUrl(pdfUrl);
    }
    setIsLoading(true);
  }, [pdfUrl, fileUrl]);




  useEffect(() => {
    if (formType) {
      let formsArray = [];

      if (Array.isArray(formType)) {
        formsArray = formType;
      } else if (typeof formType === "object") {
        formsArray = Object.values(formType);
      } else if (formType === "AllForms" || formType === "All") {
        formsArray = ["AllForms"];
      } else {
        formsArray = [formType];
      }

      setSelectedForms(formsArray);
    } else {
      setSelectedForms([]);
    }
  }, [formType]);

  const FORM_COMPONENT_COUNTS = {
    MMT8: 2, // Form1: MMT8
    CDASI: 10,
    MDAAT: 2, // Form7
    Physician: 2,
    AllForms: 16, // Form9
  };

  const totalFormCount = selectedForms.reduce(
    (sum, form) => sum + (FORM_COMPONENT_COUNTS[form] || 0),
    0
  );

  const computeGrandTotal = (visit) => {
    let activity = 0;
    let damage = 0;

    for (const key in totals) {
      if (!totals[key]) continue;


      if (key.endsWith(`_${visit}`)) {
        if (key.includes("CDASI_Damage")) {
          damage += Number(totals[key]);
        } else {
          activity += Number(totals[key]);
        }
      }
    }

    return { activity, damage };
  };
  const combinedPercent = Math.min(
    100,
    Math.floor(initialPercent + followUpPercent + 1e-9)
  );

  useEffect(() => {
    if (userCaseId !== null) {
      isLoadingFromApi.current = true;

      prevFormDataRef.current = null;
      dispatch(resetSectionTotals());
      dispatch(loadForm({ caseId, formId, userCaseId }, token)).then(() => {
        // small delay lets redux propagate all SET_SECTION_DATA actions before we snapshot
        setTimeout(() => {
          // snapshot current store data (if any) to prevFormDataRef to prevent immediate autosave
          try {
            prevFormDataRef.current = formData && Object.keys(formData).length
              ? JSON.parse(JSON.stringify(formData))
              : prevFormDataRef.current;
          } catch (e) {
            prevFormDataRef.current = formData;
          }
          isLoadingFromApi.current = false;
        }, 50);
      });;
    } else {

      dispatch(resetSectionTotals());
    }
  }, [userCaseId, dispatch]);

  const toggleExpand = (sectionName) => {
    setExpandedSection((prev) => (prev === sectionName ? null : sectionName));
  };

  const [saving, setSaving] = useState(false);

  //

  const handleSubmit = () => {
    if (combinedPercent < 100) {
      // Find first empty field - checks both selects and sliders
      let firstEmptyField = null;

      // Check all select elements
      const allSelects = document.querySelectorAll('select');
      for (let select of allSelects) {
        if (!select.value || select.value === "") {
          firstEmptyField = select;
          break;
        }
      }

      // If no empty select found, check sliders with "-" display
      if (!firstEmptyField) {
        const allReadonlyInputs = document.querySelectorAll('input[readonly]');
        for (let input of allReadonlyInputs) {
          if (input.value === "-") {
            firstEmptyField = input;
            break;
          }
        }
      }

      // If no empty slider found, check text inputs
      if (!firstEmptyField) {
        const allTextInputs = document.querySelectorAll('input[type="text"]:not([readonly])');
        for (let input of allTextInputs) {
          if (!input.value || input.value === "") {
            firstEmptyField = input;
            break;
          }
        }
      }
      if (!firstEmptyField) {
        const allSliders = document.querySelectorAll('input[type="range"]');
        for (let slider of allSliders) {
          // Find the "Selected Value" text for this slider
          const sliderContainer = slider.closest('.slider-section');
          if (sliderContainer) {
            const valueDisplay = sliderContainer.querySelector('strong');
            if (valueDisplay && valueDisplay.textContent === "-") {
              firstEmptyField = slider;
              break;
            }
          }
        }
      }

      if (firstEmptyField) {
        const formContainer = document.querySelector('.outer-wrap .theme-card.block-height');
  
        if (formContainer) {
          // Scroll within the container
          const fieldRect = firstEmptyField.getBoundingClientRect();
          const containerRect = formContainer.getBoundingClientRect();
          const scrollOffset = fieldRect.top - containerRect.top + formContainer.scrollTop - 100;
          
          formContainer.scrollTo({
            top: scrollOffset,
            behavior: 'smooth'
          });
        }
        
        setTimeout(() => firstEmptyField.focus(), 400);
      }

      dispatch(setAlert("Please fill all required fields", "warning"));
      return;
    }
    setShowSubmitAlert(true);
  };

  const handleConfirmSubmit = async () => {
    setSaving(true);
    // window.isSubmitting = true;
    const grandTotal = {
      initial: computeGrandTotal("initial"),
      followUp: computeGrandTotal("followUp"),
    };
    try {
      const payload = {
        caseId,
        formId: formId || null,
        userCaseId,
        grandTotal,
        formdata: formData,
        percentage: combinedPercent,
        isDraft: 1,
      };

      const result = await dispatch(
        payload.formId ? editForm(payload, token) : submitForm(payload, token)
      );

      if (result && result.success) {

        dispatch(
          setAlert(
            payload.formId
              ? "Case updated successfully"
              : "Case submitted successfully",
            "success"
          )
        );
        skipAutosaveOnUnmount.current = true;
        navigate("/user/my-cases");
      } else {
        dispatch(setAlert(result.error, "danger"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      dispatch(setAlert("An error occurred", "danger"));
    } finally {
      // window.isSubmitting = false;
      setSaving(false);
      setShowSubmitAlert(false);
    }
  };
  const handleCancelSubmit = () => {
    setShowSubmitAlert(false);
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    let updatedUrl = fileUrl;
    try {
      const urlObj = new URL(fileUrl);
      const tzOffsetMinutes = new Date().getTimezoneOffset();
      const tzOffsetHours = -(tzOffsetMinutes / 60);

      if (!urlObj.searchParams.has("timezone")) {
        urlObj.searchParams.append("timezone", tzOffsetHours.toString());
      }
      updatedUrl = urlObj.toString();
    } catch (err) {
      console.error("Invalid URL:", err);
      return;
    }

    fetch(updatedUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch file");
        return response.blob();
      })
      .then((blob) => {
        const urlParts = updatedUrl.split("/");
        // let filename = urlParts[urlParts.length - 1].split("?")[0];
        // filename = decodeURIComponent(filename);
        const urlFilename = urlParts[urlParts.length - 1].split("?")[0];
        const extension = urlFilename.substring(urlFilename.lastIndexOf('.')) || '';
        
        // Use title from caseItem, fallback to URL filename if title not available
        let filename = `${title}${extension}`
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => {
        console.error("Download error:", err);
      });
  };



  useEffect(() => {
    return () => {
      if (docUrl && docType === "pdf") {
        URL.revokeObjectURL(docUrl);
      }
    };
  }, [docUrl, docType]);

  const shouldShowForm = (formNumber) => {
    if (selectedForms.includes("AllForms")) return true;

    const formMapping = {
      1: "MMT8",
      2: "CDASI",
      3: "MDAAT",
      4: "Physician",
    };

    const formIdentifier = formMapping[formNumber];
    return selectedForms.includes(formIdentifier);
  };
  const shouldShowForm8 = selectedForms.includes("CDASI") || selectedForms.includes("AllForms");

  const autoSaveForm = async () => {
    const grandTotal = {
      initial: computeGrandTotal("initial"),
      followUp: computeGrandTotal("followUp"),
    };

    const payload = {
      caseId,
      formId: formId || null,
      userCaseId,
      grandTotal,
      formdata: formData,
      percentage: combinedPercent,
      isDraft: 0,
    };

    const result = await dispatch(
      payload.formId ? editForm(payload, token) : submitForm(payload, token)
    );
    if (result && result.success) {

      dispatch(
        setAlert(
          "saved successfully",
          "success"
        )
      );
    }
  };
  const isLoadingFromApi = useRef(false);
  // const isApiDataLoaded = useRef(false);
  // const isUserModified = useRef(false);
  const prevFormDataRef = useRef(null);

  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0 || isReadOnly) {
      return;
    }

    if (isLoadingFromApi.current) {
      try {
        prevFormDataRef.current = JSON.parse(JSON.stringify(formData));
      } catch (e) {
        prevFormDataRef.current = formData;
      }
      return;
    }

    const prevData = prevFormDataRef.current;
    let currentData;
    try {
      currentData = JSON.parse(JSON.stringify(formData));
    } catch (e) {
      currentData = formData;
    }

    if (JSON.stringify(prevData) !== JSON.stringify(currentData)) {
      prevFormDataRef.current = currentData;
      autoSaveForm();
    }
  }, [formData]);

  return (
    <>
      <MainWrapper>
        <div className={`row g-3 mt-3 ${isReadOnly ? "user-submit-form" : ""}`}>
          {(expandedSection === null || expandedSection === "caseInfo") && (
            <div
              className={`col-12 ${expandedSection === "caseInfo" ? "" : "col-xl-6"
                }`}
            >
              <div className="outer-wrap">
                <div className="theme-card block-height" style = {{overflow:"hidden"}}>
                  <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between card-title">
                    <h5>{Case?.title}</h5>
                    <div className="d-flex align-items-center gap-2">
                      {(fileUrl || pdfUrl) && (
                        <>
                          <button
                            className="site-link"
                            onClick={handleDownload}
                          >
                            <span>
                              <FiDownload />
                              Download
                            </span>
                          </button>
                          <button
                            className="site-link dark"
                            onClick={() => toggleExpand("caseInfo")}
                          >
                            <span>
                              {expandedSection === "caseInfo" ? (
                                <HiOutlineArrowsPointingIn />
                              ) : (
                                <HiOutlineArrowsExpand />
                              )}
                              {expandedSection === "caseInfo"
                                ? "Collapse"
                                : "Expand"}
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {(pdfUrl || fileUrl) && (
                    <div className="mt-3">
                      <h5>Case Document:</h5>
                      <div
                        className="file-preview"
                        style={{
                          height:
                            expandedSection === "caseInfo" ? "calc(100vh - 180px)" : "calc(100vh - 180px)",

                          // expandedSection === "caseInfo" ? "500px" : "500px",
                          // border: "1px solid #e9ecef",
                          // borderRadius: "8px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {isLoading && (
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading document...
                              </span>
                            </div>
                          </div>
                        )}

                        {docUrl && (

                          // <iframe
                          //   src={docUrl ? `${docUrl}#toolbar=0&navpanes=0&scrollbar=0` : ''}
                          //   className="viewer-iframe"
                          //   style={{
                          //     // width: "100%",
                          //     height: "100%",
                          //     // border: "none",
                          //     display: isLoading ? "none" : "block",
                          //   }}
                          //   title="Case Document"
                          //   onLoad={() => setIsLoading(false)}
                          //   onError={() => setIsLoading(false)}
                          // />


                          <iframe
                            src={
                              docUrl
                                ? `${docUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
                                : ""
                            }
                            className="viewer-iframe"
                            style={{
                              // width: "100%",
                              height: "100%",
                              border: "none",
                              display: isLoading ? "none" : "block",
                              //background: "#fff",
                            }}
                            title="Case Document"
                            onLoad={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)}
                          />

                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(expandedSection === null || expandedSection === "scoringSheet") && (
            <div
              className={`col-12 ${expandedSection === "scoringSheet" ? "" : "col-xl-6"
                }`}
            >
              <div className="outer-wrap pe-1">
                <div className="theme-card block-height pe-2">
                  <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between card-title">
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <span>
                        <MdFormatAlignRight fontSize={18} />
                      </span>
                      <h5>Myositis Case Scoring Sheet</h5>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className={`site-link ${isReadOnly || saving ? 'disabled' : ''}`}
                        onClick={handleSubmit}
                        // disabled={isReadOnly || saving || combinedPercent < 100}
                        style={{
                          cursor: (isReadOnly || saving)
                            ? 'not-allowed'
                            : 'pointer',
                        }}
                      >
                        <span>
                          <LuFileSpreadsheet />
                          {/* {saving ? "Saving…" : "Save"} */}
                          {saving ? "Saving…" : "Submit"}
                        </span>
                      </button>
                      <button
                        className="site-link dark"
                        onClick={() => toggleExpand("scoringSheet")}
                      >
                        <span>
                          {expandedSection === "scoringSheet" ? (
                            <HiOutlineArrowsPointingIn />
                          ) : (
                            <HiOutlineArrowsExpand />
                          )}
                          {expandedSection === "scoringSheet"
                            ? "Collapse"
                            : "Expand"}
                        </span>
                      </button>
                    </div>
                  </div>
                  <hr className="horizontal-rule" />

                  <div className="col-sm-12 col-lg-12">
                    {shouldShowForm(1) && (
                      <Form1
                        visit="initial"
                        readOnly={isReadOnly}
                        FORM_COUNT={totalFormCount}
                      />
                    )}
                    {shouldShowForm(2) && (
                      <>
                        <Form2
                          visit="initial"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                        <Form3
                          visit="initial"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                        <Form4
                          visit="initial"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                        <Form5
                          visit="initial"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                        <Form6
                          visit="initial"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                      </>
                    )}
                    {shouldShowForm8 && (
                      <Form8
                        visit="initial"
                        readOnly={isReadOnly}
                      />
                    )}
                    {shouldShowForm(3) && (
                      <Form7
                        visit="initial"
                        readOnly={isReadOnly}
                        FORM_COUNT={totalFormCount}
                      />
                    )}
                    {shouldShowForm(4) && (
                      <Form9
                        visit="initial"
                        readOnly={isReadOnly}
                        FORM_COUNT={totalFormCount}
                      />
                    )}

                    {shouldShowForm(1) && (
                      <Form1
                        visit="followUp"
                        readOnly={isReadOnly}
                        FORM_COUNT={totalFormCount}
                      />
                    )}
                    {shouldShowForm(2) && (
                      <>
                        <Form2
                          visit="followUp"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                        <Form3
                          visit="followUp"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                        <Form4
                          visit="followUp"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                        <Form5
                          visit="followUp"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                        <Form6
                          visit="followUp"
                          readOnly={isReadOnly}
                          FORM_COUNT={totalFormCount}
                        />
                      </>
                    )}
                    {shouldShowForm8 && (
                      <Form8
                        visit="followUp"
                        readOnly={isReadOnly}
                      />
                    )}
                    {shouldShowForm(3) && (
                      <Form7
                        visit="followUp"
                        readOnly={isReadOnly}
                        FORM_COUNT={totalFormCount}
                      />
                    )}
                    {shouldShowForm(4) && (
                      <Form9
                        visit="followUp"
                        readOnly={isReadOnly}
                        FORM_COUNT={totalFormCount}
                      />
                    )}

                  </div>
                  <div className="d-flex flex-wrap gap-2 align-items-center justify-content-end mt-3 mb-3">
                    <button
                      className={`site-link ${isReadOnly || saving ? 'disabled' : ''}`}
                      onClick={handleSubmit}
                      // disabled={isReadOnly || saving || combinedPercent < 100}
                      style={{
                        cursor: (isReadOnly || saving)
                          ? 'not-allowed'
                          : 'pointer',
                      }}
                    >
                      <span>
                        <LuFileSpreadsheet />
                        Submit
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <CommonAlert
            show={showSubmitAlert}
            handleClose={handleCancelSubmit}
            handleConfirm={handleConfirmSubmit}
            message={"Are you sure you want to submit this form?"}
            confirmButton={
              <span>
                {saving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </span>
            }
            cancelButton={"Cancel"}
          />
        </div>
      </MainWrapper>
    </>
  );
};
