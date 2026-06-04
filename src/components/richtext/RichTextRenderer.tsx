import type { ReactNode } from 'react'

type LexicalNode = {
  type?: string
  text?: string
  tag?: string
  format?: number
  children?: LexicalNode[]
  url?: string
  listType?: string
}

export function RichTextRenderer({ data }: { data?: unknown }) {
  if (!data) return null

  if (typeof data === 'string') {
    return <p className="text-gray-600 dark:text-gray-400">{data}</p>
  }

  const root = data as { root?: { children?: LexicalNode[] } }
  const children = root.root?.children
  if (!children?.length) return null

  return (
    <div className="space-y-4 text-gray-600 dark:text-gray-400">
      {children.map((node, index) => (
        <LexicalElement key={index} node={node} />
      ))}
    </div>
  )
}

function LexicalElement({ node }: { node: LexicalNode }) {
  const children = node.children?.map((child, index) => (
    <LexicalElement key={index} node={child} />
  ))

  if (node.type === 'text') {
    let content: ReactNode = node.text || ''
    if ((node.format || 0) & 1) content = <strong>{content}</strong>
    if ((node.format || 0) & 2) content = <em>{content}</em>
    return <>{content}</>
  }

  if (node.type === 'heading') {
    const level = node.tag === 'h3' ? 'h3' : 'h2'
    const className = level === 'h3'
      ? 'text-xl font-semibold text-gray-900 dark:text-white'
      : 'text-2xl font-bold text-gray-900 dark:text-white'

    return level === 'h3'
      ? <h3 className={className}>{children}</h3>
      : <h2 className={className}>{children}</h2>
  }

  if (node.type === 'link' && node.url) {
    return (
      <a href={node.url} className="font-medium text-primary-600 hover:text-primary-700">
        {children}
      </a>
    )
  }

  if (node.type === 'list') {
    if (node.listType === 'number') {
      return <ol className="list-decimal space-y-2 pl-5">{children}</ol>
    }
    return <ul className="list-disc space-y-2 pl-5">{children}</ul>
  }

  if (node.type === 'listitem') {
    return <li>{children}</li>
  }

  if (node.type === 'linebreak') {
    return <br />
  }

  return <p>{children}</p>
}
