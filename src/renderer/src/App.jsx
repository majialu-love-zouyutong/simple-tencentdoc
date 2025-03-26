import Canvas from './components/Canvas/Canvas'
import SideBar from './components/SideBar/SideBar'
import ToolBar from './components/ToolBar/ToolBar'
import './assets/App.scss'
export default function App() {
  return (
    <div className="app">
      <div className="toolbar-container">
        <ToolBar />
      </div>
      <div className="main-container">
        <div className="sidebar-container">
          <SideBar />
        </div>
        <div className="canvas-container">
          <Canvas />
        </div>
      </div>
    </div>
  )
}
