/**
 * Rellena el template de una sección 'raw' con sus valores: {{tN}} -> texts[N].value,
 * {{iN}} -> images[N].src. Función pura (server + client safe). La comparten el render
 * del editor (EditableSection) y el render público server-side (RawPublic) para que el
 * preview del editor y la página pública sean BYTE-idénticos.
 */
type Txt = { value?: string }
type Img = { src?: string }
export function fillTemplate(p: { template?: string; texts?: Txt[]; images?: Img[] }): string {
  let html = p.template || ''
  ;(p.texts || []).forEach((t, i) => {
    html = html.split(`{{t${i}}}`).join(t?.value ?? '')
  })
  ;(p.images || []).forEach((m, i) => {
    html = html.split(`{{i${i}}}`).join(m?.src ?? '')
  })
  return html
}
