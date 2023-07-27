const PORT = 8500;
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

app.get("/ping", (req, res) => {
  res.json("Cryptofonts to the moon!");
});

// Endpoint for address only
app.get("/:address", async (req, res) => {
  axios
    .get(apiURL + "address=eq." + req.params.address + "&select=name,logoURI,symbol,chainId,decimals,address,chain", { headers })
    .then((response) => {
      const modres = response.data.map((item) => {
        return {
          ...item,
          logoURI: bucketURL + item.logoURI,
        };
      });
      res.json(modres);
    })
    .catch((error) => {
      console.log("API error: ", error.message);
      res.status(500).json({ error: "An error occurred while fetching data from the API." });
    });
});

// Endpoint for chainId and address (recommended)
app.get("/:chainId/:address", async (req, res) => {
  axios
    .get(apiURL + "chainId=eq." + req.params.chainId + "&address=eq." + req.params.address + "&select=name,logoURI,symbol,chainId,decimals,address,chain", { headers })
    .then((response) => {
      const modres = response.data.map((item) => {
        return {
          ...item,
          logoURI: bucketURL + item.logoURI,
        };
      });
      res.json(modres);
    })
    .catch((error) => {
      console.log("API error: ", error.message);
      res.status(500).json({ error: "An error occurred while fetching data from the API." });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("SIGINT", () => {
  console.log("\nClosing the server...");

  // Close the server and free up the port
  server.close((err) => {
    if (err) {
      console.error("Error while closing the server:", err);
      process.exit(1); // Exit the process with an error code (optional)
    }

    console.log("Server has been closed successfully.");
    process.exit(0); // Exit the process with a success code (optional)
  });
});
