import {useEffect, useState} from "react";
import uuid from "react-native-uuid";
import {globalStyles} from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert, ScrollView, TextInput, TouchableOpacity, View, Text,StyleSheet} from "react-native";


export default function CreateBlog({ navigation, route }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [blogId, setBlogId] = useState(null);

    useEffect(() => {
        const { id, title: blogTitle, content: blogContent } = route.params || {};
        if (id) {
            setIsEditing(true);
            setBlogId(id);
            setTitle(blogTitle || '');
            setContent(blogContent || '');
        }
    }, [route.params]);

    const onCheck = async () => {
        try {
            if (!title || !content) {
                Alert.alert('Incomplete Information', 'Please fill in both the title and content of the blog.');
                return;
            }

            if (isEditing) {
                await updateBlog();
            } else {
                await saveBlog();
            }
        } catch (error) {
            console.error('Error saving blog:', error);
        }
    };

    const saveBlog = async () => {
        const uid = uuid.v4();
        const newBlog = { id: uid, title, content };
        const existingBlogs = await AsyncStorage.getItem('blogs');
        const parsedBlogs = existingBlogs ? JSON.parse(existingBlogs) : [];
        const updatedBlogs = [...parsedBlogs, newBlog];
        await AsyncStorage.setItem('blogs', JSON.stringify(updatedBlogs));
        resetFormAndNavigate('Blog Saved', 'Your blog has been saved successfully.');
    };

    const updateBlog = async () => {
        const existingBlogs = await AsyncStorage.getItem('blogs');
        const parsedBlogs = existingBlogs ? JSON.parse(existingBlogs) : [];
        const updatedBlogs = parsedBlogs.map((blog) =>
            blog.id === blogId ? { ...blog, title, content } : blog
        );
        await AsyncStorage.setItem('blogs', JSON.stringify(updatedBlogs));
        resetFormAndNavigate('Blog Updated', 'Your blog has been updated successfully.');
    };

    const resetFormAndNavigate = (title, message) => {
        setTitle('');
        setContent('');
        Alert.alert(title, message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
    };

    return (
        <ScrollView
            style={globalStyles.primaryContainer}
            keyboardShouldPersistTaps={'always'}
        >
            <Text style={{ ...globalStyles.headingText, margin: 10 }}>{isEditing ? 'Edit Blog' : 'Create A Blog'}</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={2}
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Content</Text>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={10}
                    value={content}
                    onChangeText={(text) => setContent(text)}
                    underlineColorAndroid='transparent'
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={onCheck}>
                <Text style={styles.saveButtonText}>{isEditing ? 'Update Blog' : 'Create Blog'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    label: {
        fontSize: 18,
        marginVertical: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: 'purple',
        borderRadius: 5,
        paddingVertical: 12,
        marginHorizontal: 10,
        marginVertical: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
});
