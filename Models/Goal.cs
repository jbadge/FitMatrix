using System;

namespace FitMatrix.Models
{
    public class Goal
    {
        public int Id { get; set; }
        public string GoalSelection { get; set; }
        public double GoalWeight { get; set; }
        public double GoalRate { get; set; }
        public double GoalBodyFatPercent { get; set; }
        public DateTime GoalDate { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}