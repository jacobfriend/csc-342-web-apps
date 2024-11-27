-- @block Journal Entries
SELECT Profiles.name,
    JournalEntries.content,
    JournalEntries.time
FROM (
        SELECT *
        FROM Plants
        WHERE id = 1
    ) AS FilteredPlants
    JOIN Profiles ON Profiles.id = FilteredPlants.profile_id
    JOIN JournalEntries ON JournalEntries.plant_id = FilteredPlants.id -- @block Get Plant by ID and user_id
SELECT *
FROM (
        SELECT *
        FROM Plants
        WHERE Plants.id = 1
            AND Plants.user_id = 1
    ) AS FilteredPlants
    JOIN Profiles ON Profiles.id = FilteredPlants.profile_id -- @block Get Plant by Name and user_id
SELECT *
FROM (
        SELECT *
        FROM Plants
        WHERE Plants.user_id = 1
    ) AS FilteredPlants
    JOIN Profiles ON Profiles.id = FilteredPlants.profile_id
WHERE Profiles.name = "Tomato" -- @block
SELECT Plants.id AS plant_id,
    Plants.profile_id AS profile_id,
    Plants.created_at,
    Plants.last_watered,
    Profiles.name,
    Profiles.image,
    Profiles.water,
    Profiles.sun,
    Profiles.soil,
    Profiles.temp,
    Profiles.info,
    Profiles.tags
FROM Plants
    JOIN Profiles ON Profiles.id = Plants.profile_id
WHERE Plants.id = 1
    AND Plants.user_id = 1