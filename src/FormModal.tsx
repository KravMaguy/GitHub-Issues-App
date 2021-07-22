export interface FormModalProps {
  closeModal: (event: any) => void;
}

const FormModal: React.FunctionComponent<FormModalProps> = ({
  closeModal,
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
