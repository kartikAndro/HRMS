const Notification = require('../models/Notification');

const sendNotification = async (userId, type, message, companyId) => {
  try {
    if (!userId || !companyId) return;
    await Notification.create({
      user: userId,
      type,
      message,
      company: companyId,
    });
  } catch (error) {
    console.error('Failed to write notification to database:', error);
  }
};

module.exports = { sendNotification };
