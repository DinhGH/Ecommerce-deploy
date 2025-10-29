const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendContactMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to: process.env.EMAIL_USER,
      subject: `[Contact Support] ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    });

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send message." });
  }
};
