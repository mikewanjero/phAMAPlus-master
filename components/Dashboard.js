import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  // BackHandler,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  NativeBaseProvider,
  Box,
  View,
  Stack,
  HStack,
  Heading,
  Center,
  Text,
  VStack,
  Divider,
  Flex,
  ScrollView,
  Image,
  Link,
  Button,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../config/colors";

function Dashboard({ navigation }) {
  const [userData, setUserData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // PPL000101

  const handleTransactions = async () => {
    setIsLoading(true);
    let token = await AsyncStorage.getItem("token");
    let memberno = await AsyncStorage.getItem("memberno");
    if (token && memberno) {
      return fetch(
        `http://www.phamacoretraining.co.ke:81/CustomerPoints/GetCustomerTransactions?memberNo=${memberno}`,
        {
          method: "GET", // GET, POST, PUT, DELETE, etc.
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            // const data = await response.json();
            setIsLoading(false);
            setTransactions(data.slice(0, 10));
            console.log(data);
          } else {
            // const data = await response.json();
            setIsLoading(false);
            alert(data.errors.message);
            // return console.log(data);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error.message);
          alert("Check your internet connection!");
          // ADD THIS THROW error
          throw error;
        });
    } else {
      alert("No values stored under that key.");
    }
  };
  const handleDashboard = async () => {
    setIsLoading(true);
    let token = await AsyncStorage.getItem("token");
    let memberno = await AsyncStorage.getItem("memberno");
    if (token && memberno) {
      return fetch(
        `http://www.phamacoretraining.co.ke:81/Customers/members?memberNum=${memberno}&numberOfcustomers=1`,
        {
          method: "GET", // GET, POST, PUT, DELETE, etc.
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            setIsLoading(false);
            setUserData(data[0]);
            console.log(data);
          } else {
            // const data = await response.json();
            setIsLoading(false);
            return console.log(data);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          alert("Check your internet connection!");
          console.log(error.message);
          // ADD THIS THROW error
          throw error;
        });
    } else {
      alert("No values stored under that key.");
    }
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleDashboard();
    handleTransactions();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    handleDashboard();
    handleTransactions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <NativeBaseProvider>
        <ScrollView
          h="100%"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View flex={1} bg="coolGray.100">
            <Box p={2}>
              <VStack>
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text
                      fontWeight={"semibold"}
                      fontSize={"2xl"}
                      color={Colors.phAMACoreColor1}
                    >
                      Hi, {userData?.membername}
                    </Text>
                    <Text fontSize={"sm"}> Welcome back!</Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
            <View flex={1} px="5" py={3} justifyContent="center">
              <Box
                // minW="80"
                p="4"
                shadow={5}
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                bg={Colors.phAMACoreColor2}
                borderWidth=".5"
              >
                <Stack space={2}>
                  <Heading size="sm" color="white">
                    phAMACore Points
                  </Heading>
                </Stack>
                <Stack py={4} space={3}>
                  <Text
                    fontWeight="500"
                    space={3}
                    fontSize="6xl"
                    // color={Colors.phAMACoreColor1}
                    color="white"
                  >
                    {userData.mempOintSBAL ?? 0} pts
                  </Text>
                </Stack>
                <HStack
                  alignItems="center"
                  space={4}
                  justifyContent="space-between"
                >
                  <HStack alignItems="center">
                    <Text
                      color="white"
                      _dark={{
                        color: "warmGray.200",
                      }}
                      fontWeight="500"
                      fontSize="2xs"
                    >
                      {userData?.membername}
                    </Text>
                  </HStack>
                  <HStack alignItems="center">
                    <Text
                      color="white"
                      _dark={{
                        color: "warmGray.200",
                      }}
                      fontWeight="500"
                      fontSize="2xs"
                    >
                      {new Date().toDateString()}
                    </Text>
                  </HStack>
                </HStack>
              </Box>
              <Box
                width="100%"
                // p="3"
                mt={2}
                mb={1}
                rounded="md"
                borderWidth={0.5}
              >
                <Flex
                  direction="row"
                  p="4"
                  w={"100%"}
                  justifyContent="space-between"
                  // mt={2}
                >
                  <VStack mx={"auto"}>
                    <Text mx={"auto"} fontWeight="200">
                      Gained
                    </Text>
                    <Text
                      mx={"auto"}
                      fontWeight={"bold"}
                      color={Colors.phAMACoreColor1}
                    >
                      {userData.mempOintSBUY ?? 0} pts
                    </Text>
                  </VStack>

                  <Divider thickness="1" mx="2" orientation="vertical" />
                  <VStack mx={"auto"}>
                    <Text mx={"auto"} fontWeight="200">
                      Redeemed
                    </Text>
                    <Text mx={"auto"} fontWeight={"bold"} color={Colors.danger}>
                      {userData.mempOintSREDEEM ?? 0} pts
                    </Text>
                  </VStack>

                  <Divider thickness="1" mx="2" orientation="vertical" />
                  <VStack mx={"auto"}>
                    <Text mx={"auto"} fontWeight="200">
                      Available
                    </Text>
                    <Text
                      mx={"auto"}
                      fontWeight={"bold"}
                      color={Colors.success}
                    >
                      {userData.mempOintSBAL ?? 0} pts
                    </Text>
                  </VStack>
                </Flex>
              </Box>
            </View>
            <View flex={2} px="3">
              <Heading mt={0} mb={2} size="md">
                Transactions
              </Heading>
              <ScrollView>
                {isLoading ? (
                  <Center flex={1}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </Center>
                ) : transactions ? (
                  transactions?.map((transaction, index) => (
                    <Link
                      onPress={() =>
                        navigation.navigate("transactionDetails", {
                          docNum: transaction.DOCNUM,
                          salesBCODE: transaction.SALESBCODE,
                          branch: transaction.SALESBRANCH,
                          gain: transaction.MEMPOINTSBUY,
                          redeemed: transaction.MEMPOINTSREDEEM,
                          transdate: transaction.SALEDATE,
                        })
                      }
                      key={index}
                    >
                      <Box
                        width="100%"
                        p="3"
                        my={1}
                        rounded="md"
                        borderWidth={1}
                        bg="coolGray.100"
                        key={index}
                        // shadow={1}
                      >
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <VStack>
                            <Text
                              // color={"muted.800"}
                              color={Colors.phAMACoreColor1}
                              fontWeight="600"
                              fontSize={"sm"}
                            >
                              {transaction.DOCNUM}
                            </Text>
                            <HStack>
                              <Text color={"muted.800"} fontWeight="400">
                                {new Date(transaction.SALEDATE).toDateString()}
                              </Text>
                              <Center>
                                <Divider orientation="vertical" h={3} mx={1} />
                              </Center>

                              <Text color={"muted.800"} fontWeight="400">
                                {transaction.SALESBRANCH}
                              </Text>
                            </HStack>
                            <Text
                              // color={"muted.800"}
                              color={Colors.phAMACoreColor1}
                              fontWeight="600"
                              fontSize={"sm"}
                            >
                              Kshs.
                              {transaction.Itmtotalinc.toFixed(2)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </Text>
                            <HStack space={3}>
                              <Text
                                color="success.600"
                                fontWeight="400"
                                // style={styles.myText}
                              >
                                Earned:{" "}
                                {transaction.MEMPOINTSBUY.toString().replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )}
                              </Text>

                              <Text
                                color="danger.600"
                                fontWeight="400"
                                // style={styles.myText}
                              >
                                Redeemed:{" "}
                                {transaction.MEMPOINTSREDEEM.toString().replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )}
                              </Text>
                            </HStack>
                          </VStack>
                          <Image
                            source={require("../assets/right.png")}
                            alt="company logo"
                            // style={styles.companyLogo}
                            size="2xs"
                          />
                        </HStack>
                      </Box>
                    </Link>
                  ))
                ) : (
                  <Center flex={1}>
                    <Text>No Transactions Found</Text>
                  </Center>
                )}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </NativeBaseProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
  },
});

export default Dashboard;
