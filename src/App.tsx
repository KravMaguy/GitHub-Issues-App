import { useState, useEffect } from "react";
import axios from "axios";
import IssuesComponent from "./IssuesComponent";
import { IState, Issue } from "./Types";
import CardComponent from "./CardComponent";
import FilterForm from "./FilterForm";
import PaginationComponent from "./PaginationComponent";
// import { Form } from "react-bootstrap";

const BaseUrl = "https://api.github.com/repos/";
const microsoft = "microsoft/TypeScript/issues";
const facebook = "facebook/react/issues";
const graphQl = "graphql/graphql-js/issues";

function App() {
  const [gitIssues, setGitIssues] = useState<IState["issues"]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage]: [number, (a: number) => void] = useState(1);
  const [loaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [gitUsers, setGitUsers] = useState([]);

  const handleSubmit = (event: React.FormEventHandler<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submitted");
    axios
      .get(`https://api.github.com/search/users?q=${input}`)
      .then(({ data }) => {
        const { items } = data;
        setInput("");
        setGitUsers(items);
      })
      .catch((e) => console.log("err", e));
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setInput(event.target.value);
    // console.log("handleChange ", input);
    // console.log(event);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
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

  return (
    <>
      <div
        className={`${
          isModalOpen ? "my-modal-overlay show-my-modal" : "my-modal-overlay"
        }`}
      >
        <div className="modal-container">
          <button className="close-modal-btn" onClick={closeModal}>
            X{" "}
          </button>
          {/* <Form className="mb-3" style={{ margin: "10px", width: "75%" }}> */}
          <form className="form" onSubmit={handleSubmit}>
            {gitUsers.length < 1 ? (
              <input
                list="opts"
                name="user"
                value={input}
                onChange={handleChange}
                id="search-user"
              />
            ) : (
              <select
                onChange={handleChange}
                name="user-select"
                id="user-select"
                className="country-select"
              >
                {gitUsers.map((option) => (
                  <option key={option.id} value={option.login}>
                    {option.login}
                  </option>
                ))}
              </select>
            )}
            <input type="submit" value="search" />
          </form>
          {/* 
            <Form.Label>Issue Title</Form.Label>
            <Form.Control name="issue_title" type="text" />
            <Form.Label>Author</Form.Label>
            <Form.Control name="issue_author" type="text" /> 
          </Form>*/}
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
