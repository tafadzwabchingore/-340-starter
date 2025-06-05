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

/* Build detail page by inventory Id */
invCont.buildByInvId = async function (req, res, next) {
  const inventory_id = req.params.invId;
  const data = await invModel.getDetailsByInvId(inventory_id);
  const grid = await utilities.buildDetailGrid(data);
  let nav = await utilities.getNav();
  const carMake = data[0].inv_make;
  const carModel = data[0].inv_model;
  res.render("./inventory/detail", {
    title: `${carMake} ${carModel}`,
    nav,
    grid,
    errors: null,
  });
};

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Managment",
    nav,
    errors: null,
  });
};

invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  //loads page
  res.render("inventory/addClassification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  //runs model
  const { classification_name } = req.body;
  const classificationResult = await classificationModel.addClassification(
    classification_name
  );
  // error message middleware
  if (classificationResult) {
    req.flash(
      "notice",
      `You successfully added ${classification_name} as a classification.`
    );
    let nav = await utilities.getNav();
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    });
  } else {
    req.flash("Sorry, the classification could not be added");
    res.status(201).render("inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/addInventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  });
};

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const invAddResult = await inventoryAddModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (invAddResult) {
    req.flash(
      "notice",
      `You have successfully added the ${inv_make} ${inv_model} to the ${classification_id} classification`
    );
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the vehicle was not added");
    res.status(201).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    });
  }
};

module.exports = invCont;