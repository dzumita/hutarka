import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

type ToolbarButtonType = {
  title: string;
  onPress: () => void;
};

const ToolbarButton = ({title, onPress}: ToolbarButtonType) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>
);

type ToolbarType = {
  isFocused: boolean;
  onChangeFocus?: (bool: boolean) => void;
  onSubmit?: (text: string) => void;
  onPressCamera?: () => void;
  onPressLocation?: () => void;
};

const Toolbar = ({
  isFocused,
  onChangeFocus = () => {},
  onSubmit = () => {},
  onPressCamera = () => {},
  onPressLocation = () => {},
}: ToolbarType) => {
  const [text, setText] = useState('');
  const [input, setInput] = useState(null);

  const handleSubmitEditing = () => {
    if (!text) return;

    onSubmit(text);
    setText('');
  };

  const handleFocus = () => {
    onChangeFocus(true);
  };

  const handleBlur = () => {
    onChangeFocus(false);
  };

  const handleChangeText = (text: string) => {
    setText(text);
  };

  return (
    <View style={styles.toolbar}>
      <ToolbarButton title={'📷'} onPress={onPressCamera} />
      <ToolbarButton title={'📍'} onPress={onPressLocation} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          underlineColorAndroid={'transparent'}
          placeholder={'Type something!'}
          blurOnSubmit={false}
          value={text}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          ref={setInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingLeft: 16,
    backgroundColor: 'white',
  },
  button: {
    top: -2,
    marginRight: 12,
    fontSize: 20,
    color: 'grey',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});

export default Toolbar;
