import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake data for now
    setLoading(true);
    setTimeout(() => {
      const fakeHistory = [
        { id: "1", title: "Math Quiz", score: 85, date: "2024-02-01T10:00:00.000Z" },
        { id: "2", title: "Science Quiz", score: 40, date: "2024-02-02T14:30:00.000Z" },
        { id: "3", title: "History Quiz", score: 72, date: "2024-02-03T16:45:00.000Z" },
      ];
      setHistory(fakeHistory);
      setLoading(false);
    }, 1500);
  }, []);

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
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <Text style={styles.quizDate}>{new Date(quiz.date).toLocaleString()}</Text>
        <Text style={[styles.quizScore, { color: quiz.score > 50 ? "#28a745" : "#dc3545" }]}>
          Score: {quiz.score}
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
    elevation: 3, // Shadow for Android
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

