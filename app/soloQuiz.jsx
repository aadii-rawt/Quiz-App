import { Link } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useUserAuth } from "./context/useAuthContext";

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

const SoloQuiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    // Timer logic
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
            setShowScore(true);
        }
    };

    const handleAnswer = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore((prevScore) => prevScore + 1);
        }
        goToNextQuestion();
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setTimeLeft(10); // Reset timer
    };

    if (showScore) {
        return (
            <View style={styles.scoreContainer}>
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
            <View style={styles.header}>
                <Text style={styles.pointsText}>{score} Points</Text>
                <Text style={styles.timerText}>{timeLeft} Sec</Text>
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </View>

            <FlatList
                data={currentQuestion.options}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => handleAnswer(item)}
                    >
                        <Text style={styles.optionText}>{String.fromCharCode(65 + index)}. {item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default SoloQuiz;

// Add your styles here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    pointsText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#6c63ff",
    },
    timerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#6c63ff",
    },
    questionContainer: {
        backgroundColor: "#e0e0e0",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    questionText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    optionButton: {
        backgroundColor: "#6c63ff",
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
    },
    optionText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
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
        padding: 20,
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
        fontWeight: 500
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
});