import {
  NativeBaseProvider,
  Box,
  VStack,
  Input,
  Button,
  Text,
  Alert,
  Center,
} from "native-base";
import { useState } from "react";
import colors from "../config/colors";

export default function Redeem({ route, navigation }) {
  //   const [userData, setUserData] = useState({});
  //   const { totalPoints } = route.params;
  const [otp, setOtp] = useState("");
  const [ptsToRedeem, setPtsToRedeem] = useState("");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  const handleRedeem = () => {
    const ptsToRedeemInt = parseInt(ptsToRedeem, 10);
    if (ptsToRedeemInt > totalPoints) {
      setError("Points to redeem cannot exceed total points");
      return;
    }
    setError("");
    const newBalance = totalPoints - ptsToRedeemInt;
    setBalance(newBalance);

    //API Logic to follow
    alert(
      `Redeemed ${ptsToRedeem} points! You have ${newBalance} points left.}`
    );
    //After submission, navigation back to Dashboard
    navigation.goBack();
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} px={3}>
        <Box w={"100%"} maxW={"400px"}>
          <VStack space={4} mt={3}>
            <Input
              placeholder="OTP"
              value={otp}
              onChangeText={(value) => setOtp(value)}
              keyboardType="numeric"
            />
            <Input
              isDisabled
              placeholder="Total Points"
              //   value={totalPoints.toString()}
            />
            <Input
              placeholder="Points to Redeem"
              keyboardType="numeric"
              value={ptsToRedeem}
              onChangeText={(value) => setPtsToRedeem(value)}
            />
            <Input
              placeholder="Balance (currently hardcoded)"
              keyboardType="numeric"
              value={""}
              onChangeText={(value) => setBalance(value)}
            />
            <Button
              onPress={handleRedeem}
              backgroundColor={colors.phAMACoreColor3}
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
