import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function QuizCategory() {
  const data = [
    { id: 1, winningAmount: "10₹", entry: "₹5.0" },
    { id: 2, winningAmount: "10₹", entry: "₹5.0" },
    { id: 3, winningAmount: "10₹", entry: "₹5.0" },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.winningAmount}>{item.winningAmount}</Text>
        <Text style={styles.subtitle}>Winning amount</Text>
      </View>
      <View style={styles.entryContainer}>
        <Text style={styles.entryText}>{item.entry}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>2 Players</Text>
        <Text style={styles.infoText}>1 Winner</Text>
        <Text style={styles.infoText}>2 Question</Text>
        <Text style={styles.infoText}>60 Sec</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     

      {/* Quiz Cards */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5e9fd",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7c4dff",
    padding: 8,
    borderRadius: 16,
  },
  walletText: {
    color: "white",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  winningAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7c4dff",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  entryContainer: {
    backgroundColor: "#f5e9fd",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  entryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7c4dff",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  infoText: {
    fontSize: 12,
    color: "gray",
  },
});
