import transporter from "../../config/mail.js";
import logger from "../../config/logger.js";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Job Queue System" <no-reply@jobqueue.dev>',
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
