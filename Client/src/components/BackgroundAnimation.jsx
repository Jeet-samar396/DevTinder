import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const BackgroundAnimation = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: "transparent",
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 60,
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
          opacity: {
            value: 0.5,
          },
          size: {
            value: 3,
          },
        },
        detectRetina: true,
      }}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default BackgroundAnimation;