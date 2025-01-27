import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useUserAuth } from "./context/useAuthContext";

export default function Home() {

    const { user } = useUserAuth()

    return (
        <ScrollView style={styles.container}>
            <StatusBar style="auto" />

            {/* Header */}
            <View style={styles.header}>
                <MaterialIcons name="menu" size={24} color="white" />
                <Text style={styles.location}>{user?.username}</Text>
                <Image
                    style={styles.profileImage}
                    source={{
                        uri: "https://via.placeholder.com/40",
                    }}
                />
            </View>

            {/* Welcome Text */}
            <Text style={styles.welcomeText}>Welcome Back</Text>

            {/* Service Categories */}
            <View style={styles.categoriesContainer}>
                {[
                    { name: "Food", icon: "cutlery" },
                    { name: "Ride", icon: "motorcycle" },
                    { name: "Rent", icon: "car" },
                    { name: "Delivery", icon: "truck" },
                    { name: "Mart", icon: "shopping-cart" },
                    { name: "Beauty", icon: "user" },
                    { name: "Cleaning", icon: "bath" },
                    { name: "More", icon: "ellipsis-h" },
                ].map((category, index) => (
                    <TouchableOpacity key={index} style={styles.categoryButton}>
                        <FontAwesome name={category.icon} size={24} color="green" />
                        <Text style={styles.categoryText}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Recommendation Section */}
            <View style={styles.recommendContainer}>
                <Text style={styles.recommendText}>Recommend For You</Text>
                <View style={styles.discountCard}>
                    <Text style={styles.discountText}>Discounts For Monday</Text>
                    <Text style={styles.discountSubtext}>Save On Your First Order</Text>
                    <Text style={styles.discountPercent}>50%</Text>
                    <Image
                        style={styles.discountImage}
                        source={{
                            uri: "https://via.placeholder.com/100",
                        }}
                    />
                </View>
            </View>

            {/* Popular Section */}
            <View style={styles.popularContainer}>
                <Text style={styles.popularText}>Popular Now</Text>
                <Text style={styles.viewAll}>View all</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "green",
        padding: 16,
    },
    location: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 16,
        marginLeft: 16,
    },
    categoriesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginVertical: 16,
    },
    categoryButton: {
        alignItems: "center",
        width: 80,
        marginVertical: 8,
    },
    categoryText: {
        marginTop: 8,
        fontSize: 14,
        color: "black",
    },
    recommendContainer: {
        backgroundColor: "#fff",
        padding: 16,
        marginVertical: 16,
    },
    recommendText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    discountCard: {
        backgroundColor: "#d4edda",
        borderRadius: 10,
        padding: 16,
        marginTop: 16,
        alignItems: "center",
    },
    discountText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    discountSubtext: {
        fontSize: 12,
        textAlign: "center",
        marginBottom: 8,
    },
    discountPercent: {
        fontSize: 40,
        color: "green",
        fontWeight: "bold",
    },
    discountImage: {
        width: 100,
        height: 100,
        marginTop: 8,
    },
    popularContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
    },
    popularText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    viewAll: {
        fontSize: 14,
        color: "green",
    },
});
