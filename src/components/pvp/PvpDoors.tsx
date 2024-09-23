import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const DoorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  pointer-events: none;
`;

const Door = styled(motion.div)<{ $isBottom?: boolean }>`
  width: 100%;
  height: 50vh;
  background-size: cover;
  background-position: center;
  position: absolute;
  ${(props) => (props.$isBottom ? "bottom: 0;" : "top: 0;")}
`;

interface PvpDoorsProps {
  showDoors: boolean;
  doorImages: {
    top: string | null;
    bottom: string | null;
  };
}

export const PvpDoors: React.FC<PvpDoorsProps> = ({ showDoors, doorImages }) => {
  return (
    <AnimatePresence>
      {showDoors && doorImages.top && doorImages.bottom && (
        <DoorContainer>
          <Door
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5 }}
            style={{ backgroundImage: `url(${doorImages.top})` }}
          />
          <Door
            $isBottom
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5 }}
            style={{ backgroundImage: `url(${doorImages.bottom})` }}
          />
        </DoorContainer>
      )}
    </AnimatePresence>
  );
};