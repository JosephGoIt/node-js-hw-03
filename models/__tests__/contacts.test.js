const fs = require('fs/promises');
const path = require('path');
const contactsModel = require('../contacts');
jest.mock('fs/promises');

const mockContacts = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321' },
];

const contactsPath = path.join(__dirname, '../contacts.json');
const tempContactsPath = `${contactsPath}.tmp`;

describe('Contacts Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listContacts should return all contacts', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockContacts));
    const contacts = await contactsModel.listContacts();
    expect(contacts).toEqual(mockContacts);
  });

  test('getContactById should return a contact by ID', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockContacts));
    const contact = await contactsModel.getContactById('1');
    expect(contact).toEqual(mockContacts[0]);
  });

  test('getContactById should return null if contact not found', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockContacts));
    const contact = await contactsModel.getContactById('3');
    expect(contact).toBeNull();
  });

  test('addContact should add a new contact', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockContacts));
    fs.writeFile.mockResolvedValue();

    const newContact = { name: 'New Contact', email: 'new@example.com', phone: '1122334455' };
    const result = await contactsModel.addContact(newContact);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(newContact.name);
    expect(fs.writeFile).toHaveBeenCalledWith(
      tempContactsPath,
      expect.stringContaining(newContact.name)
    );
  });

  test('removeContact should remove a contact by ID', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockContacts));
    fs.writeFile.mockResolvedValue();

    const result = await contactsModel.removeContact('1');
    expect(result).toBe(true);
    expect(fs.writeFile).toHaveBeenCalledWith(
      tempContactsPath,
      expect.not.stringContaining(mockContacts[0].name)
    );
  });

  test('updateContact should update an existing contact', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockContacts));
    fs.writeFile.mockResolvedValue();

    const updatedContact = { name: 'Updated Name' };
    const result = await contactsModel.updateContact('1', updatedContact);

    expect(result).toEqual({ ...mockContacts[0], ...updatedContact });
    expect(fs.writeFile).toHaveBeenCalledWith(
      tempContactsPath,
      expect.stringContaining(updatedContact.name)
    );
  });

  test('updateContact should return null if contact not found', async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(mockContacts));

    const updatedContact = { name: 'Updated Name' };
    const result = await contactsModel.updateContact('3', updatedContact);

    expect(result).toBeNull();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
});
