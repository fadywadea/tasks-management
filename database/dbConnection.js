"use strict";

import { connect } from "mongoose";

export const dbConnection = connect("mongodb://127.0.0.1:27017/ManageTasks")
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log(`Error Connecting to the Database: ${error}`);
  });
