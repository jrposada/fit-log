import { DeviceEventEmitter } from 'react-native';

const EVENT_NAME = 'MAP_POINT_PICKER_CONFIRM';

type MapPointResult = {
  latitude: number;
  longitude: number;
  address?: string;
  placeId?: string;
};

function emit(result: MapPointResult) {
  DeviceEventEmitter.emit(EVENT_NAME, result);
}

function subscribe(callback: (result: MapPointResult) => void) {
  const subscription = DeviceEventEmitter.addListener(EVENT_NAME, callback);
  return () => subscription.remove();
}

export const MapPointPickerEvents = { emit, subscribe };
export type { MapPointResult };
