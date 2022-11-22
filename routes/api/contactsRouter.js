const express = require("express");
const router = express.Router();

const contactControllers = require("../../controllers/controllers");
const { tryCatch } = require("../../TryCatchWrapper/TryCatchWrapper");

router.get("/", tryCatch(contactControllers.getAllContacts));

router.get("/:contactId", tryCatch(contactControllers.getContactByID));

router.post("/", tryCatch(contactControllers.addContact));

router.delete("/:contactId", tryCatch(contactControllers.deleteContact));

router.put("/:contactId", tryCatch(contactControllers.updateContact));

router.patch(
  "/:contactId/favorite",
  tryCatch(contactControllers.updateStatusContact)
);
module.exports = router;
