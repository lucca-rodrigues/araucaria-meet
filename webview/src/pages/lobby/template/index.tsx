import { Video, VideoOff, Mic, MicOff, Calendar, Users } from 'lucide-react';

interface TemplatePageProps {
  toggleVideo: () => void;
  toggleAudio: () => void;
  handleJoinMeeting: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  userName: string;
  setUserName: (name: string) => void;
  isWaiting: boolean;
  // Campos para agendamento
  isSchedulingMode: boolean;
  toggleSchedulingMode: () => void;
  scheduleTitle: string;
  setScheduleTitle: (title: string) => void;
  scheduleDescription: string;
  setScheduleDescription: (description: string) => void;
  scheduleOwnerEmail: string;
  setScheduleOwnerEmail: (email: string) => void;
  scheduleParticipantEmail: string;
  setScheduleParticipantEmail: (email: string) => void;
  scheduleParticipants: string[];
  addParticipant: () => void;
  removeParticipant: (email: string) => void;
  scheduleDate: string;
  setScheduleDate: (date: string) => void;
  scheduleTime: string;
  setScheduleTime: (time: string) => void;
  scheduleEndDate: string;
  setScheduleEndDate: (date: string) => void;
  scheduleEndTime: string;
  setScheduleEndTime: (time: string) => void;
  handleScheduleRoom: () => void;
  isScheduling: boolean;
  scheduleError: string;
  roomId: string;
  setRoomId: (id: string) => void;
}

export default function TemplatePage({
  videoRef,
  isVideoEnabled,
  isAudioEnabled,
  toggleVideo,
  toggleAudio,
  handleJoinMeeting,
  userName,
  setUserName,
  isWaiting,
  // Campos para agendamento
  isSchedulingMode,
  toggleSchedulingMode,
  scheduleTitle,
  setScheduleTitle,
  scheduleDescription,
  setScheduleDescription,
  scheduleOwnerEmail,
  setScheduleOwnerEmail,
  scheduleParticipantEmail,
  setScheduleParticipantEmail,
  scheduleParticipants,
  addParticipant,
  removeParticipant,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  scheduleEndDate,
  setScheduleEndDate,
  scheduleEndTime,
  setScheduleEndTime,
  handleScheduleRoom,
  isScheduling,
  scheduleError,
  roomId,
  setRoomId,
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
                className={`p-3 rounded-full transition-colors ${
                  isVideoEnabled
                    ? 'bg-[#3c4043] hover:bg-[#4a4d51] text-white'
                    : 'bg-[#ea4335] hover:bg-[#dc3626] text-white'
                }`}
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition-colors ${
                  isAudioEnabled
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
          {isWaiting ? (
            <div className="text-center">
              <h2 className="text-[22px] font-normal text-[#202124] mb-4">Aguardando aprovação</h2>
              <p className="text-[#5f6368]">
                Você será admitido assim que um participante aprovar sua entrada.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-6">
                <button
                  onClick={() => toggleSchedulingMode()}
                  className={`flex items-center justify-center py-2 px-4 rounded-md text-sm transition-colors ${
                    !isSchedulingMode ? 'bg-[#1a73e8] text-white' : 'bg-gray-100 text-[#5f6368]'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Participar
                </button>
                <button
                  onClick={() => toggleSchedulingMode()}
                  className={`flex items-center justify-center py-2 px-4 rounded-md text-sm transition-colors ${
                    isSchedulingMode ? 'bg-[#1a73e8] text-white' : 'bg-gray-100 text-[#5f6368]'
                  }`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar
                </button>
              </div>

              {!isSchedulingMode ? (
                <>
                  <h2 className="text-[22px] font-normal text-[#202124] mb-8">
                    Pronto para participar?
                  </h2>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-[#5f6368] mb-1">
                      Qual é seu nome?
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      maxLength={60}
                      className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-base"
                      placeholder="Digite seu nome"
                    />
                    <div className="text-right text-xs text-[#5f6368] mt-1">
                      {userName.length}/60
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="roomId"
                      className="block text-sm font-medium text-[#5f6368] mb-1"
                    >
                      ID da reunião (opcional)
                    </label>
                    <input
                      type="text"
                      id="roomId"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-base"
                      placeholder="Deixe em branco para criar uma nova sala"
                    />
                  </div>

                  <button
                    onClick={handleJoinMeeting}
                    disabled={!userName.trim()}
                    className={`w-full ${
                      userName.trim()
                        ? 'bg-[#1a73e8] hover:bg-[#1557b0]'
                        : 'bg-[#dadce0] cursor-not-allowed'
                    } text-white py-2.5 px-6 rounded-md font-medium text-sm transition-colors`}
                  >
                    {roomId ? 'Pedir para participar' : 'Iniciar uma reunião'}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-[22px] font-normal text-[#202124] mb-6">
                    Agendar uma reunião
                  </h2>

                  {scheduleError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                      {scheduleError}
                    </div>
                  )}

                  <div className="mb-4">
                    <label
                      htmlFor="scheduleTitle"
                      className="block text-sm font-medium text-[#5f6368] mb-1"
                    >
                      Título da reunião *
                    </label>
                    <input
                      type="text"
                      id="scheduleTitle"
                      value={scheduleTitle}
                      onChange={(e) => setScheduleTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-sm"
                      placeholder="Digite o título da reunião"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="scheduleDescription"
                      className="block text-sm font-medium text-[#5f6368] mb-1"
                    >
                      Descrição
                    </label>
                    <textarea
                      id="scheduleDescription"
                      value={scheduleDescription}
                      onChange={(e) => setScheduleDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-sm resize-none"
                      placeholder="Digite a descrição da reunião"
                      rows={2}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="scheduleOwnerEmail"
                      className="block text-sm font-medium text-[#5f6368] mb-1"
                    >
                      Seu email *
                    </label>
                    <input
                      type="email"
                      id="scheduleOwnerEmail"
                      value={scheduleOwnerEmail}
                      onChange={(e) => setScheduleOwnerEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label
                          htmlFor="scheduleDate"
                          className="block text-sm font-medium text-[#5f6368] mb-1"
                        >
                          Data início *
                        </label>
                        <input
                          type="date"
                          id="scheduleDate"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="scheduleTime"
                          className="block text-sm font-medium text-[#5f6368] mb-1"
                        >
                          Hora *
                        </label>
                        <input
                          type="time"
                          id="scheduleTime"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label
                          htmlFor="scheduleEndDate"
                          className="block text-sm font-medium text-[#5f6368] mb-1"
                        >
                          Data fim *
                        </label>
                        <input
                          type="date"
                          id="scheduleEndDate"
                          value={scheduleEndDate}
                          onChange={(e) => setScheduleEndDate(e.target.value)}
                          className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="scheduleEndTime"
                          className="block text-sm font-medium text-[#5f6368] mb-1"
                        >
                          Hora *
                        </label>
                        <input
                          type="time"
                          id="scheduleEndTime"
                          value={scheduleEndTime}
                          onChange={(e) => setScheduleEndTime(e.target.value)}
                          className="w-full px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#5f6368] mb-1">
                      Adicionar participantes
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={scheduleParticipantEmail}
                        onChange={(e) => setScheduleParticipantEmail(e.target.value)}
                        className="flex-1 px-3 py-2 border border-[#dadce0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent text-sm"
                        placeholder="email@participante.com"
                      />
                      <button
                        type="button"
                        onClick={addParticipant}
                        className="px-3 py-2 bg-[#1a73e8] text-white rounded-md text-sm"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {scheduleParticipants.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-[#5f6368] mb-2">Participantes:</p>
                      <div className="max-h-[100px] overflow-y-auto space-y-2">
                        {scheduleParticipants.map((email) => (
                          <div
                            key={email}
                            className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md"
                          >
                            <span className="text-sm">{email}</span>
                            <button
                              type="button"
                              onClick={() => removeParticipant(email)}
                              className="text-red-500 text-sm"
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleScheduleRoom}
                    disabled={isScheduling}
                    className="w-full mt-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white py-2.5 px-6 rounded-md font-medium text-sm transition-colors disabled:bg-[#dadce0] disabled:cursor-not-allowed"
                  >
                    {isScheduling ? 'Agendando...' : 'Agendar reunião'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

