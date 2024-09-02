const express = require('express');
const Joi = require('joi');
const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
} = require('../../models/contacts');
const router = express.Router();

const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
});

router.get('/:contactId', async (req, res, next) => {
    try {
        const contacts = await listContacts();
        const contact = await getContactById(req.params.contactId, contacts);
        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { error } = contactSchema.validate(req.body);
        if (error) {
            console.error(`Validation Error: `, error.details) // add logs to see why this fails the test
            return res.status(400).json({ message: `missing required ${error.details[0].path[0]} field` });
        }
        const newContact = await addContact(req.body);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
});

router.delete('/:contactId', async (req, res, next) => {
    try {
        const success = await removeContact(req.params.contactId);
        if (success) {
            res.status(200).json({ message: 'Contact deleted' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        next(error);
    }
});

router.put('/:contactId', async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        const updatedContact = await updateContact(req.params.contactId, req.body);
        if (updatedContact) {
            res.status(200).json(updatedContact);
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
