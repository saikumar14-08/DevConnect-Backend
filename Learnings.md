# Express does NOT stop at a partially matched route. It finds the best match.

# Order matters only when using app.use(), or when two similar routes conflict in logic.

# Always define more specific routes (/hello/hi) before generic routes (/hello) when needed.

# The route url can handle regular expressions and many literals like ?,\*,+ with individual benifits.

# Advanced routing

-> app.get('/test?') => Makes the preceding character or group optional. Here group means ()
For example, /ab?cd will match both "abcd" and "acd".
-> app.get('/te+st') => Matches one or more occurrences of the preceding character or group.
For example, /ab+cd will match "abcd", "abbcd", "abbbcd", but not "acd".
-> app.get('/te*st') => Matches any string of characters (including an empty string).
For example, /ab*cd will match "abcd", "abxcd", "ab123cd", and so on.
-> Regex in routes
-> Reading query params
-> app.get('/test') with the URL http://localhost:3000/test?userId=sai&password=IloveNode and console.log(req.query) in callback gives you the complete query object like { userId: 'sai', password: 'IloveNode' }
-> app.get('/test/:userId/:password') with the URL http://localhost:3000/test/sai/loveNode and console.log(req.params) in callback gives you the complete query object like { username: 'sai', passowrd: 'loveNode' }

-> If there is no response i.e., there is no res.send in code then the url goes into infinite loop.
-> We use app.use, next for our middleware purposes. The final method which have res.send is called routerHandler.

-> What is middleware?
Ans: Functions that process requests before sending a response is called middleware.
-> How express JS handles requests behind the scenes.
Ans: Express runs middleware in order, matching routes and executing next() as needed.
-> Difference between app.use and app.all
Ans: app.use() Used for middleware that applies to all methods (GET, POST, etc.) and subroutes.
app.all() Matches all HTTP methods but only for an exact path.
-> Why error handlings should be last in the code?
-> app.use('/', (err,req,res,next) => {})
-> Learn more on error handling in express JS

-> Create a model folder and add a user.js file. Then create a new schema with fields and its type then create a model for that schema and export that model
-> In out API endpoint now create a instance of our user model and use save() to save the data to the database.

-> Why \_id and \_\_v fields in our database important? What is the use of it.
-> Always use try catch when sending the error

-> JSON vs JS vs JS object
-> /user : Get user by email.
-> /feed : get All users from database. - use mongoose.find

-> Server validations
-> API level validations.
-> Using validation library for easy checking

-> After clearing cookie value and again trying to login getting 404 error in postman. Then again without any changes saved the file again and the error in console is going away then if i try to login everything is working as expected. Getting: node:\_http_outgoing:699
throw new ERR_HTTP_HEADERS_SENT('set');
^

Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

-> For forgot password API:

-if(UserLoggedIn === true) Directly fetch the pwd and change it(You can send the new Password in req.body).

- if(UserLoggedIn === flase) Send emailId and new Pwd in body and check authenticity of our emailId and if it is valid change the password. else throw error saying emailId isn't registered.

- Pros and cons of indexing and why do we need it in first place.
- How to write queries in find() like $or, $not etc.,

- What is the use of creating references in mongoose schema. ref: "Table_name"
