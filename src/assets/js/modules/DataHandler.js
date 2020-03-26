import fetch from 'isomorphic-fetch';

export const getUser = async () => {
  const endpoint = 'https://api.github.com/users/thomasxbanks';
  const raw = await fetch(endpoint);
  const response = await raw.json();
  return !response ? false : {
    title: response.name,
    image: response.avatar_url,
    bio: response.bio,
    link: response.blog,
    location: response.location,
    company: response.company,
  };
};

export const getProjects = async (page, perPage = 6) => {
  const endpoint = `https://api.github.com/users/thomasxbanks/repos?page=${page}&per_page=${perPage}`;
  const raw = await fetch(endpoint);
  const response = await raw.json();
  const projects = [];
  if (!response) return false;
  response.forEach((project) => {
    projects.push({
      title: project.name,
      repo: project.html_url,
      demo: project.has_pages ? `https://${project.owner.login}.github.io/${project.name}` : false,
    });
  });
  return projects;
};
