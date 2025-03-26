import { useEffect, useState, useRef } from 'react'
import { Image, Layer, Stage, Transformer } from 'react-konva'
import './Canvas.scss'
import PropTypes from 'prop-types'

Canvas.propTypes = {
  imageUrl: PropTypes.string
}

export default function Canvas({ imageUrl }) {
  const [images, setImages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const transformerRef = useRef()
  const stageRef = useRef()

  // 监听 Delete 键
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Delete' && selectedId) {
        setImages((prev) => prev.filter((img) => img.id !== selectedId))
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
          if (e.target === e.target.getStage() && !e.target.isDragging()) {
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
      </Stage>
    </div>
  )
}
