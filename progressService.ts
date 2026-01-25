
export interface UserProgress {
    completedLessons: number[]; // Array of lesson IDs (integers)
    unlockedLevels: number[];   // Array of level IDs (1, 2, 3...)
}

const STORAGE_KEY = 'currentUser';

export const progressService = {
    // Helper to get current stored data
    _getAllData(): any {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    },

    // Save or toggle a lesson as completed
    async toggleLessonCompletion(userId: string, lessonId: number, isCompleted: boolean) {
        // userId arg is unused in single-user local mode, but kept for signature compatibility
        const data = this._getAllData();
        const currentCompleted = data.completedLessons || [];

        let newCompleted;
        if (isCompleted) {
            newCompleted = [...new Set([...currentCompleted, lessonId])];
        } else {
            newCompleted = currentCompleted.filter((id: number) => id !== lessonId);
        }

        const updatedData = {
            ...data,
            completedLessons: newCompleted,
            unlockedLevels: data.unlockedLevels || [1] // Ensure this exists
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    },

    // Unlock a new level
    async unlockLevel(userId: string, levelId: number) {
        const data = this._getAllData();
        const currentLevels = data.unlockedLevels || [1];

        if (!currentLevels.includes(levelId)) {
            const updatedData = {
                ...data,
                unlockedLevels: [...currentLevels, levelId]
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        }
    },

    // Get user progress
    async getUserProgress(userId: string): Promise<UserProgress> {
        const data = this._getAllData();
        return {
            completedLessons: data.completedLessons || [],
            unlockedLevels: data.unlockedLevels || [1]
        };
    }
};
