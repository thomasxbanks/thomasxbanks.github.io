# %Project_Title%

%BRIEF_PROJECT_DESCRIPTION%

- **Client**: %CLIENT_NAME%
- **Agency**: %AGENCY_NAME%
- **Author**: LXLabs for Havas Lynx

%DETAILED_PROJECT_DESCRIPTION%

**This README is for version %CURRENT_VERSION_NUMBER% and it would be appreciated if it was kept up-to-date if there are any changes made to the processes detailed here.**

## Sites

| Environment | Frontend              |
| ----------- | --------------------- |
| Local       |                       |
| Development | .ci-dev.havaslynx.com |
| Staging     | .ci-uat.havaslynx.com |
| Production  |                       |

## Folder Structure 📁

```bash
root
├── README.md
├── gulpfile.js
├── node_modules
├── package-lock.json
└── package.json
```

## Backend 🖥

There is no backend for this application.

## Frontend 📱

The frontend is written in [HandlebarsJS]() to keep the various components separated. 
The frontend compiles down to static `index.html` file for deploying on a specific congress device.

## Getting Started

### Installing

1. Install all of the dependencies for the application

```bash
npm install
```

> Go and make a brew while everything installs 😂

## Running locally 💻

Once your dependencies have successfully installed, the application is ready for running locally.

```bash
npm start
```

## Running the tests ✅

The test scripts can be run with the following commands

```bash
npm run test
```

> There are currently no tests defined

## Deployment 📦

The application deploys to Development and Staging (UAT) environments using the [GitLab](https://gitlab.havaslynx.com/) CI Pipeline.

The configuration for this is detailed in the `.gitlab-ci.yml` file.

### Server 👾

The Development and Staging servers are running on Linux Ubuntu (Version 16.04.5 LTS) server with nginx (Version 1.10.3)

## Developing locally 🤓

### Creating components 🔠

The base styling and JavaScript functionality have been attached to elements, in the most part, using `data-` attributes to leave the `class` attribute solely for styling.

The main content of the application is made of 'slides'.

To create a slide:

1. In `slides.js`, add or edit the relevant slide
    - `slides[index].nav` is the text that will appear in the Navigation Button
    - `slides[index].file` is the path to the file containing the slide content
1. In the `slides` folder, create a file with the correct index from the `slides` array
    - An example of the layout is available in `template.slide.hbs`

### Adjusting animations 🏃‍♀️

The `data-title`, `data-content`, and `data-footer` components can be animated when their parent slide becomes visible. The animations can be changed to one of the defaults in the `assets/js/config.js` file.

Available options:
- `moveToLeft`
- `moveToRight`
- `moveUp`
- `moveDown`
- `scaleUp`

The actual code for the animations is in `assets/css/_animations.scss` where you can add your own custom animations.

### Tracking

Locally-stored tracking is available using the [Lx Labs Tracking Tool](https://gitlab.havaslynx.com/lxlabs/tracking-tool).

Full instructions are available in the [README.md](https://gitlab.havaslynx.com/lxlabs/tracking-tool/blob/master/README.md) for the Tracking Tool itself.

#### Tracked events

- `session.start`: A new session is created when the screensaver is de-activated
- `session.end`: A session is ended when the screensaver is activated
- `page`: When a page is selected, either using the menu, navigation, or swiping, the page's name is logged
- `modal.start`: When the references modal is opened
- `modal.end`: When the references modal is closed

New events can be registered by adding the tracking code to the function being run. The date/time stamp is added automatically.

##### Example code
```js
    const openModal = async (modalName) => {
        const element = document.querySelector(`[data-modal="${ modalName }"]`);
        await makeElementIsActive(element);
        const eventName = 'modal.open';
        const eventValue = modalName;
        await trackingLogEvent(eventValue, eventName);
    }
```

## Gotchas! 🤔

## Housekeeping 🛋
