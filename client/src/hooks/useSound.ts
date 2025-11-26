import { useCallback, useEffect } from 'react';

// Singleton state to avoid multiple AudioContexts
let globalAudioContext: AudioContext | null = null;
let hasInteracted = false;

export const useSound = () => {
    const initAudio = useCallback(() => {
        // Strictly block creation until interaction
        if (!hasInteracted) return null;

        if (!globalAudioContext) {
            globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return globalAudioContext;
    }, []);

    useEffect(() => {
        const handleInteraction = () => {
            hasInteracted = true;
            const ctx = initAudio();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume().catch(() => { });
            }
        };

        // Only add listeners if we haven't interacted yet
        if (!hasInteracted) {
            window.addEventListener('click', handleInteraction, { once: true });
            window.addEventListener('keydown', handleInteraction, { once: true });
            window.addEventListener('touchstart', handleInteraction, { once: true });
        }

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        };
    }, [initAudio]);

    const playHover = useCallback(() => {
        const ctx = initAudio();
        if (!ctx || ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // High pitch, short tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.05, ctx.currentTime); // Low volume
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    }, [initAudio]);

    const playClick = useCallback(() => {
        const ctx = initAudio();
        if (!ctx || ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Punchier blip
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }, [initAudio]);

    const playShockwave = useCallback(() => {
        const ctx = initAudio();
        if (!ctx || ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Deep, low frequency pulse
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }, [initAudio]);

    return { playHover, playClick, playShockwave };
};
