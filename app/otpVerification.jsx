import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigation } from 'expo-router';
import { useUserAuth } from './context/useAuthContext';

const OtpVerification = ({ confirmation, username, phoneNumber, type = 'signup' }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const navigation = useNavigation()
    const { setUser } = useUserAuth()

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Automatically focus on the next input if a digit is entered
        if (value && index < 5) {
            const nextInput = index + 1;
            otpInputRefs[nextInput].focus();
        }
    };

    const handleVerify = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length === 6) {
            try {
                if (confirmation) {
                    const result = await confirmation.confirm(enteredOtp);
                    const userId = result.user.uid; // Get the user's unique ID

                    // Firestore reference
                    const userDocRef = doc(db, `users/${userId}`);

                    if (type !== 'login') {
                        // If it's signup, create a new user document
                        await setDoc(userDocRef, {
                            username: username,
                            userId: userId,
                            phoneNumber: phoneNumber,
                        });
                    }
                    const userSnapshot = await getDoc(userDocRef);

                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data();
                        setUser(userData);
                        console.log('User data:', userData);
                        navigation.navigate('home');
                    } else {
                        console.log('No user data found');
                    }
                    // navigation.navigate("home")
                }
            } catch (error) {
                console.log('Error', error.message);
            }
        } else {
            console.log('Error', 'Please enter a valid 6-digit OTP.');
        }
    };

    const otpInputRefs = [];

    return (
        <View style={styles.container}>

            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>Enter the OTP sent to {phoneNumber}</Text>

            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        ref={(ref) => (otpInputRefs[index] = ref)}
                    />
                ))}
            </View>

            <Text style={styles.resendText}>
                Didn’t receive the OTP?{' '}
                <Text style={styles.resendLink} onPress={() => Alert.alert('OTP Resent')}>
                    Resend OTP
                </Text>
            </Text>

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
                <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
        marginBottom: 20,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        color: '#333333',
        backgroundColor: '#F9F9F9',
    },
    resendText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 20,
    },
    resendLink: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    verifyButton: {
        width: '80%',
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OtpVerification;
