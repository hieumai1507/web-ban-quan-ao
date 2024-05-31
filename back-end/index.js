const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://hieumai1507:Hieumai1507!@cluster0.24wk4vb.mongodb.net/e-commerce")

//API Creation

app.get("/", (request, respone) => {
  respone.send("Express App is Running")
})

//Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images/',
  filename:(request, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
})

const upload = multer({storage: storage})

// Creating Upload Endpoint for Images

app.use('/images', express.static('upload/images'))
app.post("/upload", upload.single('product'), (request, respone) => {
  respone.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${request.file.filename}`
  })
})

// Schema for creating Products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avilable: {
    type: Boolean,
    default: true,
  },
})

// Creating Product Endpoint
app.post('/addproduct', async (req, res) => {
  let products = await Product.find({});
  let id;
  if(products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  }
  else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  })
})

//Creating API for deleting Products

app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({
    id:req.body.id
  });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  })
})

//Creating API for getting all products
app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
})

//Schema creating for user model
const User = mongoose.model("User", {
    name :{
      type: String,
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
    },
    cartData: {
      type: Object,
    },
    date: {
      type: Date,
      default: Date.now,
    }

})

//creating Endpoint for register the user
app.post('/signup', async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, error: "Existing User found with the same email address" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();
  const data = {
    user: {
      id: user.id,
    }
  }

  const token = jwt.sign(data, 'secret_ecom');
  res.json({ success: true, token });
});


//creating endpoint for user login

app.post('/login', async (req, res) => {
  let user = await User.findOne({email: req.body.email});
  if(user) {
    const passCompare = req.body.password === user.password;
    if(passCompare) {
      const data = {
        user: {
          id: user.id,
        }
      }
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token});
    }
    else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  }
  else {
    res.json({ success: false, errors: "Wrong Email Id" });
  }
});

//creating endpoint for new collection data
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let new_collection = products.slice(1).slice(-8);
  console.log("New collection fetched");
  res.send(new_collection);
})

//creating endpoint for popular in women section

app.get('/popularinwomen', async (req,res) => {
  let products = await Product.find({category: "women"});
  let popular_inwomen = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_inwomen);
})


app.listen(port, (error) => {
  if(!error) {
      console.log("Server Running on Port " + port);
  }
  else {
      console.log("Error occurred, server can't start. Error: ", error);
  }

});