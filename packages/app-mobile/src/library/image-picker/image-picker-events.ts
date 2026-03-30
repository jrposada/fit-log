import { DeviceEventEmitter } from 'react-native';

const EVENT_NAME = 'IMAGE_PICKER_CONFIRM';

type ImagePickerResult = {
  base64: string;
  basename: string;
  fileSize: number;
  height: number;
  mimeType: string;
  uri: string;
  width: number;
};

function emit(result: ImagePickerResult) {
  DeviceEventEmitter.emit(EVENT_NAME, result);
}

function subscribe(callback: (result: ImagePickerResult) => void) {
  const subscription = DeviceEventEmitter.addListener(EVENT_NAME, callback);
  return () => subscription.remove();
}

export const ImagePickerEvents = { emit, subscribe };
export type { ImagePickerResult };
