import * as mammoth from 'mammoth'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = pdfWorker

const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const PHONE_REGEX = /(?:\+?\d[\d\s().-]{7,}\d)/g
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s)]+/gi
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s)]+/gi
const URL_REGEX = /https?:\/\/[^\s)]+/gi
const DATE_RANGE_REGEX =
  /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}|\d{4})\s*(?:-|–|—|to)\s*(?:present|current|now|(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}|\d{4}))/i
const YEAR_REGEX = /\b(?:19|20)\d{2}\b/
const DEGREE_HINT_REGEX = /\b(bachelor|master|b\.?s\.?|m\.?s\.?|phd|doctorate|associate|diploma|mba)\b/i
const FIELD_HINT_REGEX = /\b(computer science|software|engineering|information|business|design|data|ai|machine learning|finance|marketing)\b/i
const TITLE_HINT_REGEX = /\b(engineer|developer|manager|analyst|consultant|specialist|lead|director|intern|architect|officer|administrator)\b/i
const SCHOOL_HINT_REGEX = /\b(university|college|school|institute|academy)\b/i
const COMPANY_HINT_REGEX = /\b(inc|llc|ltd|corp|technologies|systems|solutions|labs|company|co\.)\b/i
const SKILL_HINT_REGEX = /\b(javascript|typescript|react|node|python|java|sql|aws|docker|kubernetes|mongodb|postgres|git|rest|graphql|html|css|figma)\b/i

const SECTION_ALIASES = {
  summary: ['summary', 'professional summary', 'profile', 'about', 'objective'],
  experience: ['experience', 'work experience', 'employment history', 'professional experience'],
  education: ['education', 'academic background', 'academic history'],
  projects: ['projects', 'personal projects', 'key projects'],
  skills: ['skills', 'technical skills', 'core skills', 'competencies']
}

const EMPTY_EXPERIENCE = { company: '', position: '', startDate: '', endDate: '', description: '' }
const EMPTY_EDUCATION = { school: '', degree: '', field: '', graduationDate: '' }
const EMPTY_PROJECT = { name: '', description: '', technologies: '', link: '' }

const normalizeString = (value) => (typeof value === 'string' ? cleanLine(value) : '')
const hasText = (value) => normalizeString(value).length > 0

const normalizeExperienceEntry = (entry = {}) => ({
  company: normalizeString(entry.company),
  position: normalizeString(entry.position),
  startDate: normalizeString(entry.startDate),
  endDate: normalizeString(entry.endDate),
  description: normalizeString(entry.description)
})

const normalizeEducationEntry = (entry = {}) => ({
  school: normalizeString(entry.school),
  degree: normalizeString(entry.degree),
  field: normalizeString(entry.field),
  graduationDate: normalizeString(entry.graduationDate)
})

const normalizeProjectEntry = (entry = {}) => ({
  name: normalizeString(entry.name),
  description: normalizeString(entry.description),
  technologies: normalizeString(entry.technologies),
  link: normalizeString(entry.link)
})

const toTemplateArray = (items, normalizeItem, hasData, fallbackItem) => {
  const normalizedItems = (Array.isArray(items) ? items : [])
    .map(normalizeItem)
    .filter(hasData)
  return normalizedItems.length ? normalizedItems : [fallbackItem]
}

const normalizeHeading = (line = '') =>
  line.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

const cleanLine = (line = '') => line.replace(/\s+/g, ' ').trim()
const stripBullet = (line = '') => line.replace(/^[-*•▪◦]\s*/, '').trim()
const isBulletLine = (line = '') => /^[-*•▪◦]\s+/.test(line)

const splitLines = (text) =>
  text
    .replace(/\r/g, '')
    .split('\n')
    .map(cleanLine)
    .filter(Boolean)

const getFirstMatch = (text, regex) => {
  const matches = text.match(regex)
  return matches?.[0] || ''
}

const normalizeUrl = (urlValue = '') => {
  if (!urlValue) return ''
  return /^https?:\/\//i.test(urlValue) ? urlValue : `https://${urlValue}`
}

const removeDateRange = (text = '') =>
  text
    .replace(DATE_RANGE_REGEX, '')
    .replace(/\b(present|current|now)\b/ig, '')
    .replace(/\s*[|,-]\s*$/, '')
    .trim()

const parseDateRange = (text = '') => {
  const match = text.match(DATE_RANGE_REGEX)
  if (!match) return { startDate: '', endDate: '' }
  const parts = match[0].replace(/\s+/g, ' ').trim().split(/\s*(?:-|–|—|to)\s*/i)
  return { startDate: parts[0] || '', endDate: parts[1] || '' }
}

const detectSectionKey = (line) => {
  const normalized = normalizeHeading(line)
  const match = Object.entries(SECTION_ALIASES).find(([, aliases]) =>
    aliases.some((alias) => normalized === alias || normalized.startsWith(`${alias} `) || normalized.includes(` ${alias}`))
  )
  return match?.[0] || null
}

const isLikelyHeadingLine = (line) => {
  const normalized = normalizeHeading(line)
  if (!normalized) return false
  const words = normalized.split(' ').filter(Boolean)
  const hasAlias = Object.values(SECTION_ALIASES).flat().some((alias) => normalized === alias || normalized.includes(alias))
  const mostlyUppercase = line === line.toUpperCase() && /[A-Z]/.test(line)
  return hasAlias || mostlyUppercase || (words.length <= 4 && (line.endsWith(':') || words.length <= 2))
}

const splitSections = (lines) => {
  const sections = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    projects: [],
    skills: []
  }

  let activeSection = 'header'
  lines.forEach((line) => {
    const detected = detectSectionKey(line)
    if (detected) {
      activeSection = detected
      return
    }
    if (isLikelyHeadingLine(line) && !detected) return
    sections[activeSection].push(line)
  })

  if (!sections.summary.length && sections.header.length > 2) {
    sections.summary = sections.header
      .filter((line) => !line.match(EMAIL_REGEX) && !line.match(PHONE_REGEX) && !line.match(URL_REGEX))
      .slice(2, 8)
  }

  return sections
}

const splitIntoChunks = (lines, isBoundary) => {
  const cleaned = lines.map(stripBullet).map(cleanLine).filter(Boolean)
  if (!cleaned.length) return []
  const chunks = []
  let current = []
  cleaned.forEach((line, index) => {
    if (current.length > 0 && isBoundary(line, index, cleaned)) {
      chunks.push(current)
      current = [line]
    } else {
      current.push(line)
    }
  })
  if (current.length > 0) chunks.push(current)
  return chunks
}

const parseRoleCompanyLine = (line = '') => {
  if (!line) return { position: '', company: '' }
  if (line.includes(' at ')) {
    const [position, company] = line.split(/\s+at\s+/i)
    return { position: cleanLine(position), company: cleanLine(company) }
  }
  if (line.includes('|')) {
    const [left, right] = line.split('|').map(cleanLine)
    if (TITLE_HINT_REGEX.test(left) || !TITLE_HINT_REGEX.test(right)) return { position: left, company: right || '' }
    return { position: right, company: left || '' }
  }
  return { position: line, company: '' }
}

const parseExperience = (lines) => {
  if (!lines.length) return []
  const chunks = splitIntoChunks(lines, (line, index, all) => {
    if (DATE_RANGE_REGEX.test(line)) return true
    const prev = all[index - 1] || ''
    return TITLE_HINT_REGEX.test(line) && line.length < 90 && DATE_RANGE_REGEX.test(prev)
  })

  return chunks
    .map((chunk) => {
      const metadataLine = chunk.find((line) => DATE_RANGE_REGEX.test(line)) || ''
      const roleLine = chunk.find((line) => TITLE_HINT_REGEX.test(line) || line.includes(' at ') || line.includes('|')) || chunk[0] || ''
      const { startDate, endDate } = parseDateRange(metadataLine || chunk.join(' '))
      const roleCompany = parseRoleCompanyLine(removeDateRange(roleLine))
      const fallbackCompany =
        removeDateRange(metadataLine).split('|').map(cleanLine).find((part) => COMPANY_HINT_REGEX.test(part)) || ''
      const description = chunk
        .filter((line) => line !== roleLine && line !== metadataLine)
        .map(stripBullet)
        .join(' ')
        .trim()

      return {
        company: roleCompany.company || fallbackCompany || '',
        position: roleCompany.position || '',
        startDate,
        endDate,
        description
      }
    })
    .filter((entry) => entry.company || entry.position || entry.description)
}

const parseEducation = (lines) => {
  if (!lines.length) return []
  const chunks = splitIntoChunks(lines, (line, index, all) => {
    if (SCHOOL_HINT_REGEX.test(line) && index !== 0) return true
    const prev = all[index - 1] || ''
    return DEGREE_HINT_REGEX.test(line) && SCHOOL_HINT_REGEX.test(prev)
  })

  return chunks
    .map((chunk) => {
      const school = chunk.find((line) => SCHOOL_HINT_REGEX.test(line)) || chunk[0] || ''
      const degree = chunk.find((line) => DEGREE_HINT_REGEX.test(line)) || ''
      const field = chunk.find((line) => FIELD_HINT_REGEX.test(line) && line !== degree) || ''
      const dateLine = chunk.find((line) => DATE_RANGE_REGEX.test(line) || YEAR_REGEX.test(line)) || ''
      const dateFromRange = parseDateRange(dateLine).endDate
      const yearMatch = dateLine.match(/(?:19|20)\d{2}/)
      return {
        school,
        degree,
        field,
        graduationDate: dateFromRange || yearMatch?.[0] || ''
      }
    })
    .filter((entry) => entry.school || entry.degree || entry.field)
}

const parseProjects = (lines, fullText) => {
  if (!lines.length && !fullText.match(URL_REGEX)) return []
  const chunks = splitIntoChunks(lines, (line, index, all) => {
    if (line.match(URL_REGEX)) return true
    const prev = all[index - 1] || ''
    return !isBulletLine(line) && prev.endsWith('.') && line.length < 75
  })
  const fallbackLink = getFirstMatch(fullText, URL_REGEX)
  return chunks
    .map((chunk, index) => {
      const link = getFirstMatch(chunk.join(' '), URL_REGEX) || fallbackLink || ''
      return {
        name: stripBullet(chunk[0] || `Imported Project ${index + 1}`),
        description: chunk.slice(1).map(stripBullet).join(' ').trim(),
        technologies: '',
        link
      }
    })
    .filter((entry) => entry.name || entry.description || entry.link)
}

const parseSkills = (skillLines, allLines) => {
  const sourceLines = skillLines.length ? skillLines : allLines.filter((line) => SKILL_HINT_REGEX.test(line))
  if (!sourceLines.length) return []
  const items = sourceLines
    .join(' | ')
    .replace(/\s{2,}/g, ' ')
    .split(/[,|•/;:]/)
    .map((value) => value.trim())
    .filter((value) => value && value.length <= 40 && !value.match(/^\d{4}$/))
  return Array.from(new Set(items)).slice(0, 40)
}

const parseHeaderInfo = (headerLines, allLines) => {
  const source = headerLines.length ? headerLines : allLines.slice(0, 10)
  const fullText = allLines.join('\n')
  const phone = getFirstMatch(fullText, PHONE_REGEX)
  const fullName =
    source.find((line) => {
      if (line.includes('@')) return false
      if (line.match(URL_REGEX)) return false
      if (phone && line.includes(phone)) return false
      const words = line.split(' ').filter(Boolean)
      return words.length >= 2 && words.length <= 5 && line.length <= 55
    }) || ''

  return {
    fullName,
    email: getFirstMatch(fullText, EMAIL_REGEX),
    phone,
    address: '',
    linkedin: normalizeUrl(getFirstMatch(fullText, LINKEDIN_REGEX)),
    github: normalizeUrl(getFirstMatch(fullText, GITHUB_REGEX))
  }
}

const mapToResumeData = (rawText) => {
  const lines = splitLines(rawText)
  const fullText = lines.join('\n')
  const sections = splitSections(lines)
  const personalInfo = parseHeaderInfo(sections.header, lines)
  const summary = sections.summary.map(stripBullet).join(' ').slice(0, 1400)
  const experience = parseExperience(sections.experience)
  const education = parseEducation(sections.education)
  const projects = parseProjects(sections.projects, fullText)
  const skills = parseSkills(sections.skills, lines)

  const warnings = []
  if (!personalInfo.email) warnings.push('Email was not detected automatically.')
  if (!personalInfo.phone) warnings.push('Phone number was not detected automatically.')
  if (!experience.length) warnings.push('Experience details need manual review.')
  if (!education.length) warnings.push('Education details need manual review.')
  if (!skills.length) warnings.push('Skills were not clearly detected.')

  const normalizedPersonalInfo = {
    fullName: normalizeString(personalInfo.fullName),
    email: normalizeString(personalInfo.email),
    phone: normalizeString(personalInfo.phone),
    address: normalizeString(personalInfo.address),
    linkedin: normalizeString(personalInfo.linkedin),
    github: normalizeString(personalInfo.github)
  }

  const normalizedSkills = Array.from(
    new Set((Array.isArray(skills) ? skills : []).map(normalizeString).filter(hasText))
  ).slice(0, 40)

  return {
    resumeData: {
      personalInfo: normalizedPersonalInfo,
      summary: normalizeString(summary),
      experience: toTemplateArray(
        experience,
        normalizeExperienceEntry,
        (item) => hasText(item.company) || hasText(item.position) || hasText(item.description),
        EMPTY_EXPERIENCE
      ),
      education: toTemplateArray(
        education,
        normalizeEducationEntry,
        (item) => hasText(item.school) || hasText(item.degree) || hasText(item.field),
        EMPTY_EDUCATION
      ),
      projects: toTemplateArray(
        projects,
        normalizeProjectEntry,
        (item) => hasText(item.name) || hasText(item.description) || hasText(item.technologies) || hasText(item.link),
        EMPTY_PROJECT
      ),
      skills: normalizedSkills
    },
    warnings
  }
}

const extractPdfText = async (file) => {
  const data = new Uint8Array(await file.arrayBuffer())
  const loadingTask = getDocument({ data })
  const document = await loadingTask.promise
  let mergedText = ''

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()
    const textItems = content.items.filter((item) => item.str?.trim())

    const itemsToLines = (items) => {
      const grouped = new Map()
      items.forEach((item) => {
        const yBucket = Math.round((item.transform?.[5] || 0) / 2.2) * 2.2
        const lineItems = grouped.get(yBucket) || []
        lineItems.push(item)
        grouped.set(yBucket, lineItems)
      })
      return Array.from(grouped.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([, lineItems]) =>
          lineItems
            .sort((a, b) => (a.transform?.[4] || 0) - (b.transform?.[4] || 0))
            .map((item) => item.str.trim())
            .join(' ')
        )
        .map(cleanLine)
        .filter(Boolean)
    }

    const midX = viewport.width / 2
    const leftItems = textItems.filter((item) => (item.transform?.[4] || 0) < midX - 14)
    const rightItems = textItems.filter((item) => (item.transform?.[4] || 0) > midX + 14)
    const centerItems = textItems.filter((item) => {
      const x = item.transform?.[4] || 0
      return x >= midX - 14 && x <= midX + 14
    })
    const isTwoColumn = leftItems.length > 20 && rightItems.length > 20
    const pageLines = isTwoColumn
      ? [...itemsToLines(centerItems), ...itemsToLines(leftItems), ...itemsToLines(rightItems)]
      : itemsToLines(textItems)

    mergedText += `${pageLines.join('\n')}\n`
  }

  return mergedText
}

const extractDocxText = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value || ''
}

export const parseCvFile = async (file) => {
  if (!file) {
    throw new Error('Please choose a file first.')
  }

  const fileName = file.name.toLowerCase()
  let rawText = ''
  if (fileName.endsWith('.pdf')) {
    rawText = await extractPdfText(file)
  } else if (fileName.endsWith('.docx')) {
    rawText = await extractDocxText(file)
  } else {
    throw new Error('Unsupported file type. Upload a PDF or DOCX file.')
  }

  if (!rawText.trim()) {
    throw new Error('Could not extract readable text from this file.')
  }

  return mapToResumeData(rawText)
}
