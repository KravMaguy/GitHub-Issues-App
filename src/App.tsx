import { useState, useEffect } from "react";
import axios from "axios";
import IssuesComponent from "./IssuesComponent";
import { IState, Issue } from "./Types";
import CardComponent from "./CardComponent";
import FilterForm from "./FilterForm";
import PaginationComponent from "./PaginationComponent";
import { Form } from "react-bootstrap";

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
          <Form className="mb-3" style={{ margin: "10px", width: "75%" }}>
            <Form.Label>Issue Title</Form.Label>
            <Form.Control name="issue_title" type="text" />
            <Form.Label>Author</Form.Label>
            <Form.Control name="issue_author" type="text" />
            <Form.Select aria-label="Default select example">
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>
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
