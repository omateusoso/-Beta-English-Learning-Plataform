
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface UserProgress {
    completedLessons: number[]; // Array of lesson IDs (integers)
    unlockedLevels: number[];   // Array of level IDs (1, 2, 3...)
}

export const progressService = {
    // Save or toggle a lesson as completed
    async toggleLessonCompletion(userId: string, lessonId: number, isCompleted: boolean) {
        const userRef = doc(db, 'users', userId);

        try {
            await updateDoc(userRef, {
                completedLessons: isCompleted ? arrayUnion(lessonId) : arrayRemove(lessonId)
            });
        } catch (error: any) {
            // If document doesn't exist, create it (should exist from signup, but safe fallback)
            if (error.code === 'not-found') {
                await setDoc(userRef, {
                    completedLessons: [lessonId],
                    unlockedLevels: [1] // Default
                }, { merge: true });
            } else {
                // If update fails for other reasons (like field missing), use set with merge
                await setDoc(userRef, {
                    completedLessons: isCompleted ? arrayUnion(lessonId) : arrayRemove(lessonId)
                }, { merge: true });
            }
        }
    },

    // Unlock a new level
    async unlockLevel(userId: string, levelId: number) {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            unlockedLevels: arrayUnion(levelId)
        }, { merge: true });
    },

    // Get user progress
    async getUserProgress(userId: string): Promise<UserProgress> {
        const userRef = doc(db, 'users', userId);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            const data = snapshot.data();
            return {
                completedLessons: data.completedLessons || [],
                unlockedLevels: data.unlockedLevels || [1]
            };
        }

        // Default initial state
        return { completedLessons: [], unlockedLevels: [1] };
    }
};
