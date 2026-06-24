/**
 * Troceador Maasy -> Puck (blockSet 'raw', bloque EditableSection). Convierte un
 * HTML de Maasy en DATOS editables por personas (no por devs):
 *   - el <style> global + los <link> de fonts -> Root (RootRaw)
 *   - cada <section> -> un EditableSection con: template (markup con marcadores),
 *     texts[] (los textos como campos "Título/Subtítulo/Botón: ...") e images[]
 *     (las imágenes como campos de URL/upload).
 * No genera código ni recompila el CMS. Es la lógica del skill /believe-web nuevo.
 *
 * Uso: node scripts/trocear-maasy.mjs <htmlPath> <slug> [name]
 */
import { parse } from 'node-html-parser'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const htmlPath = process.argv[2] || '/tmp/pawers-landing-smoke.html'
const slug = process.argv[3] || 'pawers-test'
const nameArg = process.argv[4]

const root = parse(readFileSync(htmlPath, 'utf8'), { comment: false })
const css = root.querySelector('style')?.innerHTML || ''
const fontsHtml = root.querySelectorAll('link').map((l) => l.toString()).join('\n')
const title = nameArg || root.querySelector('title')?.text?.trim() || slug

const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A', 'BUTTON', 'SPAN', 'LI', 'STRONG', 'EM', 'SMALL'])
const LABEL = {
  H1: 'Título', H2: 'Subtítulo', H3: 'Encabezado', H4: 'Encabezado', H5: 'Encabezado', H6: 'Encabezado',
  P: 'Texto', A: 'Enlace/Botón', BUTTON: 'Botón', LI: 'Ítem', SPAN: 'Texto', STRONG: 'Destacado', EM: 'Énfasis', SMALL: 'Nota',
}
// Hoja de texto = tiene texto y NO contiene otros elementos (así no pisamos hijos editables).
const isLeafText = (el) => el.text.trim().length > 0 && el.childNodes.filter((n) => n.nodeType === 1).length === 0

const sections = root.querySelectorAll('section')
const content = sections.map((sec, si) => {
  const texts = []
  const images = []
  sec.querySelectorAll('*').forEach((el) => {
    if (TEXT_TAGS.has(el.tagName) && isLeafText(el)) {
      const value = el.text.trim()
      el.set_content(`{{t${texts.length}}}`)
      texts.push({ label: LABEL[el.tagName] || 'Texto', value })
    }
  })
  sec.querySelectorAll('img').forEach((el) => {
    const origSrc = el.getAttribute('src') || ''
    const origAlt = el.getAttribute('alt') || ''
    el.setAttribute('src', `{{i${images.length}}}`)
    images.push({ alt: origAlt, src: origSrc })
  })
  return {
    type: 'EditableSection',
    props: {
      id: `sec-${si}`,
      label: sec.getAttribute('data-section') || `Sección ${si + 1}`,
      template: sec.toString(),
      texts,
      images,
    },
  }
})

const data = { root: { props: { meta: { title, description: '' }, fontsHtml, css } }, content, zones: {} }
const tenant = { slug, name: title, blockSet: 'raw', tokens: {}, settings: {} }
writeFileSync(`data/tenants/${slug}.json`, JSON.stringify(tenant, null, 2))
mkdirSync(`data/pages/${slug}`, { recursive: true })
writeFileSync(`data/pages/${slug}/home.json`, JSON.stringify(data, null, 2))

const nT = content.reduce((a, c) => a + c.props.texts.length, 0)
const nI = content.reduce((a, c) => a + c.props.images.length, 0)
console.log(`v2 slug=${slug} secciones=${content.length} textos=${nT} imgs=${nI}`)
console.log('ejemplo textos sec0:', content[0]?.props.texts.slice(0, 4).map((t) => `${t.label}="${t.value.slice(0, 25)}"`).join(' | '))
