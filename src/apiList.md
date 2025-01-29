npm init and what happens after it
why not http and we use express to create server
how to setup server using express
node_modules,package.json,package-lock.json
tilde and carot
request handler function
server, port
app.use
git initialization, adding files to git, committing the files, setting up remote repo, connection of local to remote repo, pushing the committed code from local to remote
order of routes matters. play with diff routes using app.use middleware

install postman, create workspace,collection and try making calls using http methods. try with use,get,post,delete and patch and test in all scenarios.

explore advances routing techniques like using ?,\* and regex in url path and also learn diff between req.params and req.query.

try using multiple RHFs in app.use and also use next() in dufferent places and check the responses in client-side. try putting next() before res.send and observe the output.

middlewares and RHF and how expreejs handles requests behind the scenes i.e; sequence of execution.

implement authentication using app.use.

app.use vs app.all

create dummy authorization middlewares

errror handling and also try app.use with err parameter and without and change the position of app.use and check - interesting.

//this mongoose.connect returns promise saying whether our app is connected to cluster successfully or not.
//this link mongodb+srv://tejapintu4:0ZRw7tpNjrwcP0fS@namastenode.nr7lh.mongodb.net/ is connection to cluster link and this following link mongodb+srv://tejapintu4:0ZRw7tpNjrwcP0fS@namastenode.nr7lh.mongodb.net/devTinder is connection to database devTinder inside cluster link

create cluster and database inside it and then connect our node application with the Atlas mongodb using the mongoose driver . mongoose driver is an npm library. make sure database is connected first before server is listening to requests at port 3000.

A **model** in frameworks like **Mongoose** (for MongoDB) is a tool that ensures CRUD operations on a collection follow the rules defined in its respective **schema**. The schema defines the structure, data types, validation, and constraints, and the model applies these rules when interacting with the database.

create a "/signup"  route and try to post any userdata into the database using post http method, learn how to create a new user model object and insert data into it and saving it into the database.

use of express.json => takes the body from the request which is in the json format and converts it into jsobject and puts this back in to the request body.

find out how find() and findOne() works with duplicate entries.

build /user and /feed routes

create the delete API . before deleting try to find whether the user is even present inthe database . if present, then only delete.

PUT - replaces entire resourses with the new data we sent. If you use PUT, you must send all the data for the resource, even if you're just updating one field. Any missing fields will be removed or replaced with default values.
Example: If you update a user's email using PUT, you need to send the full user object (like their name, email, and password), not just the email.

PATCH - Partially updates the resource. It modifies only the fields you specify, leaving the rest of the resource unchanged.
Use PATCH when you want to update just one or a few fields without affecting the entire resource.
Example: If you want to update just the user's email, you can send only the email field with PATCH, and the rest of the user's data stays the same.

Explore schema type options and add validate functions, timestamps......etc to the user schema.

API level validations on post and patch APIs for each field.

Use of validator , an npm package to check validations bcoz we cant trust the details sent by the users.

validate data in signup API.
install bcrypt packags from npm and create a passwordHash using bcrypt.hash() and save the user with encrypted password i.e; req.body.assword = passwordHash.

to read cookies we use cookieParser middleware. study about it.

install jsonwebtoken from npm and do jwt.sign() in login API to create jwt token and then put this token into cookie using res.cookie() and then do jwt.verify() in \profile API to verify the token.

why we write userAuth middleware and set expiration for token aswell as cookie.

Create userSchema methods to get jwt and comparePassword

#DevTinder 

## authRouter
POST /signup ✅
POST /login ✅
POST /logout ✅

## profileRouter
GET /profile/view....//to get my profile details ✅
PATCH /profile/edit ✅
PATCH /profile/password .....updating the password

whenever we see any profile we can ignore it (left swipe) and tinder calls it pass and we can also right swipe (interested) and tinder calls it like

status: we can ignore or interested and the person on the other side can also accept or reject after we right swipe

based on the above below are the API contracts.

sending-side APIs-

## connectionRequestRouter

POST /request/send/interested/:userId
POST /request/send/ignored/:userId

POST /request/send/:status/:toUserId ✅

receiving-side APIs
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

POST /request/review/:status/:requestId ✅

APIs for all the matches:

## userRouter
GET /user/connections ✅
GET /user/requests ✅
GET /user/feed gets the profile of other users on tothe platform ✅