// import React from "react";
// import { View, Text, StyleSheet } from "@react-pdf/renderer";

// // Updated BAR_WIDTH to fill page width
// const BAR_WIDTH = 520; // Adjust according to your page width
// const BAR_HEIGHT = 8;
// const HANDLE_SIZE = 26;

// const styles = StyleSheet.create({
//   section: { marginBottom: 18 },
//   headerBox: {
//     backgroundColor: "rgb(11, 87, 208)",
//     padding: 8,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: "#1f22e7",
//     marginBottom: 12,
//   },
//   headerLine: { fontSize: 12, fontWeight: "bold", color: "#ffffff" },

//   prompt: {
//     fontSize: 12,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: 12,
//     marginBottom: 8,
//   },

//   row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   labelLeft: { fontSize: 11, fontWeight: "bold" },
//   valueRight: { fontSize: 11 },

//   padX: { marginTop: 12 },

//   // Remove the ticksRow section, it's no longer necessary for label numbers
//   track: {
//     width: BAR_WIDTH,
//     height: BAR_HEIGHT,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 4,
//     position: "relative",
//   },
//   fill: {
//     height: BAR_HEIGHT,
//     backgroundColor: "#3498db",
//     borderRadius: 4,
//   },
//   handleWrap: {
//     position: "absolute",
//     top: -(HANDLE_SIZE / 2 - BAR_HEIGHT / 2),
//   },
//   handle: {
//     width: HANDLE_SIZE,
//     height: HANDLE_SIZE,
//     backgroundColor: "#3498db",
//     borderRadius: HANDLE_SIZE / 2,
//     borderWidth: 2,
//     borderColor: "#ffffff",
//   },

//   labelsRow: {
//     width: BAR_WIDTH,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 6,
//   },
//   labelText: { fontSize: 10 },

//   selectedWrap: { marginTop: 14, marginBottom: 6 },
//   selectedText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
// });

// export default function Form9Pdf({
//   data,
//   visit = "initial",
//   sectionName = "Physician Global",
//   breakAfter = true,
// }) {
//   // API gives: { Physician_initial: { Physicianglobal: number } }
//   const raw = Number(data?.Physicianglobal ?? 0);
//   const clamped = Math.max(0, Math.min(10, raw));

//   // Convert the 0–10 value to absolute units (no %)
//   const fillWidth = (BAR_WIDTH * clamped) / 10;
//   const handleLeft = Math.min(BAR_WIDTH, Math.max(0, fillWidth));

//   return (
//     <View style={styles.section} break={breakAfter}>
//       {/* Blue header block */}
//       <View style={styles.headerBox}>
//         <Text style={styles.headerLine}>
//           Case Presentation: {visit === "initial" ? "Initial" : "Follow up"}
//         </Text>
//         <Text style={styles.headerLine}>Physician Global</Text>
//       </View>

//       {/* Prompt */}
//       <Text style={styles.prompt}>
//         Please rate patient's global (overall) disease activity
//       </Text>

//       <View style={styles.padX}>
//         {/* Track + fill + handle */}
//         <View style={styles.track}>
//           <View style={[styles.fill, { width: fillWidth }]} />
//           <View style={[styles.handleWrap, { left: handleLeft - HANDLE_SIZE / 2 }]}>
//             <View style={styles.handle} />
//           </View>
//         </View>

//         {/* End labels */}
//         <View style={styles.labelsRow}>
//           <Text style={styles.labelText}>No Disease Activity</Text>
//           <Text style={styles.labelText}>Maximum Disease Activity</Text>
//         </View>

//         {/* Selected value */}
//         <View style={styles.selectedWrap}>
//           <Text style={styles.selectedText}>Selected Value: {clamped}</Text>
//         </View>
//       </View>
//     </View>
//   );
// }


import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../PdfStyles';

const Form7 = ({ data, visit }) => {
  if (!data) return null;

  const value = Number(data["Physicianglobal"] ?? 0);

  return (
    <View style={[styles.section, { pageBreakBefore: 'always' }]} wrap={false}>

      {/* <Text style={[styles.sectionTitle, { fontSize: 10, marginBottom: 5 }]}>
        Case Presentation: {visit === 'initial' ? 'Initial' : 'Follow up'}
      </Text>


      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
        Physician Global Disease Activity
      </Text> */}




      <View
        style={{
          // backgroundColor: '#1f22e7ff',
          backgroundColor: "rgb(11, 87,208)",
          color: 'white',
          padding: 4,
          borderRadius: 4,
          border: '2px solid #1f22e7ff',
          //textAlign: 'center',
          marginBottom: 7,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
          Case Presentation: {visit === 'initial' ? 'Initial' : 'Follow up'}
        </Text>
        <Text style={{ fontSize: 11, fontWeight: 'bold' }}>
          Physician Global Disease Activity
        </Text>
        {/* <Text style={{ fontSize: 12 }}>CDASI Damage</Text> */}
      </View>


      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
        Please rate patient's global (overall) disease activity
      </Text>

      {/* Selected Value */}
      {/* <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
        Selected Value: {value}
      </Text> */}

      {/* Visual Slider Representation */}
      <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
        {/* Numbers */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}
        >
          {[...Array(11).keys()].map((num) => (
            <Text key={num} style={{ fontSize: 8 }}>
              {num}
            </Text>
          ))}
        </View>

        {/* Slider Track */}
        <View
          style={{
            height: 6,
            backgroundColor: 'rgb(187 187 187)',
            borderRadius: 3,
            position: 'relative',
          }}
        >
          {/* Filled Portion */}
          <View
            style={{
              width: `${value * 10}%`,
              height: '100%',
              backgroundColor: '#3498db',
              borderRadius: 3,
            }}
          />

          {/* Slider Handle */}
          <View
            style={{
              position: 'absolute',
              left: `${value * 10}%`,
              top: -5,
              marginLeft: -8,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                backgroundColor: '#3498db',
                borderRadius: 8,
                borderWidth: 2,
                borderColor: '#fff',
              }}
            />
          </View>
        </View>

        {/* Labels */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
          }}
        >
          <Text style={{ fontSize: 9 }}>No Disease Activity</Text>
          <Text style={{ fontSize: 9 }}>Maximum Disease Activity</Text>
        </View>


        <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, marginTop: 10 }}>
          Selected Value: {value}
        </Text>

      </View>
    </View>
  );
};

export default Form7;
