using System;

namespace FitMatrix.Models
{
    public class Stats
    {
        public int Id { get; set; }
        public DateTime DoB { get; set; }
        public string Sex { get; set; }
        public int Height { get; set; }
        public int StartingWeight { get; set; }
        public int ActivityLevel { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}