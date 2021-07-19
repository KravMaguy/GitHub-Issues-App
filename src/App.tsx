import { useState, useEffect } from "react";
import axios from "axios";
import IssuesComponent from "./IssuesComponent";
import { IState, Issue } from "./Types";
import CardComponent from "./CardComponent";
import FilterForm from "./FilterForm";
import PaginationComponent from "./PaginationComponent";
import { Form, InputGroup, Button, FormControl } from "react-bootstrap";

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
}

function App() {
  const [gitIssues, setGitIssues] = useState<IState["issues"]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage]: [number, (a: number) => void] = useState(1);
  const [loaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [gitUsers, setGitUsers] = useState<Array<GitUser>>([]);
  const [selectedUser, setSelectedUser] = useState<GitUser>();

  const handleGitSearch = (event: any) => {
    event.preventDefault();
    console.log("submitted");
    axios
      .get(`https://api.github.com/search/users?q=${input}`)
      .then(({ data }) => {
        const { items } = data;
        setInput("");
        setGitUsers(items);
        setSelectedUser(items[0]);
      })
      .catch((e) => console.log("err", e));
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setInput(value);
    const selectedUser = gitUsers.find((user) => user.login === value);
    console.log("selectedUser: ", selectedUser);
    setSelectedUser(selectedUser);
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
    console.log("pageAdjuster called");
    setPage(page + amount);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("form was submitted");
  };

  const goBack = (e: any) => {
    setGitUsers([]);
    console.log("users is now ", gitUsers);
  };

  const handleSelectedUser = () => {
    // const selectedUser = gitUsers.find((user) => user.login === input);
    // console.log("selectedUser: ", selectedUser);

    // setSelectedUser(selectedUser);
    console.log("go to next page with the selectedUser");
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
            onSubmit={handleSubmit}
            // style={{ margin: "10px", width: "75%" }}
          >
            <InputGroup className="mb-3 select-input">
              {gitUsers.length < 1 ? (
                <>
                  <FormControl
                    placeholder="Search gitHub users"
                    aria-label="GitHub username"
                    aria-describedby="basic-addon2"
                    onChange={handleChange}
                    value={input}
                  />
                  <Button
                    onClick={handleGitSearch}
                    variant="primary"
                    id="button-addon2"
                    style={{ borderRadius: "0px 4px 4px 0px" }}
                  >
                    Search
                  </Button>
                </>
              ) : (
                <>
                  <select
                    onChange={handleChange}
                    name="user-select"
                    id="user-select"
                    value={input}
                  >
                    {gitUsers.map((option) => (
                      <option key={option.id} value={option.login}>
                        {option.login}
                      </option>
                    ))}
                  </select>
                  <span onClick={goBack} className="close">
                    x
                  </span>

                  <Button
                    onClick={handleSelectedUser}
                    variant="primary"
                    id="button-addon2"
                    style={{ borderRadius: "0px 4px 4px 0px" }}
                  >
                    Next
                  </Button>
                </>
              )}
            </InputGroup>
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
