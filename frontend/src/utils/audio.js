import { Howl, Howler } from 'howler';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Audio store with persistence
export const useAudioStore = create(
    persist(
        (set, get) => ({
            muted: false,
            volume: 0.5,
            sfxEnabled: true,

            setMuted: (muted) => {
                Howler.mute(muted);
                set({ muted });
            },

            setVolume: (volume) => {
                Howler.volume(volume);
                set({ volume });
            },

            toggleMute: () => {
                const newMuted = !get().muted;
                Howler.mute(newMuted);
                set({ muted: newMuted });
            },

            setSfxEnabled: (enabled) => set({ sfxEnabled: enabled }),
        }),
        {
            name: 'f1pedia-audio-settings',
        }
    )
);

// Preload all sounds
const sounds = {
    click: new Howl({
        src: ['/audio/click.wav'],
        volume: 0.3,
        preload: true,
    }),
    hover: new Howl({
        src: ['/audio/hover.wav'],
        volume: 0.2,
        preload: true,
    }),
    startBeep: new Howl({
        src: ['/audio/start_beep.wav'],
        volume: 0.5,
        preload: true,
    }),
    engineRev: new Howl({
        src: ['/audio/engine_rev.wav'],
        volume: 0.4,
        preload: true,
    }),
    pitClick: new Howl({
        src: ['/audio/pit_click.wav'],
        volume: 0.5,
        preload: true,
    }),
    gearShift: new Howl({
        src: ['/audio/gear_shift.wav'],
        volume: 0.4,
        preload: true,
    }),
    cheer: new Howl({
        src: ['/audio/cheer.wav'],
        volume: 0.3,
        preload: true,
    }),
};

// Sound effect player functions
export const sfx = {
    click: () => {
        const { muted, sfxEnabled } = useAudioStore.getState();
        if (!muted && sfxEnabled) sounds.click.play();
    },

    hover: () => {
        const { muted, sfxEnabled } = useAudioStore.getState();
        if (!muted && sfxEnabled) sounds.hover.play();
    },

    startBeep: () => {
        const { muted, sfxEnabled } = useAudioStore.getState();
        if (!muted && sfxEnabled) sounds.startBeep.play();
    },

    engineRev: () => {
        const { muted, sfxEnabled } = useAudioStore.getState();
        if (!muted && sfxEnabled) sounds.engineRev.play();
    },

    pitClick: () => {
        const { muted, sfxEnabled } = useAudioStore.getState();
        if (!muted && sfxEnabled) sounds.pitClick.play();
    },

    gearShift: () => {
        const { muted, sfxEnabled } = useAudioStore.getState();
        if (!muted && sfxEnabled) sounds.gearShift.play();
    },

    cheer: () => {
        const { muted, sfxEnabled } = useAudioStore.getState();
        if (!muted && sfxEnabled) sounds.cheer.play();
    },
};

// Initialize volume from stored settings
const initializeAudio = () => {
    const { volume, muted } = useAudioStore.getState();
    Howler.volume(volume);
    Howler.mute(muted);
};

// Call on app start
if (typeof window !== 'undefined') {
    initializeAudio();
}

export default sfx;
