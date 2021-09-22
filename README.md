# GemProxy

GemProxy is a simple and stylish web proxy for the [Gemini network](https://gemini.circumlunar.space) primarily written in Bottle and React. It's easy to use and also self-hostable.

## Installation

### Backend

Install Python3 alongside PIP and run the following command to install the dependencies:

`sudo pip3 install -r requirements.txt`

Afterwards run `main.py` to run the backend.

### Frontend

Install NodeJS with yarn and run `yarn install` to install the dependencies and `yarn build` to build the frontend. You can also debug the frontend using `yarn start` which will open a browser with auto-reload and error reporting.

## Caveats

Due to the software's nature of not being multi-threaded it's recommended to set up a cronjob that restarts the backend every few minutes to avoid potential hangs.

## Screenshot

![Screenshot](screenshot.png)
