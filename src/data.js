// Define the copy to allow for easier localisation
const copy = {
  company: {
    name: 'thomasxbanks',
  },
  title: 'thomasxbanks',
};

// Generate the context
const context = {
  colophon: `&copy; ${new Date().getFullYear()} ${copy.company.name}`,
  copy,
};

module.exports = context;
