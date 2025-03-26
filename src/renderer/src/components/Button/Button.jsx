import './Button.scss'
export default function Button({ content, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      {content}
    </button>
  )
}
