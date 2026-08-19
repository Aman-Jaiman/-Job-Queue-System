import bcrypt from "bcrypt";

import { generateToken } from "../../utils/jwt.js";
import config from "../../config/env.js";

export const loginService = async (email, password) => {
  if (!email || !password) {
    return null;
  }

  const normalizedEmail = email.toLowerCase();

  if (normalizedEmail !== config.admin.email) {
    return null;
  }

  const valid = await bcrypt.compare(password, config.admin.passwordHash);

  if (!valid) {
    return null;
  }

  return generateToken({
    email: normalizedEmail,
    role: "admin",
  });
};
