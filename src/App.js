import React from 'react';
import './App.css';
import config from './config.json';
import $ from 'jquery';
import twemoji from 'twemoji';

const parse = require('gemini-to-html/parse')
const render = require('gemini-to-html/render')


export default class App extends React.Component {
  componentDidMount() {
    //Git info
    $.get(config.backend+"gitid", function(data) {
      $("#git-id").html(data);
    })
    //Current Gemini URL
    var gemurl = window.location.href.split("/")[3];
    var slashcount = window.location.href.split("/").length - 1;
    if (slashcount > 2) {
        $("#addressbar").attr("value", "gemini:/"+window.location.href.replaceAll(window.location.protocol+"//"+window.location.host, ""));
    } else {
        $("#addressbar").attr("value", "gemini://geminispace.info/"+gemurl);
    }
    if (!$("#addressbar").val().includes(".")) {
      $("#addressbar").val($("#addressbar").val().replaceAll("gemini://", "gemini://geminispace.info/"));
    }
    console.log($("#addressbar").val().split("/").length);
    if ($("#addressbar").val().split("/").length - 1 < 3) {
      window.location.href = window.location.href+"/";
    }
    $("#gemurl").attr("href", $("#addressbar").val());
    $("#gemurl").html($("#addressbar").val());
    if (!$("#addressbar").val().replaceAll("gemini://", "").includes(".jpg") && !$("#addressbar").val().replaceAll("gemini://", "").includes(".png")) {
      $.get(config.backend+"get/"+$("#addressbar").val().replaceAll("gemini://", "").split("/")[0]+"/favicon.txt", function(data) {
        if (!data.includes("# Error ")) {
          $("#favicon").html(data);
          $("#favicon").html(twemoji.parse($("#favicon").html()));
        }
      });
      $.get(config.backend+"get/"+$("#addressbar").val().replaceAll("gemini://", "").replaceAll("?", "$"), function(data) {
        if (!data.startsWith("$$$input$$$")) {
          var parsed = parse(data);
          var content = "";
          if ($("#addressbar").val().replaceAll("gemini://", "").split("/")[0] !== "geminispace.info") {
            content = render(parsed).replaceAll("href=\"/", "href=\"");
          } else {
            content = render(parsed);
          }
          //Open external links in new tab
          content = content.replaceAll("href=\"https://", "target=\"_blank\" href=\"https://");
          //Output page
          $("#content").html(content);
          //Parse URLs
          $('#content a[href*="gemini://"]').each(function() {
            $(this).attr("href", $(this).attr("href").replaceAll("gemini://", "/"))
          });
          //Display inline-images
          $('a[href*=".jpg"]').each(function() {
            var cwd = "";
            if (!$(this).attr("href").replace("//", "/").includes("gemini:/")) {
              cwd = $("#addressbar").val().split("/");
              cwd.pop();
              cwd = cwd.join("/").replace("gemini://", "");
            }
            var styles = "";
            if ($(this).html().includes("_right")) {
              styles = "float:right;padding:5px;";
            }
            var imguri = config.backend+"get/"+$(this).attr("href").replace("//", "/");
            imguri = imguri.replaceAll("/gemini:/", "").replaceAll("//", "/").replaceAll(":/", "://");
            if (!imguri.replaceAll(config.backend+"get/", "").includes("/")) {
              imguri = config.backend+"get/"+cwd+"/"+imguri.replaceAll(config.backend+"get/", "");
            }
            $(this).html("<img src=\""+imguri+"\" style=\""+styles+"\" width=\"300\">");
            $(this).attr("target", "_blank");
            $(this).attr("href", imguri);
            $(this).attr("style", "border:0;");
          });
          $('a[href*=".png"]').each(function() {
            var cwd = "";
            if (!$(this).attr("href").replace("//", "/").includes("gemini:/")) {
              cwd = $("#addressbar").val().split("/");
              cwd.pop();
              cwd = cwd.join("/").replace("gemini://", "");
            }
            var styles = "";
            if ($(this).html().includes("_right")) {
              styles = "float:right;padding:5px;";
            }
            var imguri = config.backend+"get/"+$(this).attr("href").replace("//", "/");
            imguri = imguri.replaceAll("/gemini:/", "").replaceAll("//", "/").replaceAll(":/", "://");
            if (!imguri.replaceAll(config.backend+"get/", "").includes("/")) {
              imguri = config.backend+"get/"+cwd+"/"+imguri.replaceAll(config.backend+"get/", "");
            }
            $(this).html("<img src=\""+imguri+"\" style=\""+styles+"\" width=\"300\">");
            $(this).attr("target", "_blank");
            $(this).attr("href", imguri);
            $(this).attr("style", "border:0;");
          });
        } else {
          $.get(config.backend+"get/"+$("#addressbar").val().replaceAll("gemini://", "").replaceAll("?", "$"), function(cnt) {
            $.get("/input.html", function(data) {
              $("#content").html(data.replaceAll("%title%", cnt.replaceAll("$$$input$$$ ", "").replaceAll("$$$input$$$", "")));
            });
          });
        }
        $("#content").html(twemoji.parse($("#content").html()));
        if ($("h1").html() !== undefined) {
          document.title = $("h1").html()+" - GemProxy";
        }
      });
    } else {
      $("html").html("<img src=\""+config.backend+"get/"+$("#addressbar").val().replaceAll("gemini://", "").replaceAll("?", "$")+"\">");
    }
    //Address bar handler
    $("#addressbar").keypress((e) => {
      if (e.which === 13) {
          if ($("#addressbar").val().replaceAll(" ", "") !== "") {
              var newlocation = "/"+$("#addressbar").val().replace("gemini://", "")+"/";
              window.location.href = newlocation.replaceAll("//", "/");
              e.preventDefault();
          }
      }
    });
    //Input handler
    window.setTimeout(() => {
      $("#inputtext").focus();
      $("#inputtext").keypress((e) => {
          if (e.which === 13) {
              if ($("#inputtext").val().replaceAll(" ", "") !== "") {
                  window.location.href = window.location.href+"?"+$("#inputtext").val();
                  e.preventDefault();
              }
          }
      });
    }, 500);
  }

  render() {
    return (
      <div className="App">
        <p><a href=".." id="oneup" style={{marginLeft: "20px"}}>&uarr; One up</a> | <a href="/search" id="search"><i className="fa fa-search" aria-hidden="true"></i> Search</a></p>
        <div id="proxyui">
            <span id="favicon"></span><input type="text" id="addressbar" style={{width: "100%"}} autoComplete="off" />
        </div>
        <div id="content">
          Loading...
        </div>
        <hr />
        <p>♊️ Proxied content from <a id="gemurl" href="gemini://geminispace.info">gemini://geminispace.info</a></p>
        <p>GemProxy v{process.env.REACT_APP_VERSION} (<span id="git-id"></span>) | <a href="https://github.com/koyuspace/gemproxy" target="_blank" rel="noreferrer"><i className="fa fa-github" aria-hidden="true"></i> Source code</a> | <a href="https://creapaid.com/koyuspace" target="_blank" rel="noreferrer"><i className="fa fa-heart" aria-hidden="true"></i> Donate</a></p>
      </div>
    );
  }
}