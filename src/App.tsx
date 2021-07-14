import { useState, useEffect, useRef } from "react";
import axios from "axios"
import IssuesComponent from "./IssuesComponent";
import { IState, Issue } from './Types';
import {Form, Card, Pagination} from "react-bootstrap"

const BaseUrl = "https://api.github.com/repos/";
const microsoft = "microsoft/TypeScript/issues";
const facebook = "facebook/react/issues";
const graphQl = "graphql/graphql-js/issues";

function App() {
  const refContainer = useRef<HTMLInputElement | null>(null);
  const [gitIssues, setGitIssues] = useState<IState["issues"]>([]);
  const [searchValue, setSearchValue] =useState('')
  const [page, setPage] = useState<number>(1)
  const isNextPage=true;
  useEffect(() => {
    refContainer?.current?.focus();
  });

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
    setPage(prevPage => prevPage + amount)
  }


  return (
  <>
  <Card className="mb-3" style={{"margin":"10px"}}>
  <Form className="mb-3" style={{"margin":"10px", "width": "75%",}}>
  <Form.Label>Search Issues</Form.Label>
  <Form.Control onChange={onParamChange} value={searchValue} ref={refContainer}
  name="issuesearch" type="text" />  
  </Form>
    <Pagination style={{"margin":"10px"}}>
      {page !== 1 && <Pagination.Prev onClick={() => calcPage(-1)} />}
      {page !== 1 && <Pagination.Item onClick={() => setPage(1)}>1</Pagination.Item>}
      {page > 2 && <Pagination.Ellipsis />}
      {page > 2 && <Pagination.Item onClick={() => calcPage(-1)}>{page - 1}</Pagination.Item>}
      <Pagination.Item active>{page}</Pagination.Item>
      {isNextPage && <Pagination.Item onClick={() => calcPage(1)}>{page + 1}</Pagination.Item>}
      {isNextPage && <Pagination.Next onClick={() => calcPage(1)} />}
    </Pagination>
  </Card>

  <IssuesComponent searchValue={searchValue} removeIssue={removeIssue} issues={gitIssues}/>
  </>);
}

export default App;