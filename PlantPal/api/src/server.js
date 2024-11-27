const express = require("express");
const userRoutes = require("./routes/user");
const plantRoutes = require("./routes/plant");
const templateRoutes = require("./routes/template");
const weatherRoutes = require("./routes/weather");

//notifications import
const { notificationRouter } = require("./routes/NotificationRoutes");

const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(userRoutes);
app.use(plantRoutes);
app.use(templateRoutes);
app.use(weatherRoutes);
app.use(notificationRouter);

//use websocket
// app.use(websocketRoutes);
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
