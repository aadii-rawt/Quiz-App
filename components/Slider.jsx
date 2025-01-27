import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const images = [
    {
        id: '1',
        title: 'Image 1',
        url: 'https://blog-images.fanatical.com/fanatical/ZjJj2UMTzAJOCeD0_image_2024-05-01_104628327.png?auto=format%2Ccompress&rect=0%2C0%2C1920%2C1080&w=1280&h=720',
    },
    {
        id: '2',
        title: 'Image 2',
        url: 'https://blog-images.fanatical.com/fanatical/ZjJj2UMTzAJOCeD0_image_2024-05-01_104628327.png?auto=format%2Ccompress&rect=0%2C0%2C1920%2C1080&w=1280&h=720',
    },
    {
        id: '3',
        title: 'Image 3',
        url: 'https://blog-images.fanatical.com/fanatical/ZjJj2UMTzAJOCeD0_image_2024-05-01_104628327.png?auto=format%2Ccompress&rect=0%2C0%2C1920%2C1080&w=1280&h=720',
    },
];

const Slider = () => {
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            // Calculate next index
            const nextIndex = (currentIndex + 1) % images.length;

            // Scroll to the next slide
            scrollViewRef.current?.scrollTo({
                x: nextIndex * screenWidth,
                animated: true,
            });

            setCurrentIndex(nextIndex);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [currentIndex]);

    const handleScroll = (event) => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        setCurrentIndex(newIndex);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16} // Ensures smooth scrolling updates
            >
                {images.map((item) => (
                    <View style={styles.slide} key={item.id}>
                        <Image source={{ uri: item.url }} style={styles.image} />
                        {/* <Text style={styles.title}>{item.title}</Text> */}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index ? styles.activeDot : null,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default Slider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#f5f5f5',
        marginTop: 5,
    },
    slide: {
        width: screenWidth,
        alignItems: 'center',
        justifyContent: 'center',
        // marginHorizontal: 10,
        padding: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    title: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#ffaa33',
    },
});
