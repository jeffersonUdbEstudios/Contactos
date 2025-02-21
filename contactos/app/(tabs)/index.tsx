import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { getContacts, saveContact } from '../../mock/contactData'; // Importamos los datos y función para guardar contacto

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', lastname: '', phone: '' });

  useEffect(() => {
    // Cargar los contactos cuando se monta el componente y ordenarlos por favoritos
    const sortedContacts = getContacts().sort((a, b) => b.favorite - a.favorite); // Los favoritos primero
    setContacts(sortedContacts);
  }, []);

  const renderContact = ({ item }) => (
    <View style={[styles.contactItem, item.favorite && styles.favoriteItem]}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactText}>{item.name} {item.lastname}</Text>
        <Text style={styles.phoneText}>{item.phone}</Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Text style={[styles.favoriteButton, item.favorite ? styles.favorited : null]}>
            {item.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteContact(item.id)}>
          <Text style={styles.deleteButton}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const toggleFavorite = (id) => {
    setContacts((prevContacts) => {
      const updatedContacts = prevContacts.map((contact) =>
        contact.id === id ? { ...contact, favorite: !contact.favorite } : contact
      );
      return updatedContacts.sort((a, b) => b.favorite - a.favorite); // Reordenar después de modificar
    });
  };

  const deleteContact = (id) => {
    Alert.alert(
      "Eliminar contacto",
      "¿Estás seguro de que deseas eliminar este contacto?",
      [
        { text: "Cancelar" },
        { text: "Eliminar", onPress: () => setContacts((prevContacts) => {
          const filteredContacts = prevContacts.filter(contact => contact.id !== id);
          return filteredContacts.sort((a, b) => b.favorite - a.favorite); // Reordenar después de eliminar
        }) }
      ]
    );
  };

  const addContact = () => {
    if (!newContact.name || !newContact.lastname || !newContact.phone) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    const newId = contacts.length + 1;
    const contact = {
      id: newId,
      name: newContact.name,
      lastname: newContact.lastname,
      phone: newContact.phone,
      favorite: false,
    };
    saveContact(contact); // Guardamos el contacto
    setContacts((prevContacts) => {
      const updatedContacts = [...prevContacts, contact];
      return updatedContacts.sort((a, b) => b.favorite - a.favorite); // Reordenar después de agregar
    });
    setModalVisible(false);
    setNewContact({ name: '', lastname: '', phone: '' });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar contacto</Text>
      </TouchableOpacity>

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Modal para agregar contacto */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nuevo Contacto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newContact.name}
              onChangeText={(text) => setNewContact({ ...newContact, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={newContact.lastname}
              onChangeText={(text) => setNewContact({ ...newContact, lastname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={newContact.phone}
              onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
              keyboardType="phone-pad"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={addContact}>
                <Text style={styles.modalButtonText}>Agregar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  favoriteItem: {
    backgroundColor: '#fff4e5', // Fondo suave para destacar el favorito
    borderColor: '#FFD700', // Borde dorado
    borderWidth: 2, // Borde más grueso para resaltar
  },
  contactInfo: {
    flex: 1,
    paddingRight: 10,
  },
  contactText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneText: {
    fontSize: 14,
    color: '#777',
  },
  contactActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  favoriteButton: {
    color: 'blue',
    fontSize: 14,
    marginBottom: 5,
  },
  favorited: {
    color: 'red',
    fontWeight: 'bold', // Resaltar el texto cuando es favorito
  },
  deleteButton: {
    color: 'red',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
