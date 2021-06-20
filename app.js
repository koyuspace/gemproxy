$(document).ready(function() {
    //Initial variables
    var widgetcount = 0;
    //Initialize localStorage
    if (localStorage.getItem("inlineimg-enabled") === null) {
        localStorage.setItem("inlineimg-enabled", "true");
    }
    if (localStorage.getItem("twemoji-enabled") === null) {
        localStorage.setItem("twemoji-enabled", "true");
    }
    if (localStorage.getItem("menu-enabled") === null) {
        localStorage.setItem("menu-enabled", "false");
    }
    //Current Gemini URL
    var gemurl = location.href.split("/")[3];
    var slashcount = location.href.split("/").length - 1;
    if (slashcount > 3) {
        $("#addressbar").attr("value", "gemini:/"+location.pathname);
    } else {
        $("#addressbar").attr("value", "gemini://geminispace.info/"+gemurl);
    }
    $("#gemurl").attr("href", $("#addressbar").val());
    $("#gemurl").html($("#addressbar").val());
    //Open http links in new tab
    $("body").html($("body").html().replaceAll("href=\"https://", "target=\"_blank\" href=\"https://"));
    //Display inline-images
    if (localStorage.getItem("inlineimg-enabled") === "true") {
        $('a[href*=".jpg"]').each(function() {
            $(this).html("<img src=\""+$(this).attr("href")+"\" width=\"300\">");
            $(this).attr("target", "_blank");
        });
        $('a[href*=".png"]').each(function() {
            var width = "300";
            //Fix for koyu's selfie
            if ($(this).attr("href") === "me.png") {
                width = 200;
            }
            $(this).html("<img src=\""+$(this).attr("href")+"\" width=\""+width+"\" alt=\""+$(this).html()+"\" title=\""+$(this).html()+"\">");
            $(this).attr("target", "_blank");
        });
    }
    //Article metadata below article title
    $("body").html($("body").html().replaceAll("<p>Posted on ", "<p class=\"published\">Posted on "));
    //Input handler
    window.setTimeout(() => {
        $("#inputtext").focus();
        $("#inputtext").keypress((e) => {
            if (e.which == 13) {
                if ($("#inputtext").val().replaceAll(" ", "") !== "") {
                    location.href = location.href+"?"+$("#inputtext").val();
                    e.preventDefault();
                }
            }
        });
    }, 500);
    //Address bar handler
    $("#addressbar").keypress((e) => {
        if (e.which == 13) {
            if ($("#addressbar").val().replaceAll(" ", "") !== "") {
                var newlocation = "/"+$("#addressbar").val().replace("gemini://", "")+"/";
                location.href = newlocation.replaceAll("//", "/");
                e.preventDefault();
            }
        }
    });
    //Settings handler
    $("#check-inlineimg").click(() => {
        localStorage.setItem("inlineimg-enabled", $("#check-inlineimg").is(':checked'));
    });
    $("#check-twemoji").click(() => {
        localStorage.setItem("twemoji-enabled", $("#check-twemoji").is(':checked'));
    });
    $("#check-menu").click(() => {
        localStorage.setItem("menu-enabled", $("#check-menu").is(':checked'));
    });
    $("#check-inlineimg").prop("checked", (localStorage.getItem("inlineimg-enabled") === "true"));
    $("#check-twemoji").prop("checked", (localStorage.getItem("twemoji-enabled") === "true"));
    $("#check-menu").prop("checked", (localStorage.getItem("menu-enabled") === "true"));
    //Proper URL handling
    var host = $("#addressbar").val().split("gemini://")[1].split("/")[0];
    $("#content").html($("#content").html().replaceAll("<a href=\"/", "<a href=\"/"+host+"/"));
    $('a').each(function() {
        $(this).attr("href", function(index, old) {
            return old.replace("/"+host+"//", "/");
        });
  });
    //Table of Contents
    //Taken from https://medium.com/codefile/an-automatic-table-of-contents-generator-in-javascript-3f56220c9397
    var headers = document.getElementsByTagName("h2");
    if (localStorage.getItem("menu-enabled") === "true") {
        menu = document.getElementById("menu");
        menuHeader = document.createElement("h1");
        menuHeader.innerText="Menu";
        var menuList = document.createElement("ul");
        menu.appendChild(menuHeader);
        for (i = 0; i < headers.length; i++){
            var name = "h"+i;
            headers[i].id=name;
            menuListItem = document.createElement("li");
            var menuEntry = document.createElement("a");
            menuEntry.setAttribute("href","#"+name);
            menuEntry.innerText=headers[i].innerText;
            menuListItem.appendChild(menuEntry);
            menuList.appendChild(menuListItem);
        }
        menu.appendChild(menuList);
    }
    //Widgets logic
    if (headers.length > 0) {
        widgetcount = 1;
    }
    if (widgetcount === 0) {
        $("#widgets").hide();
    }
    //Page title
    var title = $("h1").html();
    if (title === undefined) {
        var title = $("#addressbar").val().split("gemini://")[1].split("/")[0];
    }
    document.title = title+" – "+document.title;
    //Parse Twemoji
    if (localStorage.getItem("twemoji-enabled") === "true") {
        $("body").html(twemoji.parse($("body").html()));
    }
    //Scroll to page after menu has been loaded
    window.setTimeout(function() {
        try {
            document.getElementById(location.href.split("#")[1]).scrollIntoView();
        } catch (e) {}
    }, 1000);
});
