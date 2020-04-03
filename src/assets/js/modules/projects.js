import { getProjects } from './DataHandler';

const displayProject = (project, grid) => {
  const template = document.querySelector('[data-template="project"]');
  const element = document.importNode(template, true);

  const elements = {
    main: element.content.querySelector('[data-project]'),
    title: element.content.querySelector('[data-title]'),
    repo: element.content.querySelector('[data-repo]'),
    demo: element.content.querySelector('[data-demo]'),
  };

  elements.title.innerHTML = project.title;
  elements.repo.href = project.repo;
  elements.demo.href = project.demo;

  if (!project.demo) {
    elements.demo.setAttribute('hidden', true);
  }

  grid.insertAdjacentElement('afterbegin', elements.main);

};

const displayProjects = async () => {
  const projects = await getProjects();
  if (!projects) return;
  const grid = document.querySelector('[data-projects] .cards');

  projects.forEach((project) => displayProject(project, grid));

};

export default displayProjects;
