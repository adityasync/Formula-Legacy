"""
F1 Racing SFX Generator
Generates realistic F1 racing sound effects using synthesis
"""
import numpy as np
from scipy.io import wavfile
import os

OUTPUT_DIR = "../frontend/public/audio"
SAMPLE_RATE = 44100

def ensure_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def normalize(audio):
    """Normalize audio to prevent clipping"""
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val * 0.9
    return (audio * 32767).astype(np.int16)

def save_wav(filename, audio):
    """Save audio as WAV file"""
    filepath = os.path.join(OUTPUT_DIR, filename)
    wavfile.write(filepath, SAMPLE_RATE, normalize(audio))
    print(f"Created: {filepath}")

def generate_start_beep():
    """F1 start light beep - 5 beeps then silence"""
    duration_per_beep = 0.3
    silence = 0.7
    frequency = 800
    
    audio = np.array([], dtype=np.float64)
    
    for i in range(5):
        t = np.linspace(0, duration_per_beep, int(SAMPLE_RATE * duration_per_beep))
        beep = np.sin(2 * np.pi * frequency * t)
        # Fade in/out
        envelope = np.ones_like(t)
        fade_len = int(0.02 * SAMPLE_RATE)
        envelope[:fade_len] = np.linspace(0, 1, fade_len)
        envelope[-fade_len:] = np.linspace(1, 0, fade_len)
        beep *= envelope * 0.7
        
        silence_samples = np.zeros(int(SAMPLE_RATE * silence))
        audio = np.concatenate([audio, beep, silence_samples])
    
    save_wav("start_beep.wav", audio)

def generate_engine_rev():
    """Short engine rev sound"""
    duration = 1.5
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration))
    
    # Base frequencies for V6 turbo hybrid
    base_freq = 300
    
    # Frequency sweep (rev up then down)
    freq_envelope = base_freq + 400 * np.sin(np.pi * t / duration) ** 2
    
    # Generate harmonics
    audio = np.zeros_like(t)
    for harmonic in [1, 2, 3, 4, 6, 8]:
        phase = np.cumsum(2 * np.pi * freq_envelope * harmonic / SAMPLE_RATE)
        audio += np.sin(phase) / harmonic
    
    # Add some noise for realistic engine texture
    noise = np.random.randn(len(t)) * 0.1
    audio += noise
    
    # Amplitude envelope
    envelope = np.ones_like(t)
    fade_in = int(0.1 * SAMPLE_RATE)
    fade_out = int(0.3 * SAMPLE_RATE)
    envelope[:fade_in] = np.linspace(0, 1, fade_in)
    envelope[-fade_out:] = np.linspace(1, 0, fade_out)
    audio *= envelope * 0.6
    
    save_wav("engine_rev.wav", audio)

def generate_pit_click():
    """Wheel gun click sound"""
    duration = 0.15
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration))
    
    # Sharp click with metallic ring
    click = np.exp(-t * 50) * np.sin(2 * np.pi * 2000 * t)
    ring = np.exp(-t * 20) * np.sin(2 * np.pi * 800 * t) * 0.5
    
    audio = click + ring
    
    # Add some noise burst
    noise = np.random.randn(int(0.02 * SAMPLE_RATE)) * 0.3
    audio[:len(noise)] += noise
    
    save_wav("pit_click.wav", audio)

def generate_gear_shift():
    """Quick gear shift blip"""
    duration = 0.2
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration))
    
    # Quick frequency drop
    freq = 600 - 200 * t / duration
    phase = np.cumsum(2 * np.pi * freq / SAMPLE_RATE)
    
    audio = np.sin(phase) * np.exp(-t * 15)
    
    # Add harmonics
    audio += np.sin(phase * 2) * 0.3 * np.exp(-t * 20)
    audio += np.sin(phase * 3) * 0.15 * np.exp(-t * 25)
    
    save_wav("gear_shift.wav", audio)

def generate_cheer():
    """Short crowd cheer"""
    duration = 1.0
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration))
    
    # Crowd noise is essentially filtered noise
    audio = np.random.randn(len(t))
    
    # Apply band-pass filter effect (manually)
    # Low frequency modulation for "wave" effect
    modulation = 0.5 + 0.5 * np.sin(2 * np.pi * 3 * t)
    audio *= modulation
    
    # Fade in and out
    envelope = np.ones_like(t)
    fade_in = int(0.1 * SAMPLE_RATE)
    fade_out = int(0.3 * SAMPLE_RATE)
    envelope[:fade_in] = np.linspace(0, 1, fade_in)
    envelope[-fade_out:] = np.linspace(1, 0, fade_out)
    audio *= envelope * 0.4
    
    save_wav("cheer.wav", audio)

def generate_click():
    """UI click sound"""
    duration = 0.05
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration))
    
    audio = np.sin(2 * np.pi * 1200 * t) * np.exp(-t * 100)
    
    save_wav("click.wav", audio)

def generate_hover():
    """Subtle hover sound"""
    duration = 0.08
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration))
    
    audio = np.sin(2 * np.pi * 600 * t) * np.exp(-t * 60) * 0.3
    
    save_wav("hover.wav", audio)

if __name__ == "__main__":
    ensure_dir()
    print("Generating F1 racing SFX...")
    
    generate_start_beep()
    generate_engine_rev()
    generate_pit_click()
    generate_gear_shift()
    generate_cheer()
    generate_click()
    generate_hover()
    
    print("\nAll SFX generated successfully!")
