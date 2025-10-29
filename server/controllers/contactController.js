const nodemailer = require("nodemailer");

exports.sendContactMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    // 1️⃣ Cấu hình transporter dùng Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ví dụ: huynhdinh2k52707@gmail.com
        pass: process.env.EMAIL_PASS, // App Password (16 ký tự)
      },
    });

    // 2️⃣ Soạn nội dung email
    const mailOptions = {
      from: `"${name}" <${email}>`, // người gửi là user điền trong form
      to: process.env.EMAIL_USER, // nhận vào hộp thư admin
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
    });
  }
};
