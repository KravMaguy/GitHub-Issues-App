import {Pagination} from "react-bootstrap"
export interface PaginationProps {
  page:number;
  calcPage: (amount:number) => void;
  setPage: (a: number) => void; 
}
 
const PaginationComponent: React.SFC<PaginationProps> = ({page, calcPage, setPage}: PaginationProps) => {
  const isNextPage=true;
    return ( <Pagination style={{"margin":"10px"}}>
    {page !== 1 && <Pagination.Prev onClick={() => calcPage(-1)} />}
    {page !== 1 && <Pagination.Item onClick={() => setPage(1)}>1</Pagination.Item>}
    {page > 2 && <Pagination.Ellipsis />}
    {page > 2 && <Pagination.Item onClick={() => calcPage(-1)}>{page - 1}</Pagination.Item>}
    <Pagination.Item active>{page}</Pagination.Item>
    {isNextPage && <Pagination.Item onClick={() => calcPage(1)}>{page + 1}</Pagination.Item>}
    {isNextPage && <Pagination.Next onClick={() => calcPage(1)} />}
  </Pagination> );
}
 
export default PaginationComponent;