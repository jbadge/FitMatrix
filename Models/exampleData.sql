-- Ensure we truncate the table and restart the identity so our Id column starts at 1 each time
TRUNCATE TABLE "Measurements", "Stats", "Goals", "Progress", "Users" RESTART IDENTITY;

-- Ensure we have a user to associate to the stats below
INSERT INTO "Users" ("FullName", "Email", "HashedPassword") VALUES ('Jeremy Badger', 'badger@suncoast.io', 'AQAAAAIAAYagAAAAECQCQXCdJ+klkUJrmKa+TC+snEorioNo61ZLi7m9OJ0q7h/91NvCVC4jpn7/ill29A==');
INSERT INTO "Users" ("FullName", "Email", "HashedPassword") VALUES ('Sarah', 'badger2@suncoast.io', 'AQAAAAIAAYagAAAAECQCQXCdJ+klkUJrmKa+TC+snEorioNo61ZLi7m9OJ0q7h/91NvCVC4jpn7/ill29A==');
INSERT INTO "Users" ("FullName", "Email", "HashedPassword") VALUES ('Mary', 'badger3@suncoast.io', 'AQAAAAIAAYagAAAAECQCQXCdJ+klkUJrmKa+TC+snEorioNo61ZLi7m9OJ0q7h/91NvCVC4jpn7/ill29A==');

INSERT INTO "Stats" ("UserId", "Age", "DoB", "Sex", "HeightImperial", "HeightMetric", "WeightImperial", "WeightMetric", "ActivityLevel", "ActivityLevelLabel", "BodyFatPercent") VALUES (1, 48, '1976-03-03 00:00:00-08', 'M', 72, 182.88000000073154, 197.2, 83.46099608, 1.425, 'Light', 16);
      

INSERT INTO "Goals" ("UserId", "GoalSelection", "GoalWeightLoseImperial", "GoalRateLoseImperial", "GoalWeightGainImperial", "GoalRateGainImperial", "GoalWeightLoseMetric", "GoalRateLoseMetric", "GoalWeightGainMetric", "GoalRateGainMetric", "GoalDate", "GoalBodyFatPercent") VALUES (1, 'lose', 176, 2, 192, 2, 79.83225712000001, 0.90718474, 87.08973504000001, 0.90718474, '2024-11-04 11:28:18-08', 0);

INSERT INTO "Measurements" ("UserId", "DoE", "WaistMetric", "WaistImperial", "NavelMetric", "NavelImperial", "NeckMetric", "NeckImperial", "HipsMetric", "HipsImperial", "ChestMetric", "ChestImperial", "ShouldersMetric", "ShouldersImperial", "RightBicepMetric", "RightBicepImperial", "LeftBicepMetric", "LeftBicepImperial", "RightForearmMetric", "RightForearmImperial", "LeftForearmMetric", "LeftForearmImperial", "RightWristMetric", "RightWristImperial", "LeftWristMetric", "LeftWristImperial", "RightThighMetric", "RightThighImperial", "LeftThighMetric", "LeftThighImperial", "RightCalfMetric", "RightCalfImperial", "LeftCalfMetric", "LeftCalfImperial", "RightAnkleMetric", "RightAnkleImperial", "LeftAnkleMetric", "LeftAnkleImperial") VALUES (1, '2024-08-04 12:00:00-07', 94, 37, 0, 0, 36.8, 14.5, 99.1, 39.0, 0, 0, 0, 0, 0, 0, 0, 0, 29.5, 11.625, 0, 0, 16.8, 6.625, 0, 0, 63.5, 25.0, 0, 0, 38.1, 15.0, 0, 0, 0, 0, 0, 0);

INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 196.9, 89.312338, 1766, '2024-08-04 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 198.0, 89.811289, 1264, '2024-08-05 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 195.7, 88.768027, 1931, '2024-08-06 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 196.1, 88.949464, 1618, '2024-08-07 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 194.2, 88.087638, 1501, '2024-08-08 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 194.1, 88.042279, 1622, '2024-08-09 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 194.1, 88.042279, 1927, '2024-08-10 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 193.9, 87.951561, 2203, '2024-08-11 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 193.5, 87.770124, 1617, '2024-08-12 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 192.0, 87.089735, 1717, '2024-08-13 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.5, 86.862939, 1539, '2024-08-14 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.9, 87.044376, 1701, '2024-08-15 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.4, 86.817580, 1707, '2024-08-16 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.4, 86.817580, 1626, '2024-08-17 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.3, 86.772220, 1584, '2024-08-18 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.6, 86.908298, 1873, '2024-08-19 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.1, 86.681502, 1657, '2024-08-20 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.6, 86.908298, 1603, '2024-08-21 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.8, 86.545424, 1607, '2024-08-22 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.4, 86.363987, 1999, '2024-08-23 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.7, 86.500065, 2383, '2024-08-24 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.3, 86.772220, 1777, '2024-08-25 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.1, 86.227910, 1669, '2024-08-26 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 189.1, 85.774317, 1538, '2024-08-27 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.3, 85.411443, 1475, '2024-08-28 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.4, 85.456803, 1505, '2024-08-29 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.3, 85.411443, 1856, '2024-08-30 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.9, 85.683599, 1532, '2024-08-31 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.8, 85.638239, 1400, '2024-09-01 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.5, 85.048569, 1389, '2024-09-02 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.5, 85.048569, 1328, '2024-09-03 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.9, 85.230006, 1350, '2024-09-04 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 185.9, 84.322822, 1360, '2024-09-05 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 186.4, 84.549618, 2533, '2024-09-06 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.1, 84.867132, 1500, '2024-09-07 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 186.1, 84.413540, 1649, '2024-09-08 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.5, 85.048569, 1573, '2024-09-09 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.0, 85.275366, 2499, '2024-09-10 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.6, 86.454706, 1345, '2024-09-11 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.6, 85.093929, 1313, '2024-09-12 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.4, 85.456803, 2084, '2024-09-13 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 189.6, 86.001113, 1465, '2024-09-14 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.7, 85.592880, 1604, '2024-09-15 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.9, 85.230006, 1670, '2024-09-16 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.4, 85.456803, 2261, '2024-09-17 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.5, 85.502162, 1435, '2024-09-18 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.2, 84.912492, 1353, '2024-09-19 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.4, 85.003210, 1577, '2024-09-20 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.9, 85.230006, 2247, '2024-09-21 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.0, 85.275366, 1617, '2024-09-22 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 186.7, 84.685695, 1500, '2024-09-23 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 185.1, 83.959948, 1449, '2024-09-24 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.7, 83.324918, 1457, '2024-09-25 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.9, 83.415637, 1539, '2024-09-26 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.9, 83.415637, 1341, '2024-09-27 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 182.9, 82.962044, 2000, '2024-09-28 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.6, 83.279559, 1519, '2024-09-29 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 185.2, 84.005307, 1481, '2024-09-30 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 184.8, 83.823870, 1680, '2024-10-01 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 185.1, 83.959948, 1485, '2024-10-02 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.0, 83.007404, 1554, '2024-10-03 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 182.7, 82.871326, 1766, '2024-10-04 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 184.5, 83.687792, 1587, '2024-10-05 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 184.7, 83.778511, 1473, '2024-10-06 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 181.8, 82.463093, 1536, '2024-10-07 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 181.8, 82.463093, 1719, '2024-10-08 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 184.4, 83.642433, 1577, '2024-10-09 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.4, 83.188841, 2313, '2024-10-10 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 184.5, 83.687792, 1690, '2024-10-11 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 184.2, 83.551715, 1756, '2024-10-12 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.2, 83.098122, 2075, '2024-10-13 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 182.5, 82.780608, 1704, '2024-10-14 12:00:00-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 182.1, 82.599171, 1511, '2024-10-15 12:00:00-07', 0);