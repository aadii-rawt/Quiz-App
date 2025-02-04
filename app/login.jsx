import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth, db } from '../firebase';
import OtpVerification from './otpVerification';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {firebaseConfig} from '../firebase';

const Login = () => {

  const [phoneNumber, setPhoneNumber] = useState("")
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("")

  const recaptchaVerifier = useRef(null); // Use `useRef` for the reCAPTCHA modal

  // const handleLogin = async () => {
  //   try {
  //     const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  //       'size': 'normal',
  //       'callback': (response) => {
  //         console.log('Recaptcha verified:', response);
  //       },
  //     });

  //     const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  //     setConfirmation(confirmationResult);
  //     console.log(confirmationResult);
  //   } catch (error) {
  //     alert('Error', error.message);
  //     console.log(error);
  //   }
  // }

  // Login for Mobile App
  // const handleLogin = async () => {
  //   try {
  //     const usersRef = collection(db, "users");
  //     const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
  //     const querySnapshot = await getDocs(q);

  //     if (querySnapshot.empty) {
  //       setError("User not found");
  //       return;
  //     }

  //     if (!recaptchaVerifier.current) {
  //       console.error("Recaptcha verifier is not initialized");
  //       return;
  //     }

  //     const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
  //     setConfirmation(confirmationResult);
  //     console.log(confirmationResult);
  //   } catch (error) {
  //     console.error("Login Error:", error);
  //   }
  // };

  // Login For Web
  const handleLogin = async () => {
    try {
      // Step 1: Check if phone number exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("can't Find user")
        return;
      }

      // Step 2: Proceed with OTP verification
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
  };



  return (
    <View style={styles.container}>
      {!confirmation ?
        <>
          <Text style={styles.heading}>Login here</Text>
          <Text style={styles.subheading}>Welcome back you've been missed!</Text>

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            placeholderTextColor="#B0B0B0"
          />

          {/* <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot your password?</Text>
          </TouchableOpacity> */}
          {error && <Text style={{ color: "red", textAlign: "left", padding: 1 }}>{error}</Text>}
          <View id="recaptcha-container" />
          <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
            <Text style={styles.signInText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Link href='/signup' style={styles.createAccount}>Create new account</Link>
          </TouchableOpacity>

          {/* <Text style={styles.orContinueWith}>Or continue with</Text>

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
          </View> */}
        </> :
        <OtpVerification confirmation={confirmation} phoneNumber={phoneNumber} type='login' />}
        
      {/* <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={{
          apiKey: "AIzaSyCJe_Pli3afXd1ddVctWbn7tu251_FaMNk",
          authDomain: "quizapp-fcfb5.firebaseapp.com",
          projectId: "quizapp-fcfb5",
          storageBucket: "quizapp-fcfb5.firebasestorage.app",
          messagingSenderId: "180141145950",
          appId: "1:180141145950:web:5e6de496aeb0b3a3fad9cf"
        }}
      /> */}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D4ED8',
    margin: 20,
  },
  subheading: {
    fontSize: 17,
    fontWeight: 'semibold',
    color: '#666',
    marginBottom: 30,
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
  forgotPassword: {
    fontSize: 14,
    color: '#007BFF',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccount: {
    fontSize: 14,
    color: '#1D4ED8',
    textDecorationLine: "underline",
    paddingBottom: 20,
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

export default Login;
