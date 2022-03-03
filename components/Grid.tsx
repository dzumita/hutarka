import {Dimensions, FlatList, PixelRatio, StyleSheet} from 'react-native';
import React from 'react';

type GridType = {
  renderItem: () => void;
  numColumns: number;
  itemMargin: number;
};

const Grid = ({
  renderItem,
  numColumns = 4,
  itemMargin = StyleSheet.hairlineWidth,
}: GridType) => {
  const renderGridItem = (info: any) => {
    const {index} = info;
    const {width} = Dimensions.get('window');

    const size = PixelRatio.roundToNearestPixel(
      (width - itemMargin * (numColumns - 1)) / numColumns,
    );

    const marginTop = index < numColumns ? 0 : itemMargin;
    const marginLeft = index % numColumns === 0 ? 0 : itemMargin;

    return renderItem({...info, size, marginLeft, marginTop});
  };

  return (
    <FlatList
      renderItem={renderGridItem}
      numColumns={numColumns}
      itemMargin={itemMargin}
    />
  );
};

export default Grid;
