import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";

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

    const handleAnswer = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore((prevScore) => prevScore + 1);
        }

        // Move to the next question or show score
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            setShowScore(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
    };

    if (showScore) {
        return (
            <View style={styles.container}>
                <Text style={styles.scoreText}>Your Score: {score}/{questions.length}</Text>
                <TouchableOpacity style={styles.button} onPress={restartQuiz}>
                    <Text style={styles.buttonText}>Restart Quiz</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>
                {currentQuestionIndex + 1}. {currentQuestion.question}
            </Text>
            <FlatList
                data={currentQuestion.options}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => handleAnswer(item)}
                    >
                        <Text style={styles.optionText}>{item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

export default SoloQuiz;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    questionText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    optionButton: {
        backgroundColor: "#ffaa33",
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    optionText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    scoreText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
});
