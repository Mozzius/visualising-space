import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef } from "react";

import Orbit from "./Orbit";
import Moon from "./Planets/Moon";
import Earth from "./Planets/Earth";

const satellites = [
  {
    name: "Sputnik",
    period: 0.0668,
    semiMajorAxis: 6.955 + 6.371,
    eccentricity: 0.05201,
    periapsis: 2.15,
  },
];

const EarthMoon: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  return (
    <>
      <Stars />
      <OrbitControls minDistance={7} />
      <directionalLight color={0xffffff} intensity={1} position={[0, 0, 1]} />
      <Suspense fallback={null}>
        <Earth ref={earthRef}>
          <Orbit semiMajorAxis={384_399} eccentricity={0.0549} period={27.321}>
            <Moon />
          </Orbit>
          {satellites.map(satellite => (
            <Orbit
              key={satellite.name}
              semiMajorAxis={satellite.semiMajorAxis}
              eccentricity={satellite.eccentricity}
              period={satellite.period}
            >
              <Html occlude={[earthRef]} center>
                <h1 style={{ color: "white" }}>{satellite.name}</h1>
              </Html>
            </Orbit>
          ))}
        </Earth>
      </Suspense>
    </>
  );
};

export default EarthMoon;
