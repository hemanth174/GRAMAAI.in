import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, Stethoscope, Navigation } from "lucide-react";
import { cn } from "@/utils";

const gradientClasses = [
  "from-blue-500/80 via-sky-400/80 to-cyan-400/80",
  "from-purple-500/80 via-indigo-400/80 to-blue-400/80",
  "from-emerald-500/80 via-teal-400/80 to-cyan-400/80",
];

export default function AlternateHospitalSuggestions({
  initialUnavailableDoctor,
  initialLocation,
  initialSpecialization,
  onFetch,
  suggestions,
  isLoading,
  onRebook,
  distanceLimit,
  onDistanceChange,
  hasRequested,
}) {
  const [formState, setFormState] = useState({
    unavailableDoctor: initialUnavailableDoctor || "",
    location: initialLocation || "",
    specialization: initialSpecialization || "",
  });
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      unavailableDoctor: initialUnavailableDoctor || prev.unavailableDoctor,
      location: initialLocation || prev.location,
      specialization: initialSpecialization || prev.specialization,
    }));
  }, [initialUnavailableDoctor, initialLocation, initialSpecialization]);

  const handleChange = (field) => (event) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.unavailableDoctor || !formState.location || !formState.specialization) {
      setValidationMessage("Please provide doctor name, location, and specialization to search.");
      return;
    }
    setValidationMessage("");
    onFetch({
      unavailable_doctor_name: formState.unavailableDoctor,
      patient_location: formState.location,
      required_specialization: formState.specialization,
      distance_limit: distanceLimit,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/70 p-6">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="doctor_name">Unavailable Doctor</Label>
            <Input
              id="doctor_name"
              placeholder="e.g., Dr. Mehta"
              value={formState.unavailableDoctor}
              onChange={handleChange("unavailableDoctor")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient_location">Patient Location</Label>
            <Input
              id="patient_location"
              placeholder="e.g., Jubilee Hills"
              value={formState.location}
              onChange={handleChange("location")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Required Specialization</Label>
            <Input
              id="specialization"
              placeholder="e.g., Cardiologist"
              value={formState.specialization}
              onChange={handleChange("specialization")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="distance_limit">Distance Limit (km)</Label>
            <Input
              id="distance_limit"
              type="number"
              min="1"
              value={distanceLimit}
              onChange={(event) => onDistanceChange(Number(event.target.value))}
            />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              disabled={isLoading}
            >
              {isLoading ? "Finding Alternatives..." : "Find Nearby Hospitals"}
            </Button>
          </div>
        </form>
        {validationMessage && (
          <p className="mt-3 text-sm text-red-600">{validationMessage}</p>
        )}
      </div>

      {formState.unavailableDoctor && distanceLimit > 0 && (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Dr. {formState.unavailableDoctor} is unavailable. Here are nearby doctors available within {distanceLimit} km.
        </p>
      )}

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <Card
            key={suggestion.id}
            className={cn(
              "overflow-hidden border-0 bg-gradient-to-r text-white shadow-lg",
              gradientClasses[index % gradientClasses.length]
            )}
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <h3 className="text-lg font-semibold">{suggestion.hospital_name}</h3>
                      <p className="text-sm text-white/80">{suggestion.address}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-white/90">
                    <span className="inline-flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      {suggestion.available_doctor}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      {suggestion.distance_km} km away
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Next slot {suggestion.next_available_time}
                    </span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="bg-white/90 text-blue-600 hover:bg-white"
                  onClick={() => onRebook(suggestion)}
                >
                  Rebook Here
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {!suggestions.length && hasRequested && (
          <Card className="border border-dashed border-slate-300/80 bg-white/70 dark:border-slate-700/60 dark:bg-slate-900/60">
            <CardContent className="py-10 text-center text-sm text-slate-500 dark:text-slate-300">
              No alternate hospitals to show. Adjust your filters and try again.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
