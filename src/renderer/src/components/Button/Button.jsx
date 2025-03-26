import './Button.scss'
import PropTypes from 'prop-types'

Button.propTypes = {
  content: PropTypes.string,
  onClick: PropTypes.func
}
export default function Button({ content, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      {content}
    </button>
  )
}
