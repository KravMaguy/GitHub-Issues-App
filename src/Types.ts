  export interface IState {
    issues: Issue[];
  }
  
  export interface Issue {
    repoSelect?: string;
    pending: boolean;
    title: string;
    id: string;
    repository_url: string;
    html_url: string;
    user: {
      html_url: string;
      login: string;
      avatar_url: string;
    };
  }

  export type IProps = IState & { searchValue: string; removeIssue: (id: string) => void; loaded: boolean; error:string;
  };