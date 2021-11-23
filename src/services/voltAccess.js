import React, { useEffect, useContext, createContext } from 'react';
import { v4 as uuid } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';

import { addNewVlamPost, depositFromVolt, getUserVolt, transferCoinToInAction } from './db';
import { selectActors, setCurrentUserVolt } from '../store/actors';
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

  useEffect(async () => {
    if (user) {
      const [volt, voltError] = await getUserVolt(user.id);

      if (volt) {
        dispatch(setCurrentUserVolt(volt));
      } else {
        console.log('Problem fetching user volt');
      }
    }
  }, [user]);

  const startNewVlam = async (message, participatingPrice, winingPrice, numberOfParticipants) => {
    dispatch(notifyLoadingStart({ type: 'form/post' }));

    const [volt, voltError] = await transferCoinToInAction(user.id, parseInt(winingPrice));
    if (volt) {
      const [vlam, error] = await addNewVlamPost({
        id: uuid(),
        author: user.id,
        message: message,
        participatingPrice: participatingPrice,
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
      console.log('voltError: ', voltError);
    }
  };

  return {
    startNewVlam,
  };
}
