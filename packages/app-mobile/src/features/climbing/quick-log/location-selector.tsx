import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface LocationSelectorProps {
  locations: string[];
  value: string;
  onChange: (loc: string) => void;
}

const LocationSelector: FunctionComponent<LocationSelectorProps> = ({
  locations,
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('climbing.current_location')}</Text>
      <TouchableOpacity style={styles.valueButton} activeOpacity={0.7}>
        <Text style={styles.valueText}>{value}</Text>
      </TouchableOpacity>
      <View style={styles.dropdown}>
        {locations
          .filter((l) => l !== value)
          .map((loc) => (
            <TouchableOpacity
              key={loc}
              style={styles.dropdownItem}
              onPress={() => onChange(loc)}
            >
              <Text style={styles.dropdownItemText}>{loc}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  valueButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  valueText: {
    fontSize: 16,
    color: '#222',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#444',
  },
});

export default LocationSelector;
