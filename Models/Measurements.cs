using System;

namespace FitMatrix.Models
{
    public class Measurements
    {
        public int Id { get; set; }
        public double Neck { get; set; }
        public double Chest { get; set; }
        public double Shoulders { get; set; }
        public double RightBicep { get; set; }
        public double LeftBicep { get; set; }
        public double RightForearm { get; set; }
        public double LeftForearm { get; set; }
        public double Waist { get; set; }
        public double Naval { get; set; }
        public double Hip { get; set; }
        public double RightThigh { get; set; }
        public double LeftThigh { get; set; }
        public double RightCalf { get; set; }
        public double LeftCalf { get; set; }
        public double Wrist { get; set; }
        public double Ankle { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}