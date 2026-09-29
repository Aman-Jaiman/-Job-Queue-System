import crypto from "crypto";

const requestId = (req, res, next) => {
  const suppliedId = req.headers["x-request-id"];

  // Request IDs appear in logs, so only accept a compact, header-safe value
  // from clients instead of reflecting arbitrary untrusted input.
  const id =
    typeof suppliedId === "string" && /^[A-Za-z0-9._-]{1,128}$/.test(suppliedId)
      ? suppliedId
      : crypto.randomUUID();

  req.requestId = id;

  res.setHeader("X-Request-ID", id);

  next();
};

export default requestId;
