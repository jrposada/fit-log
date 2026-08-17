import { DeviceEventEmitter } from 'react-native';

const EVENT_NAME = 'MODEL_3D_PICKER_CONFIRM';

type Model3dPickerResult =
  | { kind: 'video'; base64: string; mimeType: string }
  | { kind: 'model'; base64: string; mimeType: string; filename: string };

function emit(result: Model3dPickerResult) {
  DeviceEventEmitter.emit(EVENT_NAME, result);
}

function subscribe(callback: (result: Model3dPickerResult) => void) {
  const subscription = DeviceEventEmitter.addListener(EVENT_NAME, callback);
  return () => subscription.remove();
}

export const Model3dPickerEvents = { emit, subscribe };
export type { Model3dPickerResult };
