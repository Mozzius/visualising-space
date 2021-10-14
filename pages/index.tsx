import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import type { NextPage } from "next";
import Head from "next/head";
import { Suspense, useEffect, useRef } from "react";
import { createUseStyles } from "react-jss";

import Orbit from "../components/3d/Orbit";
import { config } from "../state/proxies";
import Moon from "../components/3d/Planets/Moon";
import Earth from "../components/3d/Planets/Earth";

// sizing: 1 unit = 1000 km

const satellites = [
  {
    name: "ISS",
    apogee: 4.18,
    perigee: 4.22,
    period: 1.55,
  },
  {
    name: "Hubble",
    apogee: 5.41,
    perigee: 5.37,
    period: 1.617,
  },
  {
    name: "Skylab",
    apogee: 2.75,
    perigee: 2.7,
    period: 1.56,
  },
  // {
  //   name: "Sputnik",
  //   apogee: 9.39,
  //   perigee: 2.15,
  //   period: 1.6,
  // },
];

const Scene: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  return (
    <>
      {/* <Stars /> */}
      <OrbitControls minDistance={7} />
      {/* <ambientLight color={0x333333} /> */}
      <directionalLight color={0xffffff} intensity={1} position={[0, 0, 1]} />
      <Suspense fallback={null}>
        <Earth ref={earthRef}>
          <Orbit apogee={406.7} perigee={356.5} period={27.322}>
            <Moon />
          </Orbit>
          {satellites.map(satellite => (
            <Orbit
              apogee={satellite.apogee + 6.371}
              perigee={satellite.perigee + 6.371}
              period={satellite.period}
              key={satellite.name}
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

const Home: NextPage = () => {
  const classes = useStyles();

  const { speed } = useControls({
    speed: {
      value: 1,
      min: 1,
      max: 10000,
    },
  });

  useEffect(() => {
    config.speed = speed;
  }, [speed]);

  return (
    <div className={classes.container}>
      <Head>
        <title>Visualising Space</title>
        <meta name="description" content="Learn about space" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Canvas
        shadows
        gl={{ logarithmicDepthBuffer: true }}
        onCreated={({ camera }) => {
          camera.position.set(15, 1, 4);
          camera.lookAt(0, 0, 0);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    height: "100vh",
    width: "100%",
    backgroundColor: "black",
  },
});

export default Home;
