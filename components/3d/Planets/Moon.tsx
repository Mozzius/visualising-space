import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { TextureLoader } from "three";
import { useSnapshot } from "valtio";

import textureMap from "../../../images/moon-4k.jpg";
import displacementMap from "../../../images/moonbump4k.jpg";
import { config } from "../../../state/proxies";

const radius = 1.737;

interface MoonProps {}

const Moon: React.FC<MoonProps> = ({}) => {
  const [texture, displacement] = useLoader(TextureLoader, [
    textureMap.src,
    displacementMap.src,
  ]);
  const moonRef = useRef<THREE.Mesh>(null);
  const snap = useSnapshot(config);

  useFrame((_, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y +=
        (delta * snap.speed) / (60 * 60 * 24 * 27.32);
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereBufferGeometry args={[radius, 512, 512]} />
      <meshStandardMaterial
        map={texture}
        displacementMap={displacement}
        displacementScale={0.02 * radius}
        roughness={1}
      />
    </mesh>
  );
};

export default Moon;
