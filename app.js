var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");
require("dotenv").config();

const { connectToMongoDb } = require("./config/db");

// import routes
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

var app = express();

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/auth", authRoutes);
app.use("/wallet", walletRoutes);
app.use("/transactions", transactionRoutes);

// server create
const server = http.createServer(app);
const PORT = process.env.PORT || process.env.port || 5000;

connectToMongoDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Mongo connection failed, server not started:", err.message);
    process.exit(1);
  });

// Gestion de l'erreur EADDRINUSE (port déjà utilisé)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Erreur: Le port ${PORT} est déjà utilisé.`);
    console.error(`💡 Solutions:`);
    console.error(`   1. Arrêtez le processus qui utilise le port ${PORT}`);
    console.error(`   2. Changez le PORT dans le fichier .env`);
    console.error(`   3. Pour tuer le processus, exécutez: taskkill /PID <PID> /F`);
  } else {
    console.error('Erreur serveur:', err.message);
  }
  process.exit(1);
});
