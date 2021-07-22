import axios from "axios";

// const BaseUrl = "http://localhost:3001/";
// const microsoft = "microsoft";
// const facebook = "facebook";
// const graphQl = "graphql";

const BaseUrl = "https://api.github.com/repos/";
const microsoft = "microsoft/TypeScript/issues";
const facebook = "facebook/react/issues";
const graphQl = "graphql/graphql-js/issues";

export const fetchIssues = (page: number) => {
  return [
    axios.get(`${BaseUrl}${graphQl}?page=${page}`),
    axios.get(`${BaseUrl}${microsoft}?page=${page}`),
    axios.get(`${BaseUrl}${facebook}?page=${page}`),
  ];
};

export const fetchGitUsers = (userSelect: string) => {
  return axios.get(`https://api.github.com/search/users?q=${userSelect}`);
};
