using System;

namespace FitMatrix.Models
{
    public class Measurements
    {
        public int Id { get; set; }

        public DateTime DoE { get; set; } = DateTime.UtcNow;
        public double WaistMetric { get; set; }
        public double WaistImperial { get; set; }
        public double NavelMetric { get; set; }
        public double NavelImperial { get; set; }
        public double NeckMetric { get; set; }
        public double NeckImperial { get; set; }
        public double HipsMetric { get; set; }
        public double HipsImperial { get; set; }
        public double ChestMetric { get; set; }
        public double ChestImperial { get; set; }
        public double ShouldersMetric { get; set; }
        public double ShouldersImperial { get; set; }
        public double RightBicepMetric { get; set; }
        public double RightBicepImperial { get; set; }
        public double LeftBicepMetric { get; set; }
        public double LeftBicepImperial { get; set; }
        public double RightForearmMetric { get; set; }
        public double RightForearmImperial { get; set; }
        public double LeftForearmMetric { get; set; }
        public double LeftForearmImperial { get; set; }
        public double RightWristMetric { get; set; }
        public double RightWristImperial { get; set; }
        public double LeftWristMetric { get; set; }
        public double LeftWristImperial { get; set; }
        public double RightThighMetric { get; set; }
        public double RightThighImperial { get; set; }
        public double LeftThighMetric { get; set; }
        public double LeftThighImperial { get; set; }
        public double RightCalfMetric { get; set; }
        public double RightCalfImperial { get; set; }
        public double LeftCalfMetric { get; set; }
        public double LeftCalfImperial { get; set; }
        public double RightAnkleMetric { get; set; }
        public double RightAnkleImperial { get; set; }
        public double LeftAnkleMetric { get; set; }
        public double LeftAnkleImperial { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}