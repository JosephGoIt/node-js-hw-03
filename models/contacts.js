const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactPath = path.join(__dirname, process.env.CONTACTS_PATH || 'contacts.json');

const readContacts = async () => {
    try {
        const data = await fs.readFile(contactPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading contacts file:', error);
        throw new Error('Could not retrieve contacts');
    }
};

const writeContacts = async (contacts) => {
    const tempFilePath = `${contactPath}.tmp`;
    try {
        await fs.writeFile(tempFilePath, JSON.stringify(contacts, null, 2));
        await fs.rename(tempFilePath, contactPath);
    } catch (error) {
        console.error('Error writing contacts file:', error);
        throw new Error('Could not save contacts');
    }
};

const listContacts = async () => {
    return await readContacts();
};

const getContactById = async (contactId) => {
    const contacts = await readContacts();
    return contacts.find(contact => contact.id === contactId) || null;
};

const removeContact = async (contactId) => {
    const contacts = await readContacts();
    const filteredContacts = contacts.filter(contact => contact.id !== contactId);
    if (contacts.length === filteredContacts.length) {
        return false; // Contact not found
    }
    await writeContacts(filteredContacts);
    return true;
};

const addContact = async (body) => {
    const contacts = await readContacts();
    const newContact = { id: uuidv4(), ...body };
    contacts.push(newContact);
    await writeContacts(contacts);
    return newContact;
};

const updateContact = async (contactId, body) => {
    const contacts = await readContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    contacts[index] = { ...contacts[index], ...body };
    await writeContacts(contacts);
    return contacts[index];
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
