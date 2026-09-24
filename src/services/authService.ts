import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult, 
  sendPasswordResetEmail, 
  sendEmailVerification as firebaseSendEmailVerification, 
  signOut, 
  updateProfile as firebaseUpdateProfile,
  linkWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile, UserRole } from '@/types/marketplace';

export function formatBangladeshPhone(phone: string, countryCode: string = '+880'): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+880')) return cleaned;
  if (cleaned.startsWith('880')) return `+${cleaned}`;
  if (cleaned.startsWith('01')) return `${countryCode}${cleaned.replace(/^0/, '')}`;
  if (cleaned.startsWith('1')) return `${countryCode}${cleaned}`;
  return cleaned.startsWith('+') ? cleaned : `${countryCode}${cleaned}`;
}

export async function syncUserProfile(user: User, additionalData?: Partial<UserProfile>): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data() as UserProfile;
    if (additionalData && Object.keys(additionalData).length > 0) {
      await updateDoc(userRef, {
        ...additionalData,
        updatedAt: new Date().toISOString()
      });
      return { ...data, ...additionalData };
    }
    return data;
  }

  const names = (user.displayName || '').split(' ');
  const firstName = additionalData?.firstName || names[0] || 'User';
  const lastName = additionalData?.lastName || names.slice(1).join(' ') || '';

  const newProfile: UserProfile = {
    firebaseUid: user.uid,
    email: user.email || '',
    displayName: user.displayName || `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    phone: user.phoneNumber || additionalData?.phone || '',
    role: (additionalData?.role as UserRole) || 'customer',
    status: 'active',
    emailVerified: user.emailVerified,
    phoneVerified: Boolean(user.phoneNumber),
    avatarUrl: user.photoURL || undefined,
    photoURL: user.photoURL || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...additionalData
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

export const authService = {
  async signInWithEmail(email: string, pass: string): Promise<{ user: User; profile: UserProfile }> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const profile = await syncUserProfile(cred.user);
    return { user: cred.user, profile };
  },

  async signUpWithEmail(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user: User; profile: UserProfile }> {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const displayName = `${data.firstName} ${data.lastName}`.trim();
    await firebaseUpdateProfile(cred.user, { displayName });
    
    const profile = await syncUserProfile(cred.user, {
      firstName: data.firstName,
      lastName: data.lastName,
      displayName,
      email: data.email,
      phone: formatBangladeshPhone(data.phone),
      role: data.role || 'customer'
    });

    return { user: cred.user, profile };
  },

  async signInWithGoogle(): Promise<{ user: User; profile: UserProfile }> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const profile = await syncUserProfile(cred.user);
    return { user: cred.user, profile };
  },

  setupRecaptcha(containerId: string): RecaptchaVerifier {
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible'
    });
  },

  async sendPhoneOTP(phone: string, verifier: RecaptchaVerifier): Promise<{ confirmationResult: ConfirmationResult; formattedPhone: string }> {
    const formattedPhone = formatBangladeshPhone(phone);
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    return { confirmationResult, formattedPhone };
  },

  async verifyPhoneOTP(
    confirmationResult: ConfirmationResult,
    code: string,
    metadata?: any
  ): Promise<{ user: User; profile: UserProfile }> {
    const cred = await confirmationResult.confirm(code);
    const profile = await syncUserProfile(cred.user, metadata);
    return { user: cred.user, profile };
  },

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  async sendEmailVerification(user: User): Promise<void> {
    await firebaseSendEmailVerification(user);
  },

  async reloadCurrentUser(): Promise<User | null> {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return auth.currentUser;
    }
    return null;
  },

  async linkGoogleAccount(user: User): Promise<{ user: User; profile: UserProfile }> {
    const provider = new GoogleAuthProvider();
    const cred = await linkWithPopup(user, provider);
    const profile = await syncUserProfile(cred.user);
    return { user: cred.user, profile };
  },

  async logoutUser(): Promise<void> {
    await signOut(auth);
  },

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  async getIdToken(): Promise<string | null> {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  }
};
