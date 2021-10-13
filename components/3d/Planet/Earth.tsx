import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { DoubleSide, TextureLoader } from "three";

import textureMap from "../../../images/8081_earthmap10k.jpg";
import normalMap from "../../../images/8081_earthbump10k.jpg";
import specularMap from "../../../images/8081_earthspec10k.jpg";
import cloudMap from "../../../images/earthcloudmap.jpg";
import cloudAlphaMap from "../../../images/earthcloudmaptransinverted.jpg";

interface EarthProps {}

const Earth: React.FC<EarthProps> = ({}) => {
  const [texture, normal, specular, clouds, alpha] = useLoader(TextureLoader, [
    textureMap.src,
    normalMap.src,
    specularMap.src,
    cloudMap.src,
    cloudAlphaMap.src,
  ]);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (earthRef.current) {
      // rotates in real time lol
      // earthRef.current.rotation.y += delta / 86400;
      // rotates faster
      earthRef.current.rotation.y += delta / 10;
    }
  });

  // useEffect(() => {
  //   if (cloudRef.current) {
  //     cloudRef.current.rotation.y = Math.random() * Math.PI * 2;
  //   }
  // }, []);

  return (
    <group ref={earthRef}>
      <mesh>
        <sphereBufferGeometry args={[1, 512, 512]} />
        <meshPhongMaterial
          map={texture}
          displacementMap={normal}
          displacementScale={0.01}
          specularMap={specular}
        />
      </mesh>
      <mesh ref={cloudRef}>
        <sphereBufferGeometry args={[1.015, 64, 64]} />
        <meshLambertMaterial
          map={clouds}
          transparent
          alphaMap={alpha}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default Earth;
