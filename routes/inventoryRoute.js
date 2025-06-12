// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index");
const invController = require("../controllers/invController");
const { checkAccountRole } = require("../middleware/auth");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by item detail view
router.get("/detail/:invId", invController.buildByInvId);

router.get("/inv", checkAccountRole, invController.buildInventoryManagement);

// New JSON route to get inventory by classification ID
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build the edit inventory item view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventoryView)
);

// Deliver delete confirmation view
router.get("/delete/:inv_id", async (req, res, next) => {
  try {
    await invController.buildDeleteView(req, res);
  } catch (err) {
    next(err);
  }
});

// Handle the actual delete action
router.post("/delete", async (req, res, next) => {
  try {
    await invController.deleteInventory(req, res);
  } catch (err) {
    next(err);
  }
});

/* ***************************
 *  Build edit inventory view
 * ************************** */
invController.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id) // <-- Collect inventory_id as integer
  let nav = await utilities.getNav()

  // Get inventory item data from the model
  const itemData = await invModel.getInventoryById(inv_id)

  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)

  // Build the item name (Make + Model)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  // Render the edit-inventory view with all the item's current data
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

module.exports = router;