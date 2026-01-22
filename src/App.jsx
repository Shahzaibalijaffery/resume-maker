import { useState, useRef, useEffect } from 'react'
import jsPDF from 'jspdf'
import './App.css'

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
  const [pageBreaks, setPageBreaks] = useState([])
  const [manualPageBreaks, setManualPageBreaks] = useState([])
  const resumePreviewRef = useRef(null)

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

  // Toggle manual page break at clicked element position
  const toggleManualPageBreak = (element) => {
    if (!resumePreviewRef.current) return

    const previewElement = resumePreviewRef.current
    const elementRect = element.getBoundingClientRect()
    const previewRect = previewElement.getBoundingClientRect()

    // Calculate Y position relative to preview element
    const yPosition = elementRect.top - previewRect.top + previewElement.scrollTop

    // Check if there's already a manual break near this position (within 10px tolerance)
    const existingBreakIndex = manualPageBreaks.findIndex(
      mb => Math.abs(mb - yPosition) < 10
    )

    if (existingBreakIndex >= 0) {
      // Remove existing manual break
      setManualPageBreaks(prev => prev.filter((_, i) => i !== existingBreakIndex))
    } else {
      // Add new manual break
      setManualPageBreaks(prev => [...prev, yPosition].sort((a, b) => a - b))
    }
  }

  // Calculate page breaks for preview - exactly matches PDF generation logic
  useEffect(() => {
    const calculatePageBreaks = async () => {
      if (!resumePreviewRef.current) return

      // Simulate the exact PDF generation calculation
      // First, get the actual rendered dimensions (like html2canvas does)
      const previewElement = resumePreviewRef.current

      // Fast, non-blocking preview calculation (simple estimate to avoid html2canvas hang)
      const pageHeightMM = 297
      const topMarginMM = 10
      const bottomMarginMM = 15
      const contentHeightPerPageMM = pageHeightMM - topMarginMM - bottomMarginMM

      const previewHeight = previewElement.scrollHeight
      const previewWidth = previewElement.offsetWidth
      const pageWidthMM = 210
      const contentWidthMM = pageWidthMM - 15 - 15

      const pixelsPerMM = (previewWidth - 70) / contentWidthMM // Account for padding
      const contentHeightPerPagePx = contentHeightPerPageMM * pixelsPerMM
      const totalPages = Math.ceil(previewHeight / contentHeightPerPagePx)

      const breaks = []
      let currentY = 30 // padding top
      for (let i = 1; i < totalPages; i++) {
        currentY += contentHeightPerPagePx
        if (currentY < previewHeight - 35) {
          breaks.push(currentY)
        }
      }
      setPageBreaks(breaks)
    }

    // Calculate on mount and when content changes
    const timeoutId = setTimeout(calculatePageBreaks, 200)

    // Recalculate when window resizes or content changes
    window.addEventListener('resize', calculatePageBreaks)

    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(calculatePageBreaks)
    if (resumePreviewRef.current) {
      observer.observe(resumePreviewRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', calculatePageBreaks)
      observer.disconnect()
    }
  }, [resumeData, manualPageBreaks]) // Recalculate when manual breaks change

  // Helper function to check if a region has text (non-white pixels)
  const hasTextInRegion = (imageData, y, width, height, threshold = 0.1) => {
    let nonWhitePixels = 0
    let totalPixels = 0
    const sampleRate = Math.max(1, Math.floor(width / 100))

    for (let checkY = y; checkY < y + height && checkY < imageData.height; checkY++) {
      for (let x = 0; x < width; x += sampleRate) {
        const idx = (Math.floor(checkY) * width + x) * 4
        if (idx >= 0 && idx < imageData.data.length - 3) {
          const r = imageData.data[idx]
          const g = imageData.data[idx + 1]
          const b = imageData.data[idx + 2]

          // Check if pixel is NOT white
          if (r < 240 || g < 240 || b < 240) {
            nonWhitePixels++
          }
          totalPixels++
        }
      }
    }

    return (nonWhitePixels / totalPixels) > threshold
  }

  // Helper function to detect if region contains skill tags or similar compact elements
  // Skill tags typically have rounded corners and are in a flex-wrap layout
  const hasCompactElements = (imageData, y, width, height) => {
    // Check for patterns that suggest skill tags or similar elements
    // Look for horizontal clusters of non-white pixels (suggesting tags in a row)
    let horizontalClusters = 0
    const sampleRate = Math.max(1, Math.floor(width / 150))

    for (let checkY = y; checkY < y + height && checkY < imageData.height; checkY++) {
      let inCluster = false
      let clusterStart = -1

      for (let x = 0; x < width; x += sampleRate) {
        const idx = (Math.floor(checkY) * width + x) * 4
        if (idx >= 0 && idx < imageData.data.length - 3) {
          const r = imageData.data[idx]
          const g = imageData.data[idx + 1]
          const b = imageData.data[idx + 2]

          // Check if pixel is NOT white (part of a tag/element)
          if (r < 245 || g < 245 || b < 245) {
            if (!inCluster) {
              inCluster = true
              clusterStart = x
            }
          } else {
            if (inCluster && clusterStart !== -1) {
              // Found end of cluster, check if it's a reasonable size for a tag
              const clusterWidth = x - clusterStart
              if (clusterWidth > 20 && clusterWidth < 200) {
                horizontalClusters++
              }
              inCluster = false
            }
          }
        }
      }
    }

    // If we find multiple horizontal clusters, likely skill tags or similar
    return horizontalClusters > 3
  }

  // Helper function to find safe break point by analyzing white space
  // Looks for consecutive white lines to ensure we don't cut through text
  const findSafeBreakPoint = (imageData, startY, endY, width, minWhiteLines = 30) => {
    const lineHeight = 1 // Check each line
    let consecutiveWhiteLines = 0
    let bestY = endY
    let foundBreak = false
    let whiteSpaceStartY = endY

    // Scan from endY backwards to find area with consecutive white lines
    for (let y = endY; y >= startY; y -= lineHeight) {
      let whitePixelCount = 0
      let totalPixels = 0

      // Check entire horizontal line with sampling for performance
      const sampleRate = Math.max(1, Math.floor(width / 200)) // Sample every Nth pixel
      for (let x = 0; x < width; x += sampleRate) {
        const idx = (Math.floor(y) * width + x) * 4
        if (idx >= 0 && idx < imageData.data.length - 3) {
          const r = imageData.data[idx]
          const g = imageData.data[idx + 1]
          const b = imageData.data[idx + 2]

          // Check if pixel is white (or very close to white) - more lenient threshold
          if (r > 245 && g > 245 && b > 245) {
            whitePixelCount++
          }
          totalPixels++
        }
      }

      const whiteRatio = totalPixels > 0 ? whitePixelCount / totalPixels : 0

      // Require at least 95% white pixels for a line to be considered white (more lenient)
      if (whiteRatio >= 0.95) {
        if (consecutiveWhiteLines === 0) {
          whiteSpaceStartY = y // Mark start of white space region
        }
        consecutiveWhiteLines++

        if (consecutiveWhiteLines >= minWhiteLines && !foundBreak) {
          // Before breaking, verify there's no text or compact elements in the region above
          const checkHeight = 30 // Check 30 pixels above the break point (increased for skill tags)
          const checkY = whiteSpaceStartY - checkHeight
          if (checkY >= startY) {
            const hasText = hasTextInRegion(imageData, checkY, width, checkHeight, 0.05)
            const hasCompact = hasCompactElements(imageData, checkY, width, checkHeight)

            if (!hasText && !hasCompact) {
              // Found enough consecutive white lines and verified no text/compact elements above - safe to break
              bestY = whiteSpaceStartY
              foundBreak = true
              break
            } else {
              // Text or compact elements detected above, continue searching
              consecutiveWhiteLines = 0
            }
          }
        }
      } else {
        // Reset counter if we hit non-white content
        consecutiveWhiteLines = 0
        if (foundBreak) {
          // We already found a break, stop searching
          break
        }
      }
    }

    // If we didn't find a good break point, be very conservative
    // Move back significantly to ensure we don't cut text or skill tags
    if (!foundBreak) {
      // Move back 200 pixels or 20% of page height, whichever is larger
      // This ensures we avoid cutting through skill tags or other compact elements
      const conservativeBackup = Math.max(startY, endY - Math.max(200, (endY - startY) * 0.20))

      // Double-check the backup position doesn't have compact elements
      const checkHeight = 40
      const checkY = conservativeBackup - checkHeight
      if (checkY >= startY && hasCompactElements(imageData, checkY, width, checkHeight)) {
        // If backup position has compact elements, move back even more
        return Math.max(startY, conservativeBackup - 50)
      }

      return conservativeBackup
    }

    return bestY
  }

  const downloadPDF = async () => {
    setIsGeneratingPDF(true)

    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const leftMargin = 18
      const rightMargin = 18
      const topMargin = 22
      const bottomMargin = 15
      const contentWidth = pageWidth - leftMargin - rightMargin
      const lineHeight = 4.8
      const sectionSpacing = 3
      const primaryColor = '#1a1a1a'
      const accentColor = '#2f5fad'
      const fullName = resumeData.personalInfo.fullName || 'Your Name'

      // Two-column layout
      const leftWidth = Math.min(60, contentWidth * 0.30)
      const columnGap = 3
      const rightWidth = contentWidth - leftWidth - columnGap
      const leftX = leftMargin
      const rightX = leftMargin + leftWidth + columnGap
      let leftY = topMargin
      let rightY = topMargin

      const addPageHeader = () => {
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        pdf.setTextColor(primaryColor)
        pdf.text(fullName || 'Resume', leftMargin, topMargin - 6)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.text(`Page ${pdf.internal.getCurrentPageInfo().pageNumber}`, pageWidth - rightMargin, topMargin - 6, { align: 'right' })
        drawDivider(topMargin - 2, '#d0d7e5')
        // Start content lower on new pages so first headings stand out
        leftY = topMargin + 16
        rightY = topMargin + 16
      }

      const ensureSpaceCol = (column, heightNeeded = lineHeight) => {
        const y = column === 'left' ? leftY : rightY
        if (y + heightNeeded > pageHeight - bottomMargin) {
          pdf.addPage()
          addPageHeader()
        }
      }

      const drawDivider = (yPos, color = '#d0d7e5') => {
        pdf.setDrawColor(color)
        pdf.setLineWidth(0.4)
        pdf.line(leftMargin, yPos, pageWidth - rightMargin, yPos)
      }

      const addHeading = (column, text, size = 13, color = accentColor) => {
        if (!text) return
        const width = column === 'left' ? leftWidth : rightWidth
        const x = column === 'left' ? leftX : rightX
        const lines = pdf.splitTextToSize(text.toUpperCase(), width)
        ensureSpaceCol(column, lines.length * lineHeight + sectionSpacing)
        // IMPORTANT: Re-apply styling AFTER ensureSpaceCol() in case a new page was added
        // This ensures headings always have proper styling, especially when they're the first element on a new page
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(size)
        pdf.setTextColor(color)
        // Add a small pre-pad if we are very near the top of a new page
        const currentY = column === 'left' ? leftY : rightY
        const prePad = currentY < topMargin + 10 ? 3 : 0
        const y = currentY + prePad
        pdf.text(lines, x, y)
        const used = lines.length * lineHeight + Math.max(sectionSpacing, 3.5) + prePad
        if (column === 'left') {
          leftY += used
        } else {
          rightY += used
        }
        pdf.setTextColor(primaryColor)
      }

      const addSubheading = (column, text, size = 10.1) => {
        if (!text) return
        const width = column === 'left' ? leftWidth : rightWidth
        const x = column === 'left' ? leftX : rightX
        const lines = pdf.splitTextToSize(text, width)
        ensureSpaceCol(column, lines.length * lineHeight + 0.4)
        const currentY = column === 'left' ? leftY : rightY
        // If first element after a page break, give a tiny pre-pad and a small size bump, but keep subheading color
        const isFirstAfterBreak = currentY <= topMargin + 18
        const prePad = isFirstAfterBreak ? 2 : 0
        const sizeBoost = isFirstAfterBreak ? 0.6 : 0
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(size + sizeBoost)
        pdf.setTextColor(primaryColor)
        const y = currentY + prePad
        pdf.text(lines, x, y)
        const used = lines.length * lineHeight + 0.6 + prePad
        if (column === 'left') {
          leftY += used
        } else {
          rightY += used
        }
      }

      const addParagraph = (column, text, size = 9.0) => {
        if (!text) return
        const width = column === 'left' ? leftWidth : rightWidth
        const x = column === 'left' ? leftX : rightX
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(size)
        pdf.setTextColor(primaryColor)
        const lines = pdf.splitTextToSize(text, width)
        ensureSpaceCol(column, lines.length * lineHeight)
        // IMPORTANT: compute Y after ensureSpaceCol() since it may add a page and reset cursors
        const y = column === 'left' ? leftY : rightY
        pdf.text(lines, x, y)
        const used = lines.length * lineHeight + 0.6
        if (column === 'left') {
          leftY += used
        } else {
          rightY += used
        }
      }

      const addMetaLine = (column, text, size = 10.3) => {
        if (!text) return
        const width = column === 'left' ? leftWidth : rightWidth
        const x = column === 'left' ? leftX : rightX
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(size)
        pdf.setTextColor(primaryColor)
        const lines = pdf.splitTextToSize(text, width)
        ensureSpaceCol(column, lines.length * lineHeight)
        // IMPORTANT: compute Y after ensureSpaceCol() since it may add a page and reset cursors
        const y = column === 'left' ? leftY : rightY
        pdf.text(lines, x, y)
        const used = lines.length * lineHeight + 1.2
        if (column === 'left') {
          leftY += used
        } else {
          rightY += used
        }
      }

      const addBullets = (column, items, size = 9.8) => {
        if (!items || items.length === 0) return
        const width = column === 'left' ? leftWidth : rightWidth
        const x = column === 'left' ? leftX : rightX
        const yStart = column === 'left' ? leftY : rightY
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(size)
        items.forEach(item => {
          if (!item) return
          const bulletLine = `• ${item}`
          const lines = pdf.splitTextToSize(bulletLine, width)
          ensureSpaceCol(column, lines.length * lineHeight)
          const y = column === 'left' ? leftY : rightY
          pdf.text(lines, x, y)
          if (column === 'left') {
            leftY += lines.length * lineHeight + 0.8
          } else {
            rightY += lines.length * lineHeight + 0.8
          }
        })
        if (column === 'left') {
          leftY += 0.6
        } else {
          rightY += 0.6
        }
      }

      const addLabelValue = (column, label, value) => {
        if (!value) return
        const width = column === 'left' ? leftWidth : rightWidth
        const x = column === 'left' ? leftX : rightX
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(10.5)
        ensureSpaceCol(column, lineHeight)
        // IMPORTANT: compute Y after ensureSpaceCol() since it may add a page and reset cursors
        const y = column === 'left' ? leftY : rightY
        pdf.text(label, x, y)
        const labelWidth = pdf.getTextWidth(label + ' ')
        pdf.setFont('helvetica', 'normal')
        const lines = pdf.splitTextToSize(value, width - labelWidth - 2)
        pdf.text(lines, x + labelWidth, y)
        const used = lines.length * lineHeight + 0.8
        if (column === 'left') leftY += used; else rightY += used
      }

      // Header band (centered contact line)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(22)
      pdf.setTextColor(accentColor)
      pdf.text(fullName.toUpperCase(), leftMargin, topMargin)
      const headerContacts = [
        resumeData.personalInfo.email,
        resumeData.personalInfo.phone,
        resumeData.personalInfo.address
      ].filter(Boolean).join('   |   ')
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10.5)
      pdf.setTextColor(primaryColor)
      if (headerContacts) {
        pdf.text(headerContacts, pageWidth / 2, topMargin + 7, { align: 'center' })
      }
      drawDivider(topMargin + 12)
      leftY = topMargin + 22
      rightY = topMargin + 22

      // LEFT COLUMN: Education + Skills
      const hasEdu = resumeData.education.some(edu => edu.school || edu.degree)
      if (hasEdu) {
        addHeading('left', 'Education', 11, accentColor)
        resumeData.education.forEach(edu => {
          if (!edu.school && !edu.degree) return
          addSubheading('left', edu.degree || 'Degree', 10.5)
          addParagraph('left', edu.school || '', 9.0)
          addParagraph('left', edu.field ? `Field: ${edu.field}` : '', 9.0)
          addParagraph('left', edu.graduationDate ? `Graduation: ${edu.graduationDate}` : '', 9.0)
          leftY += 2
        })
      }

      if (resumeData.skills.length > 0) {
        addHeading('left', 'Skills', 11, accentColor)
        addBullets('left', resumeData.skills, 10)
      }

      // RIGHT COLUMN
      if (resumeData.summary) {
        addHeading('right', 'Professional Profile', 11.5, accentColor)
        addParagraph('right', resumeData.summary, 9.4)
      }

      const hasExp = resumeData.experience.some(exp => exp.company || exp.position || exp.description)
      if (hasExp) {
        addHeading('right', 'Professional Experience', 11.5, accentColor)
        resumeData.experience.forEach(exp => {
          if (!exp.company && !exp.position && !exp.description) return
          addSubheading('right', exp.position || 'Position', 11)
          addMetaLine('right', exp.company ? `${exp.company} — ${[exp.startDate, exp.endDate].filter(Boolean).join(' - ')}`.trim() : [exp.startDate, exp.endDate].filter(Boolean).join(' - '))
          if (exp.description) {
            // Keep experience as paragraph (no bullets)
            addParagraph('right', exp.description, 9.0)
          }
          rightY += 2
        })
      }

      const hasProjects = resumeData.projects.some(p => p.name || p.description)
      if (hasProjects) {
        addHeading('right', 'Projects', 11.5, accentColor)
        resumeData.projects.forEach(project => {
          if (!project.name && !project.description) return
          addSubheading('right', project.name || 'Project', 11)
          addParagraph('right', project.description, 9.0)
          addParagraph('right', project.technologies ? `Tech: ${project.technologies}` : '', 9.0)
          // Link removed per request; keep a tiny spacer
          rightY += 1
        })
      }

      const fileName = fullName ? `${fullName.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf'
      pdf.save(fileName)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

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
            <h3>Personal Information</h3>
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
            <h3>Professional Summary</h3>
            <textarea
              placeholder="Write a brief summary about yourself..."
              value={resumeData.summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              rows="4"
            />
          </section>

          <section className="form-group">
            <h3>Experience</h3>
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
            <h3>Education</h3>
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
            <h3>Projects</h3>
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
            <h3>Skills</h3>
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
              <h2>Resume Preview</h2>
              <span className="ats-badge">✓ ATS-Friendly Format</span>

            </div>
            <button
              type="button"
              className="download-btn"
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              title="Download as ATS-friendly PDF"
            >
              {isGeneratingPDF ? '⏳ Generating PDF...' : '📥 Download PDF'}
            </button>
          </div>
          <div className="resume-preview" ref={resumePreviewRef}>
            {/* Header - matches PDF */}
            <div className="resume-header-pdf">
              <h1 className="resume-name">{resumeData.personalInfo.fullName || 'Your Name'}</h1>
              <div className="contact-info-header">
                {[
                  resumeData.personalInfo.email,
                  resumeData.personalInfo.phone,
                  resumeData.personalInfo.address
                ].filter(Boolean).join('   |   ')}
              </div>
              <div className="header-divider"></div>
            </div>

            {/* Two-column layout - matches PDF */}
            <div className="resume-content-pdf">
              {/* LEFT COLUMN: Education + Skills */}
              <div className="resume-column-left">
                {resumeData.education.some(edu => edu.school || edu.degree) && (
                  <section
                    className="resume-section-pdf"
                    onClick={(e) => {
                      if (e.target.tagName === 'H2') {
                        toggleManualPageBreak(e.currentTarget)
                      }
                    }}
                    title="Click heading to add/remove page break"
                  >
                    <h2 className="resume-heading-pdf page-break-trigger">EDUCATION</h2>
                    {resumeData.education.map((edu, index) => {
                      if (!edu.school && !edu.degree) return null
                      return (
                        <div key={index} className="resume-item-pdf">
                          <h3 className="resume-subheading-pdf">{edu.degree || 'Degree'}</h3>
                          <p className="resume-text-pdf">{edu.school || ''}</p>
                          {edu.field && <p className="resume-text-pdf">Field: {edu.field}</p>}
                          {edu.graduationDate && <p className="resume-text-pdf">Graduation: {edu.graduationDate}</p>}
                        </div>
                      )
                    })}
                  </section>
                )}

                {resumeData.skills.length > 0 && (
                  <section
                    className="resume-section-pdf"
                    onClick={(e) => {
                      if (e.target.tagName === 'H2') {
                        toggleManualPageBreak(e.currentTarget)
                      }
                    }}
                    title="Click heading to add/remove page break"
                  >
                    <h2 className="resume-heading-pdf page-break-trigger">SKILLS</h2>
                    <ul className="resume-skills-list-pdf">
                      {resumeData.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* RIGHT COLUMN: Profile + Experience + Projects */}
              <div className="resume-column-right">
                {resumeData.summary && (
                  <section
                    className="resume-section-pdf"
                    onClick={(e) => {
                      if (e.target.tagName === 'H2') {
                        toggleManualPageBreak(e.currentTarget)
                      }
                    }}
                    title="Click heading to add/remove page break"
                  >
                    <h2 className="resume-heading-pdf page-break-trigger">PROFESSIONAL PROFILE</h2>
                    <p className="resume-text-pdf">{resumeData.summary}</p>
                  </section>
                )}

                {resumeData.experience.some(exp => exp.company || exp.position) && (
                  <section
                    className="resume-section-pdf"
                    onClick={(e) => {
                      if (e.target.tagName === 'H2') {
                        toggleManualPageBreak(e.currentTarget)
                      }
                    }}
                    title="Click heading to add/remove page break"
                  >
                    <h2 className="resume-heading-pdf page-break-trigger">PROFESSIONAL EXPERIENCE</h2>
                    {resumeData.experience.map((exp, index) => {
                      if (!exp.company && !exp.position && !exp.description) return null
                      return (
                        <div
                          key={index}
                          className="resume-item-pdf"
                          onClick={(e) => {
                            if (e.target.tagName === 'H3') {
                              toggleManualPageBreak(e.currentTarget)
                            }
                          }}
                          title="Click item heading to add/remove page break"
                        >
                          <h3 className="resume-subheading-pdf">{exp.position || 'Position'}</h3>
                          <p className="resume-meta-pdf">
                            {exp.company ? `${exp.company} — ` : ''}
                            {[exp.startDate, exp.endDate].filter(Boolean).join(' - ')}
                          </p>
                          {exp.description && <p className="resume-text-pdf">{exp.description}</p>}
                        </div>
                      )
                    })}
                  </section>
                )}

                {resumeData.projects.some(project => project.name || project.description) && (
                  <section
                    className="resume-section-pdf"
                    onClick={(e) => {
                      if (e.target.tagName === 'H2') {
                        toggleManualPageBreak(e.currentTarget)
                      }
                    }}
                    title="Click heading to add/remove page break"
                  >
                    <h2 className="resume-heading-pdf page-break-trigger">PROJECTS</h2>
                    {resumeData.projects.map((project, index) => {
                      if (!project.name && !project.description) return null
                      return (
                        <div
                          key={index}
                          className="resume-item-pdf"
                          onClick={(e) => {
                            if (e.target.tagName === 'H3') {
                              toggleManualPageBreak(e.currentTarget)
                            }
                          }}
                          title="Click item heading to add/remove page break"
                        >
                          <h3 className="resume-subheading-pdf">{project.name || 'Project'}</h3>
                          {project.description && <p className="resume-text-pdf">{project.description}</p>}
                          {project.technologies && <p className="resume-text-pdf">Tech: {project.technologies}</p>}
                        </div>
                      )
                    })}
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
