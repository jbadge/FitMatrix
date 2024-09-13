using System;

namespace FitMatrix.Models
{
    public class Stats
    {
        public int Id { get; set; }
        public int Age { get; set; }
        public DateTime DoB { get; set; }
        public string Sex { get; set; }
        public double HeightImperial { get; set; }
        public double HeightMetric { get; set; }
        public double WeightImperial { get; set; }
        public double WeightMetric { get; set; }
        public double ActivityLevel { get; set; }
        public string ActivityLevelLabel { get; set; }
        public double BodyFatPercent { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}