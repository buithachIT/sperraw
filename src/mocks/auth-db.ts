import { RESERVED_EMAILS } from "@/consts/auth";

export type Account = {
  id: string;
  fullName: string;
  email: string;
};

const reservedEmails = new Set(
  RESERVED_EMAILS.map((email) => email.toLowerCase())
);
const accountsByEmail = new Map<string, Account>();

let currentSession: Account | null = null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function isEmailTaken(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return reservedEmails.has(normalized) || accountsByEmail.has(normalized);
}

export type CreateAccountInput = {
  fullName?: string;
  email?: string;
  password?: string;
};

export type CreateAccountResult =
  | { ok: true; user: Account }
  | { ok: false; status: 400 | 409; message: string };

export function tryCreateAccount(
  input: CreateAccountInput
): CreateAccountResult {
  const fullName = input.fullName?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";
  const password = input.password ?? "";

  if (
    fullName.length < 2 ||
    fullName.length > 80 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return { ok: false, status: 400, message: "Invalid account payload" };
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return {
      ok: false,
      status: 400,
      message:
        "Password must be at least 8 characters and include a letter and a number",
    };
  }

  if (isEmailTaken(email)) {
    return {
      ok: false,
      status: 409,
      message: "This email is already registered",
    };
  }

  return { ok: true, user: createAccountRecord(fullName, email) };
}

export function createAccountRecord(fullName: string, email: string): Account {
  const account: Account = {
    id: crypto.randomUUID(),
    fullName,
    email: email.trim().toLowerCase(),
  };
  accountsByEmail.set(account.email, account);
  currentSession = account;
  return account;
}

export function logoutSession() {
  if (currentSession) {
    currentSession = null;
  }
}

export function getCurrentSession(): Account | null {
  return currentSession;
}

export function restoreSession(account: Account) {
  accountsByEmail.set(account.email, account);
  currentSession = account;
}
