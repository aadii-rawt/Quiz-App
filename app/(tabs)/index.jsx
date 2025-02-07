import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import Home from "../home";
import { SafeAreaView } from 'react-native-safe-area-context';
const index = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <Home />
      </ScrollView>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  },
})