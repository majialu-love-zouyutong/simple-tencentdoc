import Canvas from './components/Canvas/Canvas'
import SideBar from './components/SideBar/SideBar'
import ToolBar from './components/ToolBar/ToolBar'
import './assets/App.scss'
import { useState } from 'react'
export default function App() {
  // 工具栏选择状态
  const [activeTool, setActiveTool] = useState('rect')
  // 加载图片
  const [imageUrl, setImageUrl] = useState('')

  return (
    <div className="app">
      <div className="toolbar-container">
        <ToolBar activeTool={activeTool} setActiveTool={setActiveTool} setImageUrl={setImageUrl} />
      </div>
      <div className="main-container">
        <div className="sidebar-container">
          <SideBar />
        </div>
        <div className="canvas-container">
          <Canvas imageUrl={imageUrl} activeTool={activeTool} />
        </div>
      </div>
    </div>
  )
}
