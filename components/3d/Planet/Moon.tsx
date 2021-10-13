import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader } from "three";

import textureMap from "../../../images/moon-4k.jpg";
import displacementMap from "../../../images/moonbump4k.jpg";

interface MoonProps {}

const Moon: React.FC<MoonProps> = ({}) => {
  const [texture, displacement] = useLoader(TextureLoader, [
    textureMap.src,
    displacementMap.src,
  ]);
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += delta / 10;
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereBufferGeometry args={[1, 512, 512]} />
      <meshStandardMaterial
        map={texture}
        displacementMap={displacement}
        displacementScale={0.02}
      />
    </mesh>
  );
};

export default Moon;
