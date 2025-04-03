import { motion } from 'motion/react';
import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  startPos?: DOMRect
  children: React.ReactNode;
}

const ModalPortal = ({ children, isOpen, onClose, startPos }: ModalPortalProps) => {
  const [startAnim, setStartAnim] = useState(false);
  useLayoutEffect(() => {
    setStartAnim(false);
    setTimeout(() => {
      setStartAnim(true);
    }, 0)
  }, [startPos]);
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center" onMouseDown={onClose}>
      <motion.div
        layout
        transition={{
          layout: { duration: startAnim ? 0.5 : 0 }
        }}
        style={{
          position: startAnim ? "unset" : "absolute",
          width: startAnim ? "" : "0",
          height: startAnim ? "" : "0",
          top: startPos?.top || 0,
          left: startPos?.left || 0,
        }}
        className="border rounded p-4 rounded bg-black max-w-[50%]  max-h-[90%] overflow-auto" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </motion.div>
    </div>,
    document.body
  );
};

export default ModalPortal;