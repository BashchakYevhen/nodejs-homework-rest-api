const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "./contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  const dataParse = JSON.parse(data);
  return dataParse;
}

async function getContactById(contactId) {
  const getContactsList = await listContacts();
  const getContactById = getContactsList.find(
    (item) => item.id === contactId.toString()
  );

  if (!getContactById) {
    return null;
  }
  return getContactById;
}

async function removeContact(contactId) {
  const getContactsList = await listContacts();
  const getContactById = getContactsList.find(
    (item) => item.id === contactId.toString()
  );
  if (!getContactById) {
    return null;
  }
  const contactsList = getContactsList.filter(
    (item) => item.id !== contactId.toString()
  );
  await fs.writeFile(contactsPath, JSON.stringify(contactsList));
  return contactsList;
}
async function addContact(newContact) {
  const getContactsList = await listContacts();
  const updatedContactList = [...getContactsList, newContact];
  fs.writeFile(contactsPath, JSON.stringify(updatedContactList));
  return newContact;
}

async function updateContact({ contactId }, { name, phone, email }) {
  const getContactsList = await listContacts();
  const indx = getContactsList.findIndex(
    (it) => it.id === contactId.toString()
  );
  if (indx === -1) {
    return;
  }
  const getContactById = getContactsList.find(
    (item) => item.id === contactId.toString()
  );
  if (!getContactById) {
    return null;
  }
  if (name) {
    getContactById.name = name;
  }
  if (phone) {
    getContactById.phone = phone;
  }
  if (email) {
    getContactById.email = email;
  }
  getContactsList.splice(indx, 1, getContactById);
  fs.writeFile(contactsPath, JSON.stringify(getContactsList));
  return getContactById;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
