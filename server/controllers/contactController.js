const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid");

exports.sendContactMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    // 1️⃣ Cấu hình transporter với SendGrid
    const transporter = nodemailer.createTransport(
      sgTransport({
        apiKey: process.env.SENDGRID_API_KEY, // Dĩnh lấy trong SendGrid Dashboard
      })
    );

    // 2️⃣ Soạn nội dung email
    const mailOptions = {
      from: process.env.EMAIL_FROM, // email đã xác minh trong SendGrid
      to: process.env.EMAIL_USER, // nơi nhận (admin)
      subject: `[Contact Support] ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message:
        ${message}
      `,
    };

    // 3️⃣ Gửi email
    await transporter.sendMail(mailOptions);

    console.log(`✅ Contact email sent from ${email}`);

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message.",
      error: error.message,
    });
  }
};
