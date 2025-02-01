import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useNavigation } from 'expo-router';
import { auth, db } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import OtpVerification from './otpVerification';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("")
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("")

  const navigation = useNavigation()
  const handleSignup = async () => {
    // try {
    //   const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    //     'size': 'normal',
    //     'callback': (response) => {
    //       console.log('Recaptcha verified:', response);
    //     },
    //   });

    //   const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    //   setConfirmation(confirmationResult);
    //   console.log(confirmationResult);

    //   Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
    // } catch (error) {
    //   Alert.alert('Error', error.message);
    //   console.log(error);
    // }

    try {
      // Step 1: Check if phone number already exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Phone number already in use.")
        return;
      }

      // Step 2: If phone number is not found, proceed with OTP verification
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
          console.log('Recaptcha verified:', response);
        },
      });

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmation(confirmationResult);
      console.log(confirmationResult);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      {!confirmation ? (
        <>
          <Text style={styles.heading}>Create Account</Text>
          <Text style={styles.subheading}>Create an account so you can explore all the existing jobs</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholderTextColor="#B0B0B0"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            placeholderTextColor="#B0B0B0"
          />

          {error && <Text style={{color : "red", textAlign : "left", padding: 1}}>{error}</Text>}
          <View id="recaptcha-container" />
          <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Link href='/login' style={styles.alreadyAccount}>Already have an account</Link>
          </TouchableOpacity>

          <Text style={styles.orContinueWith}>Or continue with</Text>

          <View style={styles.socialIconsContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="google" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="facebook" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="apple" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </>) :
        <OtpVerification confirmation={confirmation} username={username} phoneNumber={phoneNumber} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alreadyAccount: {
    fontSize: 14,
    color: '#1D4ED8',
    marginBottom: 20,
    textDecorationLine: "underline"
  },
  orContinueWith: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Signup;
