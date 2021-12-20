import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { createUseStyles } from "react-jss";
import EarthMoon from "../components/3d/EarthMoon";

import { config } from "../state/proxies";

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
        <EarthMoon />
      </Canvas>
      <Loader />
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
