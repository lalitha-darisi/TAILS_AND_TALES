const mongoose = require('mongoose');

const MedicalSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who added

  // Basic info
  vaccinationStatus: { type: Boolean },
  vaccinationCard: { type: String }, // URL to uploaded file
  lastVaccinationDate: { type: Date },
  nextVaccinationDate: { type: Date },

  // vaccines list (store as object of boolean flags)
  vaccines: {
    dog: {
      parvo: { type: Boolean },
      distemper: { type: Boolean },
      hepatitis: { type: Boolean },
      rabies: { type: Boolean },
      dhppi_booster: { type: Boolean }
    },
    cat: {
      fvrcp: { type: Boolean },
      rabies: { type: Boolean },
      felv: { type: Boolean }
    },
    rabbit: {
      myxomatosis: { type: Boolean },
      rhdv1: { type: Boolean },
      rhdv2: { type: Boolean }
    }
  },

  // Deworming & parasite control
  deworming: {
    lastDate: { type: Date },
    nextDate: { type: Date },
    tickFleaTreatment: { type: Boolean },
    tickFleaDate: { type: Date }
  },

  // Sterilization
  sterilization: {
    status: { type: Boolean }, // spayed/neutered true/false
    date: { type: Date },
    clinicName: { type: String }
  },

  // Medical conditions
  medicalConditions: {
    chronicIllness: { type: String },
    pastInjuries: { type: String },
    medications: { type: String },
    allergies: { type: String },
    behaviouralNotes: { type: String }
  },

  // Physical exam
  physicalExam: {
    weightKg: { type: Number },
    bodyCondition: { type: String }, // Thin/Normal/Overweight
    dentalCondition: { type: String }, // Good/Average/Poor
    coatCondition: { type: String }, // Healthy/Dull/Bald Patches
    mobility: { type: String } // Normal/Limping/Arthritis
  },

  // Lab tests
  labTests: {
    // species-specific tests stored as subobjects
    dog: {
      tickFever: { type: String }, // Positive/Negative/Unknown
      heartworm: { type: String },
      cbcReport: { type: String } // URL
    },
    cat: {
      fiv: { type: String },
      felv: { type: String },
      cbcReport: { type: String }
    },
    rabbit: {
      dentalCheckCompleted: { type: Boolean },
      parasiteTest: { type: Boolean }
    }
  },

  // Microchip
  microchip: {
    id: { type: String },
    registered: { type: Boolean }
  },

  // Vet info
  vet: {
    name: { type: String },
    clinicAddress: { type: String },
    contactNumber: { type: String },
    lastCheckupDate: { type: Date }
  },

  // Grooming & hygiene
  grooming: {
    bathingFrequency: { type: String },
    nailTrimmedRecently: { type: Boolean },
    earCleaningDate: { type: Date }
  },

  // Feeding & nutrition
  feeding: {
    currentDiet: { type: String }, // Dry/Wet/Home food
    feedingSchedule: { type: String },
    foodRestrictions: { type: String }
  },

  // Freeform record metadata
  title: { type: String },
  notes: { type: String },
  date: { type: Date, default: Date.now },
  attachments: [{ type: String }] // URLs
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalSchema);
