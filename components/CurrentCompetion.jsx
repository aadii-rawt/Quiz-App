import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useUserAuth } from "@/app/context/useAuthContext";

const TodayCompetitions = () => {
    const navigation = useNavigation();
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date().getTime());

    const { userData } = useUserAuth();

    const formatTime = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    // Function to calculate time left in minutes and seconds
    const calculateTimeLeft = (startTime) => {
        const timeDiff = startTime - currentTime;
        if (timeDiff <= 0) return "00m 00s"; // If the competition has started or passed
    
        const hours = Math.floor(timeDiff / 3600000); // 3600000 ms in an hour
        const minutes = Math.floor((timeDiff % 3600000) / 60000); // 60000 ms in a minute
        const seconds = Math.floor((timeDiff % 60000) / 1000); // 1000 ms in a second
    
        if (hours > 0) {
            return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
        } else {
            return `${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
        }
    };
    
    useEffect(() => {
        // Fetch competitions from Firestore
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

        // Update current time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const renderItem = ({ item }) => {
        if (!item) return null; // Ensure item is not null

        const isRegistered = item?.registeredUsers?.some(user => user.userId == userData?.userId);
        const startTime = item.startTime.seconds * 1000;

        return (
            <View style={styles.card}>
                <Image source={{uri: "https://t3.ftcdn.net/jpg/02/85/90/44/360_F_285904463_52tKiXp592qUhmg24eS3f4k1kGQSji3f.jpg"}} style={styles.thumbnail} />
                <View style={styles.info}>
                    <View>
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
                    <View>
                        <Text style={styles.timeLeftText}>{calculateTimeLeft(startTime)}</Text>
                        <Text style={styles.startTimeText}>{formatTime(item.startTime)}</Text>
                    </View>
                </View>

                {isRegistered ? (
                    currentTime >= startTime ? (
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
                        <Text style={{ color: "green", fontWeight: "bold", marginTop: 10, padding: 5 }}>
                            ✅ Registered - Wait for game to start
                        </Text>
                    )
                ) : (
                    <TouchableOpacity
                        style={{
                            marginTop: 10,
                            backgroundColor: "#6200ea",
                            padding: 10,
                            margin: 5,
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
        margin : 5,
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