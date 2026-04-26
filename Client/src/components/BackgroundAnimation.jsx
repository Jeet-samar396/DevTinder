import Particles from "react-tsparticles";

const BackgroundAnimation = () => {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        background: {
          color: "#0f0f0f", // 🔥 important (transparent मत रखो अभी)
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