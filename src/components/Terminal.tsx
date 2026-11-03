type TerminalProps = {
  title: string
  code: string
}

export function Terminal({ title, code }: TerminalProps) {
  const copy = () => {
    void navigator.clipboard.writeText(code)
  }

  return (
    <div className="terminal R">
      <div className="term-bar">
        <div className="td r" />
        <div className="td y" />
        <div className="td g" />
        <span className="term-title">{title}</span>
      </div>
      <div className="term-body">
        <button type="button" className="copy-btn" onClick={copy}>
          COPY
        </button>
        <pre>{code}</pre>
      </div>
    </div>
  )
}
