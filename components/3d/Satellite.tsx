import { Sphere, Html } from "@react-three/drei";
import { useState } from "react";

interface SatelliteProps {
  satellite: {
    name: string;
    [key: string]: any;
  };
  occlude?: any[];
}

const Satellite: React.FC<SatelliteProps> = ({
  satellite,
  occlude = false,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <>
      <Sphere
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      />
      {hovered && (
        <Html occlude={occlude}>
          <h1 style={{ color: "white" }}>{satellite.name}</h1>
        </Html>
      )}
    </>
  );
};

export default Satellite;
