let contacts = [
  { id: 1, name: 'Juan', lastname: 'Pérez', phone: '123456789', favorite: false },
  { id: 2, name: 'Ana', lastname: 'Gómez', phone: '987654321', favorite: false },
  { id: 3, name: 'Luis', lastname: 'Rodríguez', phone: '555555555', favorite: false },
];

export const getContacts = () => {
  return contacts;
};

export const saveContact = (newContact) => {
  contacts.push(newContact); 
};
