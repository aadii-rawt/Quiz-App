import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Slider from '../../components/Slider';
import ActiveQuiz from '../../components/ActiveQuiz';
import CurrentCompetion from '../../components/CurrentCompetion'
import { Link, useNavigation } from 'expo-router';

const Home = () => {

    const navigation = useNavigation();

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.profile}>
                    <Image
                        source={{ uri: 'https://imgcdn.stablediffusionweb.com/2024/9/8/9bc3b58a-aca9-4f88-9ecc-6ea2217f7790.jpg' }} // Replace with profile image URI
                        style={styles.profileImage}
                    />
                    <View>
                        <Text style={styles.greeting}>Hello!</Text>
                        <Text style={styles.userName}>Ivan L.</Text>
                    </View>
                </View>
                <View style={styles.coins}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="white" />
                    <Text style={styles.coinText}>1200</Text>
                </View>
            </View>

            <View>
                <CurrentCompetion />
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.button, {
                    // background: "rgb(234,73,23)",
                    backgroundColor: "linear-gradient(0deg, rgb(234, 84, 38) 35%, rgba(255, 129, 90, 0.9) 100%)"
                }]}>
                    <MaterialIcons name="add-circle" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Create Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, {
                    // background: 'rgb(135, 67, 254)',
                    backgroundColor: 'linear-gradient(0deg, rgba(135, 67, 254, 1) 35%, rgba(161, 127, 220, 1) 100%)'
                }]}
                    onPress={() => navigation.navigate('soloQuiz')}
                >
                    <FontAwesome5 name="user-alt" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Solo Mode</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, {
                    // background: 'rgb(71, 189, 177)',
                    backgroundColor: 'linear-gradient(0deg, rgba(71, 189, 177, 1) 35%, rgba(118, 212, 203, 1) 100%)'
                }]}>
                    <Entypo name="users" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Multiplayer</Text>
                </TouchableOpacity>
            </View>

            {/* Featured Categories */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Categories</Text>
                <TouchableOpacity style={styles.arrowButton}>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="#FF7043" />
                </TouchableOpacity>
            </View>
            <View style={styles.categories}>
                <TouchableOpacity onPress={() => navigation.navigate("quizCategory")} style={styles.category}>
                    <FontAwesome5 name="baseball-ball" size={25} color="#FF7043" />
                    <Text style={styles.categoryText}>Sports</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.category}>
                    <FontAwesome5 name="space-shuttle" size={25} color="#4FC3F7" />
                    <Text style={styles.categoryText}>Space</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.category}>
                    <FontAwesome5 name="paint-brush" size={25} color="#9575CD" />
                    <Text style={styles.categoryText}>Art</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.category}>
                    <Ionicons name="flask" size={25} color="#81C784" />
                    <Text style={styles.categoryText}>Science</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Slider />
            </View>

            <View>
                <ActiveQuiz />
            </View>

            {/* Bottom Navigation */}
            {/* <View style={styles.bottomNavigation}>
                <TouchableOpacity>
                    <MaterialIcons name="home" size={24} color="#FF7043" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialIcons name="history" size={24} color="#9E9E9E" />
                    <Text style={styles.navText}>Recent Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialIcons name="notifications" size={24} color="#9E9E9E" />
                    <Text style={styles.navText}>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialIcons name="person" size={24} color="#9E9E9E" />
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
            </View> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        minHeight: '100vh',
        maxWidth: '400px'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        color: '#000'
        // backgroundColor: '#FF7043',
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    greeting: {
        color: '#000',
        fontSize: 14,
    },
    userName: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    coins: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ea9906',
        padding: 5,
        borderRadius: 7
    },
    coinText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
        paddingHorizontal: 10,
        marginTop: 10,
        // width: '100vw',
        overflow: 'hidden',
        gap: 5,
    },
    button: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 15,
        width: 108,
        height: 120,
        justifyContent: 'center',
    },
    buttonText: {
        marginTop: 10,
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    arrowButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    categories: {
        display: 'flex',
        // gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns with equal width
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2, // spacing between grid items
        marginTop: 10,
        paddingHorizontal: 10,
        justifyContent: 'space-between',

    },
    category: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 20,
        paddingVertical: 18,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'start',
        gap: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 0,
        width: '49%',
        elevation: 3, // Adds shadow for Android
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow position for iOS
        shadowOpacity: 0.2, // Shadow transparency for iOS
        shadowRadius: 6, // Blur effect for iOS shadow
    },
    categoryText: {
        // marginTop: 5,
        fontSize: 14,
        textAlign: 'center',
    },
    banner: {
        margin: 20,
        backgroundColor: '#9575CD',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    bannerText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    spinButton: {
        backgroundColor: '#4FC3F7',
        padding: 10,
        borderRadius: 20,
    },
    spinButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    navText: {
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 5,
    },
});

export default Home;