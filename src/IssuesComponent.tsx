import { Card, Badge, Button } from "react-bootstrap";
import { IProps } from "./Types";
import Loading from "./Loading";
import AlertComponent from "./Alert";

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
            {x.pending && (
              <Badge style={{ marginLeft: "3px" }} variant="info">
                pending
              </Badge>
            )}
          </Card.Footer>
        </Card>
      );
    });
  };

  return (
    <div style={{ margin: "10px" }}>
      {error ? (
        <AlertComponent
          variant={"danger"}
          heading={"Oh snap! You got an error!"}
          content={error}
        />
      ) : !loaded ? (
        <Loading />
      ) : filteredIssues.length > 0 ? (
        <div>
          <AlertComponent
            variant={"success"}
            heading={"Total Results"}
            content={`${filteredIssues.length} ${pageResults}`}
          />

          {mapToFiltered()}
        </div>
      ) : (
        <AlertComponent
          variant={"info"}
          heading={"Change your search terms"}
          content={`${filteredIssues.length} ${pageResults}`}
        />
      )}
    </div>
  );
};

export default IssuesComponent;
