const request = require('supertest');
const app = require('../app');
const contactsModel = require('../models/contacts');

jest.mock('../models/contacts');

describe('Contacts API', () => {
  const mockContacts = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/contacts should return all contacts', async () => {
    contactsModel.listContacts.mockResolvedValue(mockContacts);
    const response = await request(app).get('/api/contacts');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockContacts);
  });

  test('GET /api/contacts/:contactId should return a contact by ID', async () => {
    contactsModel.getContactById.mockResolvedValue(mockContacts[0]);
    const response = await request(app).get('/api/contacts/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockContacts[0]);
  });

  test('POST /api/contacts should create a new contact', async () => {
    const newContact = { id: '3', name: 'New Contact', email: 'new@example.com', phone: '1122334455' };
    contactsModel.addContact.mockResolvedValue(newContact);
    const response = await request(app)
      .post('/api/contacts')
      .send({ name: 'New Contact', email: 'new@example.com', phone: '1122334455' });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(newContact);
  });

  test('PUT /api/contacts/:contactId should update a contact', async () => {
    const updatedContact = { id: '1', name: 'Updated Name', email: 'updated@example.com', phone: '1234567890' };
    contactsModel.updateContact.mockResolvedValue(updatedContact);
    const response = await request(app)
      .put('/api/contacts/1')
      .send({ name: 'Updated Name', email: 'updated@example.com', phone: '1234567890' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updatedContact);
  });

  test('DELETE /api/contacts/:contactId should delete a contact', async () => {
    contactsModel.removeContact.mockResolvedValue(true);
    const response = await request(app).delete('/api/contacts/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Contact deleted' });
  });
});
