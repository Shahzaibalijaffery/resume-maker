import { useEffect } from 'react'
import './LandingPage.css'

const SEO_TITLE = 'Resume Builder | Free ATS-Friendly CV Maker Online'
const SEO_DESCRIPTION =
  'Build an ATS-friendly resume online with AI-powered suggestions, professional resume templates, PDF download, and CV parsing. Create a job-ready resume in minutes.'

function LandingPage() {
  useEffect(() => {
    document.title = SEO_TITLE

    const setMeta = (name, content, key = 'name') => {
      let tag = document.head.querySelector(`meta[${key}="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(key, name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    setMeta('description', SEO_DESCRIPTION)
    setMeta('og:title', SEO_TITLE, 'property')
    setMeta('og:description', SEO_DESCRIPTION, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', SEO_TITLE)
    setMeta('twitter:description', SEO_DESCRIPTION)
  }, [])

  return (
    <main className="landing-page">
      <section className="hero">
        <p className="eyebrow">Free Online Resume Builder</p>
        <h1>Build a Professional ATS-Friendly Resume That Helps You Get Interviews</h1>
        <p>
          Create a clean, job-ready resume with modern templates, ATS-focused formatting, automatic CV parsing, and PDF export.
          Whether you are a student, fresher, or experienced professional, this online resume builder helps you create a resume
          that hiring systems can read and recruiters can trust.
        </p>
        <div className="cta-row">
          <a className="primary-btn" href="/app">Start Building Resume</a>
          <a className="secondary-btn" href="#features">Explore Features</a>
        </div>
      </section>

      <section id="features" className="content-section">
        <h2>Why This Resume Builder Works for Modern Hiring</h2>
        <p>
          Many candidates lose opportunities because their CV format is difficult for Applicant Tracking Systems (ATS) to parse.
          This resume maker focuses on ATS-friendly structure, meaningful headings, clear content hierarchy, and readable layout.
          You can quickly choose between single-column and two-column designs based on your role and ATS compatibility needs.
        </p>
        <ul>
          <li>ATS-friendly heading options for better parsing and keyword matching.</li>
          <li>Live PDF preview so what you see matches what you download.</li>
          <li>Multiple resume templates with professional visual structure.</li>
          <li>PDF export for easy application uploads and email submissions.</li>
          <li>CV parser support to import existing resume data into form fields.</li>
          <li>Editable sections for summary, work experience, projects, education, and skills.</li>
        </ul>
      </section>

      <section className="content-section">
        <h2>Best Resume Builder for Students, Freshers, and Professionals</h2>
        <p>
          The tool is designed for all job levels. Students can create internship resumes, fresh graduates can build their first ATS-ready CV,
          and experienced professionals can restructure career achievements using optimized format options. By keeping sections structured and
          content readable, your resume can perform better in both automated screenings and manual recruiter reviews.
        </p>
      </section>

      <section className="content-section">
        <h2>How to Create an ATS Resume in Minutes</h2>
        <ol>
          <li>Open the resume app and choose your preferred template layout.</li>
          <li>Fill or import details for profile, experience, education, projects, and skills.</li>
          <li>Use ATS-friendly section names to improve parsing confidence.</li>
          <li>Review live PDF preview and adjust content spacing if needed.</li>
          <li>Download your resume in PDF format and start applying confidently.</li>
        </ol>
      </section>

      <section className="content-section">
        <h2>CV Upload and Parsing Workflow</h2>
        <p>
          ResumeMaker includes CV parsing to reduce manual typing. Upload a PDF or DOCX CV and the app extracts content into the form structure
          for personal details, summary, experience, education, projects, and skills.
        </p>
        <ul>
          <li>Import CV and auto-fill all major resume sections.</li>
          <li>Review parsed content and correct any field quickly.</li>
          <li>Generate ATS-focused resume layouts from imported data.</li>
          <li>Download clean PDF resumes for job applications.</li>
        </ul>
      </section>

      <section className="content-section faq">
        <h2>Resume Builder FAQ</h2>
        <h3>Is this resume builder ATS-friendly?</h3>
        <p>
          Yes. It supports ATS-oriented headings and structured section formatting. Single-column templates generally provide the broadest ATS compatibility.
        </p>
        <h3>Can I upload my old CV and auto-fill the form?</h3>
        <p>
          Yes. You can upload PDF or DOCX files, parse the content, and edit it inside the builder before exporting.
        </p>
        <h3>Can I download my resume as PDF?</h3>
        <p>
          Yes. The builder includes one-click PDF download and preview for quality checks before applying to jobs.
        </p>
      </section>

      <section className="content-section">
        <h2>Resume Learning Resources</h2>
        <ul>
          <li><a href="/ats-resume-guide/">ATS Resume Guide</a> for parser-friendly formatting strategy.</li>
          <li><a href="/resume-summary-examples/">Resume Summary Examples</a> for role-specific professional profiles.</li>
          <li><a href="/resume-templates-guide/">Resume Templates Guide</a> for ATS-friendly layout and format choices.</li>
        </ul>
      </section>

      <footer className="landing-footer">
        <p>Ready to create your ATS resume?</p>
        <a className="primary-btn" href="/app">Create Resume Now</a>
      </footer>
    </main>
  )
}

export default LandingPage
