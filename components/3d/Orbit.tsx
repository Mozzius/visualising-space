import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSnapshot } from "valtio";

import { config } from "../../state/proxies";
import { BufferAttribute } from "three";
import { useControls } from "leva";

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
  const snap = useSnapshot(config);
  const lineRef = useRef<THREE.BufferGeometry>(null!);
  const { showOrbit } = useControls({ showOrbit: false });

  const { semiMajorAxis, eccentricity, semiMinorAxis, linearEccentricity } =
    useMemo(() => {
      const adjustedApoapsis = apoapsis + surface;
      const adjustedPeriapsis = periapsis + surface;
      const semiMajorAxis = (adjustedApoapsis + adjustedPeriapsis) / 2;
      const linearEccentricity = semiMajorAxis - adjustedPeriapsis;
      const eccentricity = linearEccentricity / semiMajorAxis;
      const semiMinorAxis = Math.sqrt(
        semiMajorAxis ** 2 - linearEccentricity ** 2,
      );
      return { semiMajorAxis, eccentricity, semiMinorAxis, linearEccentricity };
    }, [apoapsis, periapsis, surface]);

  console.group();
  console.log("Semi Major Axis", semiMajorAxis);
  console.log("Eccentricity", eccentricity);
  console.log("Semi Minor Axis", semiMinorAxis);
  console.groupEnd();

  const pointOnOrbit = useCallback(
    (t: number) => {
      const meanAnomaly = 2 * Math.PI * t;
      const eccentricAnomaly = solve(x => kepler(x, meanAnomaly, eccentricity));

      return {
        z: Math.cos(eccentricAnomaly) * semiMajorAxis - linearEccentricity,
        x: Math.sin(eccentricAnomaly) * semiMinorAxis,
      };
    },
    [eccentricity, linearEccentricity, semiMajorAxis, semiMinorAxis],
  );

  useFrame(({ clock }) => {
    const periodInSeconds = (period * 24 * 60 * 60) / snap.speed;
    const t =
      ((clock.getElapsedTime() % periodInSeconds) / periodInSeconds +
        initialPeriod) %
      1;

    const { x, z } = pointOnOrbit(t);

    orbitRef.current.position.z = z;
    orbitRef.current.position.x = x;
  });

  useEffect(() => {
    if (showOrbit) {
      const NUM_POINTS = 100;
      const first = pointOnOrbit(0);
      const points = [first.x, 0, first.z];
      for (let i = 1; i < NUM_POINTS; i++) {
        const t = i / NUM_POINTS;
        const { x, z } = pointOnOrbit(t);
        points.push(x, 0, z);
        points.push(x, 0, z);
      }
      points.push(first.x, 0, first.z);
      const vertices = new Float32Array(points);
      lineRef.current.setAttribute(
        "position",
        new BufferAttribute(vertices, 3),
      );
    } else {
      lineRef.current.setAttribute(
        "position",
        new BufferAttribute(new Float32Array([]), 3),
      );
    }
  }, [pointOnOrbit, showOrbit]);

  return (
    <group>
      <lineSegments>
        <bufferGeometry ref={lineRef} />
        <lineBasicMaterial color="white" linewidth={0.5} />
      </lineSegments>
      <group ref={orbitRef}>{children}</group>
    </group>
  );
};

export default Orbit;
