import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Icon from "react-native-vector-icons/Ionicons";
import { useUserAuth } from "@/app/context/useAuthContext";

const TodayCompetitions = () => {
    const navigation = useNavigation();
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date().getTime());

    const { userData } = useUserAuth()
    const formatTime = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    };
    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const competitionsRef = collection(db, "competitions");
                const querySnapshot = await getDocs(competitionsRef);

                let todayCompetitions = [];
                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(); // Midnight today
                const tomorrowStart = todayStart + 86400000; // Midnight next day

                querySnapshot.forEach((doc) => {
                    const competition = { id: doc.id, ...doc.data() };
                    const startTime = competition.startTime.seconds * 1000; // Convert Firestore timestamp to milliseconds

                    // Only show competitions that start today (between today's midnight and tomorrow's midnight)
                    if (startTime >= todayStart && startTime < tomorrowStart) {
                        todayCompetitions.push(competition);
                    }
                });

                // Sort competitions by start time
                todayCompetitions.sort((a, b) => a.startTime.seconds - b.startTime.seconds);
                setCompetitions(todayCompetitions);
            } catch (error) {
                console.log("Error fetching competitions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitions();
    }, []);

    const renderItem = ({ item }) => {
        const isRegistered = item?.registeredUsers?.some(user => user.userId == userData?.userId);
        const startTime = item.startTime.seconds * 1000;
        const hasStarted = currentTime >= startTime;

        return (
            <View style={styles.card}>
                <Image source="https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg" style={styles.thumbnail} />
                <View style={styles.info}>
                    <View >
                        <Text style={styles.title}>{item.competitionName}</Text>
                        <View style={styles.details}>
                            <View style={styles.detailItem}>
                                <Icon name="diamond" size={16} color="#25c50a" />
                                <Text style={styles.detailText}>{item.prize}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Icon name="time" size={16} color="#7d7d7d" />
                                <Text style={styles.detailText}>{item.duration}</Text>
                            </View>
                        </View>
                    </View>
                    <View >
                        <Text style={styles.timeLeftText}>53m 20s</Text>
                        <Text style={styles.startTimeText}>{formatTime(item.startTime)}</Text>
                    </View>
                </View>

                {isRegistered ? (
                    hasStarted ? (
                        <TouchableOpacity
                            style={{
                                marginTop: 10,
                                backgroundColor: "#ff5722",
                                padding: 10,
                                margin: 5,
                                borderRadius: 5,
                                alignItems: "center",
                            }}
                            onPress={() => navigation.navigate("play", { competitionId: item.id })}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold" }}>Play</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={{ color: "green", fontWeight: "bold", marginTop: 10 }}>
                            ✅ Registered - Wait for game to start
                        </Text>
                    )
                ) : (
                    <TouchableOpacity
                        style={{
                            marginTop: 10,
                            backgroundColor: "#6200ea",
                            padding: 10,
                            borderRadius: 5,
                            alignItems: "center",
                        }}
                        onPress={() => navigation.navigate("register", { competitionId: item.id })}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Register</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };



    if (loading) {
        return <ActivityIndicator size="large" color="#6200ea" style={{ flex: 1, justifyContent: "center" }} />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#f4f4f4", padding: 15 }}>

            {competitions.length > 0 ? (
                <FlatList
                    data={competitions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            ) : (
                <Text style={{ textAlign: "center", fontSize: 16, color: "#777" }}>No competitions available today.</Text>
            )}
        </View>
    );
};

export default TodayCompetitions;


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
    },
    sliderContainer: {
        paddingHorizontal: 0,
        marginBottom: 5,
        flexDirection: 'column',
        gap: 15,
        width: '100%',
    },
    card: {
        width: '100%',
        backgroundColor: "#fff",
        borderRadius: 12,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 0,
        shadowRadius: 4,
        border: '1px solid #00000033',
    },
    thumbnail: {
        width: "100%",
        height: 180,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginBottom: 5,
    },
    info: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    author: {
        fontSize: 14,
        color: "#777",
        marginBottom: 5,
    },
    details: {
        flexDirection: "row",
        marginTop: 3,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 12,
    },
    detailText: {
        fontSize: 12,
        color: "#777",
        marginLeft: 4,
    },
    playButton: {
        width: "94%",
        backgroundColor: "rgb(135, 67, 254)",
        borderRadius: 5,
        padding: 10,
        elevation: "",
    },
    timeLeftText: {
        color: "red",
        textAlign: "center",
        fontWeight: 500,
    },
    startTimeText: {
        color: "#777",
        textAlign: "center",
    },
});