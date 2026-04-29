export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
                {[1, 2, 3].map((col) => (
                    <section key={col} className="flex flex-col gap-6">
                        <div className="h-8 w-32 bg-gray-800 rounded mx-auto animate-pulse"></div>
                        <div className="flex flex-col gap-4 border border-gray-800 rounded-3xl p-6 bg-gray-900/20">
                            <div className="h-40 bg-gray-800 rounded-2xl animate-pulse"></div>
                            <div className="h-40 bg-gray-800 rounded-2xl animate-pulse"></div>
                            <div className="h-40 bg-gray-800 rounded-2xl animate-pulse"></div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}