type ChecklistProps = {
  title: string
  variant?: 'ml' | 'cloud' | 'both'
  items: string[]
}

export function Checklist({ title, variant = 'both', items }: ChecklistProps) {
  const whoClass =
    variant === 'ml' ? 'cp-who ml' : variant === 'cloud' ? 'cp-who cloud' : 'cp-who both'
  return (
    <div className="cp-box R">
      <div className={whoClass}>{title}</div>
      <ul className="cp-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
