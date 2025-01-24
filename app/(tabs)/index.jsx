import { Link } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

// Static data for quizzes
const currentQuizzes = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    duration: '30 mins',
    questions: 20,
  },
  {
    id: 2,
    title: 'React Native Basics',
    duration: '45 mins',
    questions: 25,
  },
];

const upcomingQuizzes = [
  {
    id: 3,
    title: 'Advanced JavaScript',
    startDate: '2024-02-01',
    duration: '60 mins',
    questions: 30,
  },
  {
    id: 4,
    title: 'Mobile App Architecture',
    startDate: '2024-02-05',
    duration: '45 mins',
    questions: 25,
  },
];

export default function HomeScreen() {
  const renderQuizCard = (quiz, isUpcoming = false) => (
    <TouchableOpacity key={quiz.id} style={styles.quizCard}>
      <Text style={styles.quizTitle}>{quiz.title}</Text>
      <Text style={styles.quizInfo}>Duration: {quiz.duration}</Text>
      <Text style={styles.quizInfo}>Questions: {quiz.questions}</Text>
      {isUpcoming && (
        <Text style={styles.quizInfo}>Starting: {quiz.startDate}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quiz App <Link href='/login' >Login</Link></Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>
      
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Quizzes</Text>
          {currentQuizzes.map(quiz => renderQuizCard(quiz))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Quizzes</Text>
          {upcomingQuizzes.map(quiz => renderQuizCard(quiz, true))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  profileButtonText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quizCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quizInfo: {
    color: '#666',
    fontSize: 14,
  },
});