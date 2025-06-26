// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useRoute } from '@react-navigation/native';

// const getTagValue = (xml, tag) => {
//   const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
//   return match ? match[1].trim() : '';
// };

// const getAttr = (xml, tag, attr) => {
//   const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"[^>]*>`, 'i'));
//   return match ? match[1] : '';
// };

// const getSections = (xml) => {
//   const regex = /<section[^>]*>([\s\S]*?)<\/section>/gi;
//   let match, sections = [];
//   while ((match = regex.exec(xml)) !== null) {
//     sections.push(match[1]);
//   }
//   return sections;
// };

// const CcdaHtmlViewerScreen = () => {
//   const route = useRoute();
//   const { xml } = route.params;

//   const title = getTagValue(xml, 'title');
//   const patientGiven = getTagValue(xml, 'given');
//   const patientFamily = getTagValue(xml, 'family');
//   const gender = getAttr(xml, 'administrativeGenderCode', 'displayName');
//   const dob = getAttr(xml, 'birthTime', 'value');

//   const sections = getSections(xml).map((sectionXml) => {
//     const secTitle = getTagValue(sectionXml, 'title');
//     let secText = getTagValue(sectionXml, 'text');
//     const tableMatch = sectionXml.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
//     if (tableMatch) {
//       secText += `<br/><table>${tableMatch[1]}</table>`;
//     }
//     return `
//       <div style="
//         background: #fff;
//         border-radius: 14px;
//         box-shadow: 0 2px 8px rgba(42,92,141,0.06);
//         margin: 8px;
//         padding: 18px 14px;
//         min-width: 250px;
//         flex: 1 1 320px;
//         display: flex;
//         flex-direction: column;
//       ">
//         <div style="
//           font-weight: bold;
//           font-size: 17px;
//           color: #2A5C8D;
//           margin-bottom: 8px;
//           letter-spacing: 0.5px;
//         ">
//           ${secTitle}
//         </div>
//         <div style="color: #334; font-size: 15px;">
//           ${secText || 'No info'}
//         </div>
//       </div>
//     `;
//   });

//   const wrappedHtml = `
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <style>
//           body {
//             font-family: 'Segoe UI', Arial, sans-serif;
//             padding: 16px;
//             background: #f7fafd;
//             color: #203040;
//           }
//           .section-grid {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 12px;
//             margin-top: 8px;
//             justify-content: flex-start;
//           }
//           table {
//             border-collapse: collapse;
//             width: 100%;
//             margin-top: 8px;
//             background: #fff;
//             border-radius: 8px;
//             overflow: hidden;
//             box-shadow: 0 1px 4px rgba(42,92,141,0.07);
//           }
//           th, td {
//             border: 1px solid #e0e7ff;
//             padding: 8px;
//           }
//           th {
//             background: #f0f6fa;
//             color: #2A5C8D;
//           }
//           .gradient-header {
//             width: 100%;
//             padding: 22px 0 18px 0;
//             margin-bottom: 28px;
//             border-radius: 18px;
//             text-align: center;
//             font-size: 26px;
//             font-weight: bold;
//             color: #fff;
//             background: linear-gradient(90deg, #2A5C8D 0%, rgb(151, 179, 208) 100%);
//             box-shadow: 0 4px 20px rgba(42,92,141,0.10);
//             letter-spacing: 1px;
//           }
//           .patient-info {
//             background: #fff;
//             color: #203040;
//             border-radius: 14px;
//             padding: 16px 14px;
//             margin-bottom: 18px;
//             box-shadow: 0 2px 12px rgba(42,92,141,0.06);
//             font-size: 16px;
//             display: flex;
//             flex-direction: column;
//             gap: 6px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="gradient-header">${title || 'CCDA Document'}</div>
//         <div class="patient-info">
//           <span><b>Patient:</b> ${patientGiven} ${patientFamily}</span>
//           <span><b>Gender:</b> ${gender || ''}</span>
//           <span><b>DOB:</b> ${dob || ''}</span>
//         </div>
//         <div class="section-grid">
//           ${sections.join('')}
//         </div>
//       </body>
//     </html>
//   `;

//   return (
//     <View style={styles.container}>
//       <WebView originWhitelist={['*']} source={{ html: wrappedHtml }} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });

// export default CcdaHtmlViewerScreen;


import React ,{useEffect}from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Utility functions to extract data from XML
const getTagValue = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? match[1].trim() : '';
};

const getAttr = (xml, tag, attr) => {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"[^>]*>`, 'i'));
  return match ? match[1] : '';
};

const getSections = (xml) => {
  const regex = /<section[^>]*>([\s\S]*?)<\/section>/gi;
  let match, sections = [];
  while ((match = regex.exec(xml)) !== null) {
    sections.push(match[1]);
  }
  return sections;
};

const CcdaHtmlViewerScreen = () => {
   const navigation = useNavigation();
  const route = useRoute();
  const { xml } = route.params;
  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }

      Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;  // prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();  // Clean up on unmount
  }, [navigation]);

  // Extract data from XML
  const title = getTagValue(xml, 'title');
  const patientGiven = getTagValue(xml, 'given');
  const patientFamily = getTagValue(xml, 'family');
  const gender = getAttr(xml, 'administrativeGenderCode', 'displayName');
  const dob = getAttr(xml, 'birthTime', 'value');

  // Build section HTML
  const sections = getSections(xml).map((sectionXml) => {
    const secTitle = getTagValue(sectionXml, 'title');
    let secText = getTagValue(sectionXml, 'text');
    const tableMatch = sectionXml.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
    if (tableMatch) {
      secText += `<br/><table>${tableMatch[1]}</table>`;
    }
    return `
      <div class="section-box">
        <div class="section-title">${secTitle}</div>
        <div class="section-content">${secText || 'No info'}</div>
      </div>
    `;
  });

  // Full HTML with improved CSS
  const wrappedHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          html, body {
            padding: 0;
            margin: 0;
            overflow-x: hidden;
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f7fafd;
            color: #203040;
          }
          .gradient-header {
            width: 100%;
            padding: 18px 0 12px 0;
            margin-bottom: 18px;
            text-align: center;
            font-size: 22px;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(90deg, #2A5C8D 0%, rgb(151, 179, 208) 100%);
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(42,92,141,0.09);
            letter-spacing: 0.5px;
          }
          .patient-info {
            background: #fff;
            padding: 12px 14px;
            border-radius: 9px;
            box-shadow: 0 1px 6px rgba(42,92,141,0.04);
            margin: 0 10px 16px 10px;
            font-size: 15px;
          }
          .section-box {
            background: #fff;
            border-radius: 9px;
            padding: 14px;
            margin: 0 10px 14px 10px;
            box-shadow: 0 1px 5px rgba(42,92,141,0.03);
            overflow-x: auto;
          }
          .section-title {
            font-weight: 600;
            font-size: 16px;
            color: #2A5C8D;
            margin-bottom: 7px;
          }
          .section-content {
            font-size: 14px;
            color: #334;
          }
          .section-content table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            background: #f8fafc;
            border-radius: 6px;
            overflow-x: auto;
            box-shadow: 0 1px 2px rgba(42,92,141,0.03);
          }
          .section-content th,
          .section-content td {
            border: 1px solid #e6eaf0;
            padding: 7px;
            font-size: 13px;
            white-space: nowrap;
          }
          .section-content th {
            background-color: #e8f0fa;
            color: #2A5C8D;
            font-weight: 500;
          }
          .section-content tr {
            transition: background 0.2s;
          }
          .section-content tr:hover {
            background: #f2f6fc;
          }
        </style>
      </head>
      <body>
        <div class="gradient-header">${title || 'CCDA Document'}</div>
        <div class="patient-info">
          <div><strong>Patient:</strong> ${patientGiven} ${patientFamily}</div>
          <div><strong>Gender:</strong> ${gender || ''}</div>
          <div><strong>DOB:</strong> ${dob || ''}</div>
        </div>
        ${sections.join('')}
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={['*']} source={{ html: wrappedHtml }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default CcdaHtmlViewerScreen;



// import React, { useState, useEffect } from 'react';
// import { View, ActivityIndicator, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import axios from 'axios';

// // Utility: Extract value between tags
// const getTagValue = (xml, tag) => {
//   const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
//   return match ? match[1].trim() : '';
// };

// // Utility: Extract attribute from tag
// const getAttr = (xml, tag, attr) => {
//   const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]+)"[^>]*>`, 'i'));
//   return match ? match[1] : '';
// };

// // Utility: Extract all sections
// const getSections = (xml) => {
//   const regex = /<section[^>]*>([\s\S]*?)<\/section>/gi;
//   let match, sections = [];
//   while ((match = regex.exec(xml)) !== null) {
//     sections.push(match[1]);
//   }
//   return sections;
// };

// // Main heading with linear gradient background
// const GradientHeader = (text) => `
//   <div style="
//     width: 100%;
//     padding: 22px 0 18px 0;
//     margin-bottom: 28px;
//     border-radius: 18px;
//     text-align: center;
//     font-size: 26px;
//     font-weight: bold;
//     color: #fff;
//     background: linear-gradient(90deg, #2A5C8D 0%,rgb(151, 179, 208) 100%);
//     box-shadow: 0 4px 20px rgba(42,92,141,0.10);
//     letter-spacing: 1px;
//     ">
//     ${text}
//   </div>
// `;

// // Patient info widget (white card)
// const PatientWidget = (given, family, gender, dob) => `
//   <div style="
//     background: #fff;
//     color: #203040;
//     border-radius: 14px;
//     padding: 16px 14px;
//     margin-bottom: 18px;
//     box-shadow: 0 2px 12px rgba(42,92,141,0.06);
//     font-size: 16px;
//     display: flex;
//     flex-direction: column;
//     gap: 6px;
//     ">
//     <span><b>Patient:</b> ${given} ${family}</span>
//     <span><b>Gender:</b> ${gender || ''}</span>
//     <span><b>DOB:</b> ${dob || ''}</span>
//   </div>
// `;

// // Section widget (white card)
// const SectionWidget = (title, content) => `
//   <div style="
//     background: #fff;
//     border-radius: 14px;
//     box-shadow: 0 2px 8px rgba(42,92,141,0.06);
//     margin: 8px;
//     padding: 18px 14px 14px 14px;
//     min-width: 250px;
//     flex: 1 1 320px;
//     display: flex;
//     flex-direction: column;
//     ">
//     <div style="
//       font-weight: bold;
//       font-size: 17px;
//       color: #2A5C8D;
//       margin-bottom: 8px;
//       letter-spacing: 0.5px;
//       ">
//       ${title}
//     </div>
//     <div style="color: #334; font-size: 15px;">
//       ${content || 'No info'}
//     </div>
//   </div>
// `;

// export default function CcdaHtmlViewerScreen() {
//   const [html, setHtml] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchAndShowXml();
//     // eslint-disable-next-line
//   }, []);

//   const fetchAndShowXml = async () => {
//     setLoading(true);
//     try {
//       // --- Authenticate ---
//       const loginBody = {
//         document: {
//           headers: {
//             action: "retrieve",
//             area: "authentication",
//             api_url: "https://portal.medicscloud.com/DG0/api/PatientGateway/",
//             api_uri: "/api/PatientGateway/",
//             sending_app_name: "MedicsMe",
//             "non-user": "true",
//             practice_code: null,
//           },
//           data: {
//             username: "zunaid",
//             password: "12345678",
//             practice_title: "J63ISUMA9N2",
//           },
//         },
//       };
//       const loginRes = await axios.post(
//         "https://portal.medicscloud.com/DG0/api/PatientGateway/",
//         loginBody,
//         {
//           headers: {
//             "mc_token": "4Ytl0EM7mwi28rG4HqlsP1t2a5VHT2wR",
//             "Content-Type": "application/json",
//           },
//           timeout: 20000,
//         }
//       );
//       const authToken = loginRes.headers["auth_tocken"] || loginRes.headers["Auth_Tocken"] || loginRes.headers["AUTH_TOCKEN"];
//       if (!authToken) throw new Error("No auth_tocken in response headers");

//       // --- Fetch XML ---
//       const body = {
//         document: {
//           data: {
//             MRN: "J63ISUMA9N2^9134/1",
//             ID: "408",
//           },
//           headers: {
//             action: "retrieve",
//             api_url: "https://portal.medicscloud.com/DG0/api/PatientGateway",
//             area: "CCDA",
//             "non-user": "true",
//             sending_app_name: "MedicsMe",
//           },
//         },
//       };
//       const res = await axios.post(
//         "https://portal.medicscloud.com/DG0/api/PatientGateway/",
//         body,
//         {
//           headers: {
//             "mc_token": authToken,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const xml = typeof res.data === "string" ? res.data : res.data?.document;
//       if (!xml) throw new Error("No XML found in response");

//       // --- Parse XML manually (extract main fields) ---
//       const title = getTagValue(xml, "title");
//       const patientGiven = getTagValue(xml, "given");
//       const patientFamily = getTagValue(xml, "family");
//       const gender = getAttr(xml, "administrativeGenderCode", "displayName");
//       const dob = getAttr(xml, "birthTime", "value");

//       // Extract all sections
//       const sections = getSections(xml).map((sectionXml, i) => {
//         const secTitle = getTagValue(sectionXml, "title");
//         let secText = getTagValue(sectionXml, "text");
//         // Try to extract table if present
//         const tableMatch = sectionXml.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
//         if (tableMatch) {
//           secText += `<br/><table border="1" style="margin-top:8px;width:100%;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(42,92,141,0.07);">${tableMatch[1]}</table>`;
//         }
//         return SectionWidget(secTitle, secText);
//       });

//       // --- Build HTML ---
//       const htmlContent = `
//         <html>
//           <head>
//             <meta name="viewport" content="width=device-width, initial-scale=1" />
//             <style>
//               body { font-family: 'Segoe UI', Arial, sans-serif; padding: 16px; background: #f7fafd; color: #203040; }
//               .section-grid {
//                 display: flex;
//                 flex-wrap: wrap;
//                 gap: 12px;
//                 margin-top: 8px;
//                 justify-content: flex-start;
//               }
//               table {
//                 border-collapse: collapse;
//                 width: 100%;
//                 margin-bottom: 12px;
//                 background: #fff;
//               }
//               th, td {
//                 border: 1px solid #e0e7ff;
//                 padding: 8px;
//               }
//               th {
//                 background: #f0f6fa;
//                 color: #2A5C8D;
//               }
//             </style>
//           </head>
//           <body>
//             ${GradientHeader(title || 'CCDA Document')}
//             ${PatientWidget(patientGiven, patientFamily, gender, dob)}
//             <div class="section-grid">
//               ${sections.join('')}
//             </div>
//           </body>
//         </html>
//       `;

//       setHtml(htmlContent);
//     } catch (err) {
//       Alert.alert("Error", err.message || "Failed to fetch or decode XML.");
//     }
//     setLoading(false);
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {loading && <ActivityIndicator size="large" style={{ margin: 20 }} />}
//       {html ? (
//         <WebView
//           originWhitelist={['*']}
//           source={{ html }}
//           style={{ flex: 1, marginTop: 10 }}
//         />
//       ) : null}
//     </View>
//   );
// }