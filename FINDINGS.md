# Express does NOT stop at a partially matched route. It finds the best match.
# Order matters only when using app.use(), or when two similar routes conflict in logic.
# Always define more specific routes (/hello/hi) before generic routes (/hello) when needed.
# The route url can handle regular expressions and many literals like ?,*,+ with individual benifits.
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

