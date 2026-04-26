import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

const BackgroundAnimation = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine); // 🔥 MUST
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        background: {
          color: "#0f0f0f",
        },
        particles: {
          number: {
            value: 50,
          },
          color: {
            value: "#ffffff",
          },
          links: {
            enable: true,
            color: "#aaaaaa",
            distance: 120,
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
          },
          size: {
            value: 2,
          },
          opacity: {
            value: 0.5,
          },
        },
      }}
    />
  );
};

export default BackgroundAnimation;