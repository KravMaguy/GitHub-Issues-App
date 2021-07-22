export interface FormModalProps {
  closeModal: (event: any) => void;
  // isModalOpen: boolean;
}

const FormModal: React.SFC<FormModalProps> = ({
  closeModal,
  // isModalOpen,
  children,
}) => {
  return (
    <div
      id="modal-overlay"
      onClick={closeModal}
      className="my-modal-overlay show-my-modal"
    >
      <div className="modal-container">{children}</div>
    </div>
  );
};

export default FormModal;
