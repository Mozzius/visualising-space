import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useSnapshot } from "valtio";

import { config } from "../../state/proxies";

interface OrbitProps {
  period: number; // in days
  apogee: number;
  perigee: number;
}

const Orbit: React.FC<OrbitProps> = ({ apogee, perigee, period, children }) => {
  const orbitRef = useRef<THREE.Group>(null);
  const objectRef = useRef<THREE.Group>(null);
  const snap = useSnapshot(config);

  useFrame((_, delta) => {
    if (orbitRef.current && objectRef.current) {
      orbitRef.current.rotation.y += (delta * snap.speed) / (60 * 60 * period);

      const theta = orbitRef.current.rotation.y % (Math.PI * 2);

      objectRef.current.position.x =
        (apogee * perigee) /
        Math.sqrt(
          Math.pow(perigee, 2) * Math.pow(Math.sin(theta), 2) +
            Math.pow(apogee, 2) * Math.pow(Math.cos(theta), 2),
        );
    }
  });

  return (
    <group ref={orbitRef}>
      <group ref={objectRef}>{children}</group>
    </group>
  );
};

export default Orbit;
