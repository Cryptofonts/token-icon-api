const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();

const apiURL = process.env.APIURL;
const bucketURL = process.env.BUCKETURL;
const apikey = process.env.APIKEY;
const headers = {
  apikey: apikey,
};

// Base endpoint
app.get("/", (req, res) => {
  res.json("Cryptofonts to the moon!");
});

// Endpoint for address only
app.get("/:address", async (req, res) => {
  lowercaseAddress = req.params.address.toLowerCase();
  axios
    .get(apiURL + "address=eq." + lowercaseAddress + "&select=name,logoURI,symbol,chainId,decimals,address,chain", { headers })
    .then((response) => {
      const modres = response.data.map((item) => {
        return {
          ...item,
          logoURI: bucketURL + item.logoURI,
        };
      });

      if (modres.length === 0) {
        return res.status(404).json({ error: "No data found for " + lowercaseAddress });
      }

      res.json(modres);
    })
    .catch((error) => {
      console.log("API error: ", error.message);
      res.status(500).json({ error: "An error occurred while fetching data from the API." });
    });
});

// Endpoint for chainId and address (recommended)
app.get("/:chainId/:address", async (req, res) => {
  lowercaseAddress = req.params.address.toLowerCase();
  axios
    .get(apiURL + "chainId=eq." + req.params.chainId + "&address=eq." + lowercaseAddress + "&select=name,logoURI,symbol,chainId,decimals,address,chain", { headers })
    .then((response) => {
      const modres = response.data.map((item) => {
        return {
          ...item,
          logoURI: bucketURL + item.logoURI,
        };
      });

      if (modres.length === 0) {
        return res.status(404).json({ error: "No data found " + lowercaseAddress + " on chain " + req.params.chainId });
      }

      res.json(modres);
    })
    .catch((error) => {
      console.log("API error: ", error.message);
      res.status(500).json({ error: "An error occurred while fetching data from the API." });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
