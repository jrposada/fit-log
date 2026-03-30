import { useDebounce } from '@shared-react/hooks/use-debounce';
import Fuse from 'fuse.js';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Modal from '../modal';
import { styles } from './select.styles';

export interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onAddNew?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  addButtonLabel?: string;
  closeButtonLabel?: string;
  emptyStateMessage?: string;
  allowAddNew?: boolean;
  readonly?: boolean;
}

function Select({
  options,
  value,
  onChange,
  onAddNew,
  onClear,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search',
  addButtonLabel = 'Add',
  closeButtonLabel = 'Close',
  emptyStateMessage = 'No options found',
  allowAddNew = true,
  readonly = false,
}: SelectProps): React.ReactElement {
  const flatListRef = useRef<FlatList<string>>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredOptions = debouncedSearchTerm.trim()
    ? fuse
        .search(debouncedSearchTerm.trim())
        .map((result: { item: string }) => result.item)
    : options;

  const hasExactMatch = options.some(
    (option) =>
      option.toLowerCase() === debouncedSearchTerm.trim().toLowerCase()
  );
  const showAddButton =
    allowAddNew && onAddNew && debouncedSearchTerm.trim() && !hasExactMatch;

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
  };

  const handleSelectOption = (option: string) => {
    onChange(option);
    closeModal();
  };

  const handleAddNew = () => {
    onAddNew?.(debouncedSearchTerm.trim());
    closeModal();
  };

  if (readonly) {
    return (
      <View style={[styles.valueButton, styles.valueReadonly]}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.valueButton,
          onClear && value && styles.valueButtonClearable,
        ]}
        activeOpacity={0.7}
        onPress={openModal}
      >
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        {onClear && value ? (
          <TouchableOpacity
            style={styles.valueClearButton}
            onPress={onClear}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.valueClearButtonText}>✕</Text>
          </TouchableOpacity>
        ) : null}
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
                    ? `No results for "${debouncedSearchTerm.trim()}"`
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
          {showAddButton && (
            <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
              <Text style={styles.addButtonText}>
                {addButtonLabel} "{debouncedSearchTerm}"
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>{closeButtonLabel}</Text>
          </TouchableOpacity>
        </Modal.Footer>
      </Modal.Root>
    </View>
  );
}

export default Select;
