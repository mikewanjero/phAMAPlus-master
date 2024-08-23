import {
  NativeBaseProvider,
  Box,
  VStack,
  Input,
  Button,
  Text,
  Alert,
  Avatar,
  Center,
  Heading,
  Divider,
} from "native-base";
import { useEffect, useState } from "react";
import colors from "../config/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Redeem({ route, navigation }) {
  const {
    mempOintSBAL = 0,
    mempOintSBUY = 0,
    mempOintSREDEEM = 0,
  } = route.params;

  const [otp, setOtp] = useState("");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  //   const [userData, setUserData] = useState({});
  //   const { totalPoints } = route.params;
  //   const [ptsToRedeem, setPtsToRedeem] = useState("");

  const fetchName = async () => {
    try {
      let fullUserName = await AsyncStorage.getItem("fullusername");
      if (fullUserName) {
        setUserName(fullUserName); //Set actual username
      } else {
        setUserName(""); //username as an empty string
        alert("No values stored under the key.");
      }
    } catch (error) {
      console.error("Failed to fetch user name from AsyncStorage", error);
      setError(error);
    }
  };

  const handleRedeem = () => {
    const mempOintSREDEEMInt = parseInt(mempOintSREDEEM, 10);
    if (mempOintSREDEEMInt > mempOintSBAL) {
      setError("Points to redeem cannot exceed total points");
      return;
    }
    setError("");
    const newBalance = mempOintSBAL - mempOintSREDEEMInt;
    setBalance(newBalance);

    //API Logic to follow
    alert(
      `Redeemed ${mempOintSREDEEM} points! You have ${newBalance} points left.`
    );
    //After submission, navigation back to Dashboard
    navigation.goBack();
  };

  useEffect(() => {
    fetchName();
  }, []);

  return (
    <NativeBaseProvider>
      <Center flex={1} px={10} bgColor={colors.phAMACoreColor1}>
        <Avatar bg="blueGray.600" size="xl">
          {userName ? userName.match(/\b([A-Z])/g).join("") : "?"}
        </Avatar>
        <Heading
          size="lg"
          fontWeight="900"
          mt={2}
          mb={10}
          color={colors.phAMACoreColor2}
          _dark={{
            color: "warmGray.50",
          }}
        >
          {userName || "User"}
        </Heading>
        <Divider mb={2} bgColor={"black"} />
        <Box w={"100%"} maxW={"400px"}>
          <Heading
            size="lg"
            fontWeight="700"
            color="coolGray.800"
            _dark={{
              color: "warmGray.50",
            }}
          >
            Redeem Points
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
            Enter points to be redeemed below.
          </Heading>
          <VStack space={4} mt={3}>
            <Input
              placeholder="OTP"
              bgColor="white"
              _input={{ color: "black", placeholderTextColor: "black" }}
              value={otp}
              onChangeText={(value) => setOtp(value)}
              keyboardType="numeric"
              size={20}
            />
            <Input
              isDisabled
              bgColor="white"
              _input={{ color: "black", placeholderTextColor: "black" }}
              value={
                mempOintSBAL + mempOintSBUY === 0
                  ? "" // This will show the placeholder if the value is 0
                  : (mempOintSBAL + mempOintSBUY).toString()
              }
              placeholder={
                mempOintSBAL + mempOintSBUY === 0 ? "Total Points" : undefined
              }
              size={20}
            />
            <Input
              placeholder="Points to Redeem"
              bgColor="white"
              _input={{ color: "black", placeholderTextColor: "black" }}
              keyboardType="numeric"
              value={mempOintSREDEEM}
              onChangeText={(value) => mempOintSREDEEM(value)}
              size={20}
            />
            <Input
              isDisabled
              placeholder="Balance remaining"
              bgColor="white"
              _input={{ color: "black", placeholderTextColor: "black" }}
              keyboardType="numeric"
              value={""}
              onChangeText={(value) => setBalance(value)}
              size={20}
            />
            <Button
              onPress={handleRedeem}
              backgroundColor={colors.phAMACoreColor2}
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
