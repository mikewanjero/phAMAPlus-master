import {
  NativeBaseProvider,
  View,
  Text,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Pressable,
  Icon,
  Image,
  Alert,
  useToast,
  Box,
  Heading,
  Center,
  KeyboardAvoidingView,
} from "native-base";
import { Platform } from "react-native";
import colors from "../config/colors";
import { useState } from "react";

export default function Signup() {
  const [loading, isLoading] = useState(false); //Loading state of action button (Create Account)
  const [formData, setFormData] = useState({
    nationalID: "",
    pin: "",
  }); //State displaying data inputs (creating new user) - key and object
  const [show, setShow] = useState(false); //State to show or hide input text and visibility
  const [error, setError] = useState(""); //State to display an error when logging in
  const [errors, setErrors] = useState({}); //Display errors in validation incase of missing inputd

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View flex={1} bg={"warmGray.50"}>
          <Center flex={1}>
            <Image
              source={require("../assets/pcico.png")}
              alt="phAMACore™ image"
              resizeMode="contain"
            />
            <Heading
              size={"2xl"}
              fontWeight={"bold"}
              color={colors.phAMACoreColor1}
            >
              phAMACore™
            </Heading>
          </Center>
        </View>

        <Center px={5} flex={1} bgColor={"coolGray.200"}>
          <Box p={"2"} w={"100%"} flex={1}>
            <Heading
              size={"lg"}
              fontWeight={"bold"}
              color={colors.phAMACoreColor1}
              _dark={{ color: "orange.50" }}
            >
              Welcome
            </Heading>
            <Heading
              size={"xs"}
              fontWeight={"medium"}
              color={colors.phAMACoreColor1}
              _dark={{ color: "orange.300" }}
            >
              Please fill in your credentials below.
            </Heading>
            <VStack space={3} mt={"5"}>
              <FormControl>
                <FormControl.Label>National ID</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Input />
              </FormControl>
              <Button
                mt={"7"}
                bg={colors.phAMACoreColor3}
                p={4}
                _text={{ fontSize: 14, fontWeight: "semibold", color: "white" }}
              >
                Create Account
              </Button>
            </VStack>
          </Box>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
