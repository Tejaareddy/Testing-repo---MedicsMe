import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, } from 'react-native';
import { WebView } from 'react-native-webview';
import useAuthStore from '../zustand/auth';
import { fetchDocumentApi } from '../API/medicsapi';
import { fetchQuestionnaireData } from '../API/payload';
import { BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function QuestionnaireScreen() {
  const navigation = useNavigation();
  const [html, setHtml] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore.getState().authToken;
  console.log("Token: ", token);
  const mrn = useAuthStore.getState().mrn?.replace(/^MRN:/, '');



  console.log("MRN: ", mrn);
  
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
      return true;  
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();  
  }, [navigation]);


  function normalizeElement(element) {
    return {
      ...element,
      label: element.label || "",
      required: element.required || "false",
      choices: element.choices || "",
      type: element.type || "unsupported",
      tag: element.tag || "",
    };
  }

  function renderFormElement(element) {
    if (!element) return '';

    element = normalizeElement(element);
    const required = element.required === "true";
    const label = `
      <label style="font-weight:600;">
        ${element.label}${required ? '<span style="color:red;">*</span>' : ''}
      </label>
    `;

    switch (element.type) {
      case "text_field":
        return `${label}<input type="text" style="width:100%;padding:8px;margin-bottom:8px;" ${required ? 'required' : ''}/>`;
      case "date_picker":
        return `${label}<input type="date" style="width:100%;padding:8px;margin-bottom:8px;" ${required ? 'required' : ''}/>`;
      case "single_choice":
        const options = Array.isArray(element.choices)
          ? element.choices
          : (element.choices || "").split('^');
        let select = `<select style="width:100%;padding:8px;margin-bottom:8px;" ${required ? 'required' : ''}>`;
        options.forEach(opt => {
          select += `<option value="${opt}">${opt}</option>`;
        });
        select += '</select>';
        return label + select;
      case "multiple_choice_long":
        const mOptions = Array.isArray(element.choices)
          ? element.choices
          : (element.choices || "").split('^');
        let checkboxes = `<div>${label}`;
        mOptions.forEach(opt => {
          checkboxes += `<div><input type="checkbox" name="${element.tag}" value="${opt}"/> ${opt}</div>`;
        });
        checkboxes += `</div>`;
        return checkboxes;
      case "text_area":
        return `${label}<textarea rows="3" style="width:100%;padding:8px;margin-bottom:8px;" ${required ? 'required' : ''}></textarea>`;
      case "yn_switch":
        return `${label}
          <div style="margin: 4px 0 8px;">
            <label><input type="radio" name="${element.tag}" value="Yes" ${required ? 'required' : ''}/> Yes</label>
            <label style="margin-left:16px;"><input type="radio" name="${element.tag}" value="No" ${required ? 'required' : ''}/> No</label>
          </div>`;
      case "new_section":
        return element.section_info
          ? `<div style="font-weight:bold;color:#2c3e50;margin-top:18px;margin-bottom:6px;">${element.section_info.replace(/\^/g, '<br/>')}</div>`
          : '';
      default:
        return `<div style="color:red;">Unsupported element type: ${element.type}</div>`;
    }
  }

  function renderTable(element) {
    if (!element.columns) return '';
    let table = `<table border="1" style="width:100%;margin-bottom:16px;border-collapse:collapse;">
      <tr>`;
    Object.values(element.columns).forEach(col => {
      col = normalizeElement(col);
      table += `<th style="padding:8px;background:#f2f2f2;">${col.label}${col.required === "true" ? '<span style="color:red;">*</span>' : ''}</th>`;
    });
    table += `</tr><tr>`;
    Object.values(element.columns).forEach(col => {
      col = normalizeElement(col);
      table += `<td style="padding:8px;">${renderFormElement(col)}</td>`;
    });
    table += `</tr></table>`;
    return table;
  }

  // Render emr_forms
  function renderEmrForms(data) {
    if (!data?.emr_forms) return '';
    let html = '';
    Object.values(data.emr_forms).forEach(form => {
      if (form.instructions) {
        html += `<div class="instructions">${form.instructions}</div>`;
      }
      Object.values(form.sections).forEach(section => {
        html += `<div class="section">
          <div class="section-title">${section.title || ""}</div>
          <div class="instructions">${section.instructions || ""}</div>
        `;
        Object.values(section.section_elements).forEach(e => {
          const element = normalizeElement(e);
          if (element.type === "table_add") {
            html += renderTable(element);
          } else {
            html += `<div style="margin-bottom: 18px;">${renderFormElement(element)}</div>`;
          }
        });
        html += `</div>`;
      });
    });
    return html;
  }

  function renderPremierForms(data) {
    if (!data?.medicspremier_forms) return '';
    let html = '';
    Object.values(data.medicspremier_forms).forEach(form => {
      if (form.info) {
        html += `<div class="section">
          <div class="section-title">${form.info.title || ""}</div>
          <div class="instructions">${form.info.instructions || ""}</div>
        `;
      }
      if (form.questions) {
        Object.values(form.questions).forEach(e => {
          const element = normalizeElement(e);
          html += `<div style="margin-bottom: 18px;">${renderFormElement(element)}</div>`;
        });
      }
      html += `</div>`;
    });
    return html;
  }
  //   function wrapTables(content) {
  //   return content.replace(/<table[^>]*>(.*?)<\/table>/gs, match => {
  //     return `<div class="table-wrapper">${match}</div>`;
  //   });
  // }

  // function generateFormHTML(data) {
  //   return `
  //     <html>
  //       <head>
  //         <meta name="viewport" content="width=device-width, initial-scale=1" />
  //         <style>
  //           body {
  //             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  //             background-color: #f3f6fa;
  //             padding: 20px;
  //             color: #23395d;
  //             margin: 0;
  //             overflow-x: hidden;
  //           }
  //           .main-gradient-header {
  //             width: 100%;
  //             padding: 24px 0 18px 0;
  //             margin-bottom: 32px;
  //             border-radius: 18px;
  //             text-align: center;
  //             font-size: 28px;
  //             font-weight: bold;
  //             color: #fff;
  //             background: linear-gradient(90deg, #2A5C8D 0%, rgb(151, 179, 208) 100%);
  //             box-shadow: 0 4px 20px rgba(42,92,141,0.12);
  //             letter-spacing: 1px;
  //           }
  //           .section {
  //             background: #fff;
  //             border: none;
  //             border-radius: 14px;
  //             padding: 24px 20px 18px 20px;
  //             margin-bottom: 28px;
  //             box-shadow: 0 2px 12px rgba(42,92,141,0.08);
  //           }
  //           .section-title {
  //             font-size: 20px;
  //             font-weight: 700;
  //             color: #2A5C8D;
  //             margin-bottom: 12px;
  //             letter-spacing: 0.5px;
  //           }
  //           .instructions {
  //             font-size: 15px;
  //             color: #718096;
  //             font-style: italic;
  //             margin-bottom: 18px;
  //           }
  //           label {
  //             display: block;
  //             font-size: 16px;
  //             margin-bottom: 8px;
  //             color: #2A5C8D;
  //             font-weight: 600;
  //           }
  //           input[type="text"], input[type="date"], select, textarea {
  //             width: 100%;
  //             padding: 12px;
  //             font-size: 15px;
  //             border: 1px solid #b6c3d1;
  //             border-radius: 7px;
  //             margin-bottom: 18px;
  //             background-color: #f8fafc;
  //             transition: border-color 0.2s;
  //           }
  //           input[type="text"]:focus, input[type="date"]:focus, select:focus, textarea:focus {
  //             border-color: #2A5C8D;
  //             outline: none;
  //           }
  //           textarea {
  //             resize: vertical;
  //           }
  //           .choices-group {
  //             margin-bottom: 18px;
  //             display: flex;
  //             flex-wrap: wrap;
  //             gap: 16px 24px;
  //           }
  //           .choices-group label {
  //             font-weight: 400;
  //             color: #23395d;
  //             margin-bottom: 0;
  //             font-size: 15px;
  //             display: flex;
  //             align-items: center;
  //             gap: 6px;
  //             background: #f3f6fa;
  //             padding: 6px 12px;
  //             border-radius: 6px;
  //           }
  //           input[type="checkbox"], input[type="radio"] {
  //             accent-color: #2A5C8D;
  //             width: 18px;
  //             height: 18px;
  //           }

  //           .table-wrapper {
  //             width: 100%;
  //             overflow-x: auto;
  //             -webkit-overflow-scrolling: touch;
  //             margin-bottom: 22px;
  //             border-radius: 8px;
  //             background: #f8fafc;
  //             box-shadow: 0 1px 3px rgba(42,92,141,0.05);
  //           }

  //           table {
  //             width: 100%;
  //             min-width: 100%;
  //             border-collapse: collapse;
  //             table-layout: auto;
  //           }

  //           th, td {
  //             padding: 12px;
  //             border: 1px solid #e2e8f0;
  //             text-align: left;
  //             font-size: 15px;
  //             word-break: break-word;
  //             overflow-wrap: anywhere;
  //             max-width: 250px;
  //           }

  //           th {
  //             background-color: #e8f0fa;
  //             color: #2A5C8D;
  //             font-weight: 600;
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="main-gradient-header">Patient Questionnaire</div>
  //         ${wrapTables(renderEmrForms(data))}
  //         ${wrapTables(renderPremierForms(data))}
  //       </body>
  //     </html>
  //   `;
  // }
  function wrapTables(content) {
    return content.replace(/<table[^>]*>(.*?)<\/table>/gs, match => {
      return `<div class="table-wrapper">${match}</div>`;
    });
  }

  function generateFormHTML(data) {
    return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f3f6fa;
            padding: 20px;
            color: #23395d;
            margin: 0;
            overflow-x: hidden;
          }
          .main-gradient-header {
            width: 100%;
            padding: 24px 0 18px 0;
            margin-bottom: 32px;
            border-radius: 18px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #fff;
            background: linear-gradient(90deg, #2A5C8D 0%, rgb(151, 179, 208) 100%);
            box-shadow: 0 4px 20px rgba(42,92,141,0.12);
            letter-spacing: 1px;
          }
          .section {
            background: #fff;
            border-radius: 14px;
            padding: 24px 20px 18px 20px;
            margin-bottom: 28px;
            box-shadow: 0 2px 12px rgba(42,92,141,0.08);
          }
          .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #2A5C8D;
            margin-bottom: 12px;
          }
          label {
            display: block;
            font-size: 16px;
            margin-bottom: 8px;
            color: #2A5C8D;
            font-weight: 600;
          }
          input[type="text"], input[type="date"], select, textarea {
            width: 100%;
            padding: 12px;
            font-size: 15px;
            border: 1px solid #b6c3d1;
            border-radius: 7px;
            margin-bottom: 18px;
            background-color: #f8fafc;
          }
          textarea {
            resize: vertical;
          }
          .choices-group {
            margin-bottom: 18px;
            display: flex;
            flex-wrap: wrap;
            gap: 16px 24px;
          }
          .choices-group label {
            font-weight: 400;
            color: #23395d;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 6px;
            background: #f3f6fa;
            padding: 6px 12px;
            border-radius: 6px;
          }
          input[type="checkbox"], input[type="radio"] {
            accent-color: #2A5C8D;
            width: 18px;
            height: 18px;
          }
          .table-wrapper {
            overflow-x: auto;
            margin-bottom: 24px;
            border-radius: 8px;
            background: #f8fafc;
            box-shadow: 0 1px 3px rgba(42,92,141,0.05);
          }
          table {
            width: 100%;
            min-width: 600px;
            border-collapse: collapse;
          }
          th, td {
            padding: 12px;
            border: 1px solid #e2e8f0;
            text-align: left;
            font-size: 15px;
            word-break: break-word;
          }
          th {
            background-color: #e8f0fa;
            color: #2A5C8D;
            font-weight: 600;
          }
            
        </style>
      </head>
      <body>
        <div class="main-gradient-header">Patient Questionnaire</div>
        ${wrapTables(renderEmrForms(data))}
        ${wrapTables(renderPremierForms(data))}
      </body>
    </html>
    <script>
  function collectFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        if (!formData[input.name]) formData[input.name] = [];
        if (input.checked) formData[input.name].push(input.value);
      } else if (input.type === 'radio') {
        if (input.checked) formData[input.name] = input.value;
      } else {
        formData[input.name] = input.value;
      }
    });
    window.ReactNativeWebView.postMessage(JSON.stringify(formData));
  }
</script>
          <button onclick="collectFormData()" style="
              background: #2A5C8D;
               color: white;
             padding: 12px 20px;
         border: none;
         border-radius: 8px;
        font-size: 16px;
          font-weight: bold;
          cursor: pointer;
            margin-top: 20px;
     ">Submit</button>


  `;
  }


  useEffect(() => {
    const fetchQuestionnaire = async () => {
      if (!token || !mrn) {
        Alert.alert('Error', 'Missing authentication token or MRN');
        return;
      }

      try {
        setLoading(true);
        const payload = await fetchQuestionnaireData(mrn);
        console.log("Payload: ", payload);
        const response = await fetchDocumentApi(payload, token);
        console.log("Response: ", response);
        const htmlTemplate = generateFormHTML(response.data);
        setHtml(htmlTemplate);
      } catch (err) {
        console.error("Error loading questionnaire:", err);
        Alert.alert("Error", "Failed to load form: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, [token, mrn]);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!html) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No data available.</Text>
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          console.log("Form Data Received:", data);

          // Show success alert
          Alert.alert("Success", "Data submitted successfully!");

          // Optional: Save or send `data` to backend here

        } catch (error) {
          console.error("Error parsing form data", error);
          Alert.alert("Error", "Something went wrong while submitting.");
        }
      }}
      style={{ flex: 1 }}
    />


  );
}
