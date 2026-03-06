/**
 * Reference data for PageDef components.
 * Used by ComponentReference.tsx. This folder can be removed when no longer needed.
 */

export const BASE_PROPS_DOC = {
  id: { type: "string", required: true, description: "Unique component id (used as key in values)." },
  type: { type: "PageComponentType", required: true, description: "Component type (e.g. \"Text\", \"Select\")." },
  label: { type: "string", required: false, description: "Label shown above the control." },
  helperText: { type: "string", required: false, description: "Helper or hint text below the label." },
  required: { type: "boolean", required: false, description: "If true, form validation requires a value." },
  disabled: { type: "boolean", required: false, description: "If true, the control is disabled." },
  onChange: {
    type: "string",
    required: false,
    description: "Action reference, e.g. \"@actionDef.logName\". Runs when value changes.",
  },
} as const;

export interface ComponentSpec {
  type: string;
  description: string;
  valueFormat: string;
  specificProps: { name: string; type: string; required: boolean; description: string }[];
  exampleJson: object;
}

export const COMPONENT_SPECS: ComponentSpec[] = [
  {
    type: "Text",
    description: "Single-line text input.",
    valueFormat: "string",
    specificProps: [
      { name: "placeholder", type: "string", required: false, description: "Placeholder text when empty." },
    ],
    exampleJson: { id: "name", type: "Text", label: "Full Name", required: true, placeholder: "Enter your name" },
  },
  {
    type: "Number",
    description: "Numeric input with optional min/max/step.",
    valueFormat: "string (numeric)",
    specificProps: [
      { name: "placeholder", type: "string", required: false, description: "Placeholder when empty." },
      { name: "min", type: "number", required: false, description: "Minimum value." },
      { name: "max", type: "number", required: false, description: "Maximum value." },
      { name: "step", type: "number", required: false, description: "Step increment." },
    ],
    exampleJson: { id: "age", type: "Number", label: "Age", min: 0, max: 120 },
  },
  {
    type: "Email",
    description: "Email input with validation.",
    valueFormat: "string (valid email)",
    specificProps: [
      { name: "placeholder", type: "string", required: false, description: "Placeholder when empty." },
    ],
    exampleJson: { id: "email", type: "Email", label: "Email", required: true },
  },
  {
    type: "Phone",
    description: "Phone number input (validated as 10 digits by default).",
    valueFormat: "string",
    specificProps: [
      { name: "placeholder", type: "string", required: false, description: "Placeholder when empty." },
    ],
    exampleJson: { id: "phone", type: "Phone", label: "Phone Number", required: true },
  },
  {
    type: "Url",
    description: "URL input with validation.",
    valueFormat: "string (valid URL)",
    specificProps: [
      { name: "placeholder", type: "string", required: false, description: "e.g. https://example.com" },
    ],
    exampleJson: { id: "website", type: "Url", label: "Website", placeholder: "https://" },
  },
  {
    type: "TextArea",
    description: "Multi-line text input.",
    valueFormat: "string",
    specificProps: [
      { name: "placeholder", type: "string", required: false, description: "Placeholder when empty." },
      { name: "rows", type: "number", required: false, description: "Visible rows (default 4)." },
    ],
    exampleJson: { id: "about", type: "TextArea", label: "About you", rows: 4 },
  },
  {
    type: "Select",
    description: "Dropdown single-select from options.",
    valueFormat: "string (selected option)",
    specificProps: [
      { name: "options", type: "string[]", required: true, description: "List of options." },
      { name: "placeholder", type: "string", required: false, description: "Placeholder for empty state." },
    ],
    exampleJson: { id: "country", type: "Select", label: "Country", required: true, options: ["India", "USA", "UK"] },
  },
  {
    type: "Radio",
    description: "Single choice from options (radio buttons).",
    valueFormat: "string (selected option)",
    specificProps: [
      { name: "options", type: "string[]", required: true, description: "List of options." },
    ],
    exampleJson: { id: "contact", type: "Radio", label: "Contact method", options: ["Email", "Phone", "Post"] },
  },
  {
    type: "MultiSelect",
    description: "Multiple choice from options (checkboxes). Value is comma-separated.",
    valueFormat: "string (comma-separated selected options, e.g. \"A,B,C\")",
    specificProps: [
      { name: "options", type: "string[]", required: true, description: "List of options." },
    ],
    exampleJson: { id: "prefs", type: "MultiSelect", label: "Preferences", options: ["News", "Updates", "Marketing"] },
  },
  {
    type: "Checkbox",
    description: "Single checkbox (yes/no). Value is \"true\" or \"false\".",
    valueFormat: "\"true\" | \"false\"",
    specificProps: [
      { name: "checkboxLabel", type: "string", required: false, description: "Label next to checkbox (default \"Yes\")." },
    ],
    exampleJson: { id: "agreed", type: "Checkbox", label: "I agree to terms", checkboxLabel: "Yes, I agree" },
  },
  {
    type: "Date",
    description: "Date picker. Value is YYYY-MM-DD.",
    valueFormat: "string (YYYY-MM-DD)",
    specificProps: [
      { name: "min", type: "string", required: false, description: "Min date (YYYY-MM-DD)." },
      { name: "max", type: "string", required: false, description: "Max date (YYYY-MM-DD)." },
    ],
    exampleJson: { id: "dob", type: "Date", label: "Date of birth", min: "1900-01-01", max: "2025-12-31" },
  },
  {
    type: "Time",
    description: "Time picker. Value is HH:mm or HH:mm:ss.",
    valueFormat: "string (HH:mm)",
    specificProps: [
      { name: "min", type: "string", required: false, description: "Min time (HH:mm)." },
      { name: "max", type: "string", required: false, description: "Max time (HH:mm)." },
    ],
    exampleJson: { id: "appointment", type: "Time", label: "Preferred time" },
  },
];

export const PAGEDEF_STRUCTURE = {
  id: "string",
  title: "string",
  description: "string (optional)",
  components: "PageComponentDef[]",
  actions: "Record<string, string> (optional) — actionId → JS function body",
};
