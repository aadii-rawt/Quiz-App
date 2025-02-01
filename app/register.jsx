import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { db } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const Register = ({ user }) => {
    const navigation = useNavigation();
    const { competitionId } = useLocalSearchParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async () => {
        if (!name || !email) {
            Alert.alert("Error", "Please enter all details");
            return;
        }

        try {
            const compRef = doc(db, `competitions/${competitionId}`);
            await updateDoc(compRef, {
                registeredUsers: arrayUnion({ uid: user.uid, name, email, hasPaid: true }) // Fake Payment
            });

            Alert.alert("Success", "You are registered!");
            navigation.goBack(); // Navigate back to competition list
        } catch (error) {
            console.error("Error registering: ", error);
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register for Competition</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Enter your name" 
                value={name} 
                onChangeText={setName} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Enter your email" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register & Pay</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f9f9f9' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
    button: { backgroundColor: 'rgb(135, 67, 254)', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
