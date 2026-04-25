import type { PageDef } from "./page-def";

export const DEFAULT_PAGE_DEF_TEMPLATE_KEY = "job-application";

export const PAGE_DEF_TEMPLATES: Record<string, PageDef> = {
  "job-application": {
    id: "job-application",
    title: "Job Application Form",
    description:
      "Ready-to-use template for collecting candidate details and role preferences.",
    components: [
      {
        id: "candidateName",
        type: "TextAnswerInput",
        label: "Full Name",
        required: true,
        placeholder: "Aarav Sharma",
      },
      {
        id: "candidateEmail",
        type: "EmailAnswerInput",
        label: "Email Address",
        required: true,
      },
      {
        id: "candidatePhone",
        type: "PhoneAnswerInput",
        label: "Phone Number",
        required: true,
      },
      {
        id: "positionApplied",
        type: "SelectAnswerInput",
        label: "Position Applied For",
        options: [
          "Frontend Developer",
          "Backend Developer",
          "UI/UX Designer",
          "Product Manager",
        ],
        required: true,
      },
      {
        id: "yearsOfExperience",
        type: "NumberAnswerInput",
        label: "Years of Experience",
        min: 0,
        max: 40,
      },
      {
        id: "coverLetter",
        type: "DescriptionAnswerInput",
        label: "Cover Letter",
        helperText: "Briefly explain why you are a fit for this role.",
        rows: 5,
      },
    ],
  },
  "customer-support-request": {
    id: "customer-support-request",
    title: "Customer Support Request",
    description:
      "Use this template to collect issue details for support and ticketing teams.",
    components: [
      {
        id: "customerName",
        type: "TextAnswerInput",
        label: "Customer Name",
        required: true,
      },
      {
        id: "customerEmail",
        type: "EmailAnswerInput",
        label: "Customer Email",
        required: true,
      },
      {
        id: "accountId",
        type: "TextAnswerInput",
        label: "Account ID",
      },
      {
        id: "issueCategory",
        type: "SelectAnswerInput",
        label: "Issue Category",
        options: [
          "Billing",
          "Technical Problem",
          "Account Access",
          "Feature Request",
          "Other",
        ],
        required: true,
      },
      {
        id: "priority",
        type: "SelectAnswerInput",
        label: "Priority",
        options: ["Low", "Medium", "High", "Critical"],
        required: true,
      },
      {
        id: "issueDescription",
        type: "DescriptionAnswerInput",
        label: "Issue Description",
        helperText: "Include exact steps and error details if possible.",
        rows: 6,
        required: true,
      },
    ],
  },
  "event-registration": {
    id: "event-registration",
    title: "Event Registration Form",
    description:
      "Useful for webinars, workshops, and offline events with attendance planning.",
    components: [
      {
        id: "attendeeName",
        type: "TextAnswerInput",
        label: "Attendee Name",
        required: true,
      },
      {
        id: "attendeeEmail",
        type: "EmailAnswerInput",
        label: "Attendee Email",
        required: true,
      },
      {
        id: "attendeePhone",
        type: "PhoneAnswerInput",
        label: "Attendee Phone",
      },
      {
        id: "ticketType",
        type: "SelectAnswerInput",
        label: "Ticket Type",
        options: ["Standard", "VIP", "Student"],
        required: true,
      },
      {
        id: "organization",
        type: "TextAnswerInput",
        label: "Organization / Company",
      },
      {
        id: "specialRequirements",
        type: "DescriptionAnswerInput",
        label: "Special Requirements",
        helperText: "Share dietary, accessibility, or seating requirements.",
        rows: 4,
      },
    ],
  },
  "patient-intake": {
    id: "patient-intake",
    title: "Patient Intake Form",
    description:
      "Healthcare-friendly intake template for first-time patient registration.",
    components: [
      {
        id: "patientName",
        type: "TextAnswerInput",
        label: "Patient Full Name",
        required: true,
      },
      {
        id: "patientEmail",
        type: "EmailAnswerInput",
        label: "Email Address",
      },
      {
        id: "patientPhone",
        type: "PhoneAnswerInput",
        label: "Phone Number",
        required: true,
      },
      {
        id: "age",
        type: "NumberAnswerInput",
        label: "Age",
        min: 0,
        max: 120,
        required: true,
      },
      {
        id: "visitType",
        type: "SelectAnswerInput",
        label: "Visit Type",
        options: [
          "General Consultation",
          "Follow-up",
          "Lab Report Review",
          "Emergency",
        ],
        required: true,
      },
      {
        id: "medicalHistory",
        type: "DescriptionAnswerInput",
        label: "Relevant Medical History",
        helperText: "Include allergies, ongoing medication, or chronic conditions.",
        rows: 5,
      },
    ],
  },
  "lead-capture": {
    id: "lead-capture",
    title: "Sales Lead Capture Form",
    description:
      "Practical template for marketing and sales teams to qualify new leads.",
    components: [
      {
        id: "leadName",
        type: "TextAnswerInput",
        label: "Contact Name",
        required: true,
      },
      {
        id: "workEmail",
        type: "EmailAnswerInput",
        label: "Work Email",
        required: true,
      },
      {
        id: "companyName",
        type: "TextAnswerInput",
        label: "Company Name",
        required: true,
      },
      {
        id: "teamSize",
        type: "SelectAnswerInput",
        label: "Team Size",
        options: ["1-10", "11-50", "51-200", "201-1000", "1000+"],
        required: true,
      },
      {
        id: "budgetRange",
        type: "SelectAnswerInput",
        label: "Budget Range (USD)",
        options: ["< 1,000", "1,000 - 5,000", "5,001 - 20,000", "20,000+"],
      },
      {
        id: "requirements",
        type: "DescriptionAnswerInput",
        label: "Business Requirements",
        helperText: "Tell us what you want to achieve in the next 3-6 months.",
        rows: 5,
      },
    ],
  },
};

export const getDefaultPageDefTemplate = (): PageDef =>
  PAGE_DEF_TEMPLATES[DEFAULT_PAGE_DEF_TEMPLATE_KEY];
