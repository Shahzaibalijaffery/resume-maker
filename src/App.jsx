import { useState, useEffect } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import EditableHeading from './components/EditableHeading'
import { createResumePdfDocument } from './templates/resumePdfTemplate'
import { ATS_HEADING_OPTIONS, DEFAULT_SECTION_HEADINGS, DEFAULT_RESUME_FORMAT, getResumeFormatOptions } from './templates/resumeTemplateConfig'
import './App.css'

GlobalWorkerOptions.workerSrc = pdfWorker

function App() {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, New York, NY 10001',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe'
    },
    summary: 'Experienced software engineer with over 5 years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering scalable solutions that drive business growth',
    experience: [

      {
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        startDate: 'Jun 2019',
        endDate: 'Dec 2020',
        description: 'Developed and maintained web applications using React and Node.js. Built RESTful APIs and integrated third-party services. Participated in agile sprints and contributed to architectural decisions. Improved application performance by 40% through optimization.'
      },
      {
        company: 'Digital Agency',
        position: 'Junior Developer',
        startDate: 'Jan 2018',
        endDate: 'May 2019',
        description: 'Created responsive web applications for various clients. Worked with HTML, CSS, JavaScript, and PHP. Collaborated with designers to implement pixel-perfect UI/UX designs. Maintained and debugged existing codebases.'
      }
    ],
    education: [
      {
        school: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: 'May 2017'
      },
      {
        school: 'Community College',
        degree: 'Associate Degree',
        field: 'Information Technology',
        graduationDate: 'May 2015'
      }
    ],
    projects: [
      {
        name: 'E-Commerce Platform',
        description: 'Built a comprehensive full-stack e-commerce platform from scratch with React frontend and Node.js/Express backend. Implemented secure payment gateway integration using',
        technologies: 'React, Redux, Node.js, Express.js, MongoDB, Mongoose, Stripe API, AWS (EC2, S3, CloudFront), Docker, Redis, JWT, SendGrid API, Winston, New Relic, Jest, Cypress',
        link: 'https://github.com/johndoe/ecommerce-platform'
      },
      {
        name: 'Task Management App',
        description: 'Developed a feature-rich collaborative task management application with real-time synchronization using ',
        technologies: 'React, TypeScript, Redux Toolkit, Express.js, Socket.io, PostgreSQL, Prisma ORM, Redis, JWT, Multer, AWS S3, Jest, Supertest, React Testing Library, Webpack',
        link: 'https://github.com/johndoe/task-manager'
      },
      {
        name: 'Weather Dashboard',
        description: 'Created a beautiful and responsive weather dashboard application that displays current weather conditions',
        technologies: 'React, JavaScript (ES6+), HTML5, CSS3, Chart.js, OpenWeatherMap API, Axios, LocalStorage API, Geolocation API, Responsive Design, CSS Grid, Flexbox, Async/Await',
        link: 'https://github.com/johndoe/weather-dashboard'
      },

      {
        name: 'Real-Time Chat Application',
        description: 'Built a scalable real-time chat application supporting one-on-one and group messaging with end-to-end encryption. Implemented WebSocket connections using Socket.io for instant',
        technologies: 'React, Node.js, Socket.io, MongoDB, Redis, Elasticsearch, AWS (EC2, S3, CloudFront), Firebase Cloud Messaging, JWT, bcrypt, Crypto.js, Multer, Express.js, PM2, Nginx',
        link: 'https://github.com/johndoe/chat-app'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'Agile', 'RESTful APIs']
  })

  const [currentSkill, setCurrentSkill] = useState('')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [previewPages, setPreviewPages] = useState([])
  const [isRenderingPreview, setIsRenderingPreview] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [resumeFormat, setResumeFormat] = useState(DEFAULT_RESUME_FORMAT)
  const [sectionHeadings, setSectionHeadings] = useState(DEFAULT_SECTION_HEADINGS)
  const [editingHeadingKey, setEditingHeadingKey] = useState(null)
  const [headingDraft, setHeadingDraft] = useState('')
  const formatOptions = getResumeFormatOptions()

  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  const handleSummaryChange = (value) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }))
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...resumeData.experience]
    newExperience[index] = {
      ...newExperience[index],
      [field]: value
    }
    setResumeData(prev => ({
      ...prev,
      experience: newExperience
    }))
  }

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }))
  }

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...resumeData.education]
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    }
    setResumeData(prev => ({
      ...prev,
      education: newEducation
    }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: '',
          degree: '',
          field: '',
          graduationDate: ''
        }
      ]
    }))
  }

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...resumeData.projects]
    newProjects[index] = {
      ...newProjects[index],
      [field]: value
    }
    setResumeData(prev => ({
      ...prev,
      projects: newProjects
    }))
  }

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: '',
          description: '',
          technologies: '',
          link: ''
        }
      ]
    }))
  }

  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const addSkill = () => {
    if (currentSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }))
      setCurrentSkill('')
    }
  }

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill()
    }
  }

  const startEditingHeading = (key) => {
    setEditingHeadingKey(key)
    const options = ATS_HEADING_OPTIONS[key] || []
    const currentValue = sectionHeadings[key] || ''
    setHeadingDraft(options.includes(currentValue) ? currentValue : (options[0] || currentValue))
  }

  const saveHeadingEdit = () => {
    if (!editingHeadingKey || !headingDraft) return
    setSectionHeadings(prev => ({
      ...prev,
      [editingHeadingKey]: headingDraft
    }))
    setEditingHeadingKey(null)
    setHeadingDraft('')
  }

  const cancelHeadingEdit = () => {
    setEditingHeadingKey(null)
    setHeadingDraft('')
  }

  const renderEditableHeading = (key) => (
    <EditableHeading
      headingKey={key}
      title={sectionHeadings[key]}
      isEditing={editingHeadingKey === key}
      draftValue={headingDraft}
      options={ATS_HEADING_OPTIONS[key] || []}
      onStartEdit={startEditingHeading}
      onDraftChange={setHeadingDraft}
      onSave={saveHeadingEdit}
      onCancel={cancelHeadingEdit}
      disableEdit={key === 'personalInfo'}
    />
  )

  const downloadPDF = (saveToFile = false) => {
    if (saveToFile) setIsGeneratingPDF(true)
    try {
      const { pdf, fileName } = createResumePdfDocument({
        resumeData,
        resumeFormat,
        sectionHeadings
      })
      if (saveToFile) pdf.save(fileName)
      return pdf
    } catch (error) {
      console.error('Error generating PDF:', error)
      console.error('Error stack:', error.stack)
      if (saveToFile) {
        alert(`Error generating PDF: ${error.message || 'Unknown error'}. Please check the console for details.`)
      }
      throw error
    } finally {
      if (saveToFile) setIsGeneratingPDF(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    let loadingTask = null

    const renderPdfPreview = async () => {
      try {
        setPreviewError('')
        setIsRenderingPreview(true)
        const pdf = downloadPDF(false)
        if (!pdf) {
          throw new Error('Preview PDF instance was not created')
        }
        if (cancelled) return

        const arrayBuffer = pdf.output('arraybuffer')
        if (!arrayBuffer) throw new Error('Unable to generate preview array buffer')

        loadingTask = getDocument({ data: new Uint8Array(arrayBuffer) })
        const pdfDocument = await loadingTask.promise

        const renderedPages = []
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
          if (cancelled) return
          const page = await pdfDocument.getPage(pageNumber)
          const viewport = page.getViewport({ scale: 1.35 })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          if (!context) throw new Error('Unable to create canvas context')
          canvas.width = viewport.width
          canvas.height = viewport.height
          await page.render({ canvasContext: context, viewport }).promise
          renderedPages.push(canvas.toDataURL('image/png'))
        }

        if (!cancelled) {
          setPreviewPages(renderedPages)
        }
      } catch (error) {
        console.error('Error rendering PDF preview:', error)
        if (!cancelled) {
          setPreviewError(error?.message || 'Failed to render preview')
          setPreviewPages([])
        }
      } finally {
        if (!cancelled) setIsRenderingPreview(false)
      }
    }

    const timeoutId = setTimeout(renderPdfPreview, 200)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      if (loadingTask) {
        loadingTask.destroy()
      }
    }
  }, [resumeData, resumeFormat, sectionHeadings])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Resume Maker</h1>
        <p>Create your professional resume in minutes</p>
      </header>

      <div className="container">
        <div className="form-section">
          <h2>Resume Information</h2>

          <section className="form-group">
            {renderEditableHeading('personalInfo')}
            <input
              type="text"
              placeholder="Full Name"
              value={resumeData.personalInfo.fullName}
              onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={resumeData.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={resumeData.personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={resumeData.personalInfo.address}
              onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
            />
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={resumeData.personalInfo.linkedin}
              onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
            />
            <input
              type="text"
              placeholder="GitHub URL"
              value={resumeData.personalInfo.github}
              onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
            />
          </section>

          <section className="form-group">
            {renderEditableHeading('summary')}
            <textarea
              placeholder="Write a brief summary about yourself..."
              value={resumeData.summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              rows="4"
            />
          </section>

          <section className="form-group">
            {renderEditableHeading('experience')}
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                />
                <div className="date-inputs">
                  <input
                    type="text"
                    placeholder="Start Date (e.g., Jan 2020)"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="End Date (e.g., Present)"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                  />
                </div>
                <textarea
                  placeholder="Job description..."
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  rows="3"
                />
                {resumeData.experience.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeExperience(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addExperience}>
              + Add Experience
            </button>
          </section>

          <section className="form-group">
            {renderEditableHeading('education')}
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <input
                  type="text"
                  placeholder="School/University"
                  value={edu.school}
                  onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={edu.field}
                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Graduation Date"
                  value={edu.graduationDate}
                  onChange={(e) => handleEducationChange(index, 'graduationDate', e.target.value)}
                />
                {resumeData.education.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeEducation(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addEducation}>
              + Add Education
            </button>
          </section>

          <section className="form-group">
            {renderEditableHeading('projects')}
            {resumeData.projects.map((project, index) => (
              <div key={index} className="project-item">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                />
                <textarea
                  placeholder="Project description..."
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  rows="4"
                />
                <input
                  type="text"
                  placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                  value={project.technologies}
                  onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Project Link (GitHub, Live Demo, etc.)"
                  value={project.link}
                  onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                />
                {resumeData.projects.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeProject(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addProject}>
              + Add Project
            </button>
          </section>

          <section className="form-group">
            {renderEditableHeading('skills')}
            <div className="skill-input">
              <input
                type="text"
                placeholder="Add a skill and press Enter"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button type="button" className="add-btn" onClick={addSkill}>
                Add
              </button>
            </div>
            <div className="skills-list">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    className="skill-remove"
                    onClick={() => removeSkill(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="preview-section">
          <div className="preview-header">
            <div>
              <span className="ats-badge">✓ ATS-Friendly Format</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <label htmlFor="format-select" style={{ fontSize: '14px', fontWeight: '500' }}>Format:</label>
                <select
                  id="format-select"
                  value={resumeFormat}
                  onChange={(e) => setResumeFormat(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {formatOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="download-btn"
                onClick={() => downloadPDF(true)}
                disabled={isGeneratingPDF}
                title="Download PDF"
              >
                {isGeneratingPDF ? '⏳ Generating PDF...' : '📥 Download PDF'}
              </button>
            </div>
          </div>
          <div className="resume-preview">
            {previewError ? (
              <div style={{ padding: '20px', color: '#c82333' }}>
                Preview failed: {previewError}
              </div>
            ) : previewPages.length === 0 ? (
              <div style={{ padding: '20px', color: '#666' }}>
                {isRenderingPreview ? 'Rendering PDF preview...' : 'Preparing preview...'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {previewPages.map((pageSrc, index) => (
                  <img
                    key={index}
                    src={pageSrc}
                    alt={`PDF preview page ${index + 1}`}
                    style={{ width: '100%', border: '1px solid #e3e7ef', background: '#fff' }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
