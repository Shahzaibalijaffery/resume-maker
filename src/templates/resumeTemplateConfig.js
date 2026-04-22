export const DEFAULT_RESUME_FORMAT = "format1";

export const TEMPLATE_DEFAULTS = {
  layout: "two-column",
  columnGap: 3,
  header: {
    nameAlign: "left",
    contactAlign: "center",
  },
  sections: {
    headingAlign: "left",
    headingAlignBySection: {},
    skillsStyle: "bullets",
    educationLayout: "stacked",
    graduationLabel: "Graduation",
    showHorizontalRuleAfterHeading: false,
  },
  typography: {
    headingSize: 11.5,
    subheadingSize: 10.5,
    bodySize: 9.0,
    metaSize: 10.3,
  },
};

export const RESUME_FORMATS = {
  format1: {
    label: "Executive Sidebar",
    layout: "two-column",
    leftRatio: 0.3,
    maxLeftWidthMm: 60,
    columnGap: 3,
    header: {
      nameAlign: "center",
      contactAlign: "center",
    },
    sections: {
      headingAlign: "left",
      headingAlignBySection: {},
      skillsStyle: "bullets",
      educationLayout: "stacked",
    },
    columns: {
      left: ["education", "skills"],
      right: ["summary", "experience", "projects"],
    },
  },
  format2: {
    label: "Executive Sidebar Reverse",
    layout: "two-column",
    leftRatio: 0.8,
    columnGap: 6,
    maxLeftWidthMm: 120,
    header: {
      nameAlign: "center",
      contactAlign: "center",
    },
    sections: {
      headingAlign: "left",
      headingAlignBySection: {},
      skillsStyle: "bullets",
      educationLayout: "stacked",
    },
    columns: {
      left: ["summary", "experience", "projects"],
      right: ["education", "skills"],
    },
  },
  singleClassic: {
    label: "Professional Classic",
    layout: "single-column",
    header: {
      nameAlign: "center",
      contactAlign: "center",
    },
    sections: {
      headingAlign: "left",
      headingAlignBySection: {
        summary: "left",
        experience: "left",
        education: "left",
        skills: "left",
      },
      skillsStyle: "comma",
      educationLayout: "inline-graduation-right",
      graduationLabel: "Graduated",
      showHorizontalRuleAfterHeading: true,
    },
    columns: {
      main: ["summary", "experience", "projects", "education", "skills"],
    },
  },
  singleCompact: {
    label: "Professional Centered",
    layout: "single-column",
    header: {
      nameAlign: "center",
      contactAlign: "center",
    },
    sections: {
      headingAlign: "center",
      headingAlignBySection: {},
      skillsStyle: "comma",
      educationLayout: "inline-graduation-right",
      graduationLabel: "Graduated",
      showHorizontalRuleAfterHeading: true,
    },
    columns: {
      main: ["summary", "skills", "experience", "projects", "education"],
    },
  },
};

export const getResumeFormatConfig = (format) =>
  RESUME_FORMATS[format] || RESUME_FORMATS[DEFAULT_RESUME_FORMAT];

export const getResumeFormatOptions = () =>
  Object.entries(RESUME_FORMATS).map(([value, config]) => ({
    value,
    label: config.label || value,
  }));

export const DEFAULT_SECTION_HEADINGS = {
  personalInfo: "Personal Information",
  summary: "Professional Profile",
  experience: "Professional Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
};

export const ATS_HEADING_OPTIONS = {
  personalInfo: [
    "Personal Information",
    "Contact Information",
    "Personal Details",
  ],
  summary: [
    "Professional Profile",
    "Professional Summary",
    "Summary",
    "Profile",
  ],
  experience: [
    "Professional Experience",
    "Work Experience",
    "Experience",
    "Employment History",
  ],
  education: ["Education", "Academic Background", "Educational Qualifications"],
  projects: [
    "Projects",
    "Key Projects",
    "Relevant Projects",
    "Project Experience",
  ],
  skills: ["Skills", "Core Skills", "Technical Skills", "Key Competencies"],
};
