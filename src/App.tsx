import { useState, useEffect } from "react";
import axios from "axios"
import IssuesComponent from "./IssuesComponent";
import {IState} from "./Types"
const BaseUrl = "https://api.github.com/repos/";
const microsoft = "microsoft/TypeScript/issues";
const facebook = "facebook/react/issues";
const graphQl = "graphql/graphql-js/issues";


function App() {
  const [gitIssues, setGitIssues] = useState<IState["issues"]>([]);

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
          .sort((a:any, b:any) => {
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

  const removeIssue = (id:string) => {
    const filteredIssues = gitIssues.filter((item) => item.id !== id);
    setGitIssues(filteredIssues);
  };

  return <IssuesComponent removeIssue={removeIssue} issues={gitIssues} />;
}

export default App;