import { Video, VideoOff, Mic, MicOff } from 'lucide-react';

interface TemplatePageProps {
  toggleVideo: () => void;
  toggleAudio: () => void;
  handleJoinMeeting: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

export default function TemplatePage({
  videoRef,
  isVideoEnabled,
  isAudioEnabled,
  toggleVideo,
  toggleAudio,
  handleJoinMeeting,
}: TemplatePageProps) {
  return (
    <div className="flex min-h-screen bg-[#202124]">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-[600px] bg-[#3c4043] rounded-lg shadow-lg overflow-hidden">
          <div className="relative aspect-video">
            {isVideoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl bg-[#3c4043]">
                <div className="flex flex-col items-center">
                  <VideoOff className="w-16 h-16 opacity-40 mb-2" />
                  <span className="text-sm text-gray-300">Câmera desligada</span>
                </div>
              </div>
            )}

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center space-x-3">
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors ${isVideoEnabled
                  ? 'bg-[#3c4043] hover:bg-[#4a4d51] text-white'
                  : 'bg-[#ea4335] hover:bg-[#dc3626] text-white'
                }`}
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition-colors ${isAudioEnabled
                  ? 'bg-[#3c4043] hover:bg-[#4a4d51] text-white'
                  : 'bg-[#ea4335] hover:bg-[#dc3626] text-white'
                }`}
              >
                {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[400px] bg-white flex flex-col justify-center shadow-lg">
        <div className="px-10 py-8">
          <h2 className="text-[22px] font-normal text-[#202124] mb-8">Pronto para participar?</h2>
          <div className="mb-8">
            <label htmlFor="name" className="block text-sm font-medium text-[#5f6368] mb-1">
              Qual é seu nome?
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-base"
              placeholder="Digite seu nome"
            />
            <div className="text-right text-xs text-[#5f6368] mt-1">5/60</div>
          </div>

          <button
            onClick={handleJoinMeeting}
            className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white py-2.5 px-6 rounded-md font-medium text-sm transition-colors"
          >
            Pedir para participar
          </button>

          <button className="w-full mt-4 text-[#1a73e8] hover:text-[#1557b0] hover:underline text-sm font-medium transition-colors">
            Outras formas de participar
          </button>
        </div>
      </div>
    </div>
  );
}
