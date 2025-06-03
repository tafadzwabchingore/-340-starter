const invModel = require("../models/inventory-model")
//const revModel = require("../models/review-model"); // Make sure this is included
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inventory_id = req.params.inventoryId
  const data = await invModel.getDetailByInventoryId(inventory_id)
  const listing = await utilities.buildDetailGrid(data[0])
  const itemName = `${data[0].inv_make} ${data[0].inv_model}`
  const reviews = await revModel.getReviewsByInventory(inventory_id)
  res.render("inventory/listing", {
    title: itemName,
    nav,
    listing,
    reviews,
    inv_id: inventory_id,
  })
}

module.exports = invCont;