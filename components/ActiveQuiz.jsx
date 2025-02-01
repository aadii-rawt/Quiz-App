import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const data = [
    {
        id: "1",
        title: "Beginner Math quiz",
        author: "Mahmud Saimon",
        points: "500",
        time: "5min",
        image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg", // Replace with your actual image path
    },
    {
        id: "2",
        title: "Sports notifications",
        author: "Mahmud Saimon",
        points: "500",
        time: "5min",
        image: 'https://cdn.magicdecor.in/com/2024/02/06154140/Colorful-Gaming-Console-Wallpaper-for-Gamers.jpg', // Replace with your actual image path
    },
    {
        id: "3",
        title: "Central History",
        author: "Mahmud Saimon",
        points: "500",
        time: "5min",
        image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg', // Replace with your actual image path
    },
    {
        id: "4",
        title: "Music Classics",
        author: "Mahmud Saimon",
        points: "500",
        time: "5min",
        image: 'https://cdn.magicdecor.in/com/2024/02/06154140/Colorful-Gaming-Console-Wallpaper-for-Gamers.jpg', // Replace with your actual image path
    },
    // {
    //     id: "5",
    //     title: "Drama’s of Century",
    //     author: "Mahmud Saimon",
    //     points: "500",
    //     time: "5min",
    //     image: require("./assets/drama.png"), // Replace with your actual image path
    // },
];

const ActiveQuiz = () => {

    const [competition, setCompetitions] = useState([]);

     useEffect(() => {
            const fetchCompetitions = async () => {
                try {
                    const competitionsRef = collection(db, 'competitions');
                    const snapshot = await getDocs(competitionsRef);
                    const allCompetitions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setCompetitions(allCompetitions);
                    // console.log(competition);
                    
                } catch (error) {
                    console.error("Error fetching competitions: ", error);
                }
            };
    
            fetchCompetitions();
        }, []);
    
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg'}} style={styles.thumbnail} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.competitionName}</Text>
                {/* <Text style={styles.author}>by {item.author}</Text> */}
                <View style={styles.details}>
                    <View style={styles.detailItem}>
                        <Icon name="diamond" size={16} color="#7d7d7d" />
                        <Text style={styles.detailText}>{item.prize || item.winningAmount}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="time" size={16} color="#7d7d7d" />
                        <Text style={styles.detailText}>{item.time}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.playButton}>
                <Icon name="play-circle" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={competition}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                // ListFooterComponent={<Text style={styles.loadMore}>LOAD MORE</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        padding: 10,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    author: {
        fontSize: 14,
        color: "#777",
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
        backgroundColor: "#ffaa33",
        borderRadius: 25,
        padding: 5,
    },
    loadMore: {
        textAlign: "center",
        fontSize: 14,
        color: "#007bff",
        marginTop: 16,
    },
});

export default ActiveQuiz;
