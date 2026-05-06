import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            <h1 className="text-4xl font-rajdhani font-bold text-accent">
                Dashboard
            </h1>

            <div className="p-8 border rounded-lg bg-card border-border shadow-md text-center flex flex-col items-center gap-4">
                {session.user?.image && (
                    <img
                        src={session.user.image}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-2 border-accent"
                    />
                )}
                <div>
                    <h2 className="text-2xl font-semibold text-text">{session.user?.name}</h2>
                    <p className="text-text/70">{session.user?.email}</p>
                </div>
            </div>
        </div>
    );
}