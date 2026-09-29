import transporter from "../../config/mail.js";
import logger from "../../config/logger.js";
import config from "../../config/env.js";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: config.mail.from,
      to,
      subject,
      text,
      html,
    });

    logger.info(`Email sent successfully: ${info.messageId}`);

    return info;
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

export default sendEmail;
