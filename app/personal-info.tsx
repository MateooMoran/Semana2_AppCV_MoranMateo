import { View, Text, Alert, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useCVContext } from '@/context/CVContext';
import { PersonalInfo } from '@/types/cv.types';
import { InputField } from '@/components/InputField';
import { NavigationButton } from '@/components/NavigationButton';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo } = useCVContext();

  const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);

  useEffect(() => {
    setFormData(cvData.personalInfo);
  }, [cvData.personalInfo]);

  const handleSave = () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\s()-]{7,20}$/;

    if (!formData.fullName || !formData.email) {
      Alert.alert('Error', 'Por favor, complete los campos obligatorios.');
      return;
    }
     if (!emailRegex.test(formData.email.trim())) {
    Alert.alert('Error', 'El formato del email no es válido.');
    return;
  }
   if (formData.phone && !phoneRegex.test(formData.phone.trim())) {
    Alert.alert('Error', 'El número de teléfono no es válido.');
    return;
  }

    updatePersonalInfo(formData);
    Alert.alert('Éxito', 'Información personal guardada.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <InputField
        label="Nombre Completo *"
        placeholder="Mateo Moran"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />
      <InputField
        label="Email *"
        placeholder="mateomoran2000@gmail.com"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <InputField
        label="Teléfono"
        placeholder="+593 98 440 9644"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        keyboardType="phone-pad"

      />
      <InputField
        label="Ubicación"
        placeholder="Quito, Ecuador"
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
      />
      <InputField
        label="Resumen Profesional"
        placeholder="Describe brevemente tu perfil profesional..."
        value={formData.summary}
        onChangeText={(text) => setFormData({ ...formData, summary: text })}
        multiline
        numberOfLines={4}
        style={{ height: 100, textAlignVertical: 'top' }}
      />

      <NavigationButton
        title="Guardar Información"
        onPress={handleSave}
      />

      <NavigationButton
        title="Cancelar"
        variant="secondary"
        onPress={() => router.back()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
});
