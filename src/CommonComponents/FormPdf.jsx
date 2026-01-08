import React from 'react';
import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';
import { useSelector } from 'react-redux';
import Form1 from './Caseformparts/form1';
import Form2 from './Caseformparts/form2';
import Form3 from './Caseformparts/form3';
import Form4 from './Caseformparts/form4';
import Form5 from './Caseformparts/form5';
import Form6 from './Caseformparts/form6';
import Form7 from './Caseformparts/form7';
import Form9 from './Caseformparts/form9';
import Form8 from './Caseformparts/form8';
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  headerCell: {
    flex: 1,
  },
  headerLabel: {
    fontWeight: 'bold',
  },
  visitHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#2c5282',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  formContainer: {
    marginBottom: 15,
  },
  pageBreak: {
    break: 'page',
  },
});

const FormPdfRenderer = ({ formData,selectedForm }) => {
   const { submittedCases } = useSelector(state => state.case);
 
  const caseItem = submittedCases.find(c => c.id == formData.userCaseId);
 
  if (!formData) return null;

  const renderFormSection = (Component, data, sectionName, visit, forcePageBreak = true) => {
    const shouldAddPageBreak = !isFirstForm && forcePageBreak;
    if (forcePageBreak) {
      isFirstForm = false;
    }
    return (
      <View style={styles.formContainer} break={shouldAddPageBreak}>
        <Component
          data={data}
          visit={visit}
          sectionName={sectionName}
        />
      </View>
    );
  };
  const shouldShowForm = (formNumber) => {
        
        if (selectedForm.includes("AllForms")) return true;

        const formMapping = {
            1: "MMT8",
            2: "CDASI",
            3: "MDAAT",
            4: "Physician"
        };

        const formIdentifier = formMapping[formNumber];
        return selectedForm.includes(formIdentifier);
    };
    const shouldShowForm8 = selectedForm.includes("CDASI") || selectedForm.includes("AllForms");
    const getFirstFormKey = () => {
    if (selectedForm.includes("AllForms")) return "MMT8_initial";
    
    const formOrder = ["MMT8", "CDASI", "MDAAT", "Physician"];
    for (const form of formOrder) {
      if (selectedForm.includes(form)) {
        return `${form}_initial`;
      }
    }
    return null;
  };

  const firstFormKey = getFirstFormKey();
  let isFirstForm = true;
  return (

    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Myositis Case Scoring Sheet</Text>

        <View style={styles.headerInfo}>
          <View style={styles.headerCell}>
            <Text style={styles.headerLabel}>Case Title</Text>
            <Text>{caseItem?.case?.title}</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerLabel}>Investigator Name:</Text>
            <Text>{formData.investigatorName || "N/A"}</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerLabel}>Submitted At:</Text>
            <Text>
              {new Date(formData.updatedAt).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                timeZone: 'America/Los_Angeles',
              })}{' '}
              {new Date(formData.updatedAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Los_Angeles',
              })}
            </Text>
          </View>
        </View>

        {/* Initial Visit */}
        {/* <Text style={styles.visitHeader}>Case Presentation :Initial Visit</Text> */}
        {shouldShowForm(1) && (
          <>
            {renderFormSection(Form1, formData.initial?.MMT_8, "Manual Muscle Testing-8 (MMT-8)", "initial")}
          </>
        )}
        {shouldShowForm(2) && (
          <>
            {renderFormSection(Form2, formData.initial?.CDASI_Activity, "CDASI Activity", "initial")}
            {renderFormSection(Form3, formData.initial?.CDASI_Damage, "CDASI Damage", "initial", false)}
            {renderFormSection(Form4, formData.initial?.Gottron_Hands, "Gottron's Hands", "initial", false)}
            {renderFormSection(Form5, formData.initial?.Periungual, "Periungual Findings", "initial", false)}
            {renderFormSection(Form6, formData.initial?.Alopecia, "Alopecia Assessment", "initial", false)}
          </>
        )}
        {shouldShowForm8 &&
        renderFormSection(Form8, formData.initial?.form_Score, "Form Scores", "initial", false)}
        {shouldShowForm(3) && (
          <>
            {renderFormSection(Form7, formData.initial?.MDAAT, "MDAAT", "initial")}
          </>
        )}
        {shouldShowForm(4) && (
          <>
            {renderFormSection(Form9, formData.initial?.Physician, "Physician Global", "initial")}
          </>
        )}

        
        {shouldShowForm(1) && (
          <>
            {renderFormSection(Form1, formData.followUp?.MMT_8, "Manual Muscle Testing-8 (MMT-8)", "followUp")}
          </>
        )}
        {shouldShowForm(2) && (
          <>
            {renderFormSection(Form2, formData.followUp?.CDASI_Activity, "CDASI Activity", "followUp")}
            {renderFormSection(Form3, formData.followUp?.CDASI_Damage, "CDASI Damage", "followUp", false)}
            {renderFormSection(Form4, formData.followUp?.Gottron_Hands, "Gottron's Hands", "followUp", false)}
            {renderFormSection(Form5, formData.followUp?.Periungual, "Periungual Findings", "followUp", false)}
            {renderFormSection(Form6, formData.followUp?.Alopecia, "Alopecia Assessment", "followUp", false)}
          </>
        )}
        {shouldShowForm8 &&
        renderFormSection(Form8, formData.followUp?.form_Score, "Form Scores", "followUp", false)}
        {shouldShowForm(3) && (
          <>
            {renderFormSection(Form7, formData.followUp?.MDAAT, "MDAAT", "followUp")}
          </>
        )}
        {shouldShowForm(4) && (
          <>
            {renderFormSection(Form9, formData.followUp?.Physician, "Physician Global", "followUp")}
          </>
        )}
        
        
      </Page>
    </Document>
  );
};

export default FormPdfRenderer;
