import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import { FlatList, Text } from 'react-native';
import { CompleteRegistrationBanner } from '../../common/banners';
import VlamPosts from '../../sections/cards/VlamPostCard';
import PageAux from '../../hoc/PageAux';
import { useNavigation } from '@react-navigation/core';
import { useSelector } from 'react-redux';
import { selectActors, setCurrentUserFeedList } from '../../../store/actors';
import { LottieIcon } from '../../common/animations';
import { getUserFeedList } from '../../../services/db/queries/site';
import { useAuth } from '../../../services/auth';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid';

export default Home = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [loadMoreVlams, setLoadMoreVlams] = useState(false);
  const navigation = useNavigation();
  const actors = useSelector(selectActors);

  useEffect(() => {
    if (user) {
      const fetchFeedsVlamList = async () => {
        const [vlamList, error] = await getUserFeedList();

        if (vlamList) {
          dispatch(setCurrentUserFeedList(vlamList));
        } else {
          console.log('Error: ', error);
        }
      };
      fetchFeedsVlamList();
    }
  }, [user]);

  if (!user || !actors.currentUserFeedList) {
    return <Text>Loading...</Text>;
  }

  const renderVlams = ({ item }) => {
    return (
      <VlamPosts
        key={uuid()}
        id={item.id}
        authorAccount={item.authorAccount}
        postedAt={item.postedAt}
        vlamType={''}
        message={item.message}
        numberOfParticipants={item.numberOfParticipants}
        participatingPrice={item.participatingPrice}
        winingPrice={item.winingPrice}
        createdAt={item.createdAt}
        navigation={navigation}
      />
    );
  };

  return (
    <PageAux>
      <CompleteRegistrationBanner />
      <FlatList
        data={actors.currentUserFeedList}
        renderItem={renderVlams}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        // onEndReachedThreshold={0.2}
        // onEndReached={(event) => setLoadMoreVlams(true)}
      />
      {loadMoreVlams && (
        <LottieIcon
          autoPlay={true}
          loop={true}
          src={require('../../../../assets/lottie/scroll-down.json')}
          style={styles.iconBig}
        />
      )}
    </PageAux>
  );
};
