// Only for important changes made

//  issue : user is logged out when refresh
// we have taken userId in authUser and userController from req.user





// changes made in adressCOntroller: (for// address validation failed: userId: Path `userId` is required.)
    // const { userId } = req.body;  changed to const { id: userId } = req.user
    //also used const { id: userId } = req.user; instead of userId = req.body


// changes in cartController : added   code for amount son that we can get total count our database

//change made in orderControler => getUserOrders +=->used const { id: userId } = req.user; instead of userId = req.body



// Changes in placeOrderStripe()   usd changed to INR



// ===================DEPLOYMENT===================
// Deployed succesfull every route is working refresh error is gone but online payment is not veryfing