import jsPDF from 'jspdf'
import { DEFAULT_SECTION_HEADINGS, getResumeFormatConfig, TEMPLATE_DEFAULTS } from './resumeTemplateConfig'

const buildFileName = (fullName) => (fullName ? `${fullName.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf')
const DEFAULT_SINGLE_COLUMN_ORDER = ['summary', 'experience', 'projects', 'education', 'skills']

export const createResumePdfDocument = ({ resumeData, resumeFormat, sectionHeadings }) => {
  if (typeof jsPDF === 'undefined') {
    throw new Error('jsPDF library is not loaded')
  }

  const rawFormatConfig = getResumeFormatConfig(resumeFormat)
  const formatConfig = {
    ...TEMPLATE_DEFAULTS,
    ...rawFormatConfig,
    header: {
      ...TEMPLATE_DEFAULTS.header,
      ...(rawFormatConfig.header || {})
    },
    sections: {
      ...TEMPLATE_DEFAULTS.sections,
      ...(rawFormatConfig.sections || {}),
      headingAlignBySection: {
        ...TEMPLATE_DEFAULTS.sections.headingAlignBySection,
        ...(rawFormatConfig.sections?.headingAlignBySection || {})
      }
    },
    typography: {
      ...TEMPLATE_DEFAULTS.typography,
      ...(rawFormatConfig.typography || {})
    }
  }
  const mergedHeadings = { ...DEFAULT_SECTION_HEADINGS, ...sectionHeadings }
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
  const secondaryColor = '#6b7280'
  const accentColor = '#2f5fad'
  const fullName = resumeData.personalInfo.fullName || 'Your Name'
  const columns = {}
  const yPositions = {}
  const layout = formatConfig.layout || 'two-column'

  if (layout === 'single-column') {
    columns.main = {
      x: leftMargin,
      width: contentWidth
    }
    yPositions.main = topMargin
  } else {
    const leftRatio = formatConfig.leftRatio ?? 0.30
    const columnGap = formatConfig.columnGap ?? 3
    // Calculate widths from usable space (content minus gap) so mirrored formats
    // keep a consistent gutter and proportional columns.
    const usableColumnWidth = contentWidth - columnGap
    const leftWidth = formatConfig.maxLeftWidthMm
      ? Math.min(formatConfig.maxLeftWidthMm, usableColumnWidth * leftRatio)
      : usableColumnWidth * leftRatio
    const rightWidth = usableColumnWidth - leftWidth
    columns.left = { x: leftMargin, width: leftWidth }
    columns.right = { x: leftMargin + leftWidth + columnGap, width: rightWidth }
    yPositions.left = topMargin
    yPositions.right = topMargin
  }

  const drawDivider = (yPos, color = '#d0d7e5') => {
    pdf.setDrawColor(color)
    pdf.setLineWidth(0.4)
    pdf.line(leftMargin, yPos, pageWidth - rightMargin, yPos)
  }

  const addPageHeader = () => {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.setTextColor(primaryColor)
    pdf.text(fullName || 'Resume', leftMargin, topMargin - 6)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(`Page ${pdf.internal.getCurrentPageInfo().pageNumber}`, pageWidth - rightMargin, topMargin - 6, { align: 'right' })
    drawDivider(topMargin - 2, '#d0d7e5')
    Object.keys(yPositions).forEach((columnKey) => {
      yPositions[columnKey] = topMargin + 16
    })
  }

  const ensureSpaceCol = (column, heightNeeded = lineHeight) => {
    const y = yPositions[column] ?? topMargin
    if (y + heightNeeded > pageHeight - bottomMargin) {
      pdf.addPage()
      addPageHeader()
    }
  }

  const getAlignedX = (align, x, width) => {
    if (align === 'center') return x + (width / 2)
    if (align === 'right') return x + width
    return x
  }

  const getSectionHeadingAlign = (sectionKey) =>
    formatConfig.sections.headingAlignBySection?.[sectionKey] || formatConfig.sections.headingAlign || 'left'

  const addHeading = (column, sectionKey, text, size = formatConfig.typography.headingSize, color = accentColor) => {
    if (!text) return
    const { x, width } = columns[column]
    const align = getSectionHeadingAlign(sectionKey)
    const headingX = getAlignedX(align, x, width)
    const lines = pdf.splitTextToSize(text.toUpperCase(), width)
    const textLines = Array.isArray(lines) ? lines : [lines]
    ensureSpaceCol(column, textLines.length * lineHeight + sectionSpacing)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(size)
    pdf.setTextColor(color)
    const currentY = yPositions[column]
    const prePad = currentY < topMargin + 10 ? 3 : 0
    const y = currentY + prePad
    pdf.text(textLines, headingX, y, { align })
    if (layout === 'single-column' && formatConfig.sections.showHorizontalRuleAfterHeading) {
      const lineY = y + (textLines.length * lineHeight) - 1.8
      pdf.setDrawColor('#8f8f8f')
      pdf.setLineWidth(0.35)
      pdf.line(x, lineY, x + width, lineY)
    }
    const used = textLines.length * lineHeight + Math.max(sectionSpacing, 3.5) + prePad
    yPositions[column] += used
    pdf.setTextColor(primaryColor)
  }

  const addSubheading = (column, text, size = formatConfig.typography.subheadingSize) => {
    if (!text) return
    const { x, width } = columns[column]
    const lines = pdf.splitTextToSize(text, width)
    const textLines = Array.isArray(lines) ? lines : [lines]
    ensureSpaceCol(column, textLines.length * lineHeight + 0.4)
    const currentY = yPositions[column]
    const isFirstAfterBreak = currentY <= topMargin + 18
    const prePad = isFirstAfterBreak ? 2 : 0
    const sizeBoost = isFirstAfterBreak ? 0.6 : 0
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(size + sizeBoost)
    pdf.setTextColor(primaryColor)
    pdf.text(textLines, x, currentY + prePad)
    const used = textLines.length * lineHeight + 0.6 + prePad
    yPositions[column] += used
  }

  const addParagraph = (column, text, size = formatConfig.typography.bodySize) => {
    if (!text) return
    const { x, width } = columns[column]
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(size)
    pdf.setTextColor(primaryColor)
    const lines = pdf.splitTextToSize(text, width)
    const textLines = Array.isArray(lines) ? lines : [lines]
    ensureSpaceCol(column, textLines.length * lineHeight)
    const y = yPositions[column]
    pdf.text(textLines, x, y)
    const used = textLines.length * lineHeight + 0.6
    yPositions[column] += used
  }

  const addMetaLine = (column, text, size = formatConfig.typography.metaSize) => {
    if (!text) return
    const { x, width } = columns[column]
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(size)
    pdf.setTextColor(primaryColor)
    const lines = pdf.splitTextToSize(text, width)
    const textLines = Array.isArray(lines) ? lines : [lines]
    ensureSpaceCol(column, textLines.length * lineHeight)
    const y = yPositions[column]
    pdf.text(textLines, x, y)
    const used = textLines.length * lineHeight + 1.2
    yPositions[column] += used
  }

  const addBullets = (column, items, size = formatConfig.typography.bodySize + 0.8) => {
    if (!items || items.length === 0) return
    const { x, width } = columns[column]
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(size)

    items.forEach(item => {
      if (!item) return
      const lines = pdf.splitTextToSize(`• ${item}`, width)
      const textLines = Array.isArray(lines) ? lines : [lines]
      ensureSpaceCol(column, textLines.length * lineHeight)
      const y = yPositions[column]
      pdf.text(textLines, x, y)
      yPositions[column] += textLines.length * lineHeight + 0.8
    })

    yPositions[column] += 0.6
  }

  const addCommaSeparatedList = (column, items, size = formatConfig.typography.bodySize + 0.8) => {
    if (!items || items.length === 0) return
    const inlineList = items.filter(Boolean).join(", ")
    if (!inlineList) return
    addParagraph(column, inlineList, size)
    yPositions[column] += 0.6
  }

  const addInlineLeftRight = (
    column,
    leftText,
    rightText,
    size = formatConfig.typography.subheadingSize,
    options = {}
  ) => {
    if (!leftText && !rightText) return
    const { x, width } = columns[column]
    const leftFontStyle = options.leftFontStyle || 'bold'
    const rightFontStyle = options.rightFontStyle || 'normal'
    const leftColor = options.leftColor || primaryColor
    const rightColor = options.rightColor || primaryColor
    const reservedRight = rightText ? Math.min(55, width * 0.35) : 0
    const leftWidth = rightText ? Math.max(width - reservedRight - 2, width * 0.55) : width
    const leftLines = leftText ? pdf.splitTextToSize(leftText, leftWidth) : ['']
    const textLines = Array.isArray(leftLines) ? leftLines : [leftLines]
    const linesToUse = Math.max(1, textLines.length)

    ensureSpaceCol(column, linesToUse * lineHeight + 0.8)
    const y = yPositions[column]
    pdf.setFont('helvetica', leftFontStyle)
    pdf.setFontSize(size)
    pdf.setTextColor(leftColor)
    pdf.text(textLines, x, y)
    if (rightText) {
      pdf.setFont('helvetica', rightFontStyle)
      pdf.setTextColor(rightColor)
      pdf.text(rightText, x + width, y, { align: 'right' })
    }
    pdf.setTextColor(primaryColor)
    yPositions[column] += linesToUse * lineHeight + 0.8
  }

  const addEducationDegreeWithField = (column, degreeText, fieldText) => {
    if (!degreeText && !fieldText) return
    const { x, width } = columns[column]
    const suffix = fieldText ? `(${fieldText})` : ''
    const combined = [degreeText, suffix].filter(Boolean).join(' ')
    const fitsOneLine = pdf.splitTextToSize(combined, width).length === 1
    const baseSize = 10.5
    const fieldSize = 9.1

    if (!fitsOneLine || !fieldText) {
      addSubheading(column, degreeText || 'Degree', baseSize)
      if (fieldText) addParagraph(column, `(${fieldText})`, fieldSize)
      return
    }

    ensureSpaceCol(column, lineHeight + 0.8)
    const y = yPositions[column]
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(baseSize)
    pdf.setTextColor(primaryColor)
    pdf.text(degreeText, x, y)
    const degreeWidth = pdf.getTextWidth(`${degreeText} `)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(fieldSize)
    pdf.setTextColor(secondaryColor)
    pdf.text(`(${fieldText})`, x + degreeWidth, y)
    pdf.setTextColor(primaryColor)
    yPositions[column] += lineHeight + 0.8
  }

  const formatSchoolLocationText = (schoolText = '') =>
    schoolText
      .replace(/\s+\|\s+/g, ', ')
      .replace(/\s+-\s+/g, ', ')
      .replace(/\s*,\s*/g, ', ')
      .trim()

  // Header
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(22)
  pdf.setTextColor(accentColor)
  const contentStartX = leftMargin
  const contentAreaWidth = pageWidth - leftMargin - rightMargin
  const nameAlign = formatConfig.header.nameAlign || 'left'
  const contactAlign = formatConfig.header.contactAlign || 'center'
  pdf.text(fullName.toUpperCase(), getAlignedX(nameAlign, contentStartX, contentAreaWidth), topMargin, { align: nameAlign })
  const headerContacts = [
    resumeData.personalInfo.email,
    resumeData.personalInfo.phone,
    resumeData.personalInfo.address
  ].filter(Boolean).join('   |   ')
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10.5)
  pdf.setTextColor(primaryColor)
  if (headerContacts) {
    pdf.text(headerContacts, getAlignedX(contactAlign, contentStartX, contentAreaWidth), topMargin + 7, { align: contactAlign })
  }
  drawDivider(topMargin + 12)
  Object.keys(yPositions).forEach((columnKey) => {
    yPositions[columnKey] = topMargin + 22
  })

  const addEducation = (column) => {
    const hasEdu = resumeData.education.some(edu => edu.school || edu.degree)
    if (!hasEdu) return
    addHeading(column, 'education', mergedHeadings.education, 11, accentColor)
    const educationLayout = formatConfig.sections.educationLayout || 'stacked'
    const graduationLabel = formatConfig.sections.graduationLabel || 'Graduation'

    resumeData.education.forEach(edu => {
      if (!edu.school && !edu.degree) return
      if (educationLayout === 'inline-graduation-right') {
        addEducationDegreeWithField(column, edu.degree || 'Degree', edu.field || '')
      } else {
        addSubheading(column, edu.degree || 'Degree', 10.5)
      }
      if (educationLayout === 'inline-graduation-right') {
        const schoolWithLocation = formatSchoolLocationText(edu.school || '')
        const graduationText = edu.graduationDate ? `${graduationLabel}: ${edu.graduationDate}` : ''
        addInlineLeftRight(column, schoolWithLocation, graduationText, 10, {
          leftFontStyle: 'normal',
          rightFontStyle: 'bold',
          leftColor: primaryColor,
          rightColor: primaryColor
        })
        yPositions[column] += 1.4
      } else {
        addParagraph(column, edu.school || '', 9.0)
        addParagraph(column, edu.field ? `Field: ${edu.field}` : '', 9.0)
        addParagraph(column, edu.graduationDate ? `${graduationLabel}: ${edu.graduationDate}` : '', 9.0)
        yPositions[column] += 2
      }
    })
  }

  const addSkills = (column) => {
    if (resumeData.skills.length === 0) return
    addHeading(column, 'skills', mergedHeadings.skills, 11, accentColor)
    if (formatConfig.sections.skillsStyle === "comma") {
      addCommaSeparatedList(column, resumeData.skills, formatConfig.typography.bodySize)
    } else {
      addBullets(column, resumeData.skills, 10)
    }
    if (layout === 'single-column') {
      // Keep single-column section rhythm consistent with education/experience blocks.
      yPositions[column] += 0.8
    }
  }

  const addSummary = (column) => {
    if (!resumeData.summary) return
    addHeading(column, 'summary', mergedHeadings.summary, 11.5, accentColor)
    addParagraph(column, resumeData.summary, 9.4)
  }

  const addExperience = (column) => {
    const hasExp = resumeData.experience.some(exp => exp.company || exp.position || exp.description)
    if (!hasExp) return
    addHeading(column, 'experience', mergedHeadings.experience, 11.5, accentColor)
    resumeData.experience.forEach(exp => {
      if (!exp.company && !exp.position && !exp.description) return
      addSubheading(column, exp.position || 'Position', 11)
      addMetaLine(column, exp.company ? `${exp.company} — ${[exp.startDate, exp.endDate].filter(Boolean).join(' - ')}`.trim() : [exp.startDate, exp.endDate].filter(Boolean).join(' - '))
      if (exp.description) addParagraph(column, exp.description, 9.0)
      yPositions[column] += 2
    })
  }

  const addProjects = (column) => {
    const hasProjects = resumeData.projects.some(p => p.name || p.description)
    if (!hasProjects) return
    addHeading(column, 'projects', mergedHeadings.projects, 11.5, accentColor)
    resumeData.projects.forEach(project => {
      if (!project.name && !project.description) return
      addSubheading(column, project.name || 'Project', 11)
      addParagraph(column, project.description, 9.0)
      addParagraph(column, project.technologies ? `Tech: ${project.technologies}` : '', 9.0)
      yPositions[column] += 1
    })
  }

  const sectionRenderers = {
    summary: addSummary,
    experience: addExperience,
    projects: addProjects,
    education: addEducation,
    skills: addSkills
  }

  const renderSections = (columnKey, sectionOrder) => {
    sectionOrder.forEach((sectionName) => {
      const renderer = sectionRenderers[sectionName]
      if (renderer) renderer(columnKey)
    })
  }

  if (layout === 'single-column') {
    const singleOrder = formatConfig.columns?.main || DEFAULT_SINGLE_COLUMN_ORDER
    renderSections('main', singleOrder)
  } else {
    const leftOrder = formatConfig.columns?.left || []
    const rightOrder = formatConfig.columns?.right || []
    if (resumeFormat === 'format2') {
      // Render right column first so left-column overflow doesn't force
      // right-column content onto later pages for reverse executive layout.
      renderSections('right', rightOrder)
      renderSections('left', leftOrder)
    } else {
      renderSections('left', leftOrder)
      renderSections('right', rightOrder)
    }
  }

  return { pdf, fileName: buildFileName(fullName) }
}
