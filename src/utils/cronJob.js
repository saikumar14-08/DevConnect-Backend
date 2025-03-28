const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionrequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/user");

cron.schedule("45 8 * * *", async () => {
  // const yesterday = subDays(new Date(), 1);
  // const yesterdayStart = startOfDay(yesterday);
  // const yesterdayEnd = endOfDay(yesterday);
  /**Debug the date issue here */
  const yesterday = subDays(new Date(), 1);
  const yesterdayStart = new Date(
    Date.UTC(
      yesterday.getUTCFullYear(),
      yesterday.getUTCMonth(),
      yesterday.getUTCDate(),
      0,
      0,
      0
    )
  );
  const yesterdayEnd = new Date(
    Date.UTC(
      yesterday.getUTCFullYear(),
      yesterday.getUTCMonth(),
      yesterday.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
  const usersInConnReq = await ConnectionRequest.find({
    status: "interested",
    createdAt: {
      $gte: yesterdayStart,
      $lt: yesterdayEnd,
    },
  });

  let users = [];
  for (let usr of usersInConnReq) {
    const user = await User.findById(usr.toUserId);
    if (user) {
      users.push(user);
    }
  }

  const emailsList = [
    ...new Set(
      users.map((user) => {
        return user.emailId;
      })
    ),
  ];

  for (let email of emailsList) {
    try {
      const emailBody = `New friend requests pending from ${email}`;
      const res = await sendEmail.run(email, emailBody);
    } catch (e) {
      console.log(e.message);
    }
  }
});

module.exports = cron;
