-- Ensure we truncate the table and restart the identity so our Id column starts at 1 each time
TRUNCATE TABLE "Measurements", "Stats", "Goals", "Progress", "Users" RESTART IDENTITY;

Ensure we have a user to associate to the stats below
INSERT INTO "Users" ("FullName", "Email", "HashedPassword") VALUES ('Jeremy Badger', 'badger@suncoast.io', 'AQAAAAIAAYagAAAAECQCQXCdJ+klkUJrmKa+TC+snEorioNo61ZLi7m9OJ0q7h/91NvCVC4jpn7/ill29A==');
INSERT INTO "Users" ("FullName", "Email", "HashedPassword") VALUES ('Sarah', 'badger2@suncoast.io', 'xxxxx');
INSERT INTO "Users" ("FullName", "Email", "HashedPassword") VALUES ('Mary', 'badger3@suncoast.io', 'xxxxx');

INSERT INTO "Stats" ("UserId", "Age", "DoB", "Sex", "HeightImperial", "HeightMetric", "WeightImperial", "WeightMetric", "ActivityLevel", "ActivityLevelLabel", "BodyFatPercent") VALUES (1, 48, '1976-03-03 00:00:00-08', 'M', 72, 182.88000000073154, 184, 83.46099608, 1.425, 'Light', 16);
      

INSERT INTO "Goals" ("UserId", "GoalSelection", "GoalWeightLoseImperial", "GoalRateLoseImperial", "GoalWeightGainImperial", "GoalRateGainImperial", "GoalWeightLoseMetric", "GoalRateLoseMetric", "GoalWeightGainMetric", "GoalRateGainMetric", "GoalDate", "GoalBodyFatPercent") VALUES (1, 'lose', 176, 2, 192, 2, 79.83225712000001, 0.90718474, 87.08973504000001, 0.90718474, '2024-11-04 11:28:18-08', 0);

INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 196.9, 89.22412050000001, 1766, '2024-08-04 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 198.0, 89.81148230000001, 1264, '2024-08-05 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 195.7, 88.75388220000001, 1931, '2024-08-06 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 196.1, 89.18438930000001, 1618, '2024-08-07 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 194.2, 88.13839680000001, 1501, '2024-08-08 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 194.1, 88.03344840000001, 1622, '2024-08-09 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 194.1, 88.03344840000001, 1927, '2024-08-10 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 193.9, 87.89755870000001, 2203, '2024-08-11 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 193.5, 87.65202100000001, 1617, '2024-08-12 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 192.0, 87.07215840000001, 1717, '2024-08-13 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.5, 86.79838030000001, 1539, '2024-08-14 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.9, 86.94997740000001, 1701, '2024-08-15 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.4, 86.64957530000001, 1707, '2024-08-16 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.4, 86.64957530000001, 1626, '2024-08-17 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.3, 86.55262820000001, 1584, '2024-08-18 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.6, 86.73055590000001, 1873, '2024-08-19 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.1, 86.35987920000001, 1657, '2024-08-20 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.6, 86.73055590000001, 1603, '2024-08-21 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.8, 86.37060070000001, 1607, '2024-08-22 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.4, 86.24821260000001, 1999, '2024-08-23 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.7, 86.42014130000001, 2383, '2024-08-24 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 191.3, 86.57309590000001, 1777, '2024-08-25 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.1, 86.05311320000001, 1669, '2024-08-26 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 189.1, 85.80586220000001, 1538, '2024-08-27 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.3, 85.47657290000001, 1475, '2024-08-28 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.4, 85.51695140000001, 1505, '2024-08-29 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.3, 85.47657290000001, 1856, '2024-08-30 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.9, 85.73872320000001, 1532, '2024-08-31 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.8, 85.68027450000001, 1400, '2024-09-01 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.5, 84.91356990000001, 1389, '2024-09-02 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.5, 84.91356990000001, 1328, '2024-09-03 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.9, 85.09110770000001, 1350, '2024-09-04 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 185.9, 84.26627560000001, 1360, '2024-09-05 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 186.4, 84.49876030000001, 2533, '2024-09-06 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.1, 84.83076560000001, 1500, '2024-09-07 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 186.1, 84.35023490000001, 1649, '2024-09-08 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.5, 84.91356990000001, 1573, '2024-09-09 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.0, 85.06708260000001, 2499, '2024-09-10 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 190.6, 86.28317870000001, 1345, '2024-09-11 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.6, 84.91765370000001, 1313, '2024-09-12 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.4, 85.51695140000001, 2084, '2024-09-13 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 189.6, 86.00448220000001, 1465, '2024-09-14 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.7, 85.72623770000001, 1604, '2024-09-15 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.9, 85.09078450000001, 1670, '2024-09-16 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.4, 85.51695140000001, 2261, '2024-09-17 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.5, 85.55734080000001, 1435, '2024-09-18 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.2, 84.91356990000001, 1353, '2024-09-19 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.4, 85.06369660000001, 1577, '2024-09-20 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 187.9, 85.18197820000001, 2247, '2024-09-21 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 188.0, 85.06708260000001, 1617, '2024-09-22 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 186.7, 84.71786280000001, 1500, '2024-09-23 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 185.1, 83.91729340000001, 1449, '2024-09-24 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.7, 83.54016850000001, 1457, '2024-09-25 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.9, 83.59797860000001, 1539, '2024-09-26 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.9, 83.59797860000001, 1341, '2024-09-27 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 182.9, 82.96376560000001, 2000, '2024-09-28 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.6, 83.51489750000001, 1519, '2024-09-29 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 185.2, 83.91604720000001, 1481, '2024-09-30 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 184.8, 83.77513980000001, 1680, '2024-10-01 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 185.1, 84.04903550000001, 1485, '2024-10-02 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 183.0, 83.00712950000001, 1554, '2024-10-03 17:06:45.933521-07', 0);
INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 182.7, 82.69082500000001, 1766, '2024-10-04 17:06:45.933521-07', 0);
-- INSERT INTO "Progress" ("UserId", "ProgressWeightImperial", "ProgressWeightMetric", "Calories", "DoE", "BodyFatPercent") VALUES (1, 184.5, 83.66519480000001, 1587, '2024-10-05 17:06:45.933521-07', 0);

