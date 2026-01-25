
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    surname: string;
    role: UserRole;
    teacherId?: string; // ID of the teacher this student belongs to
    photoURL?: string;
}

const ADMIN_EMAILS = ['omateusosos@gmail.com'];

export const userService = {
    // Get full user profile including role
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docRef = doc(db, 'users', uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            // Hardcode admin check for specific emails
            if (ADMIN_EMAILS.includes(data.email) && data.role !== 'admin') {
                await this.updateUserRole(uid, 'admin'); // Auto-fix role
                return { ...data, role: 'admin' };
            }
            return data;
        }
        return null;
    },

    // Get all users (Admin only)
    async getAllUsers(): Promise<UserProfile[]> {
        const q = collection(db, 'users');
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
    },

    // Create new user profile
    async createUser(profile: UserProfile) {
        const docRef = doc(db, 'users', profile.uid);
        await setDoc(docRef, profile);
    },

    // Get all teachers (For student selection)
    async getTeachers(): Promise<UserProfile[]> {
        const teachersQuery = query(collection(db, 'users'), where('role', 'in', ['teacher', 'admin']));
        const snapshot = await getDocs(teachersQuery);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
    },

    // Get my students (Teacher only)
    async getMyStudents(teacherId: string): Promise<UserProfile[]> {
        const q = query(collection(db, 'users'), where('teacherId', '==', teacherId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
    },

    // Update Role (Admin only)
    async updateUserRole(targetUid: string, newRole: UserRole) {
        const docRef = doc(db, 'users', targetUid);
        await setDoc(docRef, { role: newRole }, { merge: true });
    },

    // Assign Teacher
    async assignTeacher(studentUid: string, teacherId: string) {
        const docRef = doc(db, 'users', studentUid);
        await setDoc(docRef, { teacherId }, { merge: true });
    },

    // Update Profile Data
    async updateProfile(uid: string, data: Partial<UserProfile>) {
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, data);
    }
};
