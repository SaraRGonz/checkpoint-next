'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { markTutorialAsSeenAction } from '@/actions/user.actions';
import { LogoIcon, GridIcon, GamepadIcon, HeartIcon, UserIcon, HomeIcon } from '@/components/ui/Icons';

export function TutorialModal() {
    const { data: session, update } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (session?.user && session.user.hasSeenTutorial === false) {
            setIsOpen(true);
        }
    }, [session]);

    const completeTutorial = async () => {
        setIsOpen(false);
        await markTutorialAsSeenAction();
        await update(); 
    };

    if (!isOpen) return null;

    const tutorialSteps = [
        {
            title: "SYSTEM INITIALIZED",
            icon: <LogoIcon className="w-16 h-16 text-primary animate-pulse" />,
            content: "Welcome to Checkpoint, Runner. This is your personal hub to track, manage, and analyze your gaming experiences. Let's get your neural interface calibrated."
        },
        {
            title: "HOME TERMINAL",
            icon: <HomeIcon className="w-16 h-16 text-secondary animate-pulse" />,
            content: "This is your Home Dashboard. Here you can quickly view your 3 most recently played games and the latest 3 items added to your wishlist. You'll also see general statistics about the current status of your collection."
        },
        {
            title: "LIBRARY PROTOCOL",
            icon: <GridIcon className="w-16 h-16 text-tertiary animate-pulse" />,
            content: "Search games from the global RAWG database and add them to your Library. Organize them using the Kanban board to track what you're playing, queueing, or dropping."
        },
        {
            title: "WISHLIST UPLINK",
            icon: <HeartIcon className="w-16 h-16 text-tertiary animate-pulse" />,
            content: "Keep track of the games you want to play in the future. You can add them from RAWG or manually, move them directly to your main Library with a single button click, or remove them whenever you want."
        },
        {
            title: "GAME INTEL",
            icon: <GamepadIcon className="w-16 h-16 text-secondary animate-pulse" />,
            content: "Click on any game to open its detailed page. From here, you can edit its info, give it a personal rating, or add custom notes. You can also create detailed Playthrough Logs to track different characters, servers, or separate runs."
        },
        {
            title: "MAINFRAME ACCESS",
            icon: <UserIcon className="w-16 h-16 text-primary animate-pulse" />,
            content: "Click on your profile to access your personal Dashboard. Customize your username and avatar image, and view advanced statistics and data analysis about your entire game library."
        }
    ];

    const currentStep = tutorialSteps[step];
    const isLastStep = step === tutorialSteps.length - 1;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={completeTutorial} 
            title="TUTORIAL // OVERRIDE"
            variant="cyberpunk"
        >
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-6 min-h-75 animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    {currentStep.icon}
                </div>
                
                <h3 className="text-2xl font-rajdhani font-black text-text uppercase tracking-widest">
                    {currentStep.title}
                </h3>
                
                <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
                    {currentStep.content}
                </p>

                <div className="flex gap-2 pt-4">
                    {tutorialSteps.map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'bg-primary scale-125 shadow-[0_0_8px_rgba(14,165,233,0.8)]' : 'bg-gray-700'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-primary/20 gap-4">
                <button 
                    onClick={completeTutorial}
                    className="text-[10px] uppercase font-bold tracking-widest text-gray-500 hover:text-danger transition-colors"
                >
                    [ Skip Tutorial ]
                </button>

                <div className="flex gap-3 w-full sm:w-auto">
                    {step > 0 && (
                        <Button variant="primary" onClick={() => setStep(step - 1)}>
                            ᐊ
                        </Button>
                    )}
                    
                    {isLastStep ? (
                        <Button variant="secondary" onClick={completeTutorial}>
                            Boot System
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={() => setStep(step + 1)}>
                            ᐅ
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}