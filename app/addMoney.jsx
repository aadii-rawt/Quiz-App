import { View, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'react-native';
import WebView from 'react-native-webview';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from './context/useAuthContext';

const AddMoney = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUserAuth();

    // Function to save transaction to database
    const saveTransaction = async (paymentData, amount) => {
        try {
            const response = await axios.post('YOUR_API_ENDPOINT/transactions', {
                paymentId: paymentData.razorpay_payment_id,
                amount: amount,
                status: 'success',
                timestamp: new Date(),
                userId: 'USER_ID', // Replace with actual user ID from your auth system
                paymentDetails: paymentData
            });
            return response.data;
        } catch (error) {
            console.error('Error saving transaction:', error);
            throw error;
        }
    };

    // Function to update user's wallet balance
    const updateWalletBalance = async (amount) => {
        console.log("update");
        
        try {
            // Get user document reference
            const userRef = doc(db, 'users', user?.uid);

            // Get current user data
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                // Get current wallet balance
                const currentBalance = userSnap.data().wallet || 0;

                // Calculate new balance
                const newBalance = currentBalance + amount;

                // Update wallet balance
                await updateDoc(userRef, {
                    wallet: newBalance,
                    lastUpdated: new Date()
                });

                return newBalance;
            } else {
                throw new Error('User document not found');
            }
        } catch (error) {
            console.error('Error updating wallet:', error);
            throw error;
        }
    };


    // Handle successful payment
    const handlePaymentSuccess = async (paymentResponse, amount) => {
        setIsLoading(true);
        try {
            // await saveTransaction(paymentResponse, amount);

            // Update user's wallet balance
            await updateWalletBalance(amount);

            console.log("payment successfull");

        } catch (error) {
            console.log(
                "Error",
                "Payment was successful but there was an error updating your wallet. Please contact support.",
                [{ text: "OK" }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = (amount) => {
        if (Platform.OS === 'web') {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: "rzp_test_0DA57OEHdt9n1D",
                    amount: amount * 100,
                    currency: "INR",
                    name: "Test Order",
                    description: "Buy BMW CAR",
                    handler: function (response) {
                        handlePaymentSuccess(response, amount);
                    },
                    prefill: {
                        email: 'xyz@gmail.com',
                        contact: '9999999999',
                        name: 'User 1'
                    },
                    theme: {
                        color: "#F37254"
                    },
                    // Simplified UPI configuration
                    config: {
                        display: {
                            preferences: {
                                show_default_blocks: true
                            }
                        }
                    },
                    // Enable UPI directly
                    upi: true
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            };
        } else {
            const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          </head>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            <script>
              const options = {
                key: 'rzp_test_0DA57OEHdt9n1D',
                amount: ${amount * 100},
                currency: 'INR',
                name: 'Test Order',
                description: 'Buy BMW CAR',
                handler: function(response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(response));
                },
                prefill: {
                  email: 'xyz@gmail.com',
                  contact: '9999999999',
                  name: 'User 1'
                },
                theme: {
                  color: '#F37254'
                }
              };
              const paymentObject = new Razorpay(options);
              paymentObject.open();
            </script>
          </body>
        </html>
      `;

            return (
                <WebView
                    source={{ html: htmlContent }}
                    onMessage={(event) => {
                        const response = JSON.parse(event.nativeEvent.data);
                        handlePaymentSuccess(response, amount);
                        
                    }}
                    style={{ flex: 1 }}
                />
            );
        }
    };

    return (
        <View style={{ padding: 20, gap: 10 }}>
            <Button
                title="Add ₹100"
                onPress={() => handlePayment(100)}
                disabled={isLoading}
            />
            <Button
                title="Add ₹500"
                onPress={() => handlePayment(500)}
                disabled={isLoading}
            />
            <Button
                title="Add ₹1000"
                onPress={() => handlePayment(1000)}
                disabled={isLoading}
            />
        </View>
    );
};

export default AddMoney;