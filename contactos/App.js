import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { getContacts } from './mock/contactData'; // Importamos los datos de los contactos

const App = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Cargar los contactos cuando se monta el componente
    setContacts(getContacts());
  }, []);

  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactText}>{item.name} {item.lastname} - {item.phone}</Text>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
        <Text style={[styles.favoriteButton, item.favorite ? styles.favorited : null]}>
          {item.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const toggleFavorite = (id) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === id ? { ...contact, favorite: !contact.favorite } : contact
      )
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactText: {
    fontSize: 16,
  },
  favoriteButton: {
    color: 'blue',
  },
  favorited: {
    color: 'red',
  },
});

export default App;
