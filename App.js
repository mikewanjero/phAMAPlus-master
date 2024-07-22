import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Profile from "./components/Profile";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import TransactionDetails from "./components/TransactionDetails";
import { Text } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStackScreen() {
  return (
    <Tab.Navigator
      activeColor="#c58c4f"
      inactiveColor="#5d3915"
      initialRouteName="Home"
      backBehavior="firstRoute"
      // barStyle={{ backgroundColor: "#694fad" }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={{
          headerShown: false,
          tabBarLabel: "Transactions",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bank" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function LogoTitle({ title }) {
  return <Text>{title} </Text>;
}

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  switch (routeName) {
    case "Home":
      return "Dashboard";
    // return <LogoTitle title={"asd"} />;
    case "Transactions":
      return "Transactions";
    // return <LogoTitle title={"Transactions"} />;
    case "Profile":
      return "Profile";
    // return <LogoTitle title={"Profile"} />;
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerStyle: {
          //   backgroundColor: "#f4511e",
          // },
          animationTypeForReplace: "push",
          animation: "slide_from_right",
          headerLeft: null,
          headerBackVisible: false,
          // headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 30,
          },
        }}
      >
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={HomeStackScreen}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            // headerShown: false,
          })}
        />
        <Stack.Screen
          name="transactionDetails"
          component={TransactionDetails}
          options={{
            headerTitle: "Transactions Details",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
