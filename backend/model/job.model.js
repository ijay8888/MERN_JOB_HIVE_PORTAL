import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    company: { 
      type: String, 
      required: true 
    },
    location: { 
      type: String, 
      required: true 
    },
    salary: { 
      type: String 
    },
    description: { 
      type: String, 
      required: true 
    },
    postedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    applicants: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Freelance"],
      default: "Full-Time"
    },
    category: {
      type: String,
      enum: ["IT", "Finance", "Healthcare", "Networking", "Other"],
      default: "General"
    }

    },
    { timestamps: true }
);


export default mongoose.model("Job", jobSchema);
