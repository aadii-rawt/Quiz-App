import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import { Link, useNavigation } from 'expo-router';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

const data = [
    {
        id: "1",
        title: "Beginner Math Quiz",
        // author: "Mahmud Saimon",
        points: "500",
        time: "5min",
        image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
    },
    {
        id: "2",
        title: "Intermediate Math Quiz",
        // author: "Mahmud Saimon",
        points: "700",
        time: "10min",
        image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
    },
];

const CurrentCompetion = ({ user }) => {
    const navigation = useNavigation();
    const [competitions, setCompetitions] = useState(null)

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                const competitionsRef = collection(db, 'competitions');
                const snapshot = await getDocs(competitionsRef);
                const allCompetitions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCompetitions(allCompetitions);
            } catch (error) {
                console.error("Error fetching competitions: ", error);
            }
        };

        fetchCompetitions();
    }, []);

    const fetchComptetionInfo = async () => {
        const compId = '9D95R0qdSo0hWvvaU81O';

        try {
            const userDocRef = doc(db, `competitions/${compId}`);
            const userSnapshot = await getDoc(userDocRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();

                if (userData?.players) {
                    // Find the player whose UID matches the current user's UID
                    const currentPlayer = userData.players.find(player => player.uid === user?.uid);

                    if (currentPlayer) {
                        console.log("Current User's Player Data:", currentPlayer);
                        alert('You have already played this quiz');
                        return;
                    } else {
                        navigation.navigate('play')
                        console.log("Current User's Player Data not found in the players array.");
                    }
                } else {
                    console.log("No players found in competition data.");
                }
            } else {
                console.log("Competition document does not exist.");
            }
        } catch (error) {
            console.error("Error fetching competition info:", error);
        }
    };

    const renderItem = ({ item }) => (
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
                    <Text style={styles.startTimeText}>01:20 PM</Text>
                </View>
            </View>
            <View style={{ margin: 10, width: "100%" }}>
                <TouchableOpacity style={styles.playButton}
                    onPress={fetchComptetionInfo}
                >
                    <Text style={{ color: 'white', fontWeight: 500, textAlign: "center" }}>Regiseter Now</Text>
                </TouchableOpacity>
            </View>
        </View >
    );

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Current Competitions</Text>
            <FlatList
                data={competitions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sliderContainer}
            />
        </View>
    );
};

export default CurrentCompetion;

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
