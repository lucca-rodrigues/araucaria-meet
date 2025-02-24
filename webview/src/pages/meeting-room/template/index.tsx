import { Video, VideoOff, Mic, MicOff, Users, MessageSquare, PhoneOff } from 'lucide-react';
import { useState } from 'react';

interface TemplatePageProps {
  toggleVideo: () => void;
  toggleAudio: () => void;
  handleLeaveMeeting: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  messages: Array<{
    id: string;
    userName: string;
    message: string;
    timestamp: Date;
  }>;
  handleSendMessage: (message: string) => void;
}

export default function TemplatePage({
  videoRef,
  isVideoEnabled,
  isAudioEnabled,
  toggleVideo,
  toggleAudio,
  handleLeaveMeeting,
  messages,
  handleSendMessage,
}: TemplatePageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const [message, setMessage] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      handleSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#202124]">
      <main className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 gap-4 h-full">
            <div className="bg-[#3c4043] rounded-lg overflow-hidden">
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
            </div>
          </div>
        </div>

        {/* Collapsible Sidebar */}
        <div className={`w-[300px] bg-[#3c4043] border-l border-[#4a4d51] transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} fixed right-0 top-0 bottom-16 flex flex-col`}>
          {/* Tabs */}
          <div className="flex border-b border-[#4a4d51]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-4 text-white text-sm font-medium ${activeTab === 'chat' ? 'border-b-2 border-[#1a73e8]' : ''}`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-4 text-white text-sm font-medium ${activeTab === 'participants' ? 'border-b-2 border-[#1a73e8]' : ''}`}
            >
              Participantes
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'chat' ? (
              <div className="flex flex-col h-full">
                {/* Chat Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm text-white">{msg.userName.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{msg.userName}</div>
                      <div className="mt-1 text-sm text-gray-300">{msg.message}</div>
                    </div>
                  </div>
                ))}
                </div>

                {/* Message Input */}
                <form onSubmit={onSubmitMessage} className="p-4 border-t border-[#4a4d51]">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enviar mensagem para todos"
                      className="flex-1 bg-[#4a4d51] text-white placeholder-gray-400 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-center text-white">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm">JD</span>
                  </div>
                  <span>João Doe</span>
                </div>
                <div className="flex items-center text-white">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm">MD</span>
                  </div>
                  <span>Maria Doe</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Controls */}
      <div className="h-16 bg-[#3c4043] border-t border-[#4a4d51] flex items-center justify-between px-4 fixed bottom-0 left-0 right-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${isVideoEnabled ? 'bg-[#4a4d51] hover:bg-[#5f6368] text-white' : 'bg-[#ea4335] hover:bg-[#dc3626] text-white'}`}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${isAudioEnabled ? 'bg-[#4a4d51] hover:bg-[#5f6368] text-white' : 'bg-[#ea4335] hover:bg-[#dc3626] text-white'}`}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSidebar}
            className={`p-3 rounded-full transition-colors ${isSidebarOpen ? 'bg-[#1a73e8] text-white' : 'bg-[#4a4d51] hover:bg-[#5f6368] text-white'}`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            onClick={handleLeaveMeeting}
            className="p-3 rounded-full bg-[#ea4335] hover:bg-[#dc3626] text-white transition-colors"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}