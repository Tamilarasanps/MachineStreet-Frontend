
// // const getMechanics = async (getJsonApi,setUserDetails) => {
// //     console.log("trig")
// //     try {
// //         const response = await getJsonApi('homepage/getmechanics',"application/json",{secure:true});
// //         console.log('response :', response)
// //         if(response.status === 200) setUserDetails(response?.data)
// //     }
// //     catch (err) {
// //         throw(err)
// //     }
// // }


// const getReviews = async (getJsonApi,userId,setReviews) => {
//   try {
//     const result = await getJsonApi(`/api/getReviews/${userId}`,"application/json",{secure:true});
//     if(result?.status === 200){
//         setReviews(result.data)
//     }
//   } catch (err) {
//     throw err
//   }
// };

// const submitReviews = async () => {
//   try {
//   } catch (err) {}
// };


// export default {getMechanics,getReviews,submitReviews};