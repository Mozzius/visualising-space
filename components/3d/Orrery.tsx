import { Html, OrbitControls, Sphere, Stars } from "@react-three/drei";
import { Suspense, useRef } from "react";

import Orbit from "./Orbit";
import Moon from "./Planets/Moon";
import Earth from "./Planets/Earth";
import { useControls } from "leva";

const satelliteData = [
  {
    name: "Sputnik",
    period: 0.0668,
    semiMajorAxis: 6.955 + 6.371 + 100,
    // eccentricity: 0.05201,
    eccentricity: 0.9,
    periapsis: 2.15,
  },
];

const Orrery: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);

  const { satellites } = useControls({ satellites: false });

  return (
    <>
      <Stars radius={450} />
      <OrbitControls minDistance={7} />
      <directionalLight color={0xffffff} intensity={1} position={[0, 0, 1]} />
      <Suspense fallback={null}>
        <Earth ref={earthRef}>
          <Moon />
          {satellites &&
            satelliteData.map(satellite => (
              <Orbit
                key={satellite.name}
                semiMajorAxis={satellite.semiMajorAxis}
                eccentricity={satellite.eccentricity}
                period={satellite.period}
              >
                <Sphere />
                {/* <Html occlude={[earthRef]} center>
                  <h1 style={{ color: "white" }}>{satellite.name}</h1>
                </Html> */}
              </Orbit>
            ))}
        </Earth>
      </Suspense>
    </>
  );
};

export default Orrery;
