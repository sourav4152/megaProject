const cron = require("node-cron")
const User = require("../models/user");
const Profile = require("../models/profile");

cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    const usersToDelete = await User.find({
      deletionScheduledAt: { $lte: now }
    });

    for (const user of usersToDelete) {
      await Profile.findByIdAndDelete(user.additionalDetails);
      await User.findByIdAndDelete(user._id);
      console.log(`[Cron] Deleted user: ${user.email}`);
    }

  } catch (error) {
    console.error("[Cron Error] Failed to delete users:", error);
  }
});