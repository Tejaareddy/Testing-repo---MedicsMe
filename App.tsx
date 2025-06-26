import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MedicsMe from './src/Authentication/Login';
import Rpm from './src/screens/RPM';
import Medics from './src/dashboard/medics';
import QuestionnaireForm from './src/screens/webview';
import AllergiesScreen from './src/screens/allergies';
import ProblemListScreen from './src/screens/problemlist';
import MedicationList from './src/screens/Medications';
import DocScreen from './src/screens/doc';
import LabResultScreen from './src/screens/Labresult';
import ComposeMessageScreen from './src/screens/messages';
import InboxScreen from './src/screens/inbox';
import MessagesScreen from './src/screens/Sent';
import MessageDetail from './src/screens/MessageDetail';
import MessageReplyScreen from './src/screens/MessageReplyScreen';
import SignatureScreen from './src/screens/Signaturescreen';
import ContinuingCareScreen from './src/screens/continuingcare';
import HandoutScreen from './src/screens/handout';
import CcdaHtmlViewerScreen from './src/screens/CcdaHtmlViewerScreen';
import MicrotalkScreen from './src/screens/video';
import { useAlertStore } from './src/zustand/alertstore';
import CustomAlertModal from './src/utility/alertmodal';

const Stack = createStackNavigator();

const App = () => {
  const { isVisible, message, hideAlert } = useAlertStore();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MedicsMe" component={MedicsMe} />
          <Stack.Screen name="Rpm" component={Rpm} />
          <Stack.Screen name="Medics" component={Medics} />
          <Stack.Screen name="QuestionnaireForm" component={QuestionnaireForm} />
          <Stack.Screen name="HandoutScreen" component={HandoutScreen} />
          <Stack.Screen name="AllergiesScreen" component={AllergiesScreen} />
          <Stack.Screen name="ProblemListScreen" component={ProblemListScreen} />
          <Stack.Screen name="ComposeMessageScreen" component={ComposeMessageScreen} />
          <Stack.Screen name="MicrotalkScreen" component={MicrotalkScreen} />
          <Stack.Screen name="MessageDetail" component={MessageDetail} />
          <Stack.Screen name="MedicationList" component={MedicationList} />
          <Stack.Screen name="DocScreen" component={DocScreen} />
          <Stack.Screen name="LabResultScreen" component={LabResultScreen} />
          <Stack.Screen name="ContinuingCareScreen" component={ContinuingCareScreen} />
          <Stack.Screen name="InboxScreen" component={InboxScreen} />
          <Stack.Screen name="MessageReplyScreen" component={MessageReplyScreen} />
          <Stack.Screen name="SignatureScreen" component={SignatureScreen} />
          <Stack.Screen name="MessagesScreen" component={MessagesScreen} />
          <Stack.Screen name="CcdaHtmlViewerScreen" component={CcdaHtmlViewerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <CustomAlertModal
        visible={isVisible}
        message={message}
        onClose={hideAlert}
      />
    </>
  );
};

export default App;

