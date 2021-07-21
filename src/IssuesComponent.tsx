import { Card, Badge, Button, Alert } from "react-bootstrap";
import { IProps } from "./Types";
import Loading from "./Loading";

const IssuesComponent = ({
  error,
  loaded,
  issues,
  removeIssue,
  searchValue,
}: IProps) => {
  const filteredIssues = issues.filter((item) =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );
  const pageResults = "results on this page";

  const mapToFiltered = () => {
    let count = 0;
    let repoUrl;
    return filteredIssues.map((x) => {
      const lastItem = x.repository_url.substring(
        x.repository_url.lastIndexOf("/") + 1
      );
      const urlArray = x.html_url.split("/");
      repoUrl = urlArray.slice(0, urlArray.length - 2).join("/");
      if (x.pending) {
        repoUrl = x.html_url;
      }
      if (count < 1 && !x.pending) {
        console.log(x.html_url, "one of many");
      }
      count++;

      return (
        <Card key={x.id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <div>
                <Card.Title>
                  <a href={x.html_url}>{x.title} - </a>
                  <span className="text-muted font-weight-light">
                    <a href={x.user.html_url}>{x.user.login}</a>
                  </span>
                </Card.Title>
                <Card.Subtitle className="text-muted mb-2">
                  <a href={repoUrl}>{repoUrl}</a>
                </Card.Subtitle>
              </div>
              <a href={x.user.html_url}>
                <img
                  className="d-none d-md-block"
                  height="50"
                  alt={""}
                  src={x.user.avatar_url}
                />
              </a>
            </div>
            <Card.Text>
              <Button onClick={() => removeIssue(x.id)} variant="primary">
                Remove Issue
              </Button>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Badge variant="secondary">{lastItem}</Badge>
          </Card.Footer>
        </Card>
      );
    });
  };

  return (
    <div style={{ margin: "10px" }}>
      {error ? (
        <Alert variant="danger">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      ) : !loaded ? (
        <Loading />
      ) : filteredIssues.length > 0 ? (
        <div>
          <Alert variant="success">
            <Alert.Heading>Total Results</Alert.Heading>
            <p>{`${filteredIssues.length} ${pageResults}`}</p>
          </Alert>
          {mapToFiltered()}
        </div>
      ) : (
        <Alert variant="info">
          <Alert.Heading>Change your search terms</Alert.Heading>
          <p>{`${filteredIssues.length} ${pageResults}`}</p>
        </Alert>
      )}
    </div>
  );
};

export default IssuesComponent;
