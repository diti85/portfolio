import { MotionConfig } from "framer-motion";

import {
  About,
  Contact,
  Experience,
  Footer,
  Hero,
  Navbar,
  Tech,
  Works,
} from "./components";

const App = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative z-0 bg-bg">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Tech />
        <Works />
        <Contact />
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default App;
