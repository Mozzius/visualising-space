import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSnapshot } from "valtio";

import { config } from "../../state/proxies";

// Keplarian orbit

//           a (1 - e^2)
// r(th) = ---------------
//          1 + e cos(th)

interface OrbitProps {
  period: number; // days
  semiMajorAxis: number; // km
  eccentricity: number;
  initialTrueAnomaly?: number; // radians
}

const Orbit: React.FC<OrbitProps> = ({
  period,
  semiMajorAxis,
  eccentricity,
  initialTrueAnomaly = 0,
  children,
}) => {
  const orbitRef = useRef<THREE.Group>(null);
  const objectRef = useRef<THREE.Group>(null);
  const snap = useSnapshot(config);

  useFrame((_, delta) => {
    if (orbitRef.current && objectRef.current) {
      const theta =
        orbitRef.current.rotation.y + (delta * snap.speed) / (60 * 60 * period);
      orbitRef.current.rotation.y = theta;

      objectRef.current.position.x =
        (semiMajorAxis * (1 - eccentricity ** 2)) /
        (1 + eccentricity * Math.cos(theta));
    }
  });

  return (
    <group ref={orbitRef} rotation-y={initialTrueAnomaly}>
      <group ref={objectRef}>{children}</group>
    </group>
  );
};

export default Orbit;
