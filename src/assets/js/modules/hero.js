import { getUser } from './DataHandler';

const displayHero = async () => {
  const user = await getUser();
  console.log('user = ', user);
  if (!user) return;
  const template = document.querySelector('[data-template="hero"]');
  const hero = document.importNode(template, true);

  const elements = {
    main: hero.content.querySelector('[data-hero]'),
    title: hero.content.querySelector('[data-title]'),
    image: hero.content.querySelector('[data-image]'),
    meta: hero.content.querySelector('[data-meta]'),
    bio: hero.content.querySelector('[data-bio]'),
    link: hero.content.querySelector('[data-link]'),
  };

  elements.title.innerHTML = user.title;
  elements.image.src = user.image;
  elements.image.alt = user.title;
  elements.bio.innerHTML = user.bio;
  elements.link.href = user.link;
  elements.meta.innerHTML = `${user.company} | ${user.location}`;


  document.querySelector('main').insertAdjacentElement('afterbegin', elements.main);

};

export default displayHero;
