import React, { useState } from "react";
import { Platform, ToastAndroid } from "react-native";
import colors from "../config/colors";
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
  ScrollView,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ForgetPassword({ navigation }) {
  const [isLoading, setIsLoading] = useState(false); // Loading state of action button (Reset Password)
  const [formData, setFormData] = useState({
    nationalID: "200011233",
    pin: "",
    confirmPin: "",
  }); // State displaying data inputs (creating new user) - key and object
  const [show, setShow] = useState(false); // State to show or hide input text and visibility
  const [error, setError] = useState(""); // State to display an error when logging in
  const [errors, setErrors] = useState({}); // Display errors in validation in case of missing or wrong inputs

  const validate = () => {
    if (!formData.nationalID && !formData.pin && !formData.confirmPin) {
      setErrors({
        nationalID: "National ID is required",
        pin: "Pin is required",
        confirmPin: "Confirm Pin is required",
      });
      return false;
    } else if (!formData.nationalID) {
      setErrors({ nationalID: "National ID is required" });
      return false;
    } else if (!formData.pin) {
      setErrors({ pin: "Pin is required" });
      return false;
    } else if (!formData.confirmPin) {
      setErrors({ confirmPin: "Confirm Pin is required" });
      return false;
    }
    setErrors({ nationalID: "200011233", pin: "", confirmPin: "" });
    return true;
  };

  const passwordsMatch = () => {
    if (formData.pin !== formData.confirmPin) {
      setErrors({
        confirmPin: "New Pin and Confirm Pin do not match",
      });
      return false;
    }
    setErrors({ confirmPin: "" });
    return true;
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      let response = await fetch(
        `http://www.phamacoretraining.co.ke:81/CustomerPoints/CustomerLogin`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idnumber: formData.nationalID,
            pin: formData.pin,
            confirmPin: formData.confirmPin,
          }),
        }
      );
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        setIsLoading(false);

        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("memberno", data.user.memberno);
        await AsyncStorage.setItem("fullusername", data.user.fullusername);

        return navigation.navigate("Dashboard");
      } else {
        let data = await response.json();
        console.log(data);
        setIsLoading(false);
        setError(data.errors.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert("Error logging in. Check your credentials!");
      throw new Error(error);
    }
  };

  const handleSubmit = () => {
    if (validate() && passwordsMatch()) {
      handleLogin();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Please fill in the blanks correctly!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  };

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
              phAMACore™ Loyalty
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
              Password Reset
            </Heading>
            <Heading
              size={"xs"}
              fontWeight={"medium"}
              color={colors.phAMACoreColor1}
              _dark={{ color: "orange.300" }}
            >
              Enter a new pin below.
            </Heading>
            <VStack space={3} mt={"5"}>
              <ScrollView>
                <FormControl>
                  <FormControl.Label>National ID</FormControl.Label>
                  <Input
                    placeholder="12345678"
                    placeholderTextColor="#707070"
                    value={formData.nationalID}
                    onChangeText={(value) =>
                      setFormData({ ...formData, nationalID: value })
                    }
                    borderWidth={1}
                    borderColor={"gray.400"}
                  />
                </FormControl>
                <FormControl>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    type={show ? "text" : "password"}
                    keyboardType="numeric"
                    value={formData.pin}
                    onChangeText={(value) =>
                      setFormData({ ...formData, pin: value })
                    }
                    borderWidth={1}
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
                          mr={2}
                          color={"gray.600"}
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
                </FormControl>
                <FormControl>
                  <FormControl.Label>Confirm Password</FormControl.Label>
                  <Input
                    type={show ? "text" : "password"}
                    keyboardType="numeric"
                    value={formData.confirmPin}
                    onChangeText={(value) =>
                      setFormData({ ...formData, confirmPin: value })
                    }
                    borderWidth={1}
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
                          mr={2}
                          color={"gray.600"}
                        />
                      </Pressable>
                    }
                  />
                  {"confirmPin" in errors ? (
                    <FormControl.ErrorMessage>
                      {errors.confirmPin}
                    </FormControl.ErrorMessage>
                  ) : (
                    ""
                  )}
                </FormControl>
                <Button
                  mt={"7"}
                  bg={colors.phAMACoreColor3}
                  p={4}
                  _text={{
                    fontSize: 14,
                    fontWeight: "semibold",
                    color: "white",
                  }}
                  isLoading={isLoading}
                  isLoadingText="Resetting password"
                  onPress={handleSubmit}
                >
                  Reset Password
                </Button>
              </ScrollView>
            </VStack>
          </Box>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}
