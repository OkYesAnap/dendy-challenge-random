import React from 'react';
import ReactDOM from 'react-dom';

interface ModalPortalProps{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalPortal = ({ children, isOpen, onClose }: ModalPortalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center overflow-x-auto" onMouseDown={onClose}>
      <div className="border rounded p-4 rounded bg-black mt-200 mb-50" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalPortal;