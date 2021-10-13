import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import Head from "next/head";
import { createUseStyles } from "react-jss";

import Planet from "../components/3d/Planet";

const Content: React.FC = () => {
  return (
    <>
      <Stars />
      <OrbitControls />
      <ambientLight color={0x333333} />
      <directionalLight color={0xffffff} intensity={1} position={[0, 0, 1]} />
      <Planet type="earth" />
    </>
  );
};

const Home: NextPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Head>
        <title>Visualising Space</title>
        <meta name="description" content="Learn about space" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Canvas shadows>
        <Content />
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
