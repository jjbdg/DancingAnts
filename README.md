# So You Think Ants Can Dance

These dancing ants were animated with TypeScript using data from the Carnegie Mellon motion capture database. The CMU Mocap database contains 2,605 different motions, most recorded at 120Hz, but some recorded at 60Hz or other speeds. These motions range from the simple (person walking straight forward), to the complicated (directing traffic), to the silly (someone doing the "I'm a little teapot" dance).

The mocap data was used to create a looping animation that smoothly interpolates between the beginning and end of the motion clip then overlayed onto the character at runtime. The pair of ant dancers perform a salsa loop while the lone ant dancer performs various ballet moves. There are five different ballet techniques that can be chosen from with the click of a button using the GUI in the top right corner. The database also provided bone skeleton information which was used to form the scene hierarchy needed to create the necessary geometry for the animated characters. 

## Prerequisites

To work with this code, you will first need to install [Node.js 16.17.0 LTS](https://nodejs.org/) and [Visual Studio Code](https://code.visualstudio.com/). 

## Getting Started

After cloning your repository, you will need to set up the initial project by pulling the dependencies from the node package manager with:

```
npm install
```

This will create a `node_modules` folder in your directory and download all the dependencies needed to run the project.  Note that this folder is `.gitignore` file and should not be committed to your repository.  After that, you can compile and run a server with:

```
npm run start
```

Webpack should launch your program in a web browser automatically.  If not, you can run it by pointing your browser at `http://localhost:8080`.

## Acknowledgments

This assignment was based on content from CSCI 4611 Fall 2021 by [Daniel Keefe](https://www.danielkeefe.net/).

## License

Material for [CSCI 4611 Fall 2022](https://csci-4611-fall-2022.github.io/) by [Evan Suma Rosenberg](https://illusioneering.umn.edu/) is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
