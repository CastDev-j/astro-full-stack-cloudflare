import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );

  const hashArray = new Uint8Array(hashBuffer);
  const combined = new Uint8Array(SALT_LENGTH + KEY_LENGTH);
  combined.set(salt, 0);
  combined.set(hashArray, SALT_LENGTH);

  return btoa(String.fromCharCode(...combined));
}

async function verifyPassword(data: {
  hash: string;
  password: string;
}): Promise<boolean> {
  const combined = new Uint8Array(
    atob(data.hash)
      .split("")
      .map((c) => c.charCodeAt(0)),
  );

  const salt = combined.slice(0, SALT_LENGTH);
  const storedHash = combined.slice(SALT_LENGTH);

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(data.password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );

  const newHash = new Uint8Array(hashBuffer);
  return newHash.every((byte, i) => byte === storedHash[i]);
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
});
