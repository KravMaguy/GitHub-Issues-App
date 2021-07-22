import { useState, useEffect } from "react";
import axios from "axios";
import IssuesComponent from "./IssuesComponent";
import { IState, Issue } from "./Types";
import CardComponent from "./CardComponent";
import FilterForm from "./FilterForm";
import PaginationComponent from "./PaginationComponent";
import MultiStepForm from "./MultiStepForm";
import FormModal from "./FormModal";

const repos = [
  { name: "TypeScript", id: 1, url: "https://github.com/microsoft/TypeScript" },
  { name: "graphql-js", id: 2, url: "https://github.com/graphql/graphql-js" },
  { name: "react", id: 3, url: "https://github.com/facebook/react" },
];

// const BaseUrl = "http://localhost:3001/";
// const microsoft = "microsoft";
// const facebook = "facebook";
// const graphQl = "graphql";
const BaseUrl = "https://api.github.com/repos/";
const microsoft = "microsoft/TypeScript/issues";
const facebook = "facebook/react/issues";
const graphQl = "graphql/graphql-js/issues";

export interface GitUser {
  id: string;
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
    if (event.currentTarget === event.target) {
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
      {isModalOpen && (
        <FormModal closeModal={closeModal}>
          <div className="scale-up zoom">#1</div>
          <MultiStepForm
            gitUsers={gitUsers}
            handleChange={handleChange}
            userSelect={userSelect}
            handleGitSearch={handleGitSearch}
            selectedUser={selectedUser}
            isFinalPage={isFinalPage}
            goBack={goBack}
            repoSelect={repoSelect}
            repos={repos}
            issueTitle={issueTitle}
            handleSubmit={handleSubmit}
            finalPage={finalPage}
          />
        </FormModal>
      )}

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
