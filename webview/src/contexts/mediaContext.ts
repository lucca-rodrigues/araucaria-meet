import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MediaState {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  videoDeviceId: string | null;
  audioDeviceId: string | null;
  setVideoEnabled: (enabled: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setVideoDevice: (deviceId: string) => void;
  setAudioDevice: (deviceId: string) => void;
  reset: () => void;
}

export const useMedia = create<MediaState>()(
  persist(
    (set) => ({
      isVideoEnabled: true,
      isAudioEnabled: true,
      videoDeviceId: null,
      audioDeviceId: null,
      setVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),
      setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
      setVideoDevice: (deviceId) => set({ videoDeviceId: deviceId }),
      setAudioDevice: (deviceId) => set({ audioDeviceId: deviceId }),
      reset: () => set({
        isVideoEnabled: true,
        isAudioEnabled: true,
        videoDeviceId: null,
        audioDeviceId: null,
      }),
    }),
    {
      name: 'media-storage',
    }
  )
);