import React from 'react'
import { Text, StyleSheet, Image,  StatusBar, Dimensions, ScrollView } from 'react-native'
import {globalStyles} from "../utils/utils";


export default function Blog({ route }) {
    const blogData = {
        title: 'Sample Blog',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        coverImage: 'https://example.com/coverimage.jpg' // URL of the cover image
    };
    const { title, content,  } = route.params.blogData

    return (
        <ScrollView style={globalStyles.primaryContainer}>
            <StatusBar hidden />

                    <Image
                        style={styles.image}
                        source={{ uri: 'https://pepperyourcontent.com/wp-content/uploads/2022/05/9-Blogging-Mistakes-to-Avoid-in-2021-According-to-Pepper-Content-Bloggers.jpg' }}
                    />

            <Text
                style={{
                    ...globalStyles.headingText,
                    textAlign: 'center',
                    margin: 10
                }}
            >{title}</Text>
            <Text style={styles.content}>{content}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('screen').width,
        height: 200
    },
    content: {
        ...globalStyles.secondaryText,
        flex: 1,
        flexWrap: 'wrap',
        marginHorizontal: 10
    }
})
