import Home from "./screens/Home";
import CreateBlog from "./screens/CreateBlog";
import Blog from "./screens/Blog";
import {createStackNavigator} from "@react-navigation/stack";
import 'react-native-gesture-handler';
import {NavigationContainer} from "@react-navigation/native";



const Stack = createStackNavigator()
export default  function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'
                             screenOptions={{
                                 headerShown: false
                             }}
            >
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='CreateBlog' component={CreateBlog} />
                <Stack.Screen name='Blog' component={Blog} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
