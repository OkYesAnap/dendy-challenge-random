import { motion } from 'motion/react';
import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  startPos?: DOMRect;
  startElement?: ReactNode;
  children: React.ReactNode;
}

const ModalPortal = ({ children, isOpen, onClose, startPos, startElement }: ModalPortalProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const clearTmRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  const [anim, setAnim] = useState(0);
  useLayoutEffect(() => {
    setAnim(0);
    clearTmRef();
    timeoutRef.current = setTimeout(() => {
      setAnim(1);
    }, 0)
  }, [startPos]);


  useEffect(() => {
    if (anim === 1) {
      clearTmRef()
      timeoutRef.current = setTimeout(() => {
        setAnim(2);
      }, 300)
    }
  }, [anim]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (anim) clearTmRef();
    setAnim(0);
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 400);
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center" onMouseDown={handleClose}>
      <motion.div
        layout
        transition={{
          layout: { duration: anim ? 0.7 : 0.3 }
        }}
        style={{
          position: anim ? "unset" : "absolute",
          top: startPos?.top,
          left: startPos?.left,
        }}
        className="text-2xl overflow-y-auto bg-black max-w-[75%]  max-h-[90%]" onMouseDown={(e) => e.stopPropagation()}>
        {anim === 2 ? children : startElement}
      </motion.div>
    </div>,
    document.body
  );
};

export default ModalPortal;