import { useState, useEffect } from "react";
import axios from "axios"
import IssuesComponent from "./IssuesComponent";
import { IState, Issue } from './Types';
import CardComponent from "./CardComponent";
import FilterForm from "./FilterForm";
import PaginationComponent from "./PaginationComponent";

const BaseUrl = "https://api.github.com/repos/";
const microsoft = "microsoft/TypeScript/issues";
const facebook = "facebook/react/issues";
const graphQl = "graphql/graphql-js/issues";

function App() {
  const [gitIssues, setGitIssues] = useState<IState["issues"]>([]);
  const [searchValue, setSearchValue] =useState<string>('')
  const [page, setPage]:[number, (a:number)=>void] = useState(1)

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
          .sort((a:Issue, b:Issue) => {
            const titleA = a.title;
            const titleB = b.title;
            return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
          });
        setGitIssues(issues);
      })
      .catch((error) => {
        console.log("err", error);
      });
  }, [page]);

  const removeIssue = (id:Issue["id"]) => {
    const filteredIssues = gitIssues.filter((item) => item.id !== id);
    setGitIssues(filteredIssues);
  };

  const onParamChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const value=e.target.value
    setSearchValue(value)
  }

  function calcPage(amount:number) {
    console.log('pageAdjuster called')
    setPage(page + amount)
  }


  return (
  <>
  <CardComponent>
    <FilterForm onParamChange={onParamChange} searchValue={searchValue}/>
    <PaginationComponent page={page} calcPage={calcPage} setPage={setPage}/>
  </CardComponent>

  <IssuesComponent searchValue={searchValue} removeIssue={removeIssue} issues={gitIssues}/>
  </>);
}

export default App;