#DevTinder 

## authRouter
POST /signup
POST /login
POST /logout

## profileRouter
GET /profile/view....//to get my profile details
PATCH /profile/edit
PATCH /profile/password .....updating the password

whenever we see any profile we can ignore it (left swipe) and tinder calls it pass and we can also right swipe (interested) and tinder calls it like

status: we can ignore or interested and the person on the other side can also accept or reject after we right swipe

based on the above below are the API contracts.

sending-side APIs-

## connectionRequestRouter

POST /request/send/interested/:userId
POST /request/send/ignored/:userId
receiving-side APIs
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

APIs for all the matches:

## userRouter
GET /user/connections
GET /user/requests/
GET /user/feed gets the profile of other users on tothe platform