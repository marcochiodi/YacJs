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
<li>Declare your data object:<br>
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
                }],
                click: function(e) {
                    alert((e.target).getAttribute("label") + " - " + e.target.getAttribute("value"));
                }
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
