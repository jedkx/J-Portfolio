// Build-time script: downloads CV PDF from Google Drive and extracts
// structured data into src/generated/cv-data.json
//
// Runs automatically via "prebuild" and "predev" npm hooks.
// On failure it always writes fallback data so the build doesn't break.

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

// Read FILE_ID from config.ts — single source of truth
const configSrc = readFileSync(join(__dirname, '../src/constants/config.ts'), 'utf8')
const FILE_ID =
  process.env.CV_DRIVE_FILE_ID ??
  configSrc.match(/CV_DRIVE_FILE_ID\s*=\s*['"]([^'"]+)['"]/)?.[1] ??
  (() => { throw new Error('CV_DRIVE_FILE_ID not found in config.ts') })()

const OUT_DIR  = join(__dirname, '../src/generated')
const OUT_FILE = join(OUT_DIR, 'cv-data.json')

const EMPTY = { experience: [], education: [], skills: [] }

// ── Download ──────────────────────────────────────────────────────────────────

async function downloadPdf() {
  const primary = `https://drive.google.com/uc?id=${FILE_ID}&export=download`
  console.log('[fetch-cv] Downloading PDF...')

  const res = await fetch(primary, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-build)' },
    redirect: 'follow',
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const ct = res.headers.get('content-type') || ''
  if (ct.includes('text/html')) {
    // Google Drive virus-scan confirmation page
    const html = await res.text()
    const m = html.match(/href="(\/uc\?export=download[^"]+confirm=[^"]+)"/)
    if (!m) throw new Error('No confirmation link found in Google Drive response')
    const confirmUrl = 'https://drive.google.com' + m[1].replace(/&amp;/g, '&')
    const r2 = await fetch(confirmUrl, { redirect: 'follow' })
    if (!r2.ok) throw new Error(`Confirm download HTTP ${r2.status}`)
    return Buffer.from(await r2.arrayBuffer())
  }

  return Buffer.from(await res.arrayBuffer())
}

// ── Section splitter ──────────────────────────────────────────────────────────

const SECTION_HEADERS = [
  'EXPERIENCE', 'WORK EXPERIENCE', 'İŞ DENEYİMİ', 'DENEYİM', 'PROFESSIONAL EXPERIENCE',
  'EDUCATION', 'EĞİTİM', 'ACADEMIC BACKGROUND',
  'SKILLS', 'BECERİLER', 'TECHNICAL SKILLS', 'TECHNOLOGIES',
  'PROJECTS', 'PROJELER',
  'CERTIFICATIONS', 'SERTİFİKALAR',
  'LANGUAGES', 'DİLLER',
  'SUMMARY', 'OBJECTIVE', 'ABOUT', 'PROFILE',
]

const SECTION_RE = new RegExp(
  `^(${SECTION_HEADERS.map(h => h.replace(/[()]/g, '\\$&')).join('|')})\\s*$`,
  'im'
)

function getSection(text, ...titles) {
  const normalised = text.replace(/\r\n/g, '\n')
  for (const title of titles) {
    const re = new RegExp(`^${title}\\s*$`, 'im')
    const start = normalised.search(re)
    if (start === -1) continue
    const afterHeader = normalised.indexOf('\n', start) + 1
    const nextSection = normalised.slice(afterHeader).search(SECTION_RE)
    const end = nextSection === -1 ? undefined : afterHeader + nextSection
    return normalised.slice(afterHeader, end).trim()
  }
  return ''
}

// ── Experience parser ─────────────────────────────────────────────────────────

const DATE_PATTERN = /(\d{4})\s*[—–\-]\s*(\d{4}|Present|Günümüz|Halen|Current)/i

function parseExperience(section) {
  if (!section) return []
  const entries = []
  const lines = section.split('\n').map(l => l.trim()).filter(Boolean)

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const dateMatch = line.match(DATE_PATTERN) || (lines[i + 1] || '').match(DATE_PATTERN)
    if (!dateMatch) { i++; continue }

    const period = dateMatch[0].trim()

    // Role / Company are on the line(s) near the date
    let role = '', company = ''
    const candidate = dateMatch.index != null && line.match(DATE_PATTERN)
      ? line.replace(DATE_PATTERN, '').replace(/\|/g, '').trim()
      : line

    if (candidate.includes('|')) {
      const parts = candidate.split('|')
      role = parts[0].trim(); company = parts[1]?.trim() || ''
    } else if (candidate.includes('@')) {
      const parts = candidate.split('@')
      role = parts[0].trim(); company = parts[1]?.trim() || ''
    } else if (candidate.includes(',')) {
      const parts = candidate.split(',')
      role = parts[0].trim(); company = parts[1]?.trim() || ''
    } else {
      role = candidate
      company = (lines[i + 1] || '').match(DATE_PATTERN) ? '' : (lines[i + 1] || '')
    }

    // Description lines until next entry
    const descStart = i + (line.match(DATE_PATTERN) ? 1 : 2)
    const descLines = []
    const techItems = []
    let j = descStart
    while (j < lines.length && !lines[j].match(DATE_PATTERN)) {
      const l = lines[j].replace(/^[-•*]\s*/, '').trim()
      if (l.match(/^(Technologies|Tech|Stack|Tools)[:]/i)) {
        l.replace(/^[^:]+:\s*/, '').split(/[,|]/).forEach(t => {
          const s = t.trim(); if (s) techItems.push(s)
        })
      } else if (l.includes(',') && l.split(',').length >= 3 && l.length < 120) {
        l.split(',').forEach(t => { const s = t.trim(); if (s) techItems.push(s) })
      } else if (l) {
        descLines.push(l)
      }
      j++
    }

    if (role || company) {
      entries.push({
        role: role || 'Software Developer',
        company: company || '',
        period,
        description: descLines.slice(0, 2).join(' ').slice(0, 200),
        tech: techItems.slice(0, 10),
      })
    }
    i = j
  }

  return entries
}

// ── Education parser ──────────────────────────────────────────────────────────

const DEGREE_WORDS = /bachelor|master|b\.sc|m\.sc|phd|lisans|yüksek lisans|doktora|associate|diploma/i

function parseEducation(section) {
  if (!section) return []
  const entries = []
  const lines = section.split('\n').map(l => l.trim()).filter(Boolean)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!DEGREE_WORDS.test(line) && !line.match(/University|Üniversite|Institute|College/i)) continue

    const dateMatch = [line, lines[i+1]||'', lines[i+2]||''].join(' ').match(DATE_PATTERN)
    const period = dateMatch ? dateMatch[0].trim() : ''

    let degree = line, school = '', location = '', note = ''

    if (line.includes('|')) {
      const parts = line.split('|')
      degree = parts[0].trim(); school = parts[1]?.trim() || ''
    } else if (DEGREE_WORDS.test(line) && !line.match(/University|Üniversite/i)) {
      degree = line.replace(DATE_PATTERN, '').trim()
      school = (lines[i+1] || '').replace(DATE_PATTERN, '').trim()
      location = (lines[i+2] || '').replace(DATE_PATTERN, '').trim()
    } else {
      school = line.replace(DATE_PATTERN, '').trim()
      degree = (lines[i-1] || '').replace(DATE_PATTERN, '').trim()
    }

    // Note: lines like "Expected graduation YYYY"
    for (let k = i; k < Math.min(i + 5, lines.length); k++) {
      if (/expected|beklenen|anticipated/i.test(lines[k])) {
        note = lines[k].trim()
        break
      }
    }

    if (degree || school) {
      entries.push({ degree, school, period, location, ...(note ? { note } : {}) })
    }
  }

  return entries
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  let pdfParse
  try {
    pdfParse = require('pdf-parse')
  } catch {
    console.warn('[fetch-cv] pdf-parse not found — run npm install first')
    writeFileSync(OUT_FILE, JSON.stringify(EMPTY, null, 2))
    return
  }

  let buffer
  try {
    buffer = await downloadPdf()
  } catch (err) {
    console.warn('[fetch-cv] Download failed:', err.message, '— using empty data')
    writeFileSync(OUT_FILE, JSON.stringify(EMPTY, null, 2))
    return
  }

  let text = ''
  try {
    const parsed = await pdfParse(buffer)
    text = parsed.text
    console.log(`[fetch-cv] Extracted ${text.length} chars from PDF`)
  } catch (err) {
    console.warn('[fetch-cv] PDF parse error:', err.message)
    writeFileSync(OUT_FILE, JSON.stringify(EMPTY, null, 2))
    return
  }

  const expSection = getSection(text,
    'EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'İŞ DENEYİMİ', 'DENEYİM')
  const eduSection = getSection(text,
    'EDUCATION', 'EĞİTİM', 'ACADEMIC BACKGROUND')
  const skillsSection = getSection(text,
    'SKILLS', 'TECHNICAL SKILLS', 'TECHNOLOGIES', 'BECERİLER')

  const experience = parseExperience(expSection)
  const education  = parseEducation(eduSection)
  const skills = skillsSection
    ? [...new Set(
        skillsSection.split(/[,|\n•]/).map(s => s.trim().replace(/^[-*]\s*/, ''))
          .filter(s => s && s.length > 1 && s.length < 35)
      )]
    : []

  writeFileSync(OUT_FILE, JSON.stringify({ experience, education, skills }, null, 2))

  console.log(`[fetch-cv] ✓ experience=${experience.length} education=${education.length} skills=${skills.length}`)

  if (experience.length === 0 && education.length === 0) {
    console.warn('[fetch-cv] ⚠ Nothing extracted. First 800 chars of raw text:')
    console.warn(text.slice(0, 800))
  }
}

main().catch(err => {
  console.error('[fetch-cv] Unexpected error:', err)
  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify(EMPTY, null, 2))
})
