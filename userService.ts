
export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
    uid: string;
    email: string; // Not strictly needed for offline, but kept for interface compatibility
    name: string;
    surname: string;
    role: UserRole;
    teacherId?: string;
    photoURL?: string;
}

const STORAGE_KEY = 'currentUser';

export const userService = {
    // Get full user profile
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        try {
            const user = JSON.parse(stored) as UserProfile;
            // Ensure the requested UID matches the stored one (single user mode)
            if (user.uid === uid) return user;
            return null;
        } catch (e) {
            console.error("Failed to parse user profile", e);
            return null;
        }
    },

    // Get all users - In offline mode, this just returns the current user if they exist
    async getAllUsers(): Promise<UserProfile[]> {
        const user = await this.getCurrentUser();
        return user ? [user] : [];
    },

    // Helper to get the single local user without needing UID
    async getCurrentUser(): Promise<UserProfile | null> {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    // Create new user profile (Saves to local storage)
    async createUser(profile: UserProfile) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    },

    // Get all teachers - Mock response for offline
    async getTeachers(): Promise<UserProfile[]> {
        return [{
            uid: 'teacher-matthew',
            email: 'matthew@beta.com',
            name: 'Teacher',
            surname: 'Matthew',
            role: 'teacher',
            photoURL: '' // No photo, fallback logic might use initials or emoji if implemented, but App fallback was just replaced. Ideally we might want an emoji here too or handle it upstairs.
        }];
    },

    // Get my students - Mock response for offline
    async getMyStudents(teacherId: string): Promise<UserProfile[]> {
        return [];
    },

    // Update Role - No-op / Auto-save locally
    async updateUserRole(targetUid: string, newRole: UserRole) {
        const user = await this.getUserProfile(targetUid);
        if (user) {
            user.role = newRole;
            await this.createUser(user);
        }
    },

    // Assign Teacher - No-op / Auto-save locally
    async assignTeacher(studentUid: string, teacherId: string) {
        const user = await this.getUserProfile(studentUid);
        if (user) {
            user.teacherId = teacherId;
            await this.createUser(user);
        }
    },

    // Update Profile Data
    async updateProfile(uid: string, data: Partial<UserProfile>) {
        const user = await this.getUserProfile(uid);
        if (user) {
            const updated = { ...user, ...data };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    }
};
