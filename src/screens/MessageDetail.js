import React from 'react';
import { View, Text,ScrollView } from 'react-native';
import styles from '../styles/messagedetailsstyles';

const MessageDetail = ({ route }) => {
    const { message } = route.params;
    const plainBody = message.body?.replace(/<br\s*\/?>|\r?\n/g, '\n') || '';

    return (
        <View style={styles.container}>
            <Text style={styles.label}>To</Text>
            <Text style={styles.value}>{message.receiver_name || 'N/A'}</Text>

            <Text style={styles.label}>Subject</Text>
            <Text style={styles.value}>{message.subject || 'Medication Refill Request'}</Text>

            <Text style={styles.label}>Message</Text>
            <ScrollView>
                <Text style={styles.body}>{plainBody}</Text>
            </ScrollView>
        </View>
    );
};


export default MessageDetail;
