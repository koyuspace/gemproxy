# GemProxy

GemProxy is a simple and stylish web proxy for the [Gemini network](gemini.circumlunar.space) primarily written in Bottle and JavaScript. It's easy to use and also self-hostable.

## Installation

Install Python3 alongside PIP and run the following command to install the dependencies:

`sudo pip3 install -r requirements.txt`

Afterwards run `main.py` and open up `localhost:1970` or use a nginx reverse proxy for public serving.

## Caveats

Due to the software's nature of not being multi-threaded it's recommended to set up a cronjob that restarts the server every few minutes to avoid potential hangs.

## Screenshot

![Screenshot](screenshot.png)