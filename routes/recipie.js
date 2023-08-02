import  express  from "express";
import mongoose from 'mongoose';
import { RecipieModel } from "../models/create-recipie.js";
import { UserModel } from "../models/user.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.post('/',verifyToken,  async (req, res) => {
   const recipie = new RecipieModel(req.body);
    try {
        const newRecipie = await recipie.save();
        res.json(newRecipie);
    } catch(err) {
        res.json(err);
    }
});

router.get('/', async(req, res) => {
    try {
        const response = await RecipieModel.find({});
        res.json(response);

    } catch (error) {
        res.json(err);
    }
});

router.put('/', verifyToken, async(req,res) => {
  
    try {
        const recipie = await RecipieModel.findById(req.body.recipieID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipies.unshift(recipie);  //push()
        await user.save();
        res.json({savedRecipies: user.savedRecipies});
    } catch (error) {
        res.json(error);
    }
});

router.get('/saved-recipies/ids/:userID', async(req, res) => {

    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({savedRecipies: user?.savedRecipies});
    } catch (err) {
        res.json(err);
    }
});

router.get('/saved-recipies/:userID', async(req,res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedRecipies = await RecipieModel.find({
            _id: {$in: user.savedRecipies}
        })
        res.json({savedRecipies});

    } catch(err) {
        res.json(err);
    }
})


//Custom routes for deleting operation
router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id; // This will be set by the verifyToken middleware
      console.log('Recipe ID:', recipeId); // Add this line to log the recipe ID

      const recipe = await RecipieModel.findById(recipeId);
  
      console.log('Recipe:', recipe); 
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });

      }
  
      if (!recipe.userOwner.equals(userId)) {
        return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
        
      }
  
      // User owns the recipe, proceed with the delete
      const deletedRecipe = await RecipieModel.findByIdAndDelete(recipeId);
      res.json({ message: 'Recipe deleted successfully', deletedRecipe });
    } catch (error) {
        
            console.error('Error deleting recipe:', error); // Add this line to log the error
            res.status(500).json({ message: 'Error deleting recipe', error });
          
    }
  });
  


export {router as RecipieRouter};