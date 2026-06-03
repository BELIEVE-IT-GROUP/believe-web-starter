export function ContactBlock(props: {
  headline?: string
  subheadline?: string
  formFields?: { label: string; name: string; type: string; required?: boolean }[]
  showMap?: boolean
  mapUrl?: string
}) {
  const { headline, subheadline, formFields, showMap, mapUrl } = props

  const defaultFields = [
    { label: 'Nombre', name: 'name', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Mensaje', name: 'message', type: 'textarea', required: true },
  ]

  const fields = formFields?.length ? formFields : defaultFields

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            {headline && (
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {headline}
              </h2>
            )}
            {subheadline && <p className="mb-8 text-lg text-gray-500">{subheadline}</p>}
            <form className="space-y-6">
              {fields.map((field, i) => (
                <div key={i}>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    {field.label}{field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      required={field.required}
                      rows={4}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600"
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white hover:bg-primary-700"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
          {showMap && mapUrl && (
            <div className="rounded-lg overflow-hidden">
              <iframe
                src={mapUrl}
                className="h-full min-h-[400px] w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
