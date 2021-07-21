import { Alert } from "react-bootstrap";
export interface AlertProps {
  variant: string;
  heading: string;
  content: string;
}

const AlertComponent: React.SFC<AlertProps> = ({
  variant,
  heading,
  content,
}) => {
  return (
    <Alert variant={variant}>
      <Alert.Heading>{heading}</Alert.Heading>
      <p>{content}</p>
    </Alert>
  );
};

export default AlertComponent;
