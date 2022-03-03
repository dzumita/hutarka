import React, {useState, useEffect} from 'react';
import {StatusBar, Platform, StyleSheet, Text, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const Status = () => {
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  const handleChange = (connectionType: string | null) => {
    setConnectionType(connectionType);
  };

  useEffect(() => {
    // (async () => {
    //   setSubscription(
    //     NetInfo.addEventListener('connectionChange', handleChange),
    //   );

    //   const {type} = await NetInfo.getConnectionInfo();

    //   setConnectionType(type);
    // })();

    // return () => {
    //   subscription.remove();
    // };
  }, []);

  const isConnected = connectionType !== 'none';

  const backgroundColor = isConnected ? 'white' : 'red';

  const statusBar = (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={isConnected ? 'dark-content' : 'light-content'}
      animated={false}
    />
  );

  const messageContainer = (
    <View style={styles.messageContainer} pointerEvents={'none'}>
      {statusBar}
      {!isConnected && (
        <View style={styles.bubble}>
          <Text style={styles.text}>No network connection</Text>
        </View>
      )}
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.status, {backgroundColor}]}>{messageContainer}</View>
    );
  }

  return messageContainer;
};

const statusHeight = Platform.OS === 'ios' ? StatusBar.currentHeight : 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: Number(statusHeight),
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: Number(statusHeight) + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});

export default Status;
