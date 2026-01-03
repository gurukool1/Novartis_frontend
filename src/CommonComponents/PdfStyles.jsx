
// pdfStyles.js
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd', // Light border color
    padding: 8,
    // pageBreakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 12,
    // fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    //textDecoration: 'underline',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd', // Light border
    // borderCollapse: 'collapse',
    // pageBreakInside: 'avoid',
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: "auto",
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    // pageBreakInside: 'avoid',
  },
  tableCell: {
    padding: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd', // Lighter border
    flex: 1,
    fontSize: 10,
    display: 'flex',
    alignItems: 'center',
  },

  tableHeader: {
    // backgroundColor: '#f7f7f7', // Light gray header background
    fontWeight: 'bold',
    minHeight: 30,
  },
  subHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f1f1f1', // Lighter subheader
    padding: 3,
    fontSize: 10,
  },
  summaryCell: {
    backgroundColor: '#e3f2fd', // Very light blue
    fontWeight: 'bold',
    fontSize: 11,
  },
  damageCell: {
    backgroundColor: '#ffebee', // Light red for damage cells
    fontWeight: 'bold',
    fontSize: 11,
  },
});
