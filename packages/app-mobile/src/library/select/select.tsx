import type React from 'react';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Modal from '../modal';

export interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onAddNew?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  addNewPlaceholder?: string;
  addButtonLabel?: string;
  closeButtonLabel?: string;
  emptyStateMessage?: string;
  allowAddNew?: boolean;
}

function Select({
  options,
  value,
  onChange,
  onAddNew,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search',
  addNewPlaceholder = 'Add new option',
  addButtonLabel = 'Add',
  closeButtonLabel = 'Close',
  emptyStateMessage = 'No options found',
  allowAddNew = true,
}: SelectProps): React.ReactElement {
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newOption, setNewOption] = useState('');

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = () => setModalVisible(true);

  const closeModal = () => {
    setModalVisible(false);
    setSearchTerm('');
    setNewOption('');
  };

  const handleSelectOption = (option: string) => {
    onChange(option);
    closeModal();
  };

  const handleAddOption = () => {
    const trimmedValue = newOption.trim();
    if (!trimmedValue) return;

    if (options.includes(trimmedValue)) {
      // If option already exists, just select it
      onChange(trimmedValue);
      closeModal();
      return;
    }

    if (onAddNew) {
      onAddNew(trimmedValue);
      closeModal();
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.valueButton}
        activeOpacity={0.7}
        onPress={openModal}
      >
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal.Root visible={isModalVisible} onClose={closeModal}>
        <Modal.Header>
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus
          />
        </Modal.Header>

        <Modal.Body>
          <FlatList
            data={filteredOptions}
            style={styles.listView}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => item}
            renderItem={({ item: option }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  option === value && styles.selectedItem,
                ]}
                onPress={() => handleSelectOption(option)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    option === value && styles.selectedItemText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>{emptyStateMessage}</Text>
              </View>
            }
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={false}
            keyboardShouldPersistTaps="handled"
          />
        </Modal.Body>

        <Modal.Footer>
          {allowAddNew && onAddNew && (
            <View style={styles.addOptionContainer}>
              <TextInput
                style={styles.addOptionInput}
                placeholder={addNewPlaceholder}
                value={newOption}
                onChangeText={setNewOption}
              />
              <TouchableOpacity
                style={[
                  styles.addOptionButton,
                  !newOption.trim() && styles.addOptionButtonDisabled,
                ]}
                onPress={handleAddOption}
                disabled={!newOption.trim()}
              >
                <Text style={styles.addOptionButtonText}>{addButtonLabel}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>{closeButtonLabel}</Text>
          </TouchableOpacity>
        </Modal.Footer>
      </Modal.Root>
    </View>
  );
}

const styles = StyleSheet.create({
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
  placeholderText: {
    color: '#999',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  listView: {
    height: 300,
  },
  listContent: {
    flexGrow: 1,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 4,
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
  addOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  addOptionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addOptionButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addOptionButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addOptionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  closeButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Select;
