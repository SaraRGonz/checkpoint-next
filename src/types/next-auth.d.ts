import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            imagePosition?: string | null; 
            hasSeenTutorial?: boolean;
        };
    }

    interface User {
        id: string;
        hasSeenTutorial?: boolean;
    }
}