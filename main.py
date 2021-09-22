#!/bin/python3
import re
import ignition
from bottle import redirect, route, static_file, response, run
import subprocess

rooturl = "//"

@route("/style.css")
def style():
    return static_file("style.css", root=".")

@route("/favicon.ico")
def favicon():
    return static_file("favicon.ico", root=".")

@route("/app.js")
def appjs():
    return static_file("app.js", root=".")

@route("/koyu.png")
def koyupng():
    return static_file("koyu.png", root=".")

@route("/")
def index():
    return ""

@route("/check")
def check():
    response.content_type = "text/plain"
    response.headers['Access-Control-Allow-Origin'] = '*'
    return "OK"

@route("/get/<url:re:.+>")
def defr(url):
    req = ignition.request(rooturl+url.replace("$", "?"))
    response.headers['Access-Control-Allow-Origin'] = '*'
    if ".jpg" in url or ".png" in url or "favicon.txt" in url:
        response.headers["Cache-Control"] = "public, max-age=604800"
    images = [".jpg", ".png", ".gif", ".ico"]
    for i in images:
        if i in str(req.url):
            response.content_type = "image/"+str(req.url.split(".")[1:][1])
    if str(req).split(" ")[0].startswith("1"):
        return "$$$input$$$"+str(req).split("\n")[0].replace(str(req).split("\n")[0].split(" ")[0], "")
    else:
        if str(req).split(" ")[0].startswith("5") or str(req).split(" ")[0].startswith("0") or str(req).split(" ")[0].startswith("4"):
            return "# Error "+str(req).split("\n")[0].split(" ")[0]+"\n"+str(req).split("\n")[0].replace(str(req).split("\n")[0].split(" ")[0], "")
        else:
            if not str(req.raw_body) == "":
                return req.raw_body
            else:
                redirect("/get/"+url+"/")

@route("/gitid")
def gitid():
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.content_type = "text/plain"
    return str(subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'])).replace("b'", "").replace("\\n'", "")

run(host="127.0.0.1", port=1970, server="tornado")
