const express = require("express");
const shortid = require("shortid");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const router = express.Router();
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();

  return res.status(200).send(contacts);
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(400).json({ message: "Not found" });
  }
  return res.status(200).send(contact);
});

router.post("/", async (req, res, next) => {
  const { name, phone, email } = req.body;
  const { error } = schema.validate({ name, email, phone });
  if (error) {
    return res.status(400).json({
      message: "missing required name field",
    });
  }
  const newContact = { id: shortid.generate(), name, email, phone };

  res.status(201).send(addContact(newContact));
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  return res.status(200).send(removeContact(contactId));
});

router.put("/:contactId", async (req, res, next) => {
  const { name, phone, email } = req.body;
  const body = { name, phone, email };
  const contactId = req.params;
  if (!body) {
    return res.status(400).json({ message: "missing fields" });
  }
  const { error } = schema.validate({ name, email, phone });
  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
  const refreshContact = await updateContact(contactId, body);
  res.status(200).send(refreshContact);
});

module.exports = router;
