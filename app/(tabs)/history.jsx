import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { useUserAuth } from "../context/useAuthContext";
import { db } from "../../firebase";

export default function history() {
  const { userData } = useUserAuth(); // Get the current user
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userData) return;
      setLoading(true);

      try {
        // Get user document
        const userRef = doc(db, "users", userData?.userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.log("User not found");
          setLoading(false);
          return;
        }

        const playedCompetitions = userSnap.data()?.playedCompetitions || [];
        console.log("played :", playedCompetitions);

        if (playedCompetitions.length === 0) {
          setHistory([]);
          setLoading(false);
          return;
        }
        // Fetch competition details
        const competitionsRef = collection(db, "competitions");
        const competitionsQuery = query(competitionsRef, where("competitionId", "in", playedCompetitions));
        const competitionsSnap = await getDocs(competitionsQuery);

        const competitionsData = competitionsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(competitionsData);

        setHistory(competitionsData);
      } catch (error) {
        console.log("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userData]);

  if (loading) return <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz History</Text>
      {history.length === 0 ? (
        <Text style={styles.noDataText}>No quizzes played yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryItem quiz={item} />}
        />
      )}
    </View>
  );
}

function HistoryItem({ quiz }) {
  return (
    <View style={styles.quizItem}>
      <View style={styles.icon}>
        <Text style={{ fontSize: 22, color: quiz.score > 50 ? "#28a745" : "#dc3545" }}>🏆</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.quizTitle}>{quiz?.competitionName}</Text>
        <Text style={styles.quizDate}>{new Date(quiz?.startTime).toLocaleString()}</Text>
        <Text style={[styles.quizScore, { color: quiz.score > 50 ? "#28a745" : "#dc3545" }]}>
          Score: {quiz.score || "N/A"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  quizItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quizDate: {
    fontSize: 14,
    color: "#555",
  },
  quizScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
