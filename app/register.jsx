import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Register = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { competitionId } = route?.params;
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {;
    
    const fetchCompetitionDetails = async () => {
      try {
        const competitionRef = doc(db, "competitions", competitionId);
        const competitionSnap = await getDoc(competitionRef);

        if (competitionSnap.exists()) {
          console.log("data : ", competitionSnap.data());
          
          setCompetition(competitionSnap.data());
        } else {
          console.log("Error", "Competition not found");
        }
      } catch (error) {
        console.log("Error", "Failed to fetch competition details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitionDetails();
  }, [competitionId]);

  const handlePayment = () => {
    const options = {
      description: "Quiz Registration Fee",
      currency: "INR",
      key: "YOUR_RAZORPAY_KEY", // Replace with actual key
      amount: competition?.fee * 100, // Convert to paise
      name: "Quiz App",
      theme: { color: "#6200ea" },
    };

    RazorpayCheckout.open(options)
      .then(() => {
        Alert.alert("Success", "Payment Successful");
        navigation.navigate("QuizScreen");
      })
      .catch((error) => {
        Alert.alert("Payment Failed", error.description);
      });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Image source="https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg" style={{
        width: "100%",
        height: 180,
        marginBottom: 5,
      }} />

      <View style={styles.info}>
        <View >
          <Text style={styles.title}>{competition?.competitionName}</Text>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              {/* <Icon name="diamond" size={16} color="#25c50a" /> */}
              <Text style={styles.detailText}>{competition?.prize}</Text>
            </View>
            <View style={styles.detailItem}>
              {/* <Icon name="time" size={16} color="#7d7d7d" /> */}
              <Text style={styles.detailText}>{competition?.duration}</Text>
            </View>
          </View>
        </View>
        <View >
          <Text style={{fontSize: 16, fontWeight: "bold"}}>Entry</Text>
          <Text style={styles.timeLeftText}>₹10</Text>
          {/* <Text style={styles.startTimeText}>{competition?.startTime}</Text> */}
        </View>
      </View>
      <TouchableOpacity
        onPress={handlePayment}
        style={{ position: "absolute", bottom: 24, left: 24, right: 24, backgroundColor: "#6200ea", padding: 12, borderRadius: 8 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Pay & Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
  },
  sliderContainer: {
    paddingHorizontal: 0,
    marginBottom: 5,
    flexDirection: 'column',
    gap: 15,
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 0,
    shadowRadius: 4,
    border: '1px solid #00000033',
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 5,
  },
  info: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  details: {
    flexDirection: "row",
    marginTop: 3,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  detailText: {
    fontSize: 12,
    color: "#777",
    marginLeft: 4,
  },
  playButton: {
    width: "94%",
    backgroundColor: "rgb(135, 67, 254)",
    borderRadius: 5,
    padding: 10,
    elevation: "",
  },
  timeLeftText: {
    color: "red",
    textAlign: "center",
    fontWeight: 500,
  },
  startTimeText: {
    color: "#777",
    textAlign: "center",
  },
});
