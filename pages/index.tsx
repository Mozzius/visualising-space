import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import Head from "next/head";
import { createUseStyles } from "react-jss";

const Home: NextPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Head>
        <title>Visualising Space</title>
        <meta name="description" content="Learn about space" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Canvas>
        <Stars />
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
  },
});

export default Home;
