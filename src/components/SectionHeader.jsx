import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeUp } from "../utils/motion";

const SectionHeader = ({ eyebrow, title }) => (
  <motion.div variants={fadeUp()}>
    <p className={styles.sectionSubText}>
      <span className="signal-dot" />
      {eyebrow}
    </p>
    <h2 className={`${styles.sectionHeadText} mt-3`}>{title}</h2>
  </motion.div>
);

export default SectionHeader;
