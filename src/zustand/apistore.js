import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from '../zustand/auth';

const useInitStore = create((set) => ({
  initData: null,
  RPMDetailsInit: [],
  setInitData: (data) =>
    set({
      initData: data,
      RPMDetailsInit: data?.RPMDetailsInit?.list_RPM_devices || [],
    }),
  clearInitData: () =>
    set({
      initData: null,
      RPMDetailsInit: [],
    }),
  fetchInitData: async (username, password, practiceTitle) => {
    try {
      const token = useAuthStore.getState().authToken;
      const rawMrn = useAuthStore.getState().mrn;
      const mrn = rawMrn?.replace(/^MRN:/, '');

      console.log('Token:', token);
      console.log('MRN:', mrn);

      const response = await axios.post(
        'https://portal.medicscloud.com/DG0/api/PatientGateway',
        {
          document: {
            data: {
              MRN: mrn,
              auth_first_name: username,
              password: password,
              auth_last_name: "",
              user_id: "",
              user_type: "0",
            },
            headers: {
              action: "retrieve",
              api_uri: "/api/PortalGateway/",
              api_url: "https://portal.medicscloud.com/DG0/api/PatientGateway",
              area: "init",
              "non-user": "true",
              practice_code: practiceTitle,
              sending_app_name: "MedicsMe",
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            mc_token: token,
          },
        }
      );

      console.log('Init Data:', response.data);


      set({
        initData: response.data,
        RPMDetailsInit: response.data?.RPMDetailsInit?.list_RPM_devices || [],
      });


      // set({
      //   initData: response.data,
      //   RPMDetailsInit: response.data?.RPMDetailsInit?.list_RPM_devices?.map(device =>
      //     device.device_code.trim().toUpperCase()
      //   ) || [],
      // });

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error:', error.response.status, error.response.data);
      } else {
        console.error('Unexpected Error:', error);
      }
    }
  },
}));

export default useInitStore;
