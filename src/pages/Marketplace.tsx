import React from "react";
import { Navbar } from "../Components";
import styles from "../styles/style";

/**
 * Marketplace Component
 * Displays real-time bid monitoring with charts and bid history
 */
const Marketplace: React.FC = () => {
  return (
    <div className="w-full overflow-hidden bg-[#13141a]">
      {/* Navigation Section */}
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>

      {/* Main Content Section */}
      <div className={`${styles.boxWidth}`}>
        <div className="w-full py-16 px-4 bg-[#13141a]">
          <center>
            <p className="text-2xl font-bold text-white">Soon...</p>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
