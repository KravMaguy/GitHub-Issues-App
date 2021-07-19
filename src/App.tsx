import { useState, useEffect } from "react";
import axios from "axios";
import IssuesComponent from "./IssuesComponent";
import { IState, Issue } from "./Types";
import CardComponent from "./CardComponent";
import FilterForm from "./FilterForm";
import PaginationComponent from "./PaginationComponent";
import { Form, InputGroup, Button, FormControl } from "react-bootstrap";

const repos = [
  { name: "TypeScript", id: 1 },
  { name: "graphql-js", id: 2 },
  { name: "react", id: 3 },
];

const BaseUrl = "http://localhost:3001/";
const microsoft = "microsoft";
const facebook = "facebook";
const graphQl = "graphql";
// const BaseUrl = "https://api.github.com/repos/";
// const microsoft = "microsoft/TypeScript/issues";
// const facebook = "facebook/react/issues";
// const graphQl = "graphql/graphql-js/issues";

interface GitUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

function App() {
  const [gitIssues, setGitIssues] = useState<IState["issues"]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage]: [number, (a: number) => void] = useState(1);
  const [loaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [input, setInput] = useState({
    repoSelect: repos[0].name,
    userSelect: "",
    issueTitle: "",
  });
  const [gitUsers, setGitUsers] = useState<Array<GitUser>>([]);
  const [selectedUser, setSelectedUser] = useState<GitUser>();
  const [isFinalPage, SetIsFinalPage] = useState<boolean>(false);

  const { userSelect, repoSelect, issueTitle } = input;

  const handleGitSearch = (event: any) => {
    event.preventDefault();
    if (!userSelect) {
      return window.alert("input can not be blank");
    }
    axios
      .get(`https://api.github.com/search/users?q=${userSelect}`)
      .then(({ data }) => {
        const { items } = data;
        setGitUsers(items);
        setSelectedUser(items[0]);
      })
      .catch((e) => console.log("err", e));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = (event: any) => {
    //Property 'stopPropagation' does not exist on type 'MouseEventHandler<HTMLDivElement>'.ts(2339)
    // event.stopPropagation();
    const targetId = event.target.id;
    if (targetId === "modal-overlay") {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const Issues = [
      axios.get(`${BaseUrl}${graphQl}?page=${page}`),
      axios.get(`${BaseUrl}${microsoft}?page=${page}`),
      axios.get(`${BaseUrl}${facebook}?page=${page}`),
    ];
    Promise.all([...Issues])
      .then(([graphIssues, microsoftIssues, facebookIssues]) => {
        const issues = graphIssues.data
          .concat(microsoftIssues.data, facebookIssues.data)
          .sort((a: Issue, b: Issue) => {
            const titleA = a.title;
            const titleB = b.title;
            return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
          });
        setGitIssues(issues);
        setIsLoaded(true);
      })
      .catch((error) => {
        setError(error.message);
      });
    setIsLoaded(false);
  }, [page]);

  const removeIssue = (id: Issue["id"]) => {
    const filteredIssues = gitIssues.filter((item) => item.id !== id);
    setGitIssues(filteredIssues);
  };

  const onParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  function calcPage(amount: number) {
    setPage(page + amount);
  }

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
    setIsModalOpen(false);
    const { avatar_url, login, html_url } = selectedUser;
    console.log("userSelect ", userSelect);
    console.log("issuetitle ", issueTitle);
    console.log("repoSelect", repoSelect);
    console.log("avatar_url", avatar_url);
    console.log("login", login);
    console.log("html_url", html_url);
    if (!issueTitle) {
      return window.alert("Title can not be blank");
    }
    const newIssue = {
      title: issueTitle,
      id: Date.now().toString(),
      repository_url: "https://github.com/microsoft/TypeScript/issues/44943",
      html_url,
      user: {
        html_url,
        login,
        avatar_url,
      },
    };
    setGitIssues([newIssue, ...gitIssues]);
  };

  const goBack = (step: number) => {
    return step === 1 ? setGitUsers([]) : SetIsFinalPage(false);
  };

  const finalPage = () => {
    console.log("go to next page with the selectedUser");
    SetIsFinalPage(true);
  };

  return (
    <>
      <div
        id="modal-overlay"
        onClick={closeModal}
        className={`${
          isModalOpen ? "my-modal-overlay show-my-modal" : "my-modal-overlay"
        }`}
      >
        <div className="modal-container">
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
        </div>
      </div>

      <CardComponent openModal={openModal}>
        <FilterForm
          error={error}
          onParamChange={onParamChange}
          searchValue={searchValue}
        />
        <PaginationComponent
          error={error}
          page={page}
          calcPage={calcPage}
          setPage={setPage}
        />
      </CardComponent>

      <IssuesComponent
        error={error}
        loaded={loaded}
        searchValue={searchValue}
        removeIssue={removeIssue}
        issues={gitIssues}
      />
    </>
  );
}

export default App;
