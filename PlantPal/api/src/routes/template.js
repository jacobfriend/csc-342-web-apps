const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const { TokenMiddleware } = require("../middleware/TokenMiddleware");
const upload = require("../util/multer");

//register user endpoint
router.get("/templates", TokenMiddleware, (req, res) => {
	templateController.getPlantTemplates().then(templates => {
		res.json(templates);
	}).catch(err => {
		res.status(500).json({error: 'Internal Server Error'});
	});
});

router.post(
  "/templates",
  TokenMiddleware,
  upload.single("image"), // Multer for image upload
  async (req, res) => {
    try {

      const { id, name, water, sun, soil, temp, info, tags } = req.body;

      // Construct the image path based on the uploaded file
      const imagePath = req.file ? `${req.file.originalname}` : null;

      // Add the plant profile and get the new profile JSON
      const newProfile = await templateController.addProfile(
        req.user.id,
        name,
        imagePath,
        water,
        sun,
        soil,
        temp,
        info
      );

      return res.status(201).json(newProfile); // Send the profile JSON
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Failed to add plant profile." });
    }
  }
);

router.delete(
  "/templates/:templateName",
  TokenMiddleware, async(req, res) => {
    const templateName = req.params.templateName;
    try{
      console.log("Deleting profile: " + templateName);
      await templateController.removeProfile(templateName);
      return res.json({message: "Successfully removed profile."});
    } catch (err) {
      return res
        .status(404)
        .json({ message: "Plant could not be deleted." });
    }
  }
);

module.exports = router;
