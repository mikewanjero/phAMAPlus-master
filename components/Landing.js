import React from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../config/colors";
import {
  NativeBaseProvider,
  Heading,
  Center,
  Pressable,
  Box,
  Text,
  Image,
} from "native-base";

function Landing({ navigation }) {
  const storeData = () => {
    return navigation.push("Login");
  };

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <View flex={1}>
          <Center flex={1}>
            <Image
              source={require("../assets/pcico.png")}
              alt="Alternate Text"
              resizeMode="contain"
            />
          </Center>
        </View>
        <View flex={2}>
          <Center flex={1}>
            <Image
              source={require("../assets/shopping.png")}
              alt="Alternate Text"
              resizeMode="contain"
            />
          </Center>
        </View>
        <View style={styles.box2}>
          <Box p="5">
            <Heading size="2xl">Find a way to manage</Heading>
            <Heading size="2xl">your Transactions</Heading>
            <Text fontSize="md">Best Solution to view your</Text>
            <Text fontSize="md">loyalty points & transactions</Text>
          </Box>
        </View>
        <View style={styles.box3}>
          <Center flex={1}>
            <Pressable onPress={storeData}>
              {({ isHovered, isFocused, isPressed }) => {
                return (
                  <Box
                    borderColor="none"
                    bg={
                      isPressed
                        ? Colors.phAMACoreColor1
                        : Colors.phAMACoreColor2
                    }
                    minW="75%"
                    rounded={"md"}
                    p="5"
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 1 : 1,
                        },
                      ],
                    }}
                  >
                    <Center>
                      <Text style={{ color: "white" }}>Get Started</Text>
                    </Center>
                  </Box>
                );
              }}
            </Pressable>
          </Center>
        </View>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.phAMACoreColor1,
  },
  box1: {
    flex: 3,
    backgroundColor: Colors.danger,
  },
  box2: {
    flex: 1,
    justifyContent: "center",
  },
  box3: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "WorkSans-Bold",
  },
  subtitle: {
    textAlign: "center",
    fontFamily: "WorkSans-Regular",
    paddingHorizontal: 64,
    paddingVertical: 16,
  },
});

export default Landing;
