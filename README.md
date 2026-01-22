# Resume Maker

A modern, user-friendly Resume Maker application built with React and Vite. Create professional resumes in minutes with a real-time preview.

## Features

- 📝 **Personal Information** - Add your contact details, LinkedIn, and GitHub profiles
- 📄 **Professional Summary** - Write a compelling summary about yourself
- 💼 **Work Experience** - Add multiple work experiences with company, position, dates, and descriptions
- 🎓 **Education** - Include your educational background
- 🛠️ **Skills** - Add and manage your skills with an easy-to-use interface
- 👁️ **Live Preview** - See your resume update in real-time as you type
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

### Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
resumemaker/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Project dependencies
```

## Usage

1. Fill in your personal information in the form on the left
2. Add your professional summary
3. Add your work experience (you can add multiple entries)
4. Add your education details
5. Add your skills (press Enter or click Add after typing each skill)
6. Watch your resume preview update in real-time on the right side

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and development server
- **CSS3** - Styling with modern features

## Future Enhancements

Potential features to add:
- Export resume as PDF
- Multiple resume templates
- Save/load resume data
- Print functionality
- Additional sections (certifications, projects, languages, etc.)

## License

This project is open source and available for personal and commercial use.
