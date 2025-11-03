import twilio from "twilio";

interface sendSMSProps {
  partnerMobile: string;
  message: string;
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async ({ partnerMobile, message }: sendSMSProps) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: partnerMobile,
    });
    console.log("✅ SMS sent:", result.sid);
  } catch (error) {
    console.error("❌ SMS failed:", error);
  }
};
