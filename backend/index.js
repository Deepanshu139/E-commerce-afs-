const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize('ayush', 'postgres', 'Ayush@346', {
  host: 'localhost',
  dialect: 'postgres'
});

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Error synchronizing database:', err);
});

//Add Product
app.post('/products', async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      description
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: 'Error adding product' });
  }
});
app.get('/products', async (req, res) => {
    try {
      const products = await Product.findAll();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, error: 'Error fetching products' });
    }
  });
  
  // Read a single product
  app.get('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (product) {
        res.status(200).json({ success: true, data: product });
      } else {
        res.status(404).json({ success: false, error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ success: false, error: 'Error fetching product' });
    }
  });
  
  // Update a product
  app.put('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, description } = req.body;
  
      const product = await Product.findByPk(id);
      if (product) {
        await product.update({
          name,
          price,
          description
        });
        res.status(200).json({ success: true, data: product });
      } else {
        res.status(404).json({ success: false, error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ success: false, error: 'Error updating product' });
    }
  });
  
  // Delete a product
  app.delete('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (product) {
        await product.destroy();
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ success: false, error: 'Product not found' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ success: false, error: 'Error deleting product' });
    }
  });

const PORT =  8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});