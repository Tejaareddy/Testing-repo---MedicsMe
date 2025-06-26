import axios from 'axios';

const BASE_URL = "https://portal.medicscloud.com/DG0/api/PatientGateway";

export const loginToMedicsApi = async (payload) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      mc_token: '4Ytl0EM7mwi28rG4HqlsP1t2a5VHT2wR',
    },
    transformResponse: [data => {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }],
    validateStatus: () => true,
  });
};

export const initMedicsApi = async (payload, token) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      mc_token: token,
    },
  });
};

export const fetchQuestionnaireApi = async (payload, token) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      mc_token: token,
    },
  });
};

export const fetchDocumentApi = (payload, token) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      mc_token: token,
    },
  });
};

export const sendRefillRequest = (payload, token) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      mc_token: token,
    },
  });
};

export const fetchHandoutApi = (payload, token) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      mc_token: token,
    },
  });
}

export const fetchCcdaApi = async (payload, token) => {
  const response = await axios.post(BASE_URL, payload, {
    headers: {
      "Content-Type": "application/json",
      "mc_token": token,
    },
  });
  return response.data;
};


export const messageApi = (payload, token) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: 'application/json',
      mc_token: token,
    },
  });

};
export const authenticateUserApi = (payload, token) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      mc_token: token,
    },
  });
};

export const deviceRegistrationApi = (payload, token) => {
  return axios.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      mc_token: token,
    },
  });
};