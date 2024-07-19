import React, { useEffect, useState } from "react";
import { StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import {
  NativeBaseProvider,
  Box,
  View,
  Stack,
  HStack,
  Heading,
  Center,
  Avatar,
  Alert,
  Text,
  VStack,
  Divider,
  Flex,
  ScrollView,
  Image,
  Link,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Data from "../data.json";

import Colors from "../config/colors";

function Dashboard({ navigation }) {
  const [userData, setUserData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // PPL000101

  const handleTransactions = async () => {
    setIsLoading(true);
    // let token = await SecureStore.getItemAsync("token");
    // let memberno = await SecureStore.getItemAsync("memberno");
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
          if (response.ok) {
            const data = await response.json();
            setIsLoading(false);
            setTransactions(data.slice(0, 5));
            console.log(data);
          } else {
            const data = await response.json();
            setIsLoading(false);
            alert(data.errors.message);
            return console.log(data);
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
    // let token = await SecureStore.getItemAsync("token");
    // let memberno = await SecureStore.getItemAsync("memberno");
    let token = await AsyncStorage.getItem("token");
    let memberno = await AsyncStorage.getItem("memberno");
    if (token && memberno) {
      return fetch(
        `http://www.phamacoretraining.co.ke:81/Customers/membersDetails?memberNum=${memberno}`,
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
          if (response.ok) {
            const data = await response.json();
            setIsLoading(false);
            setUserData(data[0]);
            console.log(data);
            handleTransactions();
          } else {
            const data = await response.json();
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
  }, []);

  return (
    <NativeBaseProvider>
      <ScrollView
        h="100%"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View flex={1} bg="coolGray.100">
          <Box px="2" py="1">
            <VStack>
              <Text fontSize={"2xs"}> Welcome back,</Text>
              <Text
                fontWeight={"semibold"}
                fontSize={"xs"}
                color={Colors.phAMACoreColor1}
              >
                {userData?.membername}
              </Text>
            </VStack>
          </Box>
          <View flex={1} p="5" justifyContent="center">
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
                  fontSize="5xl"
                  // color={Colors.phAMACoreColor2}
                  color="white"
                >
                  {userData.mempOintSBAL} pts
                </Text>
                {/* <HStack
                  alignItems="center"
                  space={4}
                  justifyContent="space-between"
                >
                  <HStack alignItems="center">
                    <Text
                      color="coolGray.600"
                      _dark={{
                        color: "warmGray.200",
                      }}
                      fontWeight="300"
                      fontSize="xs"
                    >
                      Points Details
                    </Text>
                  </HStack>
                </HStack> */}
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
                    Available
                  </Text>

                  <Text mx={"auto"} fontWeight={"bold"} color={Colors.success}>
                    {userData.mempOintSBAL} pts
                  </Text>
                </VStack>

                <Divider thickness="1" mx="2" orientation="vertical" />
                <VStack mx={"auto"}>
                  <Text mx={"auto"} fontWeight="200">
                    Gained
                  </Text>
                  <Text
                    mx={"auto"}
                    fontWeight={"bold"}
                    color={Colors.phAMACoreColor1}
                  >
                    {userData.mempOintSBUY} pts
                  </Text>
                </VStack>

                <Divider thickness="1" mx="2" orientation="vertical" />
                <VStack mx={"auto"}>
                  <Text mx={"auto"} fontWeight="200">
                    Redeemed
                  </Text>
                  <Text mx={"auto"} fontWeight={"bold"} color={Colors.danger}>
                    {userData.mempOintSREDEEM} pts
                  </Text>
                </VStack>
              </Flex>
            </Box>
          </View>
          <View flex={2} px="3">
            <Heading mt={2} mb={2} size="md">
              Transactions
            </Heading>
            <ScrollView>
              {isLoading ? (
                <Center flex={1}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </Center>
              ) : Data.Transactions ? (
                Data.Transactions?.map((transaction, index) => (
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
                            color={"muted.800"}
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
                            color={"muted.800"}
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
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                  fontWeight="500"
                  fontSize="xs"
                >
                  No Transaction History
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}

export default Dashboard;
