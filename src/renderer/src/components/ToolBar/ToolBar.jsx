import './ToolBar.scss'
export default function ToolBar() {
  const title = '简易版腾讯文档PPT'
  return (
    <div className="toolbar">
      <div className="title">{title}</div>
      <div className="tools">
        <i data-tooltip="文本" className="iconfont icon-huabigongju-wenben"></i>
        <i data-tooltip="涂鸦" className="iconfont icon-huabigongju-tuya"></i>
        <i data-tooltip="矩形" className="iconfont icon-huabigongju-juxing"></i>
        <i data-tooltip="圆" className="iconfont icon-huabigongju-tuoyuan"></i>
        <i data-tooltip="擦除" className="iconfont icon-huabigongju-cachu"></i>
        <i data-tooltip="图片" className="iconfont icon-charutupian"></i>
      </div>
    </div>
  )
}
