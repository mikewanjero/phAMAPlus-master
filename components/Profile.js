import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ToastAndroid } from "react-native";
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
  Avatar,
  Icon,
  Image,
  Alert,
  useToast,
  ScrollView,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../config/colors";

function Profile({ navigation }) {
  const [formData, setFormData] = useState({
    nationalID: "",
    currentPin: "",
    newPin: "",
    confirmNewPin: "",
  });
  const [errors, setErrors] = useState({
    currentPin: "",
    newPin: "",
    confirmNewPin: "",
  });

  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!formData.currentPin && !formData.newPin && !formData.confirmNewPin) {
      setErrors({
        ...errors,
        currentPin: "Current Pin is required",
        newPin: "New Pin is required",
        confirmNewPin: "Confirm New Pin is required",
      });
      return false;
    } else if (!formData.currentPin) {
      setErrors({ ...errors, currentPin: "Current Pin is required" });
      return false;
    } else if (!formData.newPin) {
      setErrors({ ...errors, newPin: "New Pin is required" });
      return false;
    } else if (!formData.confirmNewPin) {
      setErrors({ ...errors, confirmNewPin: "Confirm New Pin is required" });
      return false;
    }
    setErrors({ ...errors, currentPin: "", newPin: "", confirmNewPin: "" });
    return true;
  };

  const passwordsMatch = () => {
    if (formData.newPin !== formData.confirmNewPin) {
      setErrors({
        ...errors,
        confirmNewPin: "New Pin and Confirm New Pin do not match",
      });
      return false;
    }
    setErrors({ ...errors, confirmNewPin: "" });
    return true;
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setError("");
    try {
      let response = await fetch(
        `http://www.phamacoretraining.co.ke:81/CustomerPoints/UpdatePassword/${memberNumber}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            nationalID: formData.nationalID,
            currentPin: formData.currentPin,
            // newPin: formData.newPin,
            // confirmNewPin: formData.confirmNewPin,
          }),
        }
      );
      if (response.ok) {
        let data = response.json();
        console.log(data);
        setIsLoading(false);
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("memberno", data.user.memberno);
        await AsyncStorage.setItem("fullusername", data.user.fullusername);
      } else {
        let data = response.json();
        console.log(data);
        setIsLoading(false);
        setError(data.errors.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert("Error logging in!");
      throw new Error(error);
    }
  };

  const handleSubmit = () => {
    validate() && passwordsMatch()
      ? handleUpdate()
      : ToastAndroid.showWithGravityAndOffset(
          "Fill in the blanks correctly!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
  };

  const fetchData = async () => {
    let fullusername = await AsyncStorage.getItem("fullusername");
    if (fullusername) {
      setUserName(fullusername);
    } else {
      alert("No values stored under that key.");
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("Something went wrong on fetching", e);
    }
    return navigation.navigate("Login");
  };

  useEffect(() => {
    fetchData();
    // handleDashboard();
  }, []);

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View flex={1} bg="coolGray.50">
          <Center flex={1}>
            {/* <Image
              source={require("../assets/pcico.png")}
              alt="Alternate Text"
              resizeMode="contain"
            /> */}
            <Avatar bg="blueGray.600" size="xl">
              {userName ? userName.match(/\b([A-Z])/g).join("") : null}
            </Avatar>
            {/* <Heading
              size="lg"
              fontWeight="900"
              color={Colors.phAMACoreColor3}
              _dark={{
                color: "warmGray.50",
              }}
            >
              {userName}
            </Heading> */}
          </Center>
        </View>
        {/*  w="100%" */}
        <Center px="5" flex={3} bg="coolGray.200">
          <Box p="2" w="100%" flex={1}>
            <Heading
              size="lg"
              fontWeight="700"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              Update Pin
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
              Fill in the form to update your pin
            </Heading>

            <VStack space={3} mt="5">
              <ScrollView>
                <FormControl>
                  <FormControl.Label>User Name</FormControl.Label>
                  <Input
                    type={"text"}
                    value={userName}
                    onChangeText={(value) => setUserName(value)}
                    isReadOnly
                    borderWidth="1"
                    borderColor={"gray.400"}
                  />
                </FormControl>
                <FormControl isRequired isInvalid={"currentPin" in errors}>
                  <FormControl.Label>Current Pin</FormControl.Label>
                  <Input
                    type={show ? "text" : "password"}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      setFormData({ ...formData, currentPin: value })
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
                  {"currentPin" in errors ? (
                    <FormControl.ErrorMessage>
                      {errors.currentPin}
                    </FormControl.ErrorMessage>
                  ) : (
                    ""
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={"newPin" in errors}>
                  <FormControl.Label>New Pin</FormControl.Label>
                  <Input
                    type={show ? "text" : "password"}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      setFormData({ ...formData, newPin: value })
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
                  {"newPin" in errors ? (
                    <FormControl.ErrorMessage>
                      {errors.newPin}
                    </FormControl.ErrorMessage>
                  ) : (
                    ""
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={"confirmNewPin" in errors}>
                  <FormControl.Label>Confirm New Pin</FormControl.Label>
                  <Input
                    type={show ? "text" : "password"}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      setFormData({ ...formData, confirmNewPin: value })
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
                  {"confirmNewPin" in errors ? (
                    <FormControl.ErrorMessage>
                      {errors.confirmNewPin}
                    </FormControl.ErrorMessage>
                  ) : (
                    ""
                  )}
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
                  Update
                </Button>
                <Button
                  mt="2"
                  bg={"coolGray.400"}
                  // colorScheme="indigo"
                  _text={{
                    fontSize: "md",
                    fontWeight: "500",
                    color: "white",
                  }}
                  p={4}
                  isLoading={isLoading}
                  isLoadingText="Submitting"
                  onPress={clearAll}
                >
                  Log Out
                </Button>
              </ScrollView>
            </VStack>
          </Box>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}

export default Profile;
