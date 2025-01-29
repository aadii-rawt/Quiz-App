import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Icon from "react-native-vector-icons/Ionicons";
import { Link, useNavigation } from 'expo-router';

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
        title: "Inter  mediate Math Quiz",
        author: "Mahmud Saimon",
        points: "700",
        time: "10min",
        image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
    },
];

const CurrentCompetion = () => {

    const navigation = useNavigation();

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.thumbnail} />
            <View style={styles.info}>
                {/* <Text style={styles.author}>by {item.author}</Text> */}
                <View >
                    <Text style={styles.title}>{item.title}</Text>
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
                <View >
                    <TouchableOpacity style={styles.playButton}
                        onPress={() => navigation.navigate('play')}
                    >
                        <Text style={{ color: 'white', fontWeight: 500, }}>Play Now</Text>
                    </TouchableOpacity>
                </View>
            </View>

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
        backgroundColor: "rgb(135, 67, 254)",
        borderRadius: 5,
        padding: 10,
        alignSelf: 'flex-start',
        elevation: "",
    },
});

// What's the point what do you mean. and then not a show but what's if you're in the end you're gonna help frankly what about you chuck let me put you each other. things are the way they are. i dnt want hurt your feeling. its been al right have you hae to put it off. have you wanna i dont't alaskan you can walk gonaa glacier and if alaska it to cold. that sounds very nice why not. they are still. upset. they must be excited about the it she showed to whe important to you just want to back on a good trust where is her can't hlep you were just trying to help if you should blame me you she doesn't you. are you sure this is wendseday. come in today. how you gonna say that. natcho what happend to you  you strapped thy're coming. who? fron now on the what's the doing ther. i settle it right now. you have to work together the can suck me you should be kissing my ass built we all did salamana treat you hector. it its. it is personal. when they arrive. i need an ambulance. come on how much you need to do it. 
