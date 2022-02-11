import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSnapshot } from "valtio";

import { config } from "../../state/proxies";

// Keplarian orbit
//
// Distance between a central body and an orbiting body
// https://en.wikipedia.org/wiki/Kepler_orbit
//
//           a (1 - e^2)
// r(th) = ---------------
//          1 + e cos(th)
//
// where:
//
// r = distance
// a = semi-major axis
// e = eccentricity
// th = true anomaly
//
// Position as a function of time
// https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion#Position_as_a_function_of_time
//
// M = E - e * sin(E)
//
// M = mean anomaly
// E = eccentric anomaly
// e = eccentricity
//
// we can rearrange to
//
// M - E + e * sin(E) = 0

const kepler = (
  meanAnomaly: number,
  eccentricAnomaly: number,
  eccentricity: number,
) => {
  // we're trying to solve for E, so return 0 when we find it
  return (
    meanAnomaly - eccentricAnomaly + eccentricity * Math.sin(eccentricAnomaly)
  );
};

// using Newton-Raphson to solve for E
const solve = (
  func: (...args: any[]) => number,
  initial: number = 0,
  maxIteration: number = 100,
) => {
  const h = 0.0001;
  const acceptableError = 0.000000001;
  let guess = initial;

  for (let i = 0; i < maxIteration; i++) {
    const y = func(guess);
    if (Math.abs(y) < acceptableError) {
      return guess;
    }
    const slope = (func(guess + h) - y) / h;
    const step = y / slope;

    guess -= step;
  }
  return guess;
};

interface OrbitProps {
  period: number; // days
  periapsis: number; // km
  apoapsis: number; // km
  initialPeriod?: number; // between 0 and 1
  surface?: number; // km
}

const Orbit: React.FC<OrbitProps> = ({
  period,
  periapsis,
  apoapsis,
  initialPeriod = 0,
  surface = 0,
  children,
}) => {
  const orbitRef = useRef<THREE.Group>(null!);
  const objectRef = useRef<THREE.Group>(null!);
  const snap = useSnapshot(config);

  const { semiMajorAxis, eccentricity } = useMemo(() => {
    const adjustedApoapsis = (apoapsis + surface) / 1000;
    const adjustedPeriapsis = (periapsis + surface) / 1000;
    const semiMajorAxis = (adjustedApoapsis + adjustedPeriapsis) / 2;
    const linearEccentricity = semiMajorAxis - adjustedPeriapsis;
    const eccentricity = linearEccentricity / semiMajorAxis;
    const semiMinorAxis = Math.sqrt(
      semiMajorAxis ** 2 - linearEccentricity ** 2,
    );
    return { semiMajorAxis, eccentricity, semiMinorAxis };
  }, [apoapsis, periapsis, surface]);

  useFrame(({ clock }) => {
    const periodInSeconds = (period * 24 * 60 * 60) / snap.speed;
    const t =
      (clock.getElapsedTime() % periodInSeconds) / periodInSeconds +
      (initialPeriod % 1);
    const meanAnomaly = 2 * Math.PI * t;
    const eccentricAnomaly = solve(x => kepler(x, meanAnomaly, eccentricity));
    const trueAnomaly =
      2 *
      Math.atan(
        Math.sqrt((1 + eccentricity) / (1 - eccentricity)) *
          Math.tan(eccentricAnomaly / 2),
      );
    orbitRef.current.rotation.y = trueAnomaly;

    objectRef.current.position.x =
      semiMajorAxis *
      ((1 - eccentricity ** 2) / (1 + eccentricity * Math.cos(trueAnomaly)));
  });

  return (
    <group ref={orbitRef}>
      <group ref={objectRef}>{children}</group>
    </group>
  );
};

export default Orbit;
