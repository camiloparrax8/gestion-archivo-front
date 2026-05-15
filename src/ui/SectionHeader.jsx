export function SectionHeader({ eyebrow, title, description, rightSlot }) {
    return (<div className="page-head">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p className="muted">{description}</p> : null}
      </div>
      {rightSlot}
    </div>);
}
