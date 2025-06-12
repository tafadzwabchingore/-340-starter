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

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildHome = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("index", {
  title: "Welcome to CSE Motors",
  nav: utilities.getNav()
  })
}

/* ***************************
 * Build Delete Confirmation View
 * *************************** */

invCont.buildDeleteView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);
  const data = await invModel.getInventoryItemById(inv_id);
  const item = data.rows[0];

  const nav = await getNav(); // if you use a navigation builder
  const name = `${item.inv_make} ${item.inv_model}`;

  res.render("./inventory/delete-confirm", {
    title: `Delete ${name}`,
    nav,
    inv_id: item.inv_id,
    invMake: item.inv_make,
    invModel: item.inv_model,
    invYear: item.inv_year,
    invPrice: item.inv_price,
    errors: null
  });
}

/* ***************************
 * Process Inventory Deletion
 * *************************** */
invCont.deleteInventory = async function (req, res) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult.rowCount > 0) {
    req.flash("notice", "The inventory item was successfully deleted.");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect(`/inv/delete/${inv_id}`);
  }
}

invCont.buildInventoryManagement = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  });
}

module.exports = invCont;