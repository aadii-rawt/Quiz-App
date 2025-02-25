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
    { id: 1, winningAmount: "10", entry: "₹5.0" },
    { id: 2, winningAmount: "10", entry: "₹5.0" },
    { id: 3, winningAmount: "10", entry: "₹5.0" },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.mainCard}>
        <View style={styles.cardContent}>
          <Text style={styles.winningAmount}>₹{item.winningAmount}</Text>
          <Text style={styles.subtitle}>Winning amount</Text>
        </View>
        <View style={styles}>
          <Text style={styles.subtitle}>Entry</Text>
          <Text style={styles.entryContainer}>{item.entry}</Text>
        </View>
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
    backgroundColor: "",
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
   
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    
  },
  mainCard: {
    display: "flex",
    flexDirection: "row",
    alignItems : "center",
    padding: 16,
    justifyContent : "space-between"
  },
  cardContent: {
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
  },
  winningAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#343E43",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
 
  entryContainer: {
    backgroundColor: "#770ffc",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 16,
    padding: 16,
    backgroundColor : "#f3e9ff"
  },
  infoText: {
    fontSize: 12,
    color: "#770ffc",

  },
});
