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

function Transactions({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleTransactions = async () => {
    setIsLoading(true);
    // let token = await SecureStore.getItemAsync("token");
    // let memberno = await SecureStore.getItemAsync("memberno");
    let token = await AsyncStorage.getItem("token");
    let memberno = await AsyncStorage.getItem("memberno");
    if (token || memberno) {
      //  PP000008 PPL000031
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
            setTransactions(data);
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

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleTransactions();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    handleTransactions();
  }, []);

  return (
    <NativeBaseProvider>
      <View flex={1}>
        {isLoading ? (
          <Center flex={1}>
            <ActivityIndicator size="large" color="#0000ff" />
          </Center>
        ) : Data.Transactions.length > 0 ? (
          <ScrollView
            // bg="indigo.200"
            px={3}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {Data.Transactions.map((transaction, index) => (
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
                  bg="coolGray.100"
                  borderWidth={1}
                  // shadow={2}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                      <Text
                        color={"muted.800"}
                        fontWeight="600"
                        fontSize={"sm"}
                      >
                        {transaction.DOCNUM}
                      </Text>
                      <HStack>
                        <Text
                          color={"muted.800"}
                          fontWeight="400"

                          // style={styles.myText}
                          // fontSize={'8'}
                        >
                          {new Date(transaction.SALEDATE).toDateString()}
                        </Text>
                        <Center>
                          <Divider orientation="vertical" h={3} mx={1} />
                        </Center>

                        <Text
                          color={"muted.800"}
                          fontWeight="400"

                          // style={styles.myText}
                          // fontSize={'8'}
                        >
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
            ))}
          </ScrollView>
        ) : (
          <Center flex={1}>
            <Text color="coolGray.600" fontWeight="700" fontSize="2xl">
              No Transaction History
            </Text>
          </Center>
        )}
      </View>
    </NativeBaseProvider>
  );
}

export default Transactions;
