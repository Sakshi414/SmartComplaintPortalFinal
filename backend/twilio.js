const twilio = require("twilio");

const sendSMS = async (to, message) => {
  // Validate env vars first (no crash on startup)
  const sid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH;
  const fromPhone = process.env.TWILIO_PHONE;

  if (!sid || !sid.startsWith('AC') || !authToken || !fromPhone) {
    console.warn('Twilio creds incomplete - SMS skipped');
    return;
  }

  try {
    const client = twilio(sid, authToken);
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: to
    });
    console.log("SMS sent to:", to);
  } catch (err) {
    console.error("SMS ERROR:", err.message);
  }
};

module.exports = sendSMS;
