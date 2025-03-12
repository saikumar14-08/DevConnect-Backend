# API endpoints list.

authRouter:

- post /signup
- post /login
- post /logout

profileRouter:

- get profile/view (viewing profile)
- patch /profile/edit (to update data)
- patch /profile/password (forgot password)

connectionRequestRouter:

- post /request/send/:status/:userId
  - status can be ignored or interested
- post /request/review/accepted/:requestId
- post /request/review/rejected/:requestId

userRouter:

- get /user/connections
- get /user/feed (gives you profile of users)
- get /user/requests/recevied

  Status: pass, like
