import { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

interface FilterFormProps {
  onParamChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue: string;
  error: string;
}

const FilterForm: React.SFC<FilterFormProps> = ({
  onParamChange,
  searchValue,
  error,
}: FilterFormProps) => {
  const refContainer = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    refContainer?.current?.focus();
  });

  return (
    <Form className="mb-3" style={{ margin: "10px", width: "75%" }}>
      <Form.Label>Search Issues</Form.Label>
      <Form.Control
        disabled={error ? true : false}
        onChange={onParamChange}
        value={searchValue}
        ref={refContainer}
        name="issuesearch"
        type="text"
      />
    </Form>
  );
};

export default FilterForm;
