import { Form, InputGroup, Button, FormControl } from "react-bootstrap";
import { GitUser } from "./App";

export interface MultiStepFormProps {
  gitUsers: GitUser[];
  //   handleChange: (
  //     event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  //   ) => void;
  handleChange: (event: any) => void;
  userSelect: string;
  handleGitSearch: (event: any) => void;
  selectedUser: GitUser | undefined;
  isFinalPage: boolean;
  goBack: (step: number) => void;
  repoSelect: string;
  repos: {
    name: string;
    id: number;
    url: string;
  }[];
  issueTitle: string;
  handleSubmit: (e: any) => void;
  finalPage: () => void;
}

const MultiStepForm: React.SFC<MultiStepFormProps> = ({
  gitUsers,
  handleChange,
  userSelect,
  handleGitSearch,
  selectedUser,
  isFinalPage,
  goBack,
  repoSelect,
  repos,
  issueTitle,
  handleSubmit,
  finalPage,
}) => {
  return (
    <Form
      className="mb-3"
      // onSubmit={handleSubmit}
    >
      {gitUsers.length < 1 ? (
        <InputGroup className="mb-3 select-input">
          <FormControl
            name="userSelect"
            placeholder="Search gitHub users"
            onChange={handleChange}
            value={userSelect}
          />
          <Button
            onClick={handleGitSearch}
            style={{ borderRadius: "0px 4px 4px 0px" }}
          >
            Search
          </Button>
        </InputGroup>
      ) : selectedUser && isFinalPage ? (
        <InputGroup className="mb-3 select-input">
          <Button
            onClick={() => goBack(2)}
            style={{ borderRadius: "4px 0px 0px 4px" }}
          >
            back
          </Button>
          <Form.Control
            onChange={handleChange}
            as="select"
            name="repoSelect"
            value={repoSelect}
          >
            {repos.map((repo) => (
              <option key={repo.id} value={repo.name}>
                {repo.name}
              </option>
            ))}
          </Form.Control>
          <FormControl
            placeholder="Issue Title"
            name="issueTitle"
            value={issueTitle}
            onChange={handleChange}
          />
          <Button
            onClick={handleSubmit}
            style={{ borderRadius: "0px 4px 4px 0px" }}
          >
            Submit
          </Button>
        </InputGroup>
      ) : (
        <InputGroup className="mb-3 select-input">
          <Button
            onClick={() => goBack(1)}
            style={{ borderRadius: "4px 0px 0px 4px" }}
          >
            back
          </Button>
          <Form.Control
            as="select"
            onChange={handleChange}
            name="userSelect"
            value={userSelect}
          >
            {gitUsers.map((option) => (
              <option key={option.id} value={option.login}>
                {option.login}
              </option>
            ))}
          </Form.Control>
          <Button
            onClick={finalPage}
            style={{ borderRadius: "0px 4px 4px 0px" }}
          >
            Next
          </Button>
        </InputGroup>
      )}
    </Form>
  );
};

export default MultiStepForm;
