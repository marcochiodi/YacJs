# YacJs
Yet Another Chart Js<br>

A simple javascript plugin for create 4 basic Charts: Bar, Pie, Line and Doughnut. 
Using SVG it has no other dependencies. 

#How to install
<ul>
<li>Add yac.min.js in your js folder</li>
<li>Reference it in your html file<br>
<code>
       &lt;script type="text/javascript" src="js/yac.js"&gt;&lt;/script&gt;
</code>
</li>
</ul>
#How to use
<ul>
<li>Add selector tag to your html:<br/>
  <pre>
    <code>
      &lt;div id="div_chart"&gt;&lt;/div&gt;
    </code>
  </pre>
</li>
<li>Declare your data object for multiline chart:<br>
  <pre>
    <code>
           var dataline = {
                columns: [{
                    values: [23, 526, 389, 145, 268, 345],
                    color: "red",
                    fill: "rgba(255,0,0,0.4)",
                    class: "animate-line",
                },
                {
                values: [123, 226, 289, 445, 268, 145],
                    color: "green",
                    fill: "rgba(0,255,0,0.0)"
                }
                ],
                labels: ["January", "February", "March", "April", "May", "June"],
                areafill: true,
                numbers: false,
                points: true,
                vline: true,
                click: function(e) {
                    alert((e.target).getAttribute("label") + " - " + e.target.getAttribute("value"));
                },
            }
    </code>
  </pre>
</li>
<li>Declare your data object for other charts:<br>
  <pre>
    <code>
       var data = {
                columns: [{
                    value: 20,
                    fill: "red",
                    stroke: "white",
                    class: "yourClass"
                }, {
                    value: 123,
                    fill: "green",
                    stroke: "white",
                    class: "yourClass"
                }, {
                    value: 232,
                    fill: "blue",
                    stroke: "white",
                    class: "yourClass"
                }, {
                    value: 160,
                    fill: "yellow",
                    stroke: "white",
                    class: "yourClass"
                }, {
                    value: 124,
                    fill: "purple",
                    stroke: "white",
                    class: "yourClass"
                }, {
                    value: 190,
                    fill: "magenta",
                    stroke: "white",
                    class: "yourClass"
                }, {
                    value: 60,
                    fill: "gray",
                    stroke: "white",
                    class: "yourClass"
                }, {
                    value: 30,
                    fill: "yellow",
                    stroke: "white",
                    class: "yourClass"
                }, {
                    value: 200,
                    fill: "green",
                    stroke: "white",
                    class: "yourClass"
                }],
                labels:["January","February","March","April","May","June","July","August","September"],
                click: function(e) {
                    alert((e.target).getAttribute("label") + " - " + e.target.getAttribute("value"));
                },
                numbers: false,
            }
    </code>
  </pre>
</li>
<li>
Choose your favourite chart between "bar","line","pie","doughnut" and add this:<br>
<pre><code>
  var chart = new yac("pie", "div_chart", data);
</code></pre>
</li>
</ul>
