// import {
//   NativeBaseProvider,
//   Box,
//   VStack,
//   Input,
//   Button,
//   Avatar,
//   Center,
//   Heading,
//   Divider,
//   FormControl,
// } from "native-base";
// import { useEffect, useState } from "react";
// import colors from "../config/colors";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function Redeem({ route, navigation }) {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [userName, setUserName] = useState("");

//   // Member points data state
//   const [memberPointsData, setMemberPointsData] = useState({
//     mempOintSBAL: 0, // Total available points
//     mempOintSBUY: 0, // Points gained today
//     mempOintSREDEEM: 0, // Points to redeem
//   });

//   const fetchName = async () => {
//     try {
//       let fullUserName = await AsyncStorage.getItem("fullusername");
//       if (fullUserName) {
//         setUserName(fullUserName); // Set actual username
//       } else {
//         setUserName(""); // If no name found, set empty string
//         alert("No values stored under the key.");
//       }
//     } catch (error) {
//       console.error("Failed to fetch username from AsyncStorage", error);
//       setError(error);
//     }
//   };

//   // Function to fetch the points gained today and update memberPointsData
//   const fetchMemberPoints = async () => {
//     let token = await AsyncStorage.getItem("token");
//     try {
//       const response = await fetch(
//         "http://www.phamacoretraining.co.ke:81/CustomerPoints/GetCustomerTransactions",
//         {
//           method: "GET", // GET, POST, PUT, DELETE, etc.
//           headers: {
//             Accept: "*/*",
//             "Content-Type": "application/json; charset=utf-8",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Check if the response is ok (status code 200-299)
//       if (!response.ok) {
//         console.error("Error fetching transactions: ", response.status);
//         setError("Failed to fetch transactions.");
//         return;
//       }

//       const responseText = await response.text(); // Get the response as text first

//       if (responseText) {
//         try {
//           const transactions = JSON.parse(responseText); // Now try to parse it as JSON

//           // Get today's date in 'YYYY-MM-DD' format
//           const today = new Date().toISOString().split("T")[0];

//           // Filter today's transactions
//           const todayTransactions = transactions.filter(
//             (transaction) => transaction.SALEDATE.split("T")[0] === today
//           );

//           // Sum the MEMPOINTSBUY (gained points) for today's transactions
//           const totalGainedPoints = todayTransactions.reduce(
//             (sum, transaction) => sum + (transaction.MEMPOINTSBUY || 0),
//             0
//           );

//           // Calculate total available balance: current balance minus any redeemed points
//           const totalBalance =
//             totalGainedPoints - memberPointsData.mempOintSREDEEM;

//           // Update the member points state
//           setMemberPointsData((prevData) => ({
//             ...prevData,
//             mempOintSBUY: totalGainedPoints, // Points earned today
//             mempOintSBAL: totalBalance >= 0 ? totalBalance : 0, // Points balance, ensuring it's not negative
//           }));
//         } catch (jsonError) {
//           console.error("Error parsing JSON response: ", jsonError);
//           setError("Invalid JSON format in response.");
//         }
//       } else {
//         console.error("Empty response from server");
//         setError("Empty response from server.");
//       }
//     } catch (err) {
//       console.error("Error fetching transactions: ", err);
//       setError("Error fetching transactions.");
//     }
//   };

//   const handleRedeem = () => {
//     if (memberPointsData.mempOintSREDEEM > memberPointsData.mempOintSBAL) {
//       setError("Points to redeem cannot exceed total points available.");
//       return;
//     }

//     // Update the points balance after redemption
//     const newBalance =
//       memberPointsData.mempOintSBAL - memberPointsData.mempOintSREDEEM;

//     setMemberPointsData((prevData) => ({
//       ...prevData,
//       mempOintSBAL: newBalance >= 0 ? newBalance : 0, // Ensure balance doesn't go negative
//     }));

//     // API Logic to submit redeemed points (not implemented here)
//     alert(
//       `Redeemed ${memberPointsData.mempOintSREDEEM} points! You have ${newBalance} points left.`
//     );
//     navigation.goBack();
//   };

//   useEffect(() => {
//     fetchName();
//     fetchMemberPoints(); // Fetch points when the page loads
//   }, []);

//   return (
//     <NativeBaseProvider>
//       <Center flex={1} px={10} bgColor={"white"}>
//         <Avatar bg="blueGray.600" size="xl">
//           {userName ? userName.match(/\b([A-Z])/g).join("") : "?"}
//         </Avatar>
//         <Heading
//           size="lg"
//           fontWeight="900"
//           mt={2}
//           mb={10}
//           color={colors.phAMACoreColor2}
//           _dark={{
//             color: "warmGray.50",
//           }}
//         >
//           {userName || "User"}
//         </Heading>
//         <Divider mb={2} bgColor={"black"} />
//         <Box w={"100%"} maxW={"400px"}>
//           <Heading
//             size="lg"
//             fontWeight="700"
//             color="coolGray.800"
//             _dark={{
//               color: "warmGray.50",
//             }}
//           >
//             Redeem Points
//           </Heading>
//           <Heading
//             mt="1"
//             _dark={{
//               color: "warmGray.200",
//             }}
//             color="coolGray.600"
//             fontWeight="medium"
//             size="xs"
//           >
//             Enter points to be redeemed below.
//           </Heading>
//           <VStack space={4} mt={3}>
//             <FormControl>
//               <FormControl.Label>OTP</FormControl.Label>
//               <Input
//                 placeholder=""
//                 _input={{ color: "black", placeholderTextColor: "black" }}
//                 value={otp}
//                 onChangeText={(value) => setOtp(value)}
//                 keyboardType="numeric"
//                 size={20}
//               />
//             </FormControl>

//             <FormControl>
//               <FormControl.Label>Available Points</FormControl.Label>
//               <Input
//                 isReadOnly
//                 _input={{ color: "black", placeholderTextColor: "black" }}
//                 placeholder=""
//                 size={20}
//                 keyboardType="numeric"
//                 value={memberPointsData.mempOintSBAL.toString()} // Display total balance
//               />
//             </FormControl>

//             <FormControl>
//               <FormControl.Label>Points to Redeem</FormControl.Label>
//               <Input
//                 placeholder=""
//                 _input={{ color: "black", placeholderTextColor: "black" }}
//                 keyboardType="numeric"
//                 value={memberPointsData.mempOintSREDEEM.toString()}
//                 onChangeText={(value) =>
//                   setMemberPointsData((prevData) => ({
//                     ...prevData,
//                     mempOintSREDEEM: parseInt(value) || 0, // Ensure it's a number
//                   }))
//                 }
//                 size={20}
//               />
//             </FormControl>

//             <FormControl>
//               <FormControl.Label>Points Gained Today</FormControl.Label>
//               <Input
//                 isReadOnly
//                 placeholder=""
//                 _input={{ color: "black", placeholderTextColor: "black" }}
//                 keyboardType="numeric"
//                 value={memberPointsData.mempOintSBUY.toString()} // Display points gained today
//                 size={20}
//               />
//             </FormControl>

//             <Button
//               onPress={handleRedeem}
//               backgroundColor={colors.phAMACoreColor2}
//             >
//               Submit
//             </Button>
//           </VStack>
//         </Box>
//       </Center>
//     </NativeBaseProvider>
//   );
// }
