import './ToolBar.scss'
export default function ToolBar() {
  const title = '简易版腾讯文档PPT'
  return (
    <div className="toolbar">
      <div className="title">{title}</div>
      <div className="tools">工具</div>
    </div>
  )
}
