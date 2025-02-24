import { useEffect } from 'react';
import TemplatePage from './template';
import useMeetingRoom from './hooks';

export default function MeetingRoom() {
  const hookParams = useMeetingRoom();
  const { getMeetingRoom } = hookParams;

  const sharedProps = {
    ...hookParams
  };

  useEffect(() => {
      getMeetingRoom();
  },[]);

  return (
    <>
      <TemplatePage {...sharedProps} />
    </>
  );
}
