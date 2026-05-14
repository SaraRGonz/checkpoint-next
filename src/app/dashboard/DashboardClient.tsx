"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { EditIcon, SaveIcon, CrossIcon, ShieldCheckIcon, StarIcon, LogoIcon, TargetIcon, ActivityIcon, ClockIcon } from "@/components/ui/Icons";
import { GridIcon } from "lucide-react"; 


export function DashboardClient({ session: initialSession, stats }: any) {
    const { data: session, update } = useSession();
    const activeSession = session || initialSession;

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    
    const currentName = activeSession.user?.name || "Anonymous_Runner";
    const currentImage = activeSession.user?.image || "/placeholder.jpg";
    const currentPan = activeSession.user?.imagePosition || "50% 50%";

    const [tempName, setTempName] = useState(currentName);
    const [tempUrl, setTempUrl] = useState(currentImage);
    const [tempPos, setTempPos] = useState(currentPan);
    const [error, setError] = useState("");

    const [currentX, currentY] = tempPos.split(' ').map((v: string) => {
        const parsed = parseInt(v, 10);
        return Number.isNaN(parsed) ? 50 : parsed;
    });

    const handleSaveName = async () => {
        if (tempName.trim().length < 3) return setError("Runner ID too short.");
        await update({ ...activeSession, user: { ...activeSession.user, name: tempName.trim() } });
        setIsEditingName(false);
        setError("");
    };

    const handleDiscardName = () => {
        setTempName(currentName);
        setIsEditingName(false);
        setError("");
    };

    const handleSaveImage = async () => {
        if (tempUrl !== "/placeholder.jpg") {
            try { new URL(tempUrl); } catch { return setError("Invalid Uplink URL."); }
        }
        await update({ ...activeSession, user: { ...activeSession.user, image: tempUrl, imagePosition: tempPos } });
        setIsImageModalOpen(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
            
            {/* HEADER DE PERFIL */}
            <section className="relative bg-gray-900/60 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-10">

                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-tertiary via-primary to-accent"></div>

                <div className="relative group shrink-0">
                    <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-primary shadow-[0_0_30px_rgba(14,165,233,0.2)]">
                        <Image 
                            src={currentImage} 
                            alt="Runner Avatar"
                            fill
                            sizes="192px"
                            className="object-cover"
                            style={{ objectPosition: currentPan }}
                        />
                    </div>
                    <button 
                        onClick={() => { 
                            setError(""); 
                            setTempUrl(currentImage);
                            setTempPos(currentPan);
                            setIsImageModalOpen(true); 
                        }}
                        className="absolute -bottom-3 -right-3 bg-primary p-3 rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-all border-2 border-background z-10"
                        title="Update Neural Link Image"
                    >
                        <EditIcon className="w-5 h-5 text-black" />
                    </button>
                </div>

                <div className="flex-1 space-y-6 w-full text-center md:text-left">
                    <div className="flex flex-col w-full">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Identity Protocol</label>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                {!isEditingName ? (
                                    <div className="flex items-center justify-center md:justify-start gap-3 group">
                                        <h1 className="text-5xl font-rajdhani font-black uppercase tracking-tighter text-text truncate">
                                            {currentName}
                                        </h1>
                                        <ShieldCheckIcon className="w-6 h-6 text-secondary opacity-50 shrink-0" />
                                    </div>
                                ) : (
                                    <input 
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="text-4xl font-rajdhani font-black bg-black/40 border border-primary/40 rounded-lg px-4 py-1 
                                        text-text focus:outline-none w-full max-w-sm"
                                        autoFocus
                                    />
                                )}
                            </div>

                            <div className="flex gap-2 justify-center shrink-0">
                                {!isEditingName ? (
                                    <Button onClick={() => setIsEditingName(true)} variant="secondary" className="flex items-center gap-2">
                                        <EditIcon className="w-4 h-4" /> Edit ID
                                    </Button>
                                ) : (
                                    <>
                                        <Button onClick={handleDiscardName} variant="danger" className="flex items-center gap-2">
                                            <CrossIcon className="w-4 h-4" /> Discard
                                        </Button>
                                        <Button onClick={handleSaveName} variant="primary" className="flex items-center gap-2">
                                            <SaveIcon className="w-4 h-4" /> Save ID
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* UPLINK EMAIL */}
                    <div className="flex justify-center md:justify-start">
                        <div 
                            className="bg-primary/10 border border-primary/30 text-primary px-4 py-2.5 rounded-lg font-mono 
                            text-sm md:text-base flex items-center gap-3 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-0.5">Email //</span>
                            <span>{activeSession.user?.email || "ENCRYPTED_UPLINK"}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* INSIGHTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InsightCard 
                    label="Specialization" value={stats.topGenre} subtext="Top Genre" 
                    icon={<LogoIcon className="w-6 h-6 text-primary" />} 
                />
                <InsightCard 
                    label="Interface" value={stats.topPlatform} subtext="Top Platform" 
                    icon={<GridIcon className="w-6 h-6 text-tertiary" />} 
                />
                <InsightCard 
                    label="Affinity" value={stats.avgRating} subtext="Average Game Score" 
                    icon={<StarIcon className="w-6 h-6 text-accent" />} 
                />
                <InsightCard 
                    label="Efficiency" value={stats.completionRate} subtext="Completion Rate" 
                    icon={<TargetIcon className="w-6 h-6 text-secondary" />} 
                />
                <InsightCard 
                    label="Temporal Focus" value={stats.temporalFocus} subtext="Era Preference" 
                    icon={<ClockIcon className="w-6 h-6 text-gray-400" />} 
                />
                <InsightCard 
                    label="Active Threads" value={stats.activeThreads} subtext="Current Sessions" 
                    icon={<ActivityIcon className="w-6 h-6 text-danger" />} 
                />
            </div>

            {/* MODAL IMAGEN */}
            <Modal 
                isOpen={isImageModalOpen} 
                onClose={() => setIsImageModalOpen(false)} 
                title="OVERRIDE AVATAR"
                footerButtons={[
                    { content: 'Cancel', variant: 'danger', onClick: () => setIsImageModalOpen(false) },
                    { content: 'Sync Image', variant: 'primary', onClick: handleSaveImage }
                ]}
            >
                <div className="space-y-6">
                    
                    {/* PREVIEW */}
                    <div className="flex flex-col items-center gap-3">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Preview</label>
                        <div 
                            className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_rgba(14,165,233,0.2)] 
                            bg-gray-950">
                            <img 
                                src={tempUrl || "/placeholder.jpg"} 
                                alt="Avatar Preview" 
                                className="w-full h-full object-cover transition-all duration-300"
                                style={{ objectPosition: tempPos }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image Data URL</label>
                        <input 
                            type="text" 
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-text focus:border-primary outline-none 
                            transition-colors"
                        />
                    </div>

                    {/* SLIDERS */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-900/50 p-4 border border-gray-800 rounded-lg">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                                <span>Horizontal Pan</span>
                                <span>{currentX}%</span>
                            </label>
                            <input 
                                type="range" min="0" max="100" 
                                value={currentX}
                                onChange={(e) => setTempPos(`${e.target.value}% ${currentY}%`)}
                                className="w-full mt-2 accent-primary"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                                <span>Vertical Pan</span>
                                <span>{currentY}%</span>
                            </label>
                            <input 
                                type="range" min="0" max="100" 
                                value={currentY}
                                onChange={(e) => setTempPos(`${currentX}% ${e.target.value}%`)}
                                className="w-full mt-2 accent-primary"
                            />
                        </div>
                    </div>
                    {error && <p className="text-danger text-[10px] font-bold text-center uppercase tracking-widest">⚠️ {error}</p>}
                </div>
            </Modal>
        </div>
    );
}

// COMPONENTE AUXILIAR INSIGHT

function InsightCard({ label, value, subtext, icon }: any) {
    return (
        <div 
            className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl flex flex-col justify-between group hover:bg-gray-800/60 
            hover:border-gray-600 transition-all shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 shadow-inner group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">
                    {label}
                </span>
            </div>
            <div>
                <p className="text-3xl font-rajdhani font-black text-text uppercase tracking-wide truncate">
                    {value}
                </p>
                <p className="text-xs font-mono text-primary/60 mt-1 uppercase tracking-widest">
                    // {subtext}
                </p>
            </div>
        </div>
    );
}