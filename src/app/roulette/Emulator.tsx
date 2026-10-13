"use client";

import {useEffect, useRef, useState, useCallback} from "react";
import {Nostalgist} from "nostalgist";

interface EmulatorProps {
    isOpen: boolean;
    onClose: () => void;
    startElement?: React.ReactNode;
    startPos?: DOMRect;
}

const Emulator = ({isOpen, onClose}: EmulatorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nostalgistRef = useRef<Nostalgist | null>(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Configure Nostalgist once
    useEffect(() => {
        Nostalgist.configure({
            resolveRom: (file: string) => `/roms/${file}`,
        });
        return () => {
            Nostalgist.resetToDefault();
        };
    }, []);

    const cleanup = useCallback(() => {
        if (nostalgistRef.current) {
            try {
                nostalgistRef.current.exit({removeCanvas: false});
            } catch (e) {
                console.error("Error exiting emulator:", e);
            }
            nostalgistRef.current = null;
        }
    }, []);

    const handleClose = useCallback(() => {
        setShowExitConfirm(false);
        cleanup();
        onClose();
    }, [cleanup, onClose]);

    const handleConfirmClose = () => {
        handleClose();
    };

    const handleCancelClose = () => {
        nostalgistRef.current?.resume();
        setShowExitConfirm(false);
    };

    // Handle ESC key press (only when emulator is open)
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                setShowExitConfirm(true);
                nostalgistRef.current?.pause()
            }
        };

        document.addEventListener("keydown", handleKeyDown, true);
        return () => {
            document.removeEventListener("keydown", handleKeyDown, true);
        };
    }, [isOpen]);

    // Launch emulator on mount / when opened
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;

        const launchEmulator = async () => {
            try {
                const nostalgistInstance = await Nostalgist.launch({
                    element: canvasRef.current || "",
                    core: "fceumm",
                    rom: "Chip 'n Dale - Rescue Rangers 2 (USA).zip",
                    retroarchConfig: {
                        input_player1_up: 'w',
                        input_player1_down: 's',
                        input_player1_left: 'a',
                        input_player1_right: 'd',
                        input_player1_b: 'n',
                        input_player1_a: 'm',
                        input_player1_y: 'h',
                        input_player1_x: 'j',
                        input_player1_start: 'space',
                        input_player1_select: 'c',
                    }
                });

                if (isMounted) {
                    nostalgistRef.current = nostalgistInstance;
                    setLoading(false);
                }
            } catch (e: unknown) {
                if (isMounted) {
                    const message = e instanceof Error ? e.message : "Failed to launch emulator";
                    setError(message);
                    setLoading(false);
                }
            }
        };

        launchEmulator();

        return () => {
            isMounted = false;
            cleanup();
        };
    }, [isOpen, cleanup]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center">
                        <div
                            className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"/>
                        <p className="text-white text-xl">Loading Emulator...</p>
                    </div>
                </div>
            )}
            {error && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center p-8 bg-gray-900 rounded-lg max-w-md">
                        <h2 className="text-xl font-bold text-red-500 mb-4">Error</h2>
                        <p className="text-gray-300 mb-6">{error}</p>
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showExitConfirm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-8 max-w-sm mx-4">
                    <h2 className="text-xl font-bold text-white mb-4">Exit Emulator?</h2>
                    <p className="text-gray-300 mb-6">
                        Are you sure you want to close the emulator?
                    </p>
                    <div className="flex gap-4 justify-end">
                        <button
                            onClick={handleCancelClose}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmClose}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </div>
            )}

            <canvas ref={canvasRef} className="w-full h-full"/>
        </div>
    );
};

export default Emulator;