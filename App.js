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
import ForgetPassword from "./components/ForgetPassword";
import Redeem from "./components/Redeem";
import TransactionDetails from "./components/TransactionDetails";

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
          headerShown: true,
          tabBarLabel: "Transactions",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bank" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Redeem"
        component={Redeem}
        options={{
          headerShown: true,
          tabBarLabel: "Redeem",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="gift-open-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  switch (routeName) {
    case "Home":
      return "Dashboard";
    case "Transactions":
      return "Transactions";
    case "Profile":
      return "Profile";
    case "Redeem":
      return "Redeem";
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
          name="Forget Password"
          component={ForgetPassword}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={HomeStackScreen}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerShown: true,
          })}
        />
        <Stack.Screen
          name="transactionDetails"
          component={TransactionDetails}
          options={{
            headerTitle: "Transactions Details",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Redeem"
          component={Redeem}
          options={{
            headerTitle: "Redeem Points",
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
