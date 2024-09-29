using System;

namespace FitMatrix.Models
{
    public class Goal
    {
        public int Id { get; set; }
        public string GoalSelection { get; set; }
        public double GoalWeightLoseImperial { get; set; }
        public double GoalRateLoseImperial { get; set; }
        public double GoalWeightGainImperial { get; set; }
        public double GoalRateGainImperial { get; set; }
        public double GoalWeightLoseMetric { get; set; }
        public double GoalRateLoseMetric { get; set; }
        public double GoalWeightGainMetric { get; set; }
        public double GoalRateGainMetric { get; set; }
        public double GoalBodyFatPercent { get; set; }
        public DateTime GoalDate { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}