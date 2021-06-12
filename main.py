#!/bin/python3
import re
import ignition
from markdown import markdown
from bottle import redirect, route, static_file, response, run, request, template
import os.path

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
    rooturl = "//geminispace.info/"
    response.headers['Access-Control-Allow-Origin'] = '*'
    req = ignition.request(rooturl)
    rep = str(req.data())
    body = rep
    lines = body.split("\n")
    parsedmd = ""
    for e in lines:
        if e.startswith("=>"):
            link = e.replace("=> ", "").split(" ")[0]
            text = " ".join(e.replace("=> ", "").split(" ")[1:])
            parsedmd += "["+text+"]("+link+")"+"\n"
        else:
            parsedmd += e+"\n"
    html = str(markdown(parsedmd, extensions=['fenced_code'])).replace("gemini://", "//")
    favico = "📄"
    try:
        favurl = "//geminispace.info/favicon.txt"
        favreq = ignition.request(favurl)
        if str(favreq).split(" ")[0].startswith("2"):
            favico = str(favreq).split("\n")[1]
    except:
        pass
    head = template("head.tpl")+template("proxyui", favicon=favico)
    f = open("tail.tpl", "r")
    tail = f.read()
    f.close()
    html = head+html+tail
    return html

@route("/<url:re:.+>")
def defr(url):
    if url == "settings/" or url == "settings":
        return template("settings")
    else:
        rooturl = "//"
        try:
            req = ignition.request(rooturl+url)
            if str(req).split(" ")[0] == "50":
                mime = "text/plain"
                response.content_type = mime+";charset=utf-8"
                return str(req).split("\n")[0]
        except:
            pass
        favico = "📄"
        if url == "capcom/":
            redirect("/geminispace.info/"+url, code=302)
        if not "/" in url:
            if request.query_string == "":
                redirect("geminispace.info/"+url+"/", code=302)
            else:
                redirect("geminispace.info/"+url+"/?"+request.query_string)
        try:
            req = ignition.request(rooturl+url)
            if str(req).split(" ")[0].startswith("2"):
                if not "/" in url[-1] and not "." in url[-4]:
                    redirect(url+"/", code=302)
        except:
            pass
        favurl = rooturl+url
        favurl = "//"+favurl.split("/")[2]+"/favicon.txt"
        response.headers['Access-Control-Allow-Origin'] = '*'
        if request.query_string != "":
            req = ignition.request(rooturl+url+"?"+request.query_string)
        else:
            req = ignition.request(rooturl+url)
        try:
            favreq = ignition.request(favurl)
            if str(favreq).split(" ")[0].startswith("2"):
                favico = str(favreq).split("\n")[1]
        except:
            pass
        try:
            if str(req).split(" ")[0].startswith("1"):
                return template("input.tpl", input_text=str(req).split(" ")[1].split("\n")[0], gemurl=req.url.replace("gemini://", ""))
        except:
            pass
        try:
            rep = str(req.data())
            mime = str(req).split("\n")[0].split(" ")[1].split(";")[0]
        except:
            mime = "text/plain"
            images = [".jpg", ".png", ".gif", ".ico"]
            for i in images:
                if i in str(req.url):
                    mime = "image/"+url.split(".")[1]
            try:
                if "ods" in str(req.url) and not mime.startswith("image/"):
                    mime = "application/vnd.oasis.opendocument.spreadsheet"
                else:
                    if not mime.startswith("image/"):
                        response.content_type = mime+";charset=utf-8"
                        return "Not supported."
            except:
                pass
        if "text/gemini" in mime:
            body = rep
            lines = body.split("\n")
            parsedmd = ""
            for e in lines:
                if e.startswith("=>"):
                    link = e.replace("=> ", "").split(" ")[0]
                    text = " ".join(e.replace("=> ", "").split(" ")[1:])
                    parsedmd += "["+text+"]("+link+")"+"\n"
                else:
                    parsedmd += e+"\n"
            html = str(markdown(parsedmd, extensions=['fenced_code'])).replace("gemini://", "//")
            head = template("head.tpl")+template("proxyui", favicon=favico)
            f = open("tail.tpl", "r")
            tail = f.read()
            f.close()
            html = head+html+tail
            return html
        else:
            if mime.startswith("text"):
                rep = str(req.data())
                mime = str(req).split("\n")[0].split(" ")[1].split(";")[0]
                try:
                    response.content_type = mime+";charset=utf-8"
                except:
                    pass
                return req.raw_body
            else:
                if mime != "error":
                    response.content_type = mime
                    return req.raw_body

run(host="127.0.0.1", port=1970, server="tornado")