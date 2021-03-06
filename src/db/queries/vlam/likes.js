import {
  doc,
  getDocs,
  setDoc,
  getFirestore,
  collectionGroup,
  deleteDoc,
  updateDoc,
  increment,
  query,
  where,
  Timestamp,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { getVlamById } from '.';
import firebaseApp from '../../../utils/firebase';
import { formatTime } from '../../../utils/timeManager';
import { VlamLike } from '../../models/VlamLike';

export const getVlamLikesByUserId = async (userId) => {
  const db = getFirestore(firebaseApp);
  const vlamLikeRef = collectionGroup(db, 'likes');
  const docRef = query(vlamLikeRef, where('id', '==', userId));

  try {
    let vlamLike = [];
    const querySnapshot = await getDocs(docRef);
    querySnapshot.forEach((doc) => {
      const { createdAt, ...document } = doc.data();
      const formattedCreatedAt = formatTime(
        new Timestamp(createdAt.seconds, createdAt.nanoseconds).toDate()
      );
      vlamLike.push({ id: doc.id, ...document, createdAt: formattedCreatedAt });
    });

    return [vlamLike, null];
  } catch (error) {
    console.log(error);
    return [null, error];
  }
};

export const likeVlamPost = async (currentUser, targetUser, vlamPostId) => {
  const db = getFirestore(firebaseApp);
  const vlamLikeRef = doc(db, 'vlams', vlamPostId, 'likes', currentUser.id);

  try {
    let [parentVlam, parentVlamError] = await getVlamById(vlamPostId);

    if (parentVlam) {
      const vlamLike = await new VlamLike(
        VlamLike.GetDefaultVlamLikeValue(currentUser.id, parentVlam)
      ).__validate();
      await setDoc(vlamLikeRef, vlamLike);

      const vlamRef = doc(db, 'vlams', vlamPostId);

      await updateDoc(vlamRef, {
        totalNumberOfLikes: increment(1),
        likeUsersIds: arrayUnion(currentUser.id),
      });

      return [vlamLike, null];
    } else {
      console.log('parentVlamError: ', parentVlamError);
    }
  } catch (error) {
    console.log(error);
    return [false, error];
  }
};

export const unlikeVlamPost = async (currentUser, targetUser, vlamId) => {
  const db = getFirestore(firebaseApp);
  const vlamLikeRef = doc(db, 'vlams', vlamId, 'likes', currentUser.id);

  try {
    await deleteDoc(vlamLikeRef);
    const vlamRef = doc(db, 'vlams', vlamId);

    await updateDoc(vlamRef, {
      totalNumberOfLikes: increment(-1),
      likeUsersIds: arrayRemove(currentUser.id),
    });
    return [true, null];
  } catch (error) {
    console.log(error);
    return [false, error];
  }
};

export const onCurrentUserLikes = async (userId) => {
  const db = getFirestore(firebaseApp);

  try {
    const vlamLikeRef = collectionGroup(db, 'likes');
    const docRef = query(vlamLikeRef, where('id', '==', userId));

    const snapShotObj = {
      docRef: docRef,
      eventHandler: onSnapshot,
    };
    return [snapShotObj, null];
  } catch (error) {
    console.log(error);
    return [null, error];
  }
};
