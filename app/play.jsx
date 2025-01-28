import { Link, useNavigation } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from "react-native";
import { useUserAuth } from "./context/useAuthContext";
import Connecting from "./connecting";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, } from "firebase/firestore";

const questions = [
    {
        id: 1,
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correctAnswer: "Paris",
    },
    {
        id: 2,
        question: "What is 5 + 3?",
        options: ["5", "8", "10", "7"],
        correctAnswer: "8",
    },
    {
        id: 3,
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correctAnswer: "Mars",
    },
];

const Play = () => {

    const { user } = useUserAuth();
    const navigation = useNavigation()

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setLoading(false)
        }, (3000))
        return () => clearTimeout(timerId)
    }, [])

    const joinCompetiton = async () => {
        if (!user) {
            return alert("Please login")
        }

        try {
            const competitionRef = doc(db, "competitions", "9D95R0qdSo0hWvvaU81O");
            await updateDoc(competitionRef, {
                players: arrayUnion({
                    uid: user.uid,
                    score: 0,
                }),
            });

            console.log("User added to competition!");
        } catch (error) {
            console.error("Error adding user to competition: ", error);
        }
    }

    useEffect(() => {
        joinCompetiton()
    }, [])

    useEffect(() => {
        if (timeLeft === 0) {
            goToNextQuestion();
        } else {
            const timer = setTimeout(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setTimeLeft(10); // Reset timer for next question
        } else {
            navigation.navigate("result")
        }
    };

    const handleAnswer = async (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            const newScore = score + 1;
            setScore(newScore);

            // Push the updated score to Firestore
            await updatePlayerScore(newScore);
        }
        goToNextQuestion();
    };

    const updatePlayerScore = async (newScore) => {
        try {
            const competitionId = "9D95R0qdSo0hWvvaU81O"; // Replace with the actual competition ID
            const competitionRef = doc(db, "competitions", competitionId);

            // Fetch the current competition document
            const competitionSnapshot = await getDoc(competitionRef);

            if (competitionSnapshot.exists()) {
                const competitionData = competitionSnapshot.data();

                // Get the current players array
                const updatedPlayers = competitionData?.players?.map((player) => {
                    if (player.uid === user?.uid) {
                        return { ...player, score: newScore }; // Update the score for the matching user
                    }
                    return player; // Keep other players unchanged
                });

                // Update the players array in Firestore
                await updateDoc(competitionRef, { players: updatedPlayers });
            } else {
                console.error("Competition document does not exist.");
            }
        } catch (error) {
            console.error("Error updating score:", error);
        }
    };


    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setTimeLeft(10); // Reset timer
    };

    if (loading) {
        return <Connecting />
    }

    if (showScore) {
        return (
            <View style={styles.scoreContainer}>
                <View style={styles.starContainer}>
                    <Image
                        source={{ uri: "https://cdn-icons-png.flaticon.com/512/2525/2525752.png" }} // Replace with your star image URL
                        style={styles.starImage}
                    />
                </View>
                <Text style={styles.congratsText}>Quiz Completed!</Text>
                <Text style={styles.earningsText}>Your Score: {score}</Text>
                <TouchableOpacity style={styles.playAgainButton} onPress={restartQuiz}>
                    <Text style={styles.playAgainText}>Play Again</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.goLobbyText}><Link href=''>Go Lobby</Link></Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>

                <Text style={styles.opponentPoints}>Score: {score}</Text>
                <Text style={styles.timer}>{timeLeft}</Text>
            </View>

            {/* Question Section */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </View>

            {/* Options Section */}
            <FlatList
                data={currentQuestion.options}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => handleAnswer(item)}
                    >
                        <View style={styles.optionCircle}>
                            <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                        </View>
                        <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default Play;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        paddingTop: 30,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginBottom: 16,
    },
    wallet: {
        backgroundColor: "#770FFC",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 10,
    },
    walletText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    points: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    userPoints: {
        fontSize: 16,
        color: "#000",
    },
    opponentPoints: {
        fontSize: 16,
        color: "#000",
        fontWeight: 600,
    },
    timer: {
        fontSize: 14,
        fontWeight: 600,
        color: "#333",
    },
    questionContainer: {
        backgroundColor: "#770FFC",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    questionText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#fff",
        textAlign: "center",
    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#770FFC",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 30,
        marginVertical: 8,
    },
    optionCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#5D0DB4",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    optionLetter: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    optionText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    scoreContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    congratsText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    earningsText: {
        fontSize: 18,
        color: "#333",
        marginVertical: 10,
    },
    playAgainButton: {
        backgroundColor: "#FFD700",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 20,
        marginVertical: 10,
    },
    playAgainText: {
        fontSize: 16,
        color: "#770FFC",
        fontWeight: "bold",
    },
    goLobbyText: {
        fontSize: 16,
        color: "#770FFC",
        textDecorationLine: "underline",
    },

});
