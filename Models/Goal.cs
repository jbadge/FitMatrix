using System;

namespace FitMatrix.Models
{
    public class Goal
    {
        public int Id { get; set; }
        public string GoalType { get; set; }
        public int GoalWeight { get; set; }
        public int GoalRate { get; set; }
        public int GoalBodyFatPercent { get; set; }
        public DateTime GoalDate { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}