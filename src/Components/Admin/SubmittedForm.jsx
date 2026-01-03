import { useState, useEffect } from "react";
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
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { getSubmittedCases } from '../../Redux/Actions/CaseAction';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export const SubmittedForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [expandedSection, setExpandedSection] = useState(null);
    const token = useSelector((state) => state.auth.token);

    const { caseid: caseIdParam, formid: formIdParam, id: userCaseIdParam } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const isReadOnly = queryParams.get("view") !== null;
    const caseId = Number(caseIdParam) || null;
    const formId = Number(formIdParam) || null;
    const userId = Number(userCaseIdParam) || null;
    const userCaseId = Number(userCaseIdParam) || null;
    const initialPercent = useSelector((state) => state.forms.initialPercent);
    const followUpPercent = useSelector((state) => state.forms.followUpPercent);


    const [docUrl, setDocUrl] = useState(null);
    const [docType, setDocType] = useState('');
    const [numPages, setNumPages] = useState(null);
    const [docError, setDocError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedForms, setSelectedForms] = useState([]);
    let FORM_COUNT;

    //const { assignedCases } = useSelector((state) => state.users);
    const { submittedCases } = useSelector(state => state.case);

    useEffect(() => {
        dispatch(getSubmittedCases());
    }, []);
    const submittedCase = submittedCases.find(item => item.id === userCaseId && item.formId === formId) || {};
    // console.log(submittedCase, "submitcse")
    const { formType, Case, title } = submittedCase
    const fileUrl = submittedCase.fileUrl || Case?.fileUrl;
    const pdfUrl = submittedCase.pdfUrl || Case?.pdfUrl;
    useEffect(() => {
        if (formType) {
            let formsArray = [];

            if (Array.isArray(formType)) {
                formsArray = formType;
            } else if (typeof formType === 'object') {
                formsArray = Object.values(formType);
            } else if (formType === "AllForms" || formType === "all") {
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
        MMT8: 2,         // Form1: MMT8
        CDASI: 10,
        MDAAT: 2,        // Form7
        Physician: 2,
        AllForms: 16 // Form9
    };

    const totalFormCount = selectedForms.reduce(
        (sum, form) => sum + (FORM_COMPONENT_COUNTS[form] || 0),
        0
    );

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
        dispatch(resetSectionTotals());
        dispatch(loadForm({ caseId, formId, userCaseId }, token, { mirrorToLocalStorage: false }))
    }, [caseId, formId, dispatch]);

    // const combinedPercent = Math.min(100, Math.floor(initialPercent + followUpPercent + 1e-9));

    const toggleExpand = (sectionName) => {
        setExpandedSection((prev) => (prev === sectionName ? null : sectionName));
    };

    const [saving, setSaving] = useState(false);
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
                const urlParts = updatedUrl.split('/');
                // let filename = urlParts[urlParts.length - 1].split('?')[0];
                // filename = decodeURIComponent(filename);
                const urlFilename = urlParts[urlParts.length - 1].split("?")[0];
                const extension = urlFilename.substring(urlFilename.lastIndexOf('.')) || '';
                
                // Use title from caseItem, fallback to URL filename if title not available
                let filename = `${title}${extension}`
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
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
            if (docUrl && docType === 'pdf') {
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
            4: "Physician"
        };

        const formIdentifier = formMapping[formNumber];
        return selectedForms.includes(formIdentifier);
    };
    const shouldShowForm8 = selectedForms.includes("CDASI") || selectedForms.includes("AllForms");
    return (
        <>
            <MainWrapper>
                <div className={`row g-3 mt-3 ${isReadOnly ? "user-submit-form" : ""}`}>
                    {(expandedSection === null || expandedSection === "caseInfo") && (
                        <div className={`col-12 ${expandedSection === "caseInfo" ? "" : "col-xl-6"}`}>
                            <div className="outer-wrap">
                                <div className="theme-card block-height" style={{overflow:"hidden"}}>
                                    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between card-title">
                                        <h5>{Case?.title}</h5>
                                        <div className="d-flex align-items-center gap-2">
                                            {(fileUrl || pdfUrl) && (
                                                <>
                                                    <button className="site-link" onClick={handleDownload}>
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
                                                            {expandedSection === "caseInfo" ? <HiOutlineArrowsPointingIn /> : <HiOutlineArrowsExpand />}
                                                            {expandedSection === "caseInfo" ? "Collapse" : "Expand"}
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
                                                    overflow: "hidden",
                                                    position: "relative",
                                                }}
                                            >
                                                {isLoading && (
                                                    <div className="d-flex justify-content-center align-items-center h-100 bg-white">
                                                        <div className="spinner-border text-primary"></div>
                                                    </div>
                                                )}

                                                {docUrl && (
                                                    // <iframe
                                                    // src={docUrl ?  `${docUrl}#toolbar=0&navpanes=0&scrollbar=0` : ''}
                                                    // className="viewer-iframe"
                                                    // style={{
                                                    //     // width: "100%",
                                                    //     height: "100%",
                                                    //     // border: "none",
                                                    //     display: isLoading ? "none" : "block",
                                                    // }}
                                                    // title="Case Document"
                                                    // onLoad={() => setIsLoading(false)}
                                                    // onError={() => setIsLoading(false)}
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
                        <div className={`col-12 ${expandedSection === "scoringSheet" ? "" : "col-xl-6"}`}>
                            <div className="outer-wrap pe-1">
                                <div className="theme-card block-height pe-2">
                                    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between card-title">
                                        <div className="d-flex flex-wrap gap-2 align-items-center">
                                            <span><MdFormatAlignRight fontSize={18} /></span>
                                            <h5>Myositis Case Scoring Sheet</h5>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <button
                                                className="site-link dark"
                                                onClick={() => toggleExpand("scoringSheet")}
                                            >
                                                <span>
                                                    {expandedSection === "scoringSheet" ? <HiOutlineArrowsPointingIn /> : <HiOutlineArrowsExpand />}
                                                    {expandedSection === "scoringSheet" ? "Collapse" : "Expand"}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <hr className="horizontal-rule" />

                                    <div className="col-sm-12 col-lg-12">


                                        {shouldShowForm(1) && (

                                            <Form1 visit="initial" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                        )}
                                        {shouldShowForm(2) && (
                                            <>
                                                <Form2 visit="initial" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                                <Form3 visit="initial" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                                <Form4 visit="initial" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                                <Form5 visit="initial" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                                <Form6 visit="initial" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                            </>
                                        )}

                                        {shouldShowForm8 && (
                                            <Form8
                                                visit="initial"
                                                readOnly={isReadOnly}
                                            />
                                        )}
                                        {shouldShowForm(3) && (
                                            <Form7 visit="initial" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                        )}
                                        {shouldShowForm(4) && (
                                            <Form9 visit="initial" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                        )}

                                        {shouldShowForm(1) && (
                                            <Form1 visit="followUp" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                        )}
                                        {shouldShowForm(2) && (
                                            <>
                                                <Form2 visit="followUp" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                                <Form3 visit="followUp" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                                <Form4 visit="followUp" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                                <Form5 visit="followUp" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                                <Form6 visit="followUp" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                            </>
                                        )}
                                        {shouldShowForm8 && (
                                            <Form8
                                                visit="followUp"
                                                readOnly={isReadOnly}
                                            />
                                        )}
                                        {shouldShowForm(3) && (
                                            <Form7 visit="followUp" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                        )}
                                        {shouldShowForm(4) && (
                                            <Form9 visit="followUp" readOnly={isReadOnly} FORM_COUNT={totalFormCount} />
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </MainWrapper>
        </>
    );
};