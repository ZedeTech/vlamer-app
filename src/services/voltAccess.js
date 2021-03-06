import React, { useContext, createContext } from 'react';
import { v4 as uuid } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';

import { addNewVlamPost } from '../db/queries/vlam';
import { transferFromVoltToInAction } from '../db/queries/user/volt';
import { selectActors } from '../store/actors';
import { notifyLoadingFinish, notifyLoadingStart } from '../store/loading';

import { useAuth } from './auth';
import { notifyError } from '../store/errors';

const VoltAccessContext = createContext();

export function VoltAccessProvider({ children }) {
  const voltAccess = useProvideVoltAccess();
  return <VoltAccessContext.Provider value={voltAccess}>{children}</VoltAccessContext.Provider>;
}

export const useVoltAccess = () => {
  return useContext(VoltAccessContext);
};

function useProvideVoltAccess() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const actors = useSelector(selectActors);

  const startNewVlam = async (message, participatingPrice, winingPrice, numberOfParticipants) => {
    dispatch(notifyLoadingStart({ type: 'form/post' }));

    const [success, failedError] = await transferFromVoltToInAction(
      user.id,
      actors.userVolt.id,
      winingPrice
    );

    if (success) {
      const [vlam, error] = await addNewVlamPost(user.id, {
        id: uuid(),
        author: user.id,
        message: message,
        participatingPrice: parseInt(participatingPrice),
        winingPrice: parseInt(winingPrice),
        numberOfParticipants: parseInt(numberOfParticipants),
      });

      if (vlam) {
        dispatch(notifyLoadingFinish());
        return vlam;
      } else {
        console.log(error);
        dispatch(notifyLoadingFinish());
        dispatch(
          notifyError({
            type: 'form/post',
            message: 'Unable to create vlam post',
          })
        );
      }
    } else {
      console.log(failedError);
    }
  };

  return {
    startNewVlam,
  };
}
