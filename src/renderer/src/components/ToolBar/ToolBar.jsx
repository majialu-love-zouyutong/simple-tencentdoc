import PropTypes from 'prop-types'
import './ToolBar.scss'
const toolbarList = [
  {
    name: '文本',
    icon: 'icon-huabigongju-wenben'
  },
  {
    name: '矩形',
    icon: 'icon-huabigongju-juxing',
    type: 'rect'
  },
  {
    name: '圆',
    icon: 'icon-huabigongju-tuoyuan'
  },
  {
    name: '涂鸦',
    icon: 'icon-huabigongju-tuya',
    type: 'pencil'
  },
  {
    name: '擦除',
    icon: 'icon-huabigongju-cachu',
    type: 'eraser'
  },
  {
    name: '图片',
    icon: 'icon-charutupian'
  }
]
// prop类型
ToolBar.propTypes = {
  activeTool: PropTypes.string,
  setActiveTool: PropTypes.func,
  setImageUrl: PropTypes.func
}
export default function ToolBar({ activeTool, setActiveTool, setImageUrl }) {
  const title = '简易版腾讯文档PPT'
  // 修改ToolBar.jsx中的图片选择处理
  const handleSelectImage = async () => {
    const result = await window.api.openImageDialog()
    if (result) {
      setImageUrl(result)
    }
  }
  return (
    <div className="toolbar">
      <div className="title">{title}</div>
      <div className="tools">
        {toolbarList.map((item) => {
          return (
            <i
              key={item.name}
              data-tooltip={item.name}
              className={`iconfont ${item.icon} ${activeTool === item.name && 'active'}`}
              onClick={() => {
                if (item.name === '图片') {
                  handleSelectImage()
                  return
                }
                if (item.name === activeTool) {
                  setActiveTool('')
                } else {
                  setActiveTool(item.name)
                }
              }}
            ></i>
          )
        })}
      </div>
    </div>
  )
}
