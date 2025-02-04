import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUserAuth } from "./context/useAuthContext";

const Register = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { competitionId } = route?.params;
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false); // New state for button loading
  const [isRegistered, setIsRegistered] = useState(false);
  // Getting user details (modify as per your auth setup)
  const { userData } = useUserAuth()

  useEffect(() => {
    const fetchCompetitionDetails = async () => {
      try {
        const competitionRef = doc(db, "competitions", competitionId);
        const competitionSnap = await getDoc(competitionRef);

        if (competitionSnap.exists()) {
          const competitionData = competitionSnap.data();
          setCompetition(competitionData);

          // Check if user is already registered in the array
          if (competitionData?.registeredUsers?.some(user => user.userId === userData?.userId)) {
            setIsRegistered(true);
          }
        } else {
          console.log("Error", "Competition not found");
        }
      } catch (error) {
        console.log("Error", "Failed to fetch competition details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitionDetails();
  }, [competitionId, userData?.userId]);


  const handleRegister = async () => {
    if (!competition) return;
    setRegistering(true); // Show loading indicator

    try {
      const competitionRef = doc(db, "competitions", competitionId);
      const competitionSnap = await getDoc(competitionRef);

      if (competitionSnap.exists()) {
        const competitionData = competitionSnap.data();
        const registeredUsers = competitionData?.registeredUsers || [];

        // Check if user is already registered
        if (registeredUsers.some((user) => user.userId === userData?.userId)) {
          setIsRegistered(true);
          setRegistering(false);
          console.log("Already Registered", "You are already registered for this competition.");
          return;
        }

        // Add user to registeredUsers array
        const newUser = {
          userId: userData?.userId,
          userName: userData.username,
          phoneNumber: userData.phoneNumber,
          registeredAt: Date.now(),
          paymentStatus: "success",
          score: 0,
        };

        await updateDoc(competitionRef, {
          registeredUsers: [...registeredUsers, newUser], // Append user
        });

        setIsRegistered(true);
        console.log("Success", "You have successfully registered for the competition!");
      }

    } catch (error) {
      console.log("Payment Error", "Something went wrong. Please try again.", error);
    } finally {
      setRegistering(false);
    }
  };

  // useEffect(() => {
  //   const fetchCompetitionDetails = async () => {
  //     try {
  //       const competitionRef = doc(db, "competitions", competitionId);
  //       const competitionSnap = await getDoc(competitionRef);

  //       if (competitionSnap.exists()) {
  //         const competitionData = competitionSnap.data();
  //         setCompetition(competitionData);

  //         // Check if user is already registered in the array
  //         if (competitionData?.registeredUsers?.some(user => user.userId === userData?.uid)) {
  //           setIsRegistered(true);
  //         }
  //       } else {
  //         console.log("Error", "Competition not found");
  //       }
  //     } catch (error) {
  //       console.log("Error", "Failed to fetch competition details", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCompetitionDetails();
  // }, [competitionId, userData?.uid]);

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Image
        source={{ uri: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg" }}
        style={{ width: "100%", height: 180, marginBottom: 5 }}
      />

      <View style={styles.info}>
        <View>
          <Text style={styles.title}>{competition?.competitionName}</Text>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>Prize: {competition?.prize}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>Duration: {competition?.duration}</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Entry</Text>
          <Text style={styles.timeLeftText}>₹{competition?.entry}</Text>
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={isRegistered || registering}
        style={[
          styles.registerButton,
          { backgroundColor: isRegistered ? "#777" : "#6200ea" },
        ]}
      >
        {registering ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
            {isRegistered ? "Registered" : "Pay & Register"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  info: {
    width: "100%",
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
  timeLeftText: {
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
  },
  registerButton: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    padding: 12,
    borderRadius: 8,
  },
});
