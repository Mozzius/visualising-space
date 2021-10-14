import { useFrame, useLoader } from "@react-three/fiber";
import { forwardRef, ReactNode, useRef } from "react";
import { DoubleSide, TextureLoader } from "three";
import mergeRefs from "react-merge-refs";

import textureMap from "../../../images/8081_earthmap10k.jpg";
import displacementMap from "../../../images/8081_earthbump10k.jpg";
import specularMap from "../../../images/8081_earthspec10k.jpg";
import cloudMap from "../../../images/earthcloudmap.jpg";
import cloudAlphaMap from "../../../images/earthcloudmaptransinverted.jpg";
import { useSnapshot } from "valtio";
import { config } from "../../../state/proxies";

const radius = 6.371;

// eslint-disable-next-line react/display-name
const Earth = forwardRef<THREE.Mesh, { children: ReactNode }>(
  ({ children }, ref) => {
    const [texture, displacement, specular, clouds, alpha] = useLoader(
      TextureLoader,
      [
        textureMap.src,
        displacementMap.src,
        specularMap.src,
        cloudMap.src,
        cloudAlphaMap.src,
      ],
    );
    const earthRef = useRef<THREE.Group>(null);
    const cloudRef = useRef<THREE.Mesh>(null);
    const snap = useSnapshot(config);

    useFrame((_, delta) => {
      if (earthRef.current) {
        earthRef.current.rotation.y += (delta * snap.speed) / (60 * 60 * 24);
      }
    });

    // useEffect(() => {
    //   if (cloudRef.current) {
    //     cloudRef.current.rotation.y = Math.random() * Math.PI * 2;
    //   }
    // }, []);

    return (
      <group>
        <group ref={earthRef}>
          <mesh castShadow>
            <sphereBufferGeometry args={[radius, 512, 512]} />
            <meshPhongMaterial
              map={texture}
              displacementMap={displacement}
              displacementScale={radius * 0.015}
              specularMap={specular}
            />
          </mesh>
          <mesh ref={mergeRefs([ref, cloudRef])} receiveShadow>
            <sphereBufferGeometry args={[radius * 1.01, 64, 64]} />
            <meshLambertMaterial
              map={clouds}
              transparent
              alphaMap={alpha}
              side={DoubleSide}
            />
          </mesh>
        </group>
        {children}
      </group>
    );
  },
);

export default Earth;
