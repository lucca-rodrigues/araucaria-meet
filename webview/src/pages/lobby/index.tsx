import { useEffect } from 'react';
import TemplatePage from './template';
import useLobby from './hooks';

export default function Lobby() {
  const hookParams = useLobby();
  const { getLobby } = hookParams;

  const sharedProps = {
    ...hookParams,
  };

  useEffect(() => {
      getLobby();
  },[]);

  return (
    <>
      <TemplatePage {...sharedProps} />
    </>
  );
}
