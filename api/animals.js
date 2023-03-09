const express = require('express');
const router = express.Router();
const { requireAdmin, requireCustomer } = require('./utils');
const {
    getAllAnimals,
    getAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    createorderItem
} = require('../db');
const { attachAnimalsToorderItem } = require('../db/models/animals');

// GET /api/animals
router.get('/', async (req, res) => {
    const allAnimals = await getAllAnimals();
    res.send(allAnimals);
});

// POST /api/animals
router.post('/', requireAdmin, async (req, res, next) => {
    const { categoryId, breed_name, image_url, description, inventory_count, price, gender } = req.body;
  
    try {
        const newAnimal = await createAnimal({ categoryId, breed_name, image_url, description, inventory_count, price, gender });
        res.send(newAnimal);
        
    } catch(error) {
        next(error)
    } 
});

router.post('/addtocart', requireCustomer, async (req, res, next) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const customerId = req.user.id;
  
    try {
        const animalToCart = await getAllAnimals ()
        res.send(animalToCart);

        const newOrderItem = await attachAnimalsToorderItem(order_item)
        
    } catch(error) {
        next(error)
    } 
});

// PATCH /api/animals/:id
router.patch("/:id", requireAdmin, async (req, res, next) => {
    const { id } = req.params;
    const { categoryId, breed_name, image_url, description, inventory_count, price, gender } = req.body;

    try {
        const updatedAnimal = await updateAnimal({ id, categoryId, breed_name, image_url, description, inventory_count, price, gender });
        res.send(updatedAnimal)

    } catch (error) {
        console.log(error);
        next(error);
    }
})

// DELETE /api/animals/:id
router.delete("/:id", requireAdmin, async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedAnimal = await deleteAnimal(id);
        res.send(deletedAnimal)

    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router;
