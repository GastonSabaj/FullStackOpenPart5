import { useState, useEffect } from 'react'

const Notification = ({ message, type }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (message) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 4000) // Desaparecerá lentamente al final de 4 segundos
      return () => clearTimeout(timer)
    }
  }, [message])

  if (message === null) {
    return null
  }

  return (
    <div className={`${type} ${visible ? 'fade-in' : 'fade-out'}`}>
      {message}
    </div>
  )
}

export default Notification
