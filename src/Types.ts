export interface IState {
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
  }

  export type IProps = IState & { removeIssue: (id: string) => void;
  };