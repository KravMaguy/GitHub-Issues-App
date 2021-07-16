import {Card} from "react-bootstrap"

export interface CardComponentProps {
    
}
 
const CardComponent: React.SFC<CardComponentProps> = ({children}) => {
    return (
        <Card className="mb-3" style={{"margin":"10px"}}>
            {children}
        </Card>
      );
}
 
export default CardComponent;