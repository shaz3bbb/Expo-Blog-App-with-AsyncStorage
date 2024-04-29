import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BlogCard from "../components/BlogCards";
import {FlatList, Modal, View, Text, StyleSheet, TextInput} from "react-native";
import {globalStyles} from "../utils/utils";
import ModalView from "../components/ModalView";
import Ionicons from "react-native-vector-icons/Ionicons";


export default function Home({ navigation }) {

    const [blogs, setBlogs] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const existingBlogs = await AsyncStorage.getItem('blogs');
            if (existingBlogs) {
                setBlogs(JSON.parse(existingBlogs));
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <BlogCard
                coverImage={'https://pepperyourcontent.com/wp-content/uploads/2022/05/9-Blogging-Mistakes-to-Avoid-in-2021-According-to-Pepper-Content-Bloggers.jpg'}
                blogData={item}
                moveToBlogScreen={moveToBlogScreen}
                onModalOpen={onModalOpen}
            />
        );
    };

    const onModalOpen = (cardId) => {
        setModalOpen(true);
        setSelectedCardId(cardId);
    };

    const onCloseModal = () => {
        setModalOpen(false);
        setSelectedCardId(null);
    };

    const moveToBlogScreen = (blogData) => {
        navigation.navigate('Blog', {
            blogData
        });
    };

    const onUpdateBlog = () => {
        console.log("ID to be passed:", selectedCardId);
        navigation.navigate('CreateBlog', { id: selectedCardId });
        setSelectedCardId(null);
        setModalOpen(false);
    };

    const onDeleteBlog = async (index) => {
        try {
            const updatedBlogs = [...blogs];
            updatedBlogs.splice(index, 1);
            await AsyncStorage.setItem('blogs', JSON.stringify(updatedBlogs));
            setBlogs(updatedBlogs);
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const refreshScreen = () => {
        fetchData();
    };
    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <View style={globalStyles.primaryContainer}>
            <Modal
                visible={modalOpen}
                animationType='fade'
                transparent={true}
            >
                <ModalView
                    onPressHandlers={{
                        onUpdateBlog,
                        onDeleteBlog,
                        onCloseModal
                    }}
                    onCloseModal={onCloseModal}
                />
            </Modal>
            <View style={styles.header}>
                <Text style={globalStyles.headingText}>My Blogs</Text>
                <Ionicons
                    name='refresh'
                    size={40}
                    color='black'
                    onPress={refreshScreen}
                />
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholderTextColor="gray"
                    placeholder="Search Blog"
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />
            </View>
            <View style={styles.addIcon}>
                <Ionicons
                    name='add-circle-sharp'
                    size={54}
                    color='purple'
                    onPress={() => navigation.navigate('CreateBlog')}
                />
            </View>

            <View style={{ alignItems: 'center', flex:1 }}>
                <FlatList
                    data={filteredBlogs}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 30,
    },
    addIcon: {
        position: 'absolute',
        bottom: 40,
        left: '45%',
        zIndex: 1,
        elevation: 20,
    },
    searchContainer: {
        paddingHorizontal: 40,
        marginBottom: 20,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 12,
        fontSize: 16,
        color:'black'
    },
});
