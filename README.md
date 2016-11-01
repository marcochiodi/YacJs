# YacJs
Yet Another Chart Js<br>

A simple javascript <del>jQuery</del> plugin for create 4 basic Charts: Bar, Pie, Line and Doughnut. 
Using SVG it has no other dependencies <del>unless jQuery</del>. 

#How to install
<ul>
<li>Add yac.min.js in your js folder</li>
<li>Reference it in your html file<br>
<code>
      <del>&lt;script type="text/javascript" src="js/jquery.min.js"&gt;&lt;/script&gt;</del>
</code><br>
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
                          class: "yourClass"
                      }, {
                          values: [553, 226, 189, 245, 268, 315],
                          color: "yellow",
                          class: "yourClass"
                      }, {
                          values: [443, 326, 289, 45, 28, 46],
                          color: "blue",
                          class: "yourClass"
                      }, {
                          values: [23, 126, 189, 245, 28, 456],
                          color: "green",
                          class: "yourClass"
                      }, ],
                      labels: ["January", "February", "March", "April", "May", "June"],
                      fill: true,
                      numbers: false,
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
                    label: "January",
                    class: "yourClass"
                }, {
                    value: 123,
                    fill: "green",
                    stroke: "white",
                    label: "February",
                    class: "yourClass"
                }, {
                    value: 232,
                    fill: "blue",
                    stroke: "white",
                    label: "March",
                    class: "yourClass"
                }, {
                    value: 160,
                    fill: "yellow",
                    stroke: "white",
                    label: "April",
                    class: "yourClass"
                }, {
                    value: 124,
                    fill: "purple",
                    stroke: "white",
                    label: "May",
                    class: "yourClass"
                }, {
                    value: 190,
                    fill: "magenta",
                    stroke: "white",
                    label: "June",
                    class: "yourClass"
                }, {
                    value: 60,
                    fill: "gray",
                    stroke: "white",
                    label: "July",
                    class: "yourClass"
                }, {
                    value: 30,
                    fill: "yellow",
                    stroke: "white",
                    label: "August",
                    class: "yourClass"
                }, {
                    value: 200,
                    fill: "green",
                    stroke: "white",
                    label: "September",
                    class: "yourClass"
                }],
                click: function(e) {
                    alert((e.target).getAttribute("label") + " - " + e.target.getAttribute("value"));
                },
                mouseover: function(e) {
                    //alert($(e.target).attr("label") + " - " + $(e.target).attr("value"));
                },
                numbers: true,
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
