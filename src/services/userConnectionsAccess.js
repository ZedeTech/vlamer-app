import { Timestamp } from '@firebase/firestore';
import React, { useState, useContext, createContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActors,
  setCurrentUserConnections,
  resetCurrentUserConnections,
} from '../store/actors';
import { formatTime } from '../utils/timeManager';
import { useAuth } from './auth';
import { subscribeToCurrentUserConnection } from '../db/queries/user/connections';
import { ConnectionTypes } from '../db/models/UserConnections';

const UserConnectionsContext = createContext();

export function UserConnectionProvider({ children }) {
  const userConnections = useProvideUserConnections();
  return (
    <UserConnectionsContext.Provider value={userConnections}>
      {children}
    </UserConnectionsContext.Provider>
  );
}

export const useUserConnections = () => {
  return useContext(UserConnectionsContext);
};

function useProvideUserConnections() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { currentUserConnections } = useSelector(selectActors);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fullConnectionList = followers.concat(following);
    dispatch(setCurrentUserConnections(fullConnectionList));

    return () => {
      dispatch(resetCurrentUserConnections());
    };
  }, [following, followers]);

  useEffect(async () => {
    if (user) {
      const [{ eventHandler, inUserConnections, outsideUserConnections }, _] =
        await subscribeToCurrentUserConnection(user.id);

      try {
        const unsubscribeInUserConnections = eventHandler(
          inUserConnections,
          (querySnapshot) => {
            const userConnectionsList = [];
            querySnapshot.forEach((doc) => {
              const document = doc.data();
              const formattedCreatedAt = formatTime(
                new Timestamp(document.createdAt.seconds, document.createdAt.nanoseconds).toDate()
              );
              userConnectionsList.push({ ...document, createdAt: formattedCreatedAt });
            });
            setFollowing(userConnectionsList);
          },
          (error) => {
            console.log(error);
          }
        );

        const unsubscribeOutsideUserConnections = eventHandler(
          outsideUserConnections,
          (querySnapshot) => {
            const userConnectionsList = [];
            querySnapshot.forEach((doc) => {
              const document = doc.data();
              const formattedCreatedAt = formatTime(
                new Timestamp(document.createdAt.seconds, document.createdAt.nanoseconds).toDate()
              );

              userConnectionsList.push({ ...document, createdAt: formattedCreatedAt });
            });
            setFollowers(userConnectionsList);
          },
          (error) => {
            console.log(error);
          }
        );
        // dispatch(setCurrentUserConnections(userConnectionsList));
        return () => {
          unsubscribeOutsideUserConnections();
          unsubscribeInUserConnections();
        };
      } catch (err) {
        console.log(err);
      }
    }
  }, [user]);

  const isUserConnected = (currentUserId, targetUserId) => {
    return (
      currentUserConnections.find((userConnection) => {
        return (
          (userConnection.status === ConnectionTypes.status.ACCEPTED &&
            userConnection.__eventOwnerAccountSnapshot.id === currentUserId) ||
          userConnection.__parentAccountSnapshot.id === targetUserId
        );
      }) !== undefined
    );
  };

  const isUserFollowing = (currentUserId, targetUserId) => {
    return (
      currentUserConnections.find((userConnection) => {
        return (
          userConnection.status === ConnectionTypes.status.ACCEPTED &&
          userConnection.__eventOwnerAccountSnapshot.id === targetUserId &&
          userConnection.__parentAccountSnapshot.id === currentUserId
        );
      }) !== undefined
    );
  };

  const isFollowingUser = (currentUserId, targetUserId) => {
    return (
      currentUserConnections.find((userConnection) => {
        return (
          userConnection.status === ConnectionTypes.status.ACCEPTED &&
          userConnection.__eventOwnerAccountSnapshot.id === targetUserId &&
          userConnection.__parentAccountSnapshot.id === currentUserId
        );
      }) !== undefined
    );
  };

  const hasUserPendingUserConnection = (targetUserId) => {
    return (
      currentUserConnections.find((userConnection) => {
        return (
          userConnection.__eventOwnerAccountSnapshot.id === targetUserId &&
          userConnection.status === ConnectionTypes.status.PENDING
        );
      }) !== undefined
    );
  };

  return {
    isUserConnected,
    isUserFollowing,
    isFollowingUser,
    hasUserPendingUserConnection,
  };
}