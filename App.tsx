import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  BackHandler,
} from 'react-native';

import Status from './components/Status';
import MessageList from './components/MessageList';
import {
  createImageMessage,
  createLocationMessage,
  createTextMessage,
} from './utils/MessageUtils';
import Toolbar from './components/Toolbar';
import ImageGrid from './components/ImageGrid';

// It's all a draft

const App = () => {
  const [messages, setMessages] = useState([
    createImageMessage('https://unsplash.it/300/300'),
    createTextMessage('World'),
    createTextMessage('Hello'),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
    }),
  ]);
  const [fullscreenImageId, setFullscreenImageId] = useState(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const dismissFullscreenImage = () => {
    setFullscreenImageId(null);
  };

  const handlePressToolbarCamera = () => {};
  const handlePressToolbarLocation = () => {};
  const handleChangeFocus = (isFocused: boolean) => {
    setIsInputFocused(isFocused);
  };

  const renderInputMethodEditor = () => (
    <View style={styles.inputMethodEditor}>
      <ImageGrid />
    </View>
  );

  const handleSubmit = (text: string) => {
    setMessages([createTextMessage(text), ...messages]);
  };

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={handleSubmit}
          onChangeFocus={handleChangeFocus}
          onPressCamera={handlePressToolbarCamera}
          onPressLocation={handlePressToolbarLocation}
        />
      </View>
    );
  };

  const handlePressMessage = ({id, type}: any) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setMessages(messages.filter(message => message.id !== id));
              },
            },
          ],
        );
        break;
      case 'image':
        setFullscreenImageId(id);
        setIsInputFocused(false);
        break;
      default:
        break;
    }
  };

  const handlePressToolbarLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const {
        coords: {latitude, longitude},
      } = position;

      setMessages([
        createLocationMessage({
          latitude,
          longitude,
        }),
        ...messages,
      ]);
    });
  };

  const renderMessageList = () => {
    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={handlePressMessage} />
      </View>
    );
  };

  const renderInputMethodEditor = () => {
    return <View style={styles.inputMethodEditor}></View>;
  };

  const renderFullscreenImage = () => {
    if (!fullscreenImageId) return null;
    const image = messages.find(message => message.id === fullscreenImageId);
    if (!image) return null;
    const {uri}: any = image;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={dismissFullscreenImage}>
        <Image style={styles.fullscreenImage} source={{uri}} />
      </TouchableHighlight>
    );
  };

  useEffect(() => {
    setSubscription(
      BackHandler.addEventListener('hardwareBackPress', () => {
        if (fullscreenImageId) {
          dismissFullscreenImage();
          return true;
        }
        return false;
      }),
    );

    return () => subscription.remove();
  });

  return (
    <View style={styles.container}>
      <Status />
      {renderMessageList()}
      {renderToolbar()}
      {renderInputMethodEditor()}
      {renderFullscreenImage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default App;
