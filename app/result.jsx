import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Result = ({ quizId = "9D95R0qdSo0hWvvaU81O" }) => {
  const [loading, setLoading] = useState(true);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [players, setPlayers] = useState([]);
  const [yourScore, setYourScore] = useState(0);
  const [usernames, setUsernames] = useState({});
  
  useEffect(() => {
    const fetchQuizData = async () => {
      const db = getFirestore();
      const quizRef = doc(db, "competitions", quizId);
      // console.log('ref',quizRef);

      try {
        const quizDoc = await getDoc(quizRef);

        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          const currentTime = new Date().toISOString();

          if (currentTime >= quizData.endTime) {
            setIsTimeOver(true);

            // Sort players by score and assign ranks
            const sortedPlayers = quizData.players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => ({
                ...player,
                rank: index + 1,
              }));

            setPlayers(sortedPlayers);

            // Fetch usernames for each player
            const fetchUserDetails = async () => {
              const usernamesMap = {};
              const userPromises = sortedPlayers.map(async (player) => {
                const userRef = doc(db, "users", player.uid); // Get user by UID
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                  usernamesMap[player.uid] = userDoc.data().username; // Map UID to username
                } else {
                  usernamesMap[player.uid] = "Unknown"; // Default if user not found
                }
              });

              await Promise.all(userPromises); // Wait for all user fetches
              setPlayers((prevPlayers) =>
                prevPlayers.map((player) => ({
                  ...player,
                  username: usernamesMap[player.uid], // Add username to each player
                }))
              );

              console.log(usernamesMap);
              
            };

            fetchUserDetails();

            // Set your score (assuming UID is available)
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
          <Text style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            {player.rank}.

            <Text style={styles.userProfile}>{player?.username?.slice(0,1)}</Text>
            
            {player?.username}
          </Text>
          {player.score} points
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
    marginTop: 20,
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
    marginBottom: 15,
  },
  rankText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  userProfile: {
    backgroundColor: '#ebcc24',
    padding: 2,
    borderRadius: '100%',
    width: 30,
    height: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 16,
    // color: 'black'
  }
});
