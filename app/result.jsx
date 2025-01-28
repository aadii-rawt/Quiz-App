import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Result = ({ quizId = "9D95R0qdSo0hWvvaU81O" }) => {
  const [loading, setLoading] = useState(true);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [players, setPlayers] = useState([]);
  const [yourScore, setYourScore] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      const db = getFirestore();
      const quizRef = doc(db, "competitions", quizId);

      try {
        const quizDoc = await getDoc(quizRef);

        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          const currentTime = new Date().toISOString();

          // Check if the quiz time is over
          if (currentTime >= quizData.endTime) {
            setIsTimeOver(true);

            // Sort players by score in descending order and assign ranks
            const sortedPlayers = quizData.players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => ({
                ...player,
                rank: index + 1,
              }));

            setPlayers(sortedPlayers);

            // Set your score (assumes current user is logged in and their UID is available)
            const currentUserUID = "currentUserUID"; // Replace with actual UID
            const currentUser = sortedPlayers.find((player) => player.uid === currentUserUID);
            setYourScore(currentUser?.score || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  if (loading) {
    return (
      <View style={styles.scoreContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.congratsText}>Loading Results...</Text>
      </View>
    );
  }

  if (!isTimeOver) {
    return (
      <View style={styles.scoreContainer}>
        <Text style={styles.congratsText}>Waiting for the quiz to end...</Text>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.scoreContainer}>
      <View style={styles.starContainer}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/2525/2525752.png" }}
          style={styles.starImage}
        />
      </View>
      <Text style={styles.congratsText}>Quiz Completed!</Text>
      <Text style={styles.earningsText}>Your Score: {yourScore}</Text>

      <Text style={styles.rankTitle}>Leaderboard:</Text>
      {players.map((player) => (
        <Text key={player.uid} style={styles.rankText}>
          {player.rank}. {player.name}: {player.score} points
        </Text>
      ))}

      <TouchableOpacity style={styles.playAgainButton}>
        <Text style={styles.playAgainText}>Play Again</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.goLobbyText}>
          <Link href="">Go Lobby</Link>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  scoreContainer: {
    flex: 1,
    backgroundColor: "#770FFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  starContainer: {
    backgroundColor: "#fff",
    borderRadius: 100,
    marginBottom: 20,
  },
  starImage: {
    width: 80,
    height: 80,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  earningsText: {
    fontSize: 25,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
  },
  playAgainButton: {
    backgroundColor: "#ffd700",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 15,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6c63ff",
  },
  goLobbyText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  rankTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  rankText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
});
