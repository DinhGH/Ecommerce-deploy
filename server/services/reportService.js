const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createReportIssue = async ({
  userId,
  orderId,
  productName,
  issueType,
  description,
  imageUrl,
}) => {
  return await prisma.reportIssue.create({
    data: {
      userId,
      orderId,
      productName,
      issueType,
      description,
      imageUrl,
    },
  });
};

module.exports = { createReportIssue };
