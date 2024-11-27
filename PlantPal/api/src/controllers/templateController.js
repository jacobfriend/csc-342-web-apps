const db = require("../db/DBConnection");
const Profile = require("../db/models/Profile");

module.exports = {
  getPlantTemplates: () => {
    return db.query("SELECT * FROM Profiles").then((rows) => {
      return rows.map((row) => new Profile(row));
    });
  },

  addProfile: (user_id, name, image, water, sun, soil, temp, info) => {
    // Check if the plant profile already exists
    return db
      .query(`SELECT id FROM Profiles WHERE name = ?`, [name])
      .then(async (rows) => {
        let profileId;
  
        if (rows.length > 0) {
          // Plant profile exists, get its ID
          profileId = rows[0].id;
          console.log("Plant profile already exists with ID:", profileId);
        } else {
          // Plant profile does not exist, create a new one
          const result = await db.query(
            `INSERT INTO Profiles (name, image, water, sun, soil, temp, info, tags) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, image, water, sun, soil, temp, info, null]
          );
          profileId = result.insertId;
          console.log("New plant profile created with ID:", profileId);
        }
  
        // Fetch and return the full profile JSON
        const [profile] = await db.query(`SELECT * FROM Profiles WHERE id = ?`, [profileId]);
        return profile; // Return the profile JSON
      })
      .catch((err) => {
        console.error("Error adding plant:", err);
        throw err;
      });
  },  

  // Remove existing template from the database
  removeProfile: async (profile_name) => {
    try {
      // Find the profile by name
      const [profile] = await db.query(
        `SELECT id FROM Profiles WHERE name = ?`,
        [profile_name]
      );
  
      if (!profile) {
        console.error("No profile found for name:", profile_name);
        throw new Error("Profile not found.");
      }
  
      const profileId = profile.id;
      console.log("Found profile ID:", profileId);
  
      // Delete the profile itself
      const profileDeletion = await db.query(
        `DELETE FROM Profiles WHERE id = ?`,
        [profileId]
      );
  
      if (profileDeletion.affectedRows === 0) {
        console.error("Failed to delete profile ID:", profileId);
        throw new Error("Profile deletion failed.");
      }
  
      console.log("Profile deleted successfully:", profile_name);
      return { message: "Profile removed successfully." };
    } catch (err) {
      console.error("Error removing profile:", err);
      throw err;
    }
  },      

};
