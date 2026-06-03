export function SplitContentBlock(props: any) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-screen-xl px-4">
        <p className="text-sm text-gray-400">{props.blockType} — TODO</p>
      </div>
    </section>
  )
}
