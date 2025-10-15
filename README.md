# local-events
Team 10

# Important Git Commands
- `git pull`: Get newest commit (update from repo)

## How to commit (add) something using command line (terminal)
1. `git add .`: This adds all modified/new files
2. `git commit -m "Commit message"`: Makes a commit with the message "Commit message"
3. `git push`: Pushes (Adds) the commit to the repo
    - If we decide to make certain branches, you can commit to one using `git push origin BRANCHNAME.`

# Running frontend
1. Open terminal, in visual studio code it is ctrl, shift and +, or:
    - Three dots on the top
    - Terminal
    - New terminal
2. Switch to the `frontend/vite-frontend` folder using `cd frontend/vite-frontend`
3. Run `npm i`: This installs all the required packages
4. Run `npm run dev`: This runs the react application.

To access it, go to the url which is in the terminal window, by default it should be `http://localhost:5173/`

# Running backend
1. Open terminal, in visual studio code it is ctrl, shift and +, or:
    - Three dots on the top
    - Terminal
    - New terminal
2. Switch to the `backend` folder using `cd backend`
3. Run `npm i`: This installs all the required packages.
4. Run `node server.js`: This runs the backend.