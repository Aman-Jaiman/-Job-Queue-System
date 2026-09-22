import dotenv from "dotenv";

dotenv.config();

let errors = [];
let warnings = [];

const env = process.env.NODE_ENV || "development";

console.log(`\n🔍 Checking Environment Configuration (NODE_ENV=${env})...\n`);

// Check required string variables
const checkRequired = (name) => {
  const val = process.env[name]?.trim();
  if (!val) {
    errors.push(`Missing required environment variable: ${name}`);
    return null;
  }
  return val;
};

// Check port variables
const checkPort = (name, fallback) => {
  const val = process.env[name] ?? fallback;
  const num = Number(val);
  if (!Number.isInteger(num) || num < 1 || num > 65535) {
    errors.push(`${name} must be a valid TCP port (1-65535), got: ${val}`);
  }
};

// 1. Core Server & Auth Settings
checkPort("PORT", 3000);
const jwtSecret = checkRequired("JWT_SECRET");

if (jwtSecret) {
  if (jwtSecret.includes("replace-with-a-long-random-secret")) {
    errors.push("JWT_SECRET is still set to the placeholder value!");
  } else if (env === "production" && jwtSecret.length < 32) {
    errors.push("JWT_SECRET must be at least 32 characters in production.");
  }
}

const adminEmail = checkRequired("ADMIN_EMAIL");
if (adminEmail && !adminEmail.includes("@")) {
  errors.push(`ADMIN_EMAIL does not look like a valid email address: ${adminEmail}`);
}

const adminPassword = checkRequired("ADMIN_PASSWORD");
if (adminPassword) {
  if (adminPassword.includes("replace-with-a-bcrypt-hash")) {
    errors.push("ADMIN_PASSWORD is set to placeholder value! Generate a valid bcrypt hash.");
  } else if (!adminPassword.startsWith("$2a$") && !adminPassword.startsWith("$2b$") && !adminPassword.startsWith("$2y$")) {
    warnings.push("ADMIN_PASSWORD does not match standard bcrypt hash prefix ($2a$, $2b$, or $2y$).");
  }
}

// 2. Redis Configuration
checkRequired("REDIS_HOST");
checkPort("REDIS_PORT", 6379);

// 3. SMTP Mail Configuration
checkRequired("MAIL_HOST");
checkPort("MAIL_PORT", 587);
checkRequired("MAIL_USER");
const mailPass = checkRequired("MAIL_PASS");

if (mailPass && mailPass.includes("replace-with-the-smtp-password")) {
  errors.push("MAIL_PASS is still set to the placeholder value!");
}

// 4. CORS Origins Warning in Production
if (env === "production") {
  const origins = process.env.CORS_ORIGINS?.trim();
  if (!origins) {
    warnings.push("CORS_ORIGINS is not set in production. Non-browser API callers will work, but web browsers will be restricted.");
  }
}

// Output Results
if (warnings.length > 0) {
  console.log("⚠️  Warnings:");
  warnings.forEach((w) => console.log(`   - ${w}`));
  console.log("");
}

if (errors.length > 0) {
  console.error("❌ Environment Check Failed with errors:");
  errors.forEach((e) => console.error(`   - ${e}`));
  console.log("\nPlease update your .env file or deployment secrets before proceeding.\n");
  process.exit(1);
} else {
  console.log("✅ All environment checks passed successfully!\n");
  process.exit(0);
}
