import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Modal from '../../../library/modal';

export interface CreateLocationFormProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const CreateLocationForm: FunctionComponent<CreateLocationFormProps> = ({
  initialValue,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formName, setFormName] = useState(initialValue);

  return (
    <>
      <Modal.Header>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Text style={styles.backButtonText}>← {t('actions.cancel')}</Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle}>{t('climbing.add_new_location')}</Text>
      </Modal.Header>

      <Modal.Body>
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>{t('climbing.location_name')}</Text>
          <TextInput
            style={styles.formInput}
            placeholder={t('climbing.enter_location_name')}
            value={formName}
            onChangeText={setFormName}
            autoFocus
          />
        </View>
      </Modal.Body>

      <Modal.Footer>
        <TouchableOpacity
          style={[
            styles.saveButton,
            !formName.trim() && styles.saveButtonDisabled,
          ]}
          onPress={() => onSave(formName.trim())}
          disabled={!formName.trim()}
        >
          <Text style={styles.saveButtonText}>{t('actions.save')}</Text>
        </TouchableOpacity>
      </Modal.Footer>
    </>
  );
};

const styles = StyleSheet.create({
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  formContainer: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CreateLocationForm;
