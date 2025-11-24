import { useDebounce } from '@shared-react/hooks/use-debounce';
import Fuse from 'fuse.js';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const flatListRef = useRef<FlatList<string>>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newOption, setNewOption] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const fuse = useMemo(
    () =>
      new Fuse(options, {
        threshold: 0.4, // 0 = exact match, 1 = match anything
        distance: 100, // Max distance for fuzzy matching
        ignoreLocation: true, // Don't care where in the string the match is
      }),
    [options]
  );

  const filteredOptions = debouncedSearchTerm
    ? fuse.search(debouncedSearchTerm).map((result) => result.item)
    : options;

  // Scroll to selected option when modal opens
  useEffect(() => {
    if (isModalVisible && value && !debouncedSearchTerm) {
      const timer = setTimeout(() => {
        const selectedIndex = filteredOptions.indexOf(value);
        if (selectedIndex !== -1 && flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: selectedIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isModalVisible, value, debouncedSearchTerm, filteredOptions]);

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
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoFocus
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchTerm('')}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal.Header>

        <Modal.Body>
          <FlatList
            ref={flatListRef}
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
                <Text style={styles.emptyStateText}>
                  {debouncedSearchTerm
                    ? `No results for "${debouncedSearchTerm}"`
                    : emptyStateMessage}
                </Text>
              </View>
            }
            getItemLayout={(data, index) => ({
              length: 48,
              offset: 48 * index,
              index,
            })}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={false}
            keyboardShouldPersistTaps="handled"
            onScrollToIndexFailed={(info) => {
              // Fallback: scroll to offset if index fails
              const wait = new Promise((resolve) => setTimeout(resolve, 100));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0.5,
                });
              });
            }}
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
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: '600',
  },
  listView: {
    height: 300,
  },
  listContent: {
    flexGrow: 1,
  },
  dropdownItem: {
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center',
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
