import { CartItem } from "@/modules/checkout/view/checkout-view";
import nodemailer from "nodemailer";

interface SendOrderEmailProps {
  partnerEmail: string;
  orderId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  formattedTime: string;
  itemSummary: string;
}

export const sendOrderEmail = async ({
  partnerEmail,
  orderId,
  itemSummary,
  totalAmount,
  paymentMethod,
  formattedTime,
}: SendOrderEmailProps) => {
  const emailText = `🍴 New Order Received!

Hello {{restaurantName}} Team,

You’ve received a new order on Foody!

Order Details:
🆔 Order ID: {${orderId}}
🧾 Items: {${itemSummary}}
💰 Total Amount: ₹{${totalAmount}}
💳 Payment Method: {${paymentMethod}}
🕒 Placed At: {${formattedTime}}

Please start preparing the order and ensure timely delivery.

Thank you for partnering with Foody!
Best,
The Foody Team
`;
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: process.env.MAILTRAP_USER!,
        pass: process.env.MAILTRAP_PASS!,
      },
    });

    await transporter.sendMail({
      from: "orders@foody.app",
      to: partnerEmail,
      subject: `New Order #${orderId}`,
      html: emailText,
    });

    console.log("✅ Order email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending order email:", error);
  }
};
