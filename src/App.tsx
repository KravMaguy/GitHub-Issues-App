import { useState, useEffect, useRef } from "react";
import axios from "axios"
import IssuesComponent from "./IssuesComponent";
import { IState, Issue } from './Types';
import {Form, Card} from "react-bootstrap"

const BaseUrl = "https://api.github.com/repos/";
const microsoft = "microsoft/TypeScript/issues";
const facebook = "facebook/react/issues";
const graphQl = "graphql/graphql-js/issues";

function App() {
  const refContainer = useRef<HTMLInputElement | null>(null);
  const [gitIssues, setGitIssues] = useState<IState["issues"]>([]);
  const [searchValue, setSearchValue] =useState('')

  useEffect(() => {
    refContainer?.current?.focus();
  });

  useEffect(() => {
    const Issues = [
      axios.get(`${BaseUrl}${graphQl}`),
      axios.get(`${BaseUrl}${microsoft}`),
      axios.get(`${BaseUrl}${facebook}`),
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
  }, []);

  const removeIssue = (id:Issue["id"]) => {
    const filteredIssues = gitIssues.filter((item) => item.id !== id);
    setGitIssues(filteredIssues);
  };


  const onParamChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const value=e.target.value
    setSearchValue(value)
  }

  return (
  <>
  <Card className="mb-3" style={{"margin":"10px"}}>
  <Form className="mb-3" style={{"margin":"10px"}}>
          <Form.Label>Search Issues</Form.Label>
          <Form.Control onChange={onParamChange} value={searchValue}          ref={refContainer}
name="issuesearch" type="text" />  
    </Form>
  </Card>

  <IssuesComponent searchValue={searchValue} removeIssue={removeIssue} issues={gitIssues}/>
  </>);
}

export default App;