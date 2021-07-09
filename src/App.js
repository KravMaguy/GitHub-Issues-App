import { useState, useEffect } from "react";
import axios from "axios";
import IssuesComponent from "./IssuesComponent";

const BaseUrl = "https://api.github.com/repos/";
const microsoft = "microsoft/TypeScript/issues";
const facebook = "facebook/react/issues";
const graphQl = "graphql/graphql-js/issues";

function App() {
  const [gitIssues, setIssues] = useState({});
  useEffect(() => {
    const Issues = [
      axios.get(`${BaseUrl}${graphQl}`),
      axios.get(`${BaseUrl}${microsoft}`),
      axios.get(`${BaseUrl}${facebook}`),
    ];
    Promise.all([...Issues])
      .then((res) => {
        const issues = res[0].data
          .concat(res[1].data, res[2].data)
          .sort((a, b) => {
            const titleA = a.title;
            const titleB = b.title;
            return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
          });
        setIssues({ issues });
      })
      .catch((error) => {
        console.log("err", error);
      });
  }, []);

  const { issues } = gitIssues;

  const removeIssue = (id) => {
    const filteredRepo = issues.filter((item) => item.id !== id);
    setIssues({ issues: filteredRepo });
  };

  return <IssuesComponent removeIssue={removeIssue} issues={issues} />;
}

export default App;
