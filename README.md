# Phantomate

Phantomate is a web application that allows people to connect with each other. It has a misterius aestethic that helps lifting up spirits) Swipe to match with different people, chat with your new bros and discover something new about yourself through personality tests.
 
## Features
- User Authentification
- Profile manipulations
- metching servise
- post creations
- tests linked to users (the API will be changed later)

## Structure
Phantomate/ <br>
├── public/                 # Static assets and index.html  <br>
├── src/  <br>
│   ├── components/         # Reusable UI components  <br>
│   ├── pages/              # App pages (HomePage, MatchPage, LoginPage, etc.)  <br>
│   ├── services/           # Firebase interaction logic  <br>
│   ├── App.tsx             # Main app component  <br>
│   └── main.tsx            # App entry point  <br>
├── .firebaserc             # Firebase project settings  <br>
├── firebase.json           # Firebase hosting config  <br>
├── package.json            # Project dependencies  <br>
└── README.md  <br>

## Setup & Instalation
### Prerequisites:
Node.js <br>
Firebase CLI

### Cloning the repository:
<code>
git clone https://github.com/bilyi1andrii/Phantomate.git
cd Phantomate
git checkout firebase
</code>

### Install dependencies:
```{shell}
npm install
npm install framer-motion
npm install react-router-dom
```

### Run app:
```
npm run dev
```

## Known Issues
Windows OS does not permit to run certain scripts necessary for execution of this code. We strongly recommend switching to other platforms for this project.
However, if you would still like to rn it on windows, run:
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
before everything else.

## Development Notes
Built with React + Vite <br>
Firebase SDK v9+ modular style


## Contributing
Oksana Kotilarchuk - https://github.com/Ok-ss <br>

Bilyi Andrii - https://github.com/bilyi1andrii <br>

Iryna Kyrylova - https://github.com/hhafiya <br>
