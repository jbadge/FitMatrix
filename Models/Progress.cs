using System;

namespace FitMatrix.Models
{
    public class Progress
    {
        public int Id { get; set; }
        public DateTime DoE { get; set; } = DateTime.UtcNow;
        public double ProgressWeightMetric { get; set; }
        public double ProgressWeightImperial { get; set; }
        public int Calories { get; set; }
        public double BodyFatPercent { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}