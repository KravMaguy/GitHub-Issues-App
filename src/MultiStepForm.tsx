import { useState } from "react";
import { Form, InputGroup, Button, FormControl } from "react-bootstrap";
import { fetchGitUsers } from "./api";
import Step from "./Step";
import { Issue } from "./Types";

export interface GitUser {
  id: string;
  login: string;
  avatar_url: string;
  html_url: string;
}

const repos = [
  { name: "TypeScript", id: 1, url: "https://github.com/microsoft/TypeScript" },
  { name: "graphql-js", id: 2, url: "https://github.com/graphql/graphql-js" },
  { name: "react", id: 3, url: "https://github.com/facebook/react" },
];

export interface MultiStepFormProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGitIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  issues: Issue[];
}
const MultiStepForm: React.FunctionComponent<MultiStepFormProps> = ({
  setIsModalOpen,
  issues,
  setGitIssues,
}) => {
  const [step, setStep] = useState(1);
  const [gitUsers, setGitUsers] = useState<Array<GitUser>>([]);
  const [selectedUser, setSelectedUser] = useState<GitUser>();
  const [isFinalPage, SetIsFinalPage] = useState<boolean>(false);

  const [input, setInput] = useState({
    repoSelect: repos[0].name,
    userSelect: "",
    issueTitle: "",
  });
  const { userSelect, repoSelect, issueTitle } = input;

  const handleGitSearch = (event: any) => {
    event.preventDefault();

    if (!userSelect) {
      return window.alert("input can not be blank");
    }
    fetchGitUsers(userSelect)
      .then(({ data }) => {
        const { items } = data;
        setGitUsers(items);
        setSelectedUser(items[0]);
        setStep(2);
      })
      .catch((e) => console.log("err", e));
  };

  const goBack = (step: number) => {
    setStep(step);
    return step === 1 ? setGitUsers([]) : SetIsFinalPage(false);
  };

  const finalPage = () => {
    console.log("go to next page with the selectedUser");
    setStep(3);
    SetIsFinalPage(true);
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const name = event.target.name;
    setInput({ ...input, [name]: value });
    if (name === "userSelect") {
      const selectedUser = gitUsers.find((user) => user.login === value);
      setSelectedUser(selectedUser);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!selectedUser) return window.alert("selected user is not present");
    const { avatar_url, login, html_url } = selectedUser;
    const selectedRepo = repos.find((repo) => repo.name === repoSelect);
    if (!selectedRepo) return;
    const { url } = selectedRepo;
    if (!issueTitle) {
      return window.alert("Title can not be blank");
    }
    setIsModalOpen(false);
    const newIssue = {
      pending: true,
      title: issueTitle,
      id: Date.now().toString(),
      repository_url: repoSelect,
      html_url: url,
      user: {
        html_url,
        login,
        avatar_url,
      },
    };
    setGitIssues([newIssue, ...issues]);
  };

  return (
    <>
      <Step step={step} />
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
    </>
  );
};

export default MultiStepForm;
