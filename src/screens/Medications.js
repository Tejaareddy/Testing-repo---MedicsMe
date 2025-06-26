import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Modal,
    TouchableWithoutFeedback,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    BackHandler,
} from 'react-native';
import useInitStore from '../zustand/apistore';
import useAuthStore from '../zustand/auth';
import { sendRefillRequest } from '../API/medicsapi';
import { buildRefillPayload } from '../API/payload';
import Icon from 'react-native-vector-icons/FontAwesome';
import { handleError } from '../utility/errorhandler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { useAlertStore } from '../zustand/alertstore';
import styles from '../styles/medicationsstyles';

const MedicationsScreen = () => {
    useEffect(() => {
        changeNavigationBarColor('#ffffff', true, false);
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true
        );

        return () => backHandler.remove();
    }, []);
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const showAlert = useAlertStore((state) => state.showAlert);
    const [selectedItem, setSelectedItem] = useState(null);
    const medications = useInitStore((state) => state.initData?.list_medications || []);
    const Token = useAuthStore((state) => state.authToken);

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const refill = async (item) => {
        const token = useAuthStore.getState().authToken;
        const rawMrn = useAuthStore.getState().mrn;
        const mrn = rawMrn?.replace(/^MRN:/, '');

        const payload = buildRefillPayload(
            `This is an online refill request for ${item?.objMedFormulations?.IngredientName}`,
            mrn,
            item?.objMedFormulations?.IngredientName,
            item?.NDC_Code || '00000000000',
            mrn,
            [String(item?.ProviderId)],
            'Medication Refill Request'
        );

        try {
            const response = await sendRefillRequest(payload, token);
            showAlert('Refill request sent successfully!');
        } catch (error) {
            handleError('refill', error);
            // console.error('Refill failed:', error.response?.data || error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2A5C8D" />
            <View style={styles.headerWrapper}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.header}>Medications</Text>
                <View style={styles.notificationWrapper}>
                    <Icon name="bell-o" size={24} color="black" />
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <FlatList
                    data={medications}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const ingredientName = item?.objMedFormulations?.IngredientName || 'N/A';
                        const prescribedDate = item?.PrescribedDate;
                        const sigText = item?.SIG || 'No SIG Info';
                        const formattedDate =
                            prescribedDate && prescribedDate !== '0001-01-01T00:00:00'
                                ? new Date(prescribedDate).toLocaleDateString(undefined, {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                }) + ', 06:00PM'
                                : 'Not Prescribed';

                        const displayedSIG = index === 0 ? sigText : `${sigText.slice(0, 70)}...`;

                        return (
                            <TouchableOpacity onPress={() => handleItemPress(item)} activeOpacity={0.7}>
                                <View style={styles.card}>
                                    <Text style={styles.titleText}>{ingredientName}</Text>
                                    <Text style={styles.sigText}>{displayedSIG}</Text>
                                    <Text style={styles.dateText}>{formattedDate}</Text>

                                    <TouchableOpacity style={styles.refillButton} onPress={() => refill(item)}>
                                        <Text style={styles.refillButtonText}>Refill</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    }}

                    ListEmptyComponent={<Text style={styles.emptyText}>No medication data found.</Text>}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />

                <Modal
                    transparent={true}
                    visible={showModal}
                    animationType="slide"
                    onRequestClose={() => setShowModal(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                        <View style={styles.modalBackdrop}>
                            <View style={styles.modalContent}>
                                <Text style={styles.label}>Ingredient Name:</Text>
                                <Text style={styles.value}>
                                    {selectedItem?.objMedFormulations?.IngredientName || 'N/A'}
                                </Text>
                                <Text style={styles.label}>SIG:</Text>
                                <Text style={styles.value}>{selectedItem?.SIG}</Text>
                                <Text style={styles.label}>Number:</Text>
                                <Text style={styles.value}>{selectedItem?.Number}</Text>
                                <Text style={styles.label}>Refill:</Text>
                                <Text style={styles.value}>{selectedItem?.Refill}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </SafeAreaView>
    );
};


export default MedicationsScreen;
