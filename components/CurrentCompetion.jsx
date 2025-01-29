import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import { Link, useNavigation } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const data = [
    {
        id: "1",
        title: "Beginner Math Quiz",
        author: "Mahmud Saimon",
        points: "500",
        time: "5min",
        image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
    },
    {
        id: "2",
        title: "Intermediate Math Quiz",
        author: "Mahmud Saimon",
        points: "700",
        time: "10min",
        image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
    },
];

const CurrentCompetion = ( {user} ) => {

    const navigation = useNavigation();

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
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                {/* <Text style={styles.author}>by {item.author}</Text> */}
                <View style={styles.details}>
                    <View style={styles.detailItem}>
                        <Icon name="diamond" size={16} color="#25c50a" />
                        <Text style={styles.detailText}>{item.points}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="time" size={16} color="#7d7d7d" />
                        <Text style={styles.detailText}>{item.time}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.playButton}
                // onPress={() => navigation.navigate('play')}
                onPress={fetchComptetionInfo}
            >
                <Text style={{ color: 'white' }}>Play Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Current Competitions</Text>
            <FlatList
                data={data}
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
        // padding: 12,
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
        borderRadius: 8,
        marginBottom: 10,
    },
    info: {
        flex: 1,
        paddingHorizontal: 12,
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
        marginTop: 4,
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
        backgroundColor: "rgb(135, 67, 254)",
        borderRadius: 25,
        padding: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        margin: 12,
    },
});
