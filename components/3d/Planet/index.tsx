import { Suspense } from "react";

import Earth from "./Earth";
import Moon from "./Moon";

interface PlanetProps {
  type: "earth" | "moon";
}

const Planet: React.FC<PlanetProps> = ({ type, ...props }) => {
  switch (type) {
    case "earth":
      return (
        <Suspense fallback={null}>
          <Earth {...props} />
        </Suspense>
      );
    case "moon":
      return (
        <Suspense fallback={null}>
          <Moon {...props} />
        </Suspense>
      );
  }
};

export default Planet;
