
const BASE_URL = "https://portal.medicscloud.com/DG0/api/PatientGateway";

export const getLoginPayload = (username, password, practiceTitle) => ({
  document: {
    headers: {
      action: 'retrieve',
      area: 'authentication',
      api_url: BASE_URL,
      api_uri: '/api/PatientGateway/',
      sending_app_name: 'MedicsMe',
      'non-user': 'true',
      practice_code: null,
    },
    data: {
      username: username.trim(),
      password: password.trim(),
      practice_title: practiceTitle.trim(),
    },
  },
});

export const getInitPayload = (mrn, username, password, practiceTitle) => ({
  document: {
    data: {
      MRN: mrn,
      auth_first_name: username,
      password: password,
      auth_last_name: "",
      user_id: "",
      user_type: "0"
    },
    headers: {
      action: "retrieve",
      api_uri: "/api/PortalGateway/",
      api_url: BASE_URL,
      area: "init",
      "non-user": "true",
      practice_code: practiceTitle.trim(),
      sending_app_name: "MedicsMe"
    }
  }
});

export const fetchQuestionnaireData = async (MRN) => ({
  document: {
    headers: {
      api_url: BASE_URL,
      sending_app_name: 'MedicsMe',
      action: 'retrieve',
      area: 'questionnaire',
    },
    data: {
      MRN: MRN,
    },

  },
});


export const documentPayload = (mrn, id) => ({
  document: {
    data: {
      MRN: mrn,
      ID: id,
    },
    headers: {
      action: "retrieve",
      api_url: BASE_URL,
      area: "document",
      "non-user": "true",
      sending_app_name: "MedicsMe",
    },
  },
});

export const buildRefillPayload = (
  bodyMessage,
  mrn,
  Name,
  NDC_Code,
  messageFrom,
  messageTo,
  subject,
) => ({
  document: {
    data: {
      body: bodyMessage,
      MRN: mrn,
      medications: [
        {
          medication_name: Name,
          NDC_Code: NDC_Code,
        },
      ],
      message_from: messageFrom,
      message_to: messageTo,
      subject: subject,
    },
    headers: {
      action: "submit",
      api_url: BASE_URL,
      area: "refills",
      sending_app_name: "MedicsMe",
    },
  },
});

export const uploadMessagePayload = ({
  base64,
  fileType,
  mrn,
  subject,
  body,
  message_to,
}) => ({
  document: {
    data: {
      content: base64,
      body,
      message_attachment_file_type: fileType,
      MRN: mrn,
      message_from: '',
      message_to: [[message_to]],
      subject,
    },
    headers: {
      action: 'submit',
      api_url: BASE_URL,
      area: 'sendmessage',
      sending_app_name: 'MedicsMe',
    },
  },
});
export const handoutPayload = (mrn, id) => ({
  document: {
    data: {
      MRN: mrn,
      ID: id,
    },
    headers: {
      action: 'retrieve',
      api_url: BASE_URL,
      area: 'Handout',
      'non-user': 'true',
      sending_app_name: 'MedicsMe',
    },
  },
});

export const ccdaPayload = (mrn, historyId) => ({
  document: {
    data: {
      MRN: mrn,
      ID: historyId.toString(),
    },
    headers: {
      action: "retrieve",
      api_url: BASE_URL,
      area: "CCDA",
      "non-user": "true",
      sending_app_name: "MedicsMe",
    },
  },
});

export const deviceRegistrationPayload = ({
  device_id,
  device_token,
  device_type,
  MRN,
  ref_no = '',
}) => ({
  document: {
    data: {
      device_id,
      device_token,
      device_type,
      MRN,
      ref_no,
    },
    headers: {
      action: 'submit',
      api_url: '',
      area: 'deviceregistration',
      sending_app_name: 'MedicsMe',
    },
  },
});
export const authenticationPayload = (username, password, practiceTitle) => ({
  document: {
    data: {
      username: username.trim(),
      password: password.trim(),
      practice_title: practiceTitle.trim(),
    },
    headers: {
      action: 'retrieve',
      api_url: '',
      area: 'authentication',
      sending_app_name: 'MedicsMe',
    },
  },
});