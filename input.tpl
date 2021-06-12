% include('head.tpl')
% include('proxyui.tpl', favicon='📄')
<h1>Input from {{gemurl}}: {{input_text}}</h1>
<input type="text" id="inputtext" style="width:50%;display:block;margin:0 auto;">
% include('tail.tpl')