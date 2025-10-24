interface OTPData {
  otp: string;
  expiresAt: number;
}

const globalForOTP = globalThis as unknown as {
  otpMap: Map<string, OTPData> | undefined;
};

class OTPStore {
  private store: Map<string, OTPData>;

  constructor() {
    if (!globalForOTP.otpMap) {
      globalForOTP.otpMap = new Map();
    }
    this.store = globalForOTP.otpMap;
  }

  set(email: string, data: OTPData): void {
    const normalizedEmail = email.toLowerCase().trim();
    this.store.set(normalizedEmail, data);
  }

  get(email: string): OTPData | undefined {
    const normalizedEmail = email.toLowerCase().trim();
    return this.store.get(normalizedEmail);
  }

  delete(email: string): boolean {
    const normalizedEmail = email.toLowerCase().trim();
    return this.store.delete(normalizedEmail);
  }

  has(email: string): boolean {
    const normalizedEmail = email.toLowerCase().trim();
    return this.store.has(normalizedEmail);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

export const otpStore = new OTPStore();
