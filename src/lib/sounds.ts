let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
}

export async function unlockAudio() {
  const context = getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }
}

function tone(
  frequency: number,
  duration: number,
  options?: {
    type?: OscillatorType;
    volume?: number;
    delay?: number;
  },
) {
  const context = getAudioContext();

  const oscillator = context.createOscillator();

  const gain = context.createGain();

  const start = context.currentTime + (options?.delay ?? 0);

  const volume = options?.volume ?? 0.09;

  oscillator.type = options?.type ?? "sine";

  oscillator.frequency.setValueAtTime(frequency, start);

  gain.gain.setValueAtTime(volume, start);

  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

  oscillator.connect(gain);

  gain.connect(context.destination);

  oscillator.start(start);

  oscillator.stop(start + duration);
}

export function playCorrectSound() {
  tone(523.25, 0.12, {
    type: "sine",
  });

  tone(659.25, 0.12, {
    type: "sine",
    delay: 0.08,
  });

  tone(783.99, 0.18, {
    type: "sine",
    delay: 0.16,
  });
}

export function playWrongSound() {
  tone(220, 0.12, {
    type: "sawtooth",
    volume: 0.06,
  });

  tone(164.81, 0.2, {
    type: "sawtooth",
    volume: 0.06,
    delay: 0.08,
  });
}

export function playYourTurnSound() {
  tone(440, 0.08, {
    type: "square",
    volume: 0.08,
  });

  tone(659.25, 0.14, {
    type: "square",
    volume: 0.08,
    delay: 0.08,
  });
}

export function playTimeoutSound() {
  tone(185, 0.2, {
    type: "sawtooth",
    volume: 0.075,
  });

  tone(120, 0.3, {
    type: "sawtooth",
    volume: 0.075,
    delay: 0.12,
  });
}

export function playGameOverSound() {
  tone(392, 0.15, {
    volume: 0.08,
  });

  tone(329.63, 0.15, {
    volume: 0.08,
    delay: 0.15,
  });

  tone(261.63, 0.35, {
    volume: 0.08,
    delay: 0.3,
  });
}
