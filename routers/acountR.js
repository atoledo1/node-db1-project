const express = require("express");
const knexDb = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {
  knexDb
    .select("*")
    .from("accounts")
    .then((accounts) => {
      res.status(200).json({
        data: accounts,
      });
    })
    .catch((err) => {
      console.log("error", err);
      res.status(500).json({
        message: err.message,
      });
    });
});

router.get("/:id", (req, res) => {
  const accountId = req.params.id;
  knexDb
    .select("*")
    .from("accounts")
    .where({
      id: accountId,
    })
    .then((account) => {
      res.status(200).json({
        data: account,
      });
    })
    .catch((err) => {
      console.log("error", err);
      res.status(500).json({
        error: err,
        message: "Error getting account",
      });
    });
});

router.post(
  "/",
  requiredProperty("name"),
  requiredProperty("budget"),
  (req, res) => {
    const newAccount = req.body;
    knexDb("accounts")
      .insert(newAccount, "id")
      .then(([id]) => {
        res.status(201).json({ newAccountId: id });
      })
      .catch((err) => {
        console.log("error", err);
        res.status(500).json({ message: err.message });
      });
  }
);

router.put(
  "/:id",
  requiredProperty("name"),
  requiredProperty("budget"),
  (req, res) => {
    const { id } = req.params;
    const updatedAccount = req.body;
    knexDb("accounts")
      .where({ id: id })
      .update(updatedAccount)
      .then((count) => {
        if (count === 1) {
          res.status(200).json({ count });
        } else {
          res.status(404).json({
            message: "Error updating acount",
          });
        }
      })
      .catch((err) => {
        console.log("error", err);
        res.status(500).json({
          message: err.message,
        });
      });
  }
);

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  knexDb("accounts")
    .where({ id: id })
    .delete()
    .then((count) => {
      if (count === 1) {
        res.status(200).json({ count });
      } else {
        res.status(404).json({
          message: "Not found",
        });
      }
    })
    .catch((err) => {
      console.log("error", err);
      res.status(500).json({
        message: err.message,
      });
    });
});

function requiredProperty(property) {
  return function (req, res, next) {
    if (!req.body[property]) {
      res.status(400).json({ message: `Needs to have a ${property} property` });
    } else {
      next();
    }
  };
}

module.exports = router;
