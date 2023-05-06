import {Html, useProgress} from '@react-three/drei'


const Loader = () => {
  const {progress} = useProgress()

  return (
    <Html>
      <span className='load'>
      <p style={{
        fonstSize: 14,
        color: "#f1f1f1",
        fontWeight: 800,
        marginTop: 40,
      }}>{progress.toFixed(2)}%</p>
      </span>
    </Html>
  )
}

export default Loader