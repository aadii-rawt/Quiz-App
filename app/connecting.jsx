import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";

export default function Connecting() {
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <View style={styles.circle}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        <Text style={styles.connectingText}>Connecting...</Text>
      </View>
      <Text style={styles.timerText}>Waiting for other players to join.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B2EFF", // Purple background
    alignItems: "center",
    justifyContent: "center",
  },
  circleContainer: {
    alignItems: "center",
  },
  circle: {
    width: 100,
    height: 100,
    borderColor: "#FFFFFF", // White border for the circle
    justifyContent: "center",
    alignItems: "center",
  },
  connectingText: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  timerText: {
    position: "absolute",
    bottom: 50,
    color: "#FFD700", // Yellow text
    fontSize: 16,
    fontWeight: "bold",
  },
});
