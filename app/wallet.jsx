import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// import { View, Text,Button } from 'react-native';
// import RazorpayCheckout from 'react-native-razorpay';
import { auth, db } from '../firebase';
import { useNavigation } from 'expo-router';
import {useUserAuth} from "./context/useAuthContext";


const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const {userData} = useUserAuth()
  const navigation = useNavigation()
  console.log(userData);
  
  //   useEffect(() => {
  //     const fetchBalance = async () => {
  //       if (auth.currentUser) {
  //         const userRef = doc(db, 'wallets', auth.currentUser.uid);
  //         const userSnap = await getDoc(userRef);
  //         if (userSnap.exists()) {
  //           setBalance(userSnap.data().balance);
  //         } else {
  //           await setDoc(userRef, { balance: 0 });
  //         }
  //       }
  //     };
  //     fetchBalance();
  //   }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Wallet Balance: ₹{userData?.wallet}</Text>
      <Button title="Add Money" onPress={() => navigation.navigate('addMoney')} />
    </View>
  );
};

const AddMoneyScreen = ({ navigation }) => {
  const auth = getAuth(FIREBASE_APP);
  const db = getFirestore(FIREBASE_APP);

  const addMoney = async (amount) => {
    const options = {
      description: 'Add Money to Wallet',
      currency: 'INR',
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: amount * 100,
      name: 'Your App',
      prefill: {
        email: auth.currentUser?.email,
        contact: '9999999999',
        name: auth.currentUser?.displayName,
      },
      theme: { color: '#F37254' },
    };

    RazorpayCheckout.open(options)
      .then(async (data) => {
        const userRef = doc(db, 'wallets', auth.currentUser.uid);
        await updateDoc(userRef, {
          balance: balance + amount,
        });
        Alert.alert('Success', 'Money added to wallet');
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Payment Failed', error.description);
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Add ₹100" onPress={() => addMoney(100)} />
      <Button title="Add ₹500" onPress={() => addMoney(500)} />
      <Button title="Add ₹1000" onPress={() => addMoney(1000)} />
    </View>
  );
};

export default Wallet
