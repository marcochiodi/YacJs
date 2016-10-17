(function() {
    "use strict";
    var type, selector, data;
    var viewportx = 600;
    var viewporty = 400;
    var wrapper, s; //wrapper and child;
    //svg elements
    var sE={
        r:"rect",
        c:"circle",
        l:"line",
        t:"text",
        p:"polyline"
    }
    function bar(data) {
        var ncol = data.columns.length;
        var colw = parseInt(Math.floor(100 / ncol));
        var max = getMax(data.columns);
        max = roundMax(max);
        s.appendChild(generateAxis(max));
        data.columns.forEach(function(e, i) {
            var px = (viewportx / ncol * i) + 5;
            var cl = makeSVG(sE.r, {
                x: px + 2,
                y: (viewporty - (viewporty / max * e.value)),
                "stroke-width": "2",
                fill: e.fill,
                width: (viewportx / ncol - 4),
                height: (viewporty / max * e.value),
                label: e.label,
                value: e.value,
                class: "yac-slice " + e.class
            })
            var lb = makeSVG(sE.t, {
                x: px + (viewportx / 2 / ncol),
                y: viewporty,
                width: ((viewportx / ncol) - 1),
                height: "auto",
                "text-anchor": "middle",
                "alignment-baseline": "text-before-edge"
            }, e.label);
            if (data.numbers) {
                var lbvalue = makeSVG(sE.t, {
                    x: px + (viewportx / 2 / ncol),
                    y: (viewporty * 98 / 100) - (viewporty / max * e.value),
                    width: ((viewportx / ncol) - 1),
                    "text-anchor": "middle",
                    "alignment-baseline": "baseline"
                }, e.value);
                s.appendChild(lbvalue);
            }

            cl.addEventListener("click", data.click);
            cl.addEventListener("mouseover", data.mouseover);
            s.appendChild(cl);
            s.appendChild(lb);

        })
    }
    function pie(data) {
        var k = viewporty;
        if (viewporty > viewportx) k = viewportx;
        k = k / 1.5;
        var cx = viewportx / 2;
        var cy = viewporty / 2;
        var ncol = data.columns.length + 2;
        var tot = k * Math.PI;
        var totArr = getTot(data.columns);
        var prev = 0;

        data.columns.forEach(function(e, i) {
            var angle = 2 * Math.PI / totArr * e.value;
            var d = createSvgArc(cx, cy, k / 2, prev, (prev + angle));
            var path = makeSVG("path", {
                d: d,
                fill: e.fill,
                stroke: e.stroke,
                "stroke-width": 2,
                label: e.label,
                value: e.value,
                class: e.class
            });
            path.addEventListener("click", data.click);
            path.addEventListener("mouseover", data.mouseover);
            var xa1, xa2, ya1, ya2;


            s.appendChild(path);
            if (data.numbers) {
                var a1 = getHalfArc(cx, cy, k / 2, prev, (prev + angle));
                var a2 = getHalfArc(cx, cy, k / 2 + 50, prev, (prev + angle));
                var line = makeSVG(sE.l, { x1: a1.x, y1: a1.y, x2: a2.x, y2: a2.y, stroke: "black" });
                var text = makeSVG(sE.t, { x: a2.x, y: a2.y, fill: "black" }, e.value);
                s.appendChild(text);
                var backbox = text.getBBox();
                var r = makeSVG(sE.r, {
                    x: backbox.x - 5,
                    y: backbox.y - 3,
                    width: backbox.width + 10,
                    height: backbox.height + 6,
                    fill: "#eeeeee",
                    stroke: "black"
                });
                s.appendChild(line);
                s.appendChild(r);
                s.appendChild(text);
            }
            prev += angle;
        });
    }
    function doughnut(data) {
        var k = viewporty;
        if (viewporty > viewportx) k = viewportx;
        var cx = viewportx / 2;
        var cy = viewporty / 2;

        var ncol = data.columns.length + 2;
        var tot = k / 1.5 * Math.PI;
        var totArr = getTot(data.columns);
        var prev = 0;
        var text = makeSVG(sE.t, {
            x: cx,
            y: cy,
            "text-anchor": "middle",
            "alignment-baseline": "middle",
            fill: "black"
        }, "");
        data.columns.forEach(function(e, i) {
            var v = e.value * tot / totArr;
            var circle = makeSVG(sE.c, {
                r: k / 3,
                cx: cx,
                cy: cy,
                "stroke-width": k / 6,
                "stroke-dasharray": v + "  " + tot,
                "stroke-dashoffset": -prev,
                stroke: e.fill,
                label: e.label,
                value: e.value,
                class: e.class,
                fill: "none"
            });
            circle.addEventListener("click", data.click);
            circle.addEventListener("mouseover", function() {
                    this.setAttribute("stroke-width", k / 5);
                    text.innerHTML = this.getAttribute("label") + ": " + this.getAttribute("value");
                }) //data.mouseover);
            circle.addEventListener("mouseout", function() {
                    this.setAttribute("stroke-width", k / 6);
                    text.innerHTML = "";
                }) //data.mouseover);


            s.appendChild(circle);
            prev += v;
        })
        s.appendChild(text);
    }
    function line(data) {
        var ncol = data.labels.length - 1;
        var max = 0; //getMax(data.columns[0]);
        data.columns.forEach(function(e,i){
            var m = Math.max.apply(Math,e.values);
            if (m > max) max = m; 
        });

        max = roundMax(max);
        var u = 100 / max;
        s.appendChild(generateAxis(max));
        data.columns.forEach(function(element, index) {
            var ox = "0";
            var oy = viewporty;
            var points = ox + "," + oy + " ";
            var color = ((data.fill) ? element.color : "none");
            element.values.forEach(function(e, i) {
                ox = (viewportx / ncol * i);
                oy = (viewporty - (viewporty / max * e));
                if (data.points) {
                    var cl = makeSVG(sE.c, {
                        cx: ox,
                        cy: oy,
                        stroke: "white",
                        "stroke-width": 2,
                        fill: element.color,
                        r: "5",
                        //label: data.labels[i],
                        value: e,
                    })
                    s.appendChild(cl);
                }
                if (data.numbers) {
                    var lbvalue = makeSVG(sE.t, {
                        x: ox,
                        y: (viewporty * 98 / 100) - (viewporty / max * e),
                        width: (viewportx / ncol),
                        "text-anchor": "middle",
                        "alignment-baseline": "baseline"
                    }, e);
                    s.appendChild(lbvalue);
                };


                if (index == 0) {
                    var lb = makeSVG(sE.t, {
                        x: ox,
                        y: viewporty,
                        "text-anchor": "middle",
                        "alignment-baseline": "text-before-edge"
                    }, data.labels[i]);
                    s.appendChild(lb);
                }

                points += ox + "," + oy + " ";
            });
            points += ox + "," + viewporty;
            var l = makeSVG(sE.p, {
                stroke: element.color,
                "stroke-width": 3,
                fill: color,
                points: points,
                class: element.class
            });
            s.appendChild(l);
        })
    }
    function getWrapper(){
        return makeSVG("svg", {
            x: 0,
            y: 0,
            width: "100%",
            height: "100%"
        });
        
    }
    function getChildWrapper(){
        return makeSVG("svg", {
            x: "5%",
            y: "5%",
            width: "90%",
            height: "90%",
            fill: "#22222",
            style: "overflow:visible;",
            viewBox: "0 0 " + viewportx + " " + viewporty
        });
    }
    function makeSVG(tag, attrs, value) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        if (value != null) {
            el.innerHTML = value;
        }
        return el;
    }
    function generateAxis(max) {
        var g = makeSVG("g");
        var liney = makeSVG(sE.l, { x1: "0%", x2: "0%", y1: "0%", y2: "100%", stroke: "#888888", "stroke-width": 1 });
        var linex = makeSVG(sE.l, { x1: "0%", x2: "105%", y1: "100%", y2: "100%", stroke: "#888888", "stroke-width": 1 });
        g.appendChild(liney);
        g.appendChild(linex);
        //unit dotted lines
        for (var c = 0; c < 10; c++) {
            var h = c * 10 + "%";
            var ln = makeSVG(sE.l, {
                x1: "0%",
                x2: "105%",
                y1: h,
                y2: h,
                stroke: "#888888",
                "stroke-width": 0.5,
                "stroke-dasharray": "5, 5"
            });
            var txt = makeSVG(sE.t, {
                    x: "0%",
                    y: h,
                    "alignment-baseline": "middle",
                    "text-anchor": "end"
                },
                parseInt((10 - c) * (max / 100) * 10) + "&nbsp;"
            )
            g.appendChild(ln);
            g.appendChild(txt);
        }
        return g
    }
    function getMax(arr) {
        var max = 0;
        arr.forEach(function(item, i) {
            if (item.value > max) max = item.value;
        });

        return max;
    }
    function roundMax(max) {
        if (max < 10)
            max = max.ceilTo(1);
        else
        if (max < 100)
            max = max.ceilTo(10);
        else
        if (max < 1000)
            max = max.ceilTo(100);
        else
            max = max.ceilTo(100);
        return max;
    }
    function getTot(arr) {
        var tot = 0;
        arr.forEach(function(item, i) {
            tot += item.value;
        });
        return tot;
    }
    function createSvgArc(x, y, r, startAngle, endAngle) {
        if (startAngle > endAngle) {
            var s = startAngle;
            startAngle = endAngle;
            endAngle = s;
        }
        if (endAngle - startAngle > Math.PI * 2) {
            endAngle = Math.PI * 1.99999;
        }

        var largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;
        var ang = startAngle + ((endAngle - startAngle) / 2);
        var xa = x + 10 + Math.cos(ang) * r;
        var ya = y + 10 - (Math.sin(ang) * r);
        return ['M', x, y,
            'L', x + Math.cos(startAngle) * r, y - (Math.sin(startAngle) * r),
            'A', r, r, 0, largeArc, 0, x + Math.cos(endAngle) * r, y - (Math.sin(endAngle) * r),
            'L', x, y
        ].join(' ');
    }
    function getHalfArc(x, y, r, startAngle, endAngle) {
        var ang = startAngle + ((endAngle - startAngle) / 2);
        var xa = x + Math.cos(ang) * r;
        var ya = y - (Math.sin(ang) * r);
        return { x: xa, y: ya };
    }
    Number.prototype.ceilTo = function(nTo) {
        nTo = nTo || 10;
        return Math.ceil(this * (1 / nTo)) * nTo;
    }
    window.yac = function(t, sel, d) {
        type = t;
        selector = sel;
        data = d;
        s = getChildWrapper();
        wrapper = getWrapper();

        switch (type) {
            case "bar":
                selector = bar(data);
                break;
            case sE.l:
                selector = line(data);
                break;
            case "pie":
                selector = pie(data);
                break;
            case "doughnut":
                selector = doughnut(data);
                break;
        }

        wrapper.appendChild(s);
        document.getElementById(sel).appendChild(wrapper);
    }
})();