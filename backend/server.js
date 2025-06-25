const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const setupAuthRoutes = require('./routes/auth');
const ProductRoutes=require('./routes/Product');
const CategoryRoutes=require('./routes/Category');
const app = express();
const port = 5000;
const cookieParser = require('cookie-parser');

app.use(cors({
  origin: "http://localhost:3000",  // your frontend origin
  credentials: true                 // ✅ allow cookies & credentials
}));

app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
const uri = "mongodb+srv://abhishekpes123:madhavan123@cluster0.ttxbiv7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;

async function connectToMongo() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    db = client.db("users");

    // Use auth routes
    app.use('/auth', setupAuthRoutes(db));
    app.use('/product',ProductRoutes(db));
   app.use('/category', CategoryRoutes(db));

    // Sample route
    app.get('/', (req, res) => {
      res.send('API is running');
    });

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

connectToMongo();

