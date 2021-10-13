interface EarthProps {}

const Earth: React.FC<EarthProps> = () => {
  return (
    <mesh>
      <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
      <meshStandardMaterial attach="material" color="#ffffff" />
    </mesh>
  );
};

export default Earth;
