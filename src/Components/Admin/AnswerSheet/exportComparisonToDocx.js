import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";

const prettyField = (fieldName = "") =>
  fieldName
    .split(".")
    .slice(1)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" · ");

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

export const exportComparisonToDocx = async (result, caseLabel) => {
  const stats = result?.stats || {};
  const discrepancies = result?.discrepancies || [];

  const accuracyPercent = Math.round(stats.accuracyPercentage ?? 0);
  
  // Headers for the table
  const tableHeader = new TableRow({
    children: ["Section", "Field", "Your Answer", "Expected", "Deviation", "Status"].map(
      (text) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
          shading: { fill: "f8fafc" },
          margins: { top: 100, bottom: 100, left: 100, right: 100 },
        })
    ),
  });

  const discrepancyRows = discrepancies.map((d) => {
    // Determine friendly label
    const friendlyLabel =
      d.status === "OUT_OF_RANGE" ? "Out of Range"
        : d.status === "RANGED_MISMATCH" ? "Out of Range"
          : d.status === "MISMATCH" ? "Mismatch"
            : "Matched";

    const isMismatch = d.status === "MISMATCH" || d.status === "RANGED_MISMATCH" || d.status === "OUT_OF_RANGE";
    const statusColor = isMismatch ? "991b1b" : "065f46";

    // Format expected value: show range if available
    // const expectedText = d.expectedValue
    //   ? `${d.expectedValue.min} – ${d.expectedValue.max}`
    //   : d.expectedValue != null ? String(d.expectedValue) : "—";


    const expectedText = (() => {
      if (d.expectedValue === "NA") return "NA";
      if (d.expectedValue && typeof d.expectedValue === "object") {
        if (d.expectedValue.min === d.expectedValue.max) return String(d.expectedValue.min);
        return `${d.expectedValue.min} – ${d.expectedValue.max}`;
      }
      return d.expectedValue != null ? String(d.expectedValue) : "—";
    })();

    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(prettySection(d.section))], margins: { top: 70, bottom: 70, left: 70, right: 70 } }),
        new TableCell({ children: [new Paragraph(prettyField(d.fieldName))], margins: { top: 70, bottom: 70, left: 70, right: 70 } }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: d.actualValue != null ? String(d.actualValue) : "not submitted", color: statusColor, bold: true })] })],
          margins: { top: 70, bottom: 70, left: 70, right: 70 }
        }),
        new TableCell({ children: [new Paragraph(expectedText)], margins: { top: 70, bottom: 70, left: 70, right: 70 } }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: d.deviation > 0 ? `+${d.deviation}` : d.deviation != null ? String(d.deviation) : "—" })] })],
          margins: { top: 70, bottom: 70, left: 70, right: 70 }
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: friendlyLabel, color: statusColor, bold: true })] })],
          margins: { top: 70, bottom: 70, left: 70, right: 70 }
        }),
      ],
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `Answer Sheet Comparison Report`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: caseLabel ? `Case: ${caseLabel}` : "Myositis Case Scoring Sheet",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "", spacing: { after: 200 } }),
          
          new Paragraph({
            text: "Overall Statistics:",
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Accuracy: `, bold: true }),
              new TextRun(`${accuracyPercent}%`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Total Fields: `, bold: true }),
              new TextRun(`${stats.totalFields ?? 0}`),
            ],
          }),
          // new Paragraph({
          //   children: [
          //     new TextRun({ text: `Exact Matches: `, bold: true }),
          //     new TextRun(`${stats.exactMatches ?? 0}`),
          //   ],
          // }),
          new Paragraph({
            children: [
              new TextRun({ text: `Ranged Match: `, bold: true }),
              new TextRun(`${stats.rangedMatch ?? stats.withinRange ?? 0}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Mismatched: `, bold: true }),
              new TextRun(`${stats.mismatchedFields ?? 0}`),
            ],
          }),
          new Paragraph({ text: "", spacing: { after: 400 } }),

          new Paragraph({
            text: "Comparison Details",
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 200 },
          }),
          
          new Table({
            rows: [tableHeader, ...discrepancyRows],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Comparison_Report_${Date.now()}.docx`);
};
