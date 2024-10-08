import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import Colors from "../config/colors";
import {
  NativeBaseProvider,
  Box,
  View,
  Heading,
  Center,
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
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
// import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import { API_URL } from "@env";

function Login({ navigation }) {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ nationalID: "", pin: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * TODO: Handle Validate form
   */
  const validate = () => {
    if (!formData.nationalID && !formData.pin) {
      setErrors({
        ...errors,
        nationalID: "National ID is required",
        pin: "Pin is required",
      });
      return false;
    } else if (!formData.nationalID) {
      setErrors({ ...errors, nationalID: "National ID is required" });
      return false;
    } else if (!formData.pin) {
      setErrors({ ...errors, pin: "Pin is required" });
      return false;
    }
    setErrors({ ...errors, nationalID: "", pin: "" });
    return true;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      let response = await fetch(
        `http://www.phamacoretraining.co.ke:81/CustomerPoints/CustomerLogin`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // 'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            idnumber: formData.nationalID,
            pin: formData.pin,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setIsLoading(false);
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("memberno", data.user.memberno);
        await AsyncStorage.setItem("fullusername", data.user.fullusername);

        return navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else {
        console.log(data);
        setIsLoading(false);
        setError(data.errors.message);
        // alert(data.errors.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError("An error occured during login!");
      // ADD THIS THROW error
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    validate()
      ? handleLogin()
      : ToastAndroid.showWithGravityAndOffset(
          "Please fill in the blanks!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
  };

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View flex={1} bg="coolGray.50">
          <Center flex={1}>
            <Image
              source={require("../assets/pcico.png")}
              alt="Alternate Text"
              resizeMode="contain"
            />
            <Heading
              size="2xl"
              fontWeight="900"
              color={Colors.phAMACoreColor1}
              _dark={{
                color: "warmGray.50",
              }}
            >
              phAMACore™ Loyalty
            </Heading>
          </Center>
        </View>

        {error && (
          <Alert w="100%" status="error">
            <Text
              fontSize="md"
              fontWeight="medium"
              _dark={{
                color: "coolGray.800",
              }}
            >
              {error}
            </Text>
          </Alert>
        )}
        <Center px="7" flex={1} bg="coolGray.200" mt={"-25%"}>
          <Box p="6" w="100%" flex={1}>
            <Heading
              size="lg"
              fontWeight="700"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              Welcome
            </Heading>
            <Heading
              mt="1"
              _dark={{
                color: "warmGray.200",
              }}
              color="coolGray.600"
              fontWeight="medium"
              size="xs"
            >
              Sign in to continue!
            </Heading>

            <VStack space={3} mt="5">
              <FormControl isRequired isInvalid={"nationalID" in errors}>
                <FormControl.Label>National ID</FormControl.Label>
                <Input
                  placeholder="12345678"
                  value={formData.nationalID}
                  onChangeText={(value) =>
                    setFormData({ ...formData, nationalID: value })
                  }
                  borderWidth="1"
                  borderColor={"gray.400"}
                />
                {"nationalID" in errors ? (
                  <FormControl.ErrorMessage>
                    {errors.nationalID}
                  </FormControl.ErrorMessage>
                ) : (
                  ""
                )}
              </FormControl>
              <FormControl isRequired isInvalid={"pin" in errors}>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  type={show ? "text" : "password"}
                  keyboardType="numeric"
                  value={formData.pin}
                  onChangeText={(value) =>
                    setFormData({ ...formData, pin: value })
                  }
                  borderWidth="1"
                  borderColor={"gray.400"}
                  InputRightElement={
                    <Pressable onPress={() => setShow(!show)}>
                      <Icon
                        as={
                          <MaterialIcons
                            name={show ? "visibility" : "visibility-off"}
                          />
                        }
                        size={5}
                        mr="2"
                        color="muted.400"
                      />
                    </Pressable>
                  }
                />
                {"pin" in errors ? (
                  <FormControl.ErrorMessage>
                    {errors.pin}
                  </FormControl.ErrorMessage>
                ) : (
                  ""
                )}
                <Link
                  _text={{
                    fontSize: "xs",
                    fontWeight: "500",
                    color: "indigo.500",
                  }}
                  alignSelf="flex-end"
                  mt="1"
                  onPress={() => navigation.navigate("Forget Password")}
                >
                  Forgot Password?
                </Link>
              </FormControl>
              <Button
                mt="2"
                bg={Colors.phAMACoreColor2}
                // colorScheme="indigo"
                _text={{
                  fontSize: "md",
                  fontWeight: "500",
                  color: "white",
                }}
                p={4}
                isLoading={isLoading}
                isLoadingText="Submitting"
                onPress={handleSubmit}
              >
                Sign in
              </Button>
            </VStack>
          </Box>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}

export default Login;

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
});
