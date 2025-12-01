import { FunctionComponent } from 'react';

import ImagePicker, { ImagePickerResult } from '../../library/image-picker';

interface SectorImagePickerProps {
  visible: boolean;
  onPick: (sectorData: {
    imageUri: string;
    imageWidth: number;
    imageHeight: number;
    imageFileSize: number;
  }) => void;
  onCancel: () => void;
}

const SectorImagePicker: FunctionComponent<SectorImagePickerProps> = ({
  visible,
  onPick,
  onCancel,
}) => {
  const handleImageSelected = (result: ImagePickerResult) => {
    onPick({
      imageUri: result.imageUri,
      imageWidth: result.imageWidth,
      imageHeight: result.imageHeight,
      imageFileSize: result.imageFileSize,
    });
  };

  return (
    <ImagePicker
      visible={visible}
      onImageSelected={handleImageSelected}
      onCancel={onCancel}
      title={'Add Image'}
    />
  );
};

export default SectorImagePicker;
export type { SectorImagePickerProps };
