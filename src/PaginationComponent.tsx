import { Pagination } from "react-bootstrap";
export interface PaginationProps {
  page: number;
  calcPage: (amount: number) => void;
  setPage: (a: number) => void;
  error: string;
}

const PaginationComponent: React.FunctionComponent<PaginationProps> = ({
  page,
  calcPage,
  setPage,
  error,
}: PaginationProps) => {
  const isNextPage = true;
  return (
    <Pagination style={{ margin: "10px" }}>
      {page !== 1 && (
        <Pagination.Prev
          disabled={error ? true : false}
          onClick={() => calcPage(-1)}
        />
      )}
      {page !== 1 && (
        <Pagination.Item
          disabled={error ? true : false}
          onClick={() => setPage(1)}
        >
          1
        </Pagination.Item>
      )}
      {page > 2 && <Pagination.Ellipsis disabled={error ? true : false} />}
      {page > 2 && (
        <Pagination.Item
          disabled={error ? true : false}
          onClick={() => calcPage(-1)}
        >
          {page - 1}
        </Pagination.Item>
      )}
      <Pagination.Item disabled={error ? true : false} active>
        {page}
      </Pagination.Item>
      {isNextPage && (
        <Pagination.Item
          disabled={error ? true : false}
          onClick={() => calcPage(1)}
        >
          {page + 1}
        </Pagination.Item>
      )}
      {isNextPage && (
        <Pagination.Next
          disabled={error ? true : false}
          onClick={() => calcPage(1)}
        />
      )}
    </Pagination>
  );
};

export default PaginationComponent;
