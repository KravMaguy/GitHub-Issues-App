import { Card, Button } from "react-bootstrap";

export interface CardComponentProps {
  openModal: () => void;
}

const CardComponent: React.FunctionComponent<CardComponentProps> = ({
  children,
  openModal,
}) => {
  return (
    <Card className="mb-3" style={{ margin: "10px" }}>
      {children}
      <Card.Footer>
        <Button
          onClick={openModal}
          style={{ color: "black", backgroundColor: "mintcream" }}
        >
          Add Issue
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default CardComponent;
