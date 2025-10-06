import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native'; // para manejar Android/iOS

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";

export default function ExperienceScreen() {
    const router = useRouter();
    const { cvData, addExperience, deleteExperience } = useCVContext();
    // Estados para manejar el DatePicker
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);


    const [formData, setFormData] = useState<Omit<Experience, "id">>({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
    });

    const handleAdd = () => {

        const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

        if (!formData.company || !formData.position || !formData.startDate) {
            Alert.alert(
                "Error",
                "Por favor completa al menos empresa, cargo y fecha de inicio"
            );
            return;
        }

        if (!onlyLettersRegex.test(formData.company.trim())) {
            Alert.alert("El campo 'Empresa' solo debe contener letras.");
            return;
        }

        if (formData.position.trim().length > 30) {
            Alert.alert("Campo inválido", "El campo 'Cargo' no puede tener más de 30 caracteres.");
            return;
        }


        if (!onlyLettersRegex.test(formData.position.trim())) {
            Alert.alert("El campo 'Cargo' solo debe contener letras.");
            return;
        }

        if (formData.position.trim().length > 30) {
            Alert.alert("Campo inválido", "El campo 'Cargo' no puede tener más de 30 caracteres.");
            return;
        }


        const newExperience: Experience = {
            id: Date.now().toString(),
            ...formData,
        };

        addExperience(newExperience);

        // Limpiar formulario
        setFormData({
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
        });

        Alert.alert("Éxito", "Experiencia agregada correctamente");
    };

    const handleDelete = (id: string) => {
        Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: () => deleteExperience(id),
            },
        ]);
    };

    //Logica DatePicker
    const handleDateChange = (event: any, selectedDate: Date | undefined, field: 'startDate' | 'endDate') => {
        if (selectedDate) {
            const formattedDate = selectedDate.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
            });

            setFormData({ ...formData, [field]: formattedDate });
        }

        if (Platform.OS === 'android') {
            if (field === 'startDate') setShowStartPicker(false);
            else setShowEndPicker(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

                <InputField
                    label="Empresa *"
                    placeholder="Nombre de la empresa"
                    value={formData.company}
                    onChangeText={(text) => setFormData({ ...formData, company: text })}
                    maxLength={30}
                />

                <InputField
                    label="Cargo *"
                    placeholder="Tu posición"
                    value={formData.position}
                    onChangeText={(text) => setFormData({ ...formData, position: text })}
                    maxLength={30}
                />

                {/* Fecha de inicio */}
                <Text style={styles.label}>Fecha de Inicio *</Text>
                <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
                    <Text style={{ color: formData.startDate ? "#000" : "#999" }}>
                        {formData.startDate || "Selecciona la fecha de inicio"}
                    </Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => handleDateChange(event, date, 'startDate')}
                    />
                )}

                {/* Fecha de fin */}
                <Text style={styles.label}>Fecha de Fin</Text>
                <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
                    <Text style={{ color: formData.endDate ? "#000" : "#999" }}>
                        {formData.endDate || "Selecciona la fecha de fin"}
                    </Text>
                </TouchableOpacity>
                {showEndPicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, date) => handleDateChange(event, date, 'endDate')}
                    />
                )}

                <InputField
                    label="Descripción"
                    placeholder="Describe tus responsabilidades y logros..."
                    value={formData.description}
                    onChangeText={(text) =>
                        setFormData({ ...formData, description: text })
                    }
                    multiline
                    numberOfLines={4}
                    style={{ height: 100, textAlignVertical: "top" }}
                />

                <NavigationButton title="Agregar Experiencia" onPress={handleAdd} />

                {cvData.experiences.length > 0 && (
                    <>
                        <Text style={styles.listTitle}>Experiencias Agregadas</Text>
                        {cvData.experiences.map((exp) => (
                            <View key={exp.id} style={styles.card}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{exp.position}</Text>
                                    <Text style={styles.cardSubtitle}>{exp.company}</Text>
                                    <Text style={styles.cardDate}>
                                        {exp.startDate} - {exp.endDate || "Actual"}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDelete(exp.id)}
                                >
                                    <Text style={styles.deleteButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </>
                )}

                <NavigationButton
                    title="Volver"
                    onPress={() => router.back()}
                    variant="secondary"
                    style={{ marginTop: 16 }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2c3e50",
        marginTop: 24,
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#7f8c8d",
        marginBottom: 4,
    },
    cardDate: {
        fontSize: 12,
        color: "#95a5a6",
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#e74c3c",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        color: '#2c3e50',
    },
    dateInput: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
    },
});
