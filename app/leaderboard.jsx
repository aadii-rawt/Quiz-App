import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Podium from "../assets/images/Podium.png";
const Leaderboard = () => {
    const players = [
        { rank: 1, name: 'Davis Curtis', points: '2,569', flag: '🇵🇹', avatar: 'https://via.placeholder.com/50', isTop: true },
        { rank: 2, name: 'Alena Donin', points: '1,469', flag: '🇫🇷', avatar: 'https://via.placeholder.com/50', isTop: false },
        { rank: 3, name: 'Craig Gouse', points: '1,053', flag: '🇨🇦', avatar: 'https://via.placeholder.com/50', isTop: false },
        { rank: 4, name: 'Madelyn Dias', points: '590', flag: '🇭🇺', avatar: 'https://via.placeholder.com/50', isTop: false },
        { rank: 5, name: 'Zain Vaccaro', points: '448', flag: '🇮🇹', avatar: 'https://via.placeholder.com/50', isTop: false },
        { rank: 6, name: 'Skylar Geidt', points: '448', flag: '🇺🇸', avatar: 'https://via.placeholder.com/50', isTop: false }
    ];

    return (
        <View style={styles.container}>


            {/* Tabs */}
            <View style={{display : "flex",alignItems : "center", justifyContent : "center"}}>
                <Image source={Podium}  />
            </View>

            {/* Leaderboard List */}

            <ScrollView style={styles.listContainer}>
                {players.map((player, index) => (
                    <View key={index} style={styles.listItem}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
                            <Text style={styles.rank}>{player.rank}</Text>
                            <Image source='https://img.freepik.com/free-photo/fun-3d-illustration-american-referee_183364-81231.jpg' style={styles.avatar} />
                            {/* <Text style={styles.flag}>{player.flag}</Text> */}
                            <Text style={styles.listName}>{player.name}</Text>
                        </View>
                        <Text style={styles.listPoints}>{player.points} points</Text>
                        {/* </Text>} */}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6A4BBC',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backArrow: {
        fontSize: 24,
        color: 'white',
        marginRight: 10,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    activeTab: {
        backgroundColor: '#FFF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
    },
    inactiveTab: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6A4BBC',
    },
    listContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    rank: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6A4BBC',
        width: 30,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    flag: {
        fontSize: 20,
        marginRight: 10,
    },
    listName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        color: '#333',
    },
    listPoints: {
        fontSize: 14,
        color: '#666',
    },
    crown: {
        fontSize: 20,
        // marginLeft: 10,
    }
});

export default Leaderboard;
