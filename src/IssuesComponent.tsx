import { Card, Badge, Button } from "react-bootstrap";

export interface IProps {
  issues: {
    title : string,
    id : string,
    repository_url : string,
    html_url : string,
    user:{
      html_url : string,
      login : string
      avatar_url : string
    }
}[]
removeIssue: (id: string) => void;
}

const IssuesComponent= ({ issues, removeIssue}:IProps) => {
  return (
    <>
      <div>
        {issues?.length > 0
          ? issues.map((x) => {
              const lastItem = x.repository_url.substring(
                x.repository_url.lastIndexOf("/") + 1
              );
              const urlArray = x.html_url.split("/");
              const repoUrl = urlArray.slice(0, urlArray.length - 2).join("/");
              return (
                <Card key={x.id} className="mb-3" style={{ margin: "10px" }}>
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
                      <Button
                        onClick={() => removeIssue(x.id)}
                        variant="primary"
                      >
                        Remove Issue
                      </Button>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Badge variant="secondary">{lastItem}</Badge>
                  </Card.Footer>
                </Card>
              );
            })
          : `loading`}
      </div>
    </>
  );
};

export default IssuesComponent;
