import { FunctionComponent, useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import IconButton from '../icon-button/icon-button';
import InteractiveImage from '../interactive-image/interactive-image';
import { styles } from './image-gallery-modal.styles';

interface GalleryImage {
  id: string;
  imageUrl: string;
}

interface ImageGalleryModalProps {
  visible: boolean;
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VIEWABILITY_CONFIG = { viewAreaCoveragePercentThreshold: 50 };

const ImageGalleryModal: FunctionComponent<ImageGalleryModalProps> = ({
  visible,
  images,
  initialIndex,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const handleScaleChange = useCallback((scale: number) => {
    setScrollEnabled(scale <= 1);
  }, []);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: GalleryImage }) => (
      <View
        style={[styles.page, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}
      >
        <InteractiveImage
          source={{ uri: item.imageUrl }}
          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          imageStyle={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          onScaleChange={handleScaleChange}
        />
      </View>
    ),
    [handleScaleChange]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={styles.overlay}>
        <View style={[styles.closeButton, { top: insets.top }]}>
          <IconButton
            icon="✕"
            onPress={onClose}
            variant="ghost"
            color="#fff"
            size="lg"
          />
        </View>

        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          scrollEnabled={scrollEnabled}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={getItemLayout}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={VIEWABILITY_CONFIG}
          style={styles.flatList}
        />

        {images.length > 1 && (
          <View style={[styles.indicator, { bottom: insets.bottom + 16 }]}>
            <Text style={styles.indicatorText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ImageGalleryModal;
