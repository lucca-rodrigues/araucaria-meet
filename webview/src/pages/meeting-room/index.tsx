import { useEffect } from 'react';
import TemplatePage from './template';
import useMeetingRoom from './hooks';

export default function MeetingRoom() {
  const hookParams = useMeetingRoom();
  const { getMeetingRoom } = hookParams;

  const sharedProps = {
    ...hookParams,
  };

  useEffect(() => {
    // Adicionar log para debug
    console.log('MeetingRoom component mounted - initializing room');
    getMeetingRoom();

    // Adicionar limpeza ao desmontar
    return () => {
      console.log('MeetingRoom component unmounted - cleaning up');
    };
  }, [getMeetingRoom]);

  return (
    <>
      <TemplatePage {...sharedProps} />
    </>
  );
}
