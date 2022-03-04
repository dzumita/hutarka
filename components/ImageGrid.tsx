import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import React, {useState, useEffect} from 'react';

import Grid from './Grid';

const keyExtractor = ({uri}: any) => uri;

type ImageGridType = {
  onPressImage?: () => void;
};

const ImageGrid = ({onPressImage = () => {}}: ImageGridType) => {
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [images, setImages] = useState([]);

  const getImages = async (after?: string) => {
    if (loading) return;

    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== 'granted') {
      console.log('Camera roll permission denied');
      return;
    }

    setLoading(true);

    const results = await CameraRoll.getPhotos({
      first: 20,
      after,
    });

    const {
      edges,
      page_info: {has_next_page, end_cursor},
    } = results;

    const loadedImages = edges.map(item => item.node.image);

    setImages(images.concat(loadedImages));
    setLoading(false);
    setCursor(has_next_page ? end_cursor : null);
  };

  const getNextImages = () => {
    if (cursor) return;

    getImages(cursor);
  };

  const renderItem = ({item: {uri}, size, marginTop, marginLeft}: any) => {
    const style = {
      width: size,
      height: size,
      marginLeft,
      marginTop,
    };

    return (
      <TouchableOpacity
        key={uri}
        activeOpacity={0.75}
        onPress={() => onPressImage(uri)}
        style={style}>
        <Image source={{uri}} style={styles.image} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getImages();
  });

  return (
    <Grid
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={getNextImages}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

export default ImageGrid;
