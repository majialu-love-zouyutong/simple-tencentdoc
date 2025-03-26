import { useEffect, useState, useRef } from 'react'
import { Image, Layer, Stage, Text, Transformer } from 'react-konva'
import './Canvas.scss'
import PropTypes from 'prop-types'

Canvas.propTypes = {
  imageUrl: PropTypes.string,
  activeTool: PropTypes.string
}

export default function Canvas({ imageUrl, activeTool }) {
  // 跟踪编辑状态
  const editingTextRef = useRef({ textarea: null, textNode: null })
  // 图片状态
  const [images, setImages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  // 在组件状态中添加文本状态
  const [texts, setTexts] = useState([])
  const transformerRef = useRef()
  const stageRef = useRef()

  // 监听 Delete 键
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Delete' && selectedId) {
        setImages((prev) => prev.filter((img) => img.id !== selectedId))
        setTexts((prev) => prev.filter((text) => text.id !== selectedId))
        setSelectedId(null)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedId])

  // 加载新图片
  useEffect(() => {
    if (!imageUrl) return

    const img = new window.Image()
    img.src = imageUrl

    img.onload = () => {
      setImages((prev) => [
        ...prev,
        {
          id: `image-${Date.now()}`,
          image: img,
          x: 50,
          y: 50,
          width: img.width * 0.3,
          height: img.height * 0.3,
          scaleX: 1,
          scaleY: 1
        }
      ])
    }
  }, [imageUrl])

  // 在useEffect中添加文本创建逻辑（需要从父组件传递activeTool状态）
  useEffect(() => {
    if (activeTool === '文本') {
      const newText = {
        id: `text-${Date.now()}`,
        x: 100,
        y: 100,
        text: '新建文本',
        fontSize: 20,
        draggable: true
      }
      setTexts((prev) => [...prev, newText])
    }
  }, [activeTool]) // activeTool需要从父组件传入

  // 更新 Transformer 绑定
  useEffect(() => {
    if (!transformerRef.current) return

    if (selectedId) {
      const node = stageRef.current.findOne(`#${selectedId}`)
      if (node) {
        transformerRef.current.nodes([node])
      }
    } else {
      transformerRef.current.nodes([])
    }
  }, [selectedId])

  return (
    <div className="canvas" tabIndex="0">
      <Stage
        width={1000}
        height={600}
        ref={stageRef}
        onPointerDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage()
          if (clickedOnEmpty) {
            // 清除编辑状态
            if (editingTextRef.current.textarea) {
              editingTextRef.current.textarea.remove()
              editingTextRef.current.textNode.show()
              editingTextRef.current = { textarea: null, textNode: null }
            }
            setSelectedId(null)
          }
        }}
      >
        <Layer>
          {images.map((img) => (
            <Image
              key={img.id}
              id={img.id}
              name="image"
              image={img.image}
              x={img.x}
              y={img.y}
              width={img.width}
              height={img.height}
              scaleX={img.scaleX}
              scaleY={img.scaleY}
              draggable
              onClick={() => setSelectedId(img.id)}
              onDragEnd={(e) => {
                setImages((prev) =>
                  prev.map((item) =>
                    item.id === img.id ? { ...item, x: e.target.x(), y: e.target.y() } : item
                  )
                )
              }}
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
        <Layer>
          {texts.map((text) => (
            <Text
              key={text.id}
              id={text.id}
              x={text.x}
              y={text.y}
              text={text.text}
              fontSize={text.fontSize}
              draggable={text.draggable}
              onClick={(e) => {
                e.cancelBubble = true
                setSelectedId(text.id)
              }}
              onDragEnd={(e) => {
                e.cancelBubble = true
                setTexts((prev) =>
                  prev.map((t) =>
                    t.id === text.id ? { ...t, x: e.target.x(), y: e.target.y() } : t
                  )
                )
              }}
              onDblClick={(e) => {
                e.cancelBubble = true
                const textNode = e.target
                const stage = textNode.getStage()

                // 清理之前的编辑状态
                if (editingTextRef.current.textarea) {
                  editingTextRef.current.textarea.remove()
                  editingTextRef.current.textNode.show()
                  editingTextRef.current = { textarea: null, textNode: null }
                }

                textNode.hide()
                const textPosition = textNode.absolutePosition()

                // 创建文本输入框
                const textarea = document.createElement('textarea')
                textarea.value = text.text

                // 关键样式设置
                textarea.style.position = 'absolute'
                textarea.style.top = `${textPosition.y + stage.container().offsetTop}px`
                textarea.style.left = `${textPosition.x + stage.container().offsetLeft}px`
                textarea.style.width = `${textNode.width() * textNode.scaleX() + 4}px`
                textarea.style.minHeight = `${textNode.height() * textNode.scaleY()}px`
                textarea.style.zIndex = 9999

                // 同步文本样式
                textarea.style.fontSize = `${textNode.fontSize()}px`
                textarea.style.fontFamily = textNode.fontFamily() || 'Arial'
                textarea.style.color = textNode.fill()
                textarea.style.textAlign = textNode.align()
                textarea.style.lineHeight = `${textNode.lineHeight()}`
                textarea.style.letterSpacing = `${textNode.letterSpacing()}px`

                // 对齐调整
                const textWidth = textNode.width() * textNode.scaleX()
                if (textNode.align() === 'center') {
                  textarea.style.left = `${parseFloat(textarea.style.left) - textWidth / 2}px`
                } else if (textNode.align() === 'right') {
                  textarea.style.left = `${parseFloat(textarea.style.left) - textWidth}px`
                }

                // 输入框装饰样式
                textarea.style.background = 'rgba(255,255,255,0.2)'
                textarea.style.border = '1px solid rgba(64, 158, 255, 0.5)'
                textarea.style.borderRadius = '3px'
                textarea.style.padding = '2px 4px'
                textarea.style.outline = 'none'
                textarea.style.resize = 'none'

                stage.container().appendChild(textarea)

                // 自动高度调整
                const adjustHeight = () => {
                  textarea.style.height = 'auto'
                  textarea.style.height = `${textarea.scrollHeight}px`
                }
                textarea.addEventListener('input', adjustHeight)
                adjustHeight() // 初始化高度

                // 事件处理
                const handleKeyDown = (e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    setTexts((prev) =>
                      prev.map((t) => (t.id === text.id ? { ...t, text: textarea.value } : t))
                    )
                    cleanup()
                  }
                  if (e.key === 'Escape') {
                    cleanup()
                  }
                }

                const handleBlur = () => {
                  setTexts((prev) =>
                    prev.map((t) => (t.id === text.id ? { ...t, text: textarea.value } : t))
                  )
                  cleanup()
                }

                const cleanup = () => {
                  textNode.show()
                  textarea.remove()
                  document.removeEventListener('keydown', handleKeyDown)
                  textarea.removeEventListener('input', adjustHeight)
                  editingTextRef.current = { textarea: null, textNode: null }
                }

                textarea.addEventListener('keydown', handleKeyDown)
                textarea.addEventListener('blur', handleBlur)

                // 聚焦并选中文本
                setTimeout(() => {
                  textarea.focus()
                  textarea.setSelectionRange(0, textarea.value.length)
                }, 10)

                // 保存引用
                editingTextRef.current = { textarea, textNode }
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
