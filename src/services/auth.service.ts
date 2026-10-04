import { demoRepository, readDemoDB, transactDemoDB, nextDemoId, requireDemoUser, SESSION_KEY } from '../lib/demoRepository';

export const AuthService = {
  async register(payload: { name: string; email: string; password: string; phone?: string }) {
    const email = payload.email.trim().toLowerCase();
    if (!payload.name.trim() || !/^\S+@\S+\.\S+$/.test(email) || payload.password.length < 6) throw new Error('Invalid account');
    return transactDemoDB(db => {
      if (db.customers.some(c => c.email === email)) throw new Error('Email already registered');
      const user = { id: String(nextDemoId(db)), name: payload.name.trim(), email, phone: payload.phone, role: 'customer' as const, kycStatus: 'unverified' as const };
      db.customers.push({ ...user, password: payload.password }); db.points[user.id] = 50000;
      db.ledger.push({ id: nextDemoId(db), userId: user.id, idempotencyKey: `register-${user.id}`, type: 'credit', amount: 50000, balanceAfter: 50000, referenceType: 'registration', referenceId: user.id, description: 'Demo registration reward', createdAt: new Date().toISOString() });
      return user;
    });
  },
  async login(email: string, password: string) {
    const user = readDemoDB().customers.find(c => c.email === email.trim().toLowerCase() && c.password === password);
    if (!user) throw new Error('Invalid credentials');
    const { password: secret, ...publicUser } = user; void secret;
    const result = { user: publicUser, accessToken: `demo-${user.id}`, refreshToken: `demo-refresh-${user.id}` };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(result)); return result;
  },
  logout() { sessionStorage.removeItem(SESSION_KEY); },
  async getMe() { const u = requireDemoUser(); const { password: secret, ...user } = readDemoDB().customers.find(c => c.id === u.id)!; void secret; return user; },
  async submitKyc(payload: { nik: string; name: string; dateOfBirth: string; address: string; ktpImageUrl: string; selfieImageUrl: string }) {
    const u = requireDemoUser('customer');
    if (!/^\d{16}$/.test(payload.nik) || !payload.name.trim() || !payload.address.trim() || !payload.ktpImageUrl || !payload.selfieImageUrl || !Number.isFinite(Date.parse(payload.dateOfBirth))) throw new Error('Invalid KYC');
    await transactDemoDB(db => { const customer = db.customers.find(c => c.id === u.id)!; if (customer.kycStatus === 'verified' || customer.kycStatus === 'pending') throw new Error('KYC already submitted'); customer.kycStatus = 'pending'; db.kyc = db.kyc.filter(k => String(k.userId) !== u.id); db.kyc.push({ ...payload, userId: Number(u.id), status: 'pending', submittedAt: new Date().toISOString() }); });
    return this.getMe();
  },
  session: demoRepository.session
};
export const authService = AuthService;
