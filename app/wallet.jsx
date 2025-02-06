import React, { useState, useEffect } from "react";
import { View, Text, Platform, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView } from "react-native";
import WebView from "react-native-webview";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserAuth } from './context/useAuthContext';
import { useNavigation } from 'expo-router';


export default function Wallet() {
  const [selectedAmount, setSelectedAmount] = useState(500);

  const [isLoading, setIsLoading] = useState(false);
  const { user,userData } = useUserAuth();
  const navigation = useNavigation()

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
        const newBalance = currentBalance + +amount;

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
      // navigation.navigate("wallet")
    }
  };

  const handlePayment = () => {
    if (Platform.OS === 'web') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: "rzp_test_0DA57OEHdt9n1D",
          amount: selectedAmount * 100,
          currency: "INR",
          name: "Test Order",
          description: "Buy BMW CAR",
          handler: function (response) {
            handlePaymentSuccess(response, selectedAmount);
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
              amount: ${selectedAmount * 100},
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
            handlePaymentSuccess(response, selectedAmount);

          }}
          style={{ flex: 1 }}
        />
      );
    }
  };


  return (
    <ScrollView style={styles.container}>
      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>₹{userData?.wallet}</Text>
        {/* <Image source={require("./coins.png")} style={styles.coinImage} /> */}
      </View>

      {/* Features Row */}
      <View style={styles.featuresRow}>
        <FeatureItem title="Easy & Fast Payments" icon="⚡" />
        <FeatureItem title="Instant Refunds" icon="💰" />
        <FeatureItem title="Exclusive Offers" icon="🎉" />
      </View>

      {/* Add Money Section */}
      <View style={styles.addMoneyContainer}>
        <Text style={styles.addMoneyTitle}>Add Money to wallet</Text>
        <Text style={styles.enterAmount}>Enter Amount</Text>
        <TextInput style={styles.input}    keyboardType="numeric" value={selectedAmount} onChangeText={(text) => setSelectedAmount(text)}  />

        {/* Amount Selection */}
        <View style={styles.amountGrid}>
          {[500, 1000, 2000, 5000].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[styles.amountButton, selectedAmount === amount && styles.selectedAmount]}
              onPress={() => setSelectedAmount(amount)}
            >
              <Text style={[styles.amountText, selectedAmount === amount && styles.selectedText]}>
                ₹{amount}
              </Text>
              {amount === 1000 && <Text style={styles.popularTag}>POPULAR</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Balance Button */}
        <TouchableOpacity onPress={handlePayment} style={styles.addBalanceButton}>
          <Text style={styles.addBalanceText}>Add Balance</Text>
        </TouchableOpacity>
      </View>

      {/* Gift Card Section */}
      <View style={styles.giftCardContainer}>
        <Text style={styles.giftCardText}>🎁 Have a Gift Card?</Text>
        <TouchableOpacity style={styles.addCardButton}>
          <Text style={styles.addCardText}>Add Card</Text>
        </TouchableOpacity>
      </View>

      {/* Terms & Conditions */}
      <Text style={styles.termsText}>
        By continuing, you agree to <Text style={styles.readMore}>Terms of Use & Privacy Policy</Text>
      </Text>

      {/* Recent Transactions */}
      <Text style={styles.recentTransactions}>Recent Transactions</Text>
    </ScrollView>
  );
}

// Feature Item Component
const FeatureItem = ({ title, icon }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  balanceContainer: {
    backgroundColor: "#6E1EFF",
    borderRadius: 16,
    padding: 20,
    position: "relative",
  },
  balanceLabel: {
    color: "#FFFFFFAA",
    fontSize: 14,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  coinImage: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 40,
    height: 40,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  featureItem: {
    alignItems: "center",
    width: "30%",
  },
  featureIcon: {
    fontSize: 22,
  },
  featureText: {
    fontSize: 12,
    textAlign: "center",
  },
  addMoneyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  addMoneyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  enterAmount: {
    fontSize: 14,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#E5E5E5",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 10,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  amountButton: {
    width: "48%",
    padding: 14,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#D1D1D1",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  selectedAmount: {
    borderColor: "#6E1EFF",
    borderWidth: 2,
  },
  amountText: {
    fontSize: 16,
  },
  selectedText: {
    fontWeight: "bold",
    color: "#6E1EFF",
  },
  popularTag: {
    position: "absolute",
    bottom: -7,
    backgroundColor: "#FF4D4D",
    color: "white",
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 10,
  },
  addBalanceButton: {
    backgroundColor: "#6E1EFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addBalanceText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  giftCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  giftCardText: {
    fontSize: 14,
  },
  addCardButton: {
    backgroundColor: "#E5D5FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addCardText: {
    color: "#6E1EFF",
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
  readMore: {
    color: "#FF4D4D",
    fontWeight: "bold",
  },
  recentTransactions: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 20,
  },
});

