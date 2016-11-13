(function () {
    "use strict";
    var type, selector, data;
    var viewportx = 600;
    var viewporty = 400;
    var wrapper, s; //wrapper and child;
    //svg elements
    var sE = {
        r: "rect",
        c: "circle",
        l: "line",
        t: "text",
        p: "polyline"
    }
    //bar chart 
    function bar(data) {
        var ncol = data.columns.length;
        var colw = parseInt(Math.floor(100 / ncol));
        var max = getMax(data.columns);
        max = roundMax(max);
        s.appendChild(generateAxis(max, data.labels, true));
        data.columns.forEach(function (e, i) {
            var px = (viewportx / ncol * i) + 5;
            var cl = makeSVG(sE.r, {
                x: px + 2,
                y: (viewporty - (viewporty / max * e.value)),
                //"stroke-width": "2",
                //stroke:e.stroke,
                fill: e.fill,
                width: (viewportx / ncol - 4),
                height: (viewporty / max * e.value),
                label: data.labels[i],
                value: e.value,
                class: "yac-tt " + e.class
            })

            if (data.numbers) {
                var lbvalue = makeSVG(sE.t, {
                    x: px + (viewportx / 2 / ncol),
                    y: (viewporty * 98 / 100) - (viewporty / max * e.value),
                    width: ((viewportx / ncol) - 1),
                    "text-anchor": "middle",
                    "alignment-baseline": "baseline"
                }, e.value);
                s.appendChild(data.labels[i]);
            }

            cl.addEventListener("click", data.click);
            addtt(cl);
            s.appendChild(cl);
        })
    }
    //pie chart
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

        data.columns.forEach(function (e, i) {
            var angle = 2 * Math.PI / totArr * e.value;
            var d = createSvgArc(cx, cy, k / 2, prev, (prev + angle));
            var path = makeSVG("path", {
                d: d,
                fill: e.fill,
                stroke: e.stroke,
                "stroke-width": 2,
                label: data.labels[i],
                value: e.value,
                class: "yac-tt " + e.class
            });
            path.addEventListener("click", data.click);
            addtt(path);
            var xa1, xa2, ya1, ya2;

            s.appendChild(path);
            if (data.numbers) {
                var a2 = getHalfArc(cx, cy, k / 2 + 20, prev, (prev + angle));
                var text = makeSVG(sE.t, { x: a2.x, y: a2.y, fill: "black", "text-anchor": "middle", "alignment-baseline": "middle" }, e.value);
                s.appendChild(text);
            }
            prev += angle;
        });
    }
    //doughnut chart
    function doughnut(data) {
        var k = viewporty;
        if (viewporty > viewportx) k = viewportx;
        k = k / 1.2;
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
        data.columns.forEach(function (e, i) {
            var v = e.value * tot / totArr;
            var circle = makeSVG(sE.c, {
                r: k / 3,
                cx: cx,
                cy: cy,
                "stroke-width": k / 6,
                "stroke-dasharray": v + "  " + tot,
                "stroke-dashoffset": -prev,
                stroke: e.fill,
                label: data.labels[i],
                value: e.value,
                class: "yac-tt " + e.class,
                fill: "none"
            });
            circle.addEventListener("click", data.click);
            circle.addEventListener("mouseover", function () {
                this.setAttribute("stroke-width", k / 5);
                text.innerHTML = this.getAttribute("label") + ": " + this.getAttribute("value");
            })
            circle.addEventListener("mouseout", function () {
                this.setAttribute("stroke-width", k / 6);
                text.innerHTML = "";
            })


            s.appendChild(circle);
            prev += v;
        })
        s.appendChild(text);
    }
    //line/multiline chart
    function line(data) {
        var ncol = data.labels.length - 1;
        var max = 0;
        //get max value between all arrays
        data.columns.forEach(function (e, i) {
            var m = Math.max.apply(Math, e.values);
            if (m > max) max = m;
        });

        max = roundMax(max);
        var u = 100 / max;
        s.appendChild(generateAxis(max, data.labels));
        data.columns.forEach(function (element, index) {
            var ox = "0";
            var oy = viewporty;
            var points = "";
            var areapoints = "";
            var color = ((data.areafill) ? element.color : "none");
            var arr_points = [];
            element.values.forEach(function (e, i) {
                ox = (viewportx / ncol * i);
                oy = (viewporty - (viewporty / max * e));
                //vertical line for chart
                if (data.vline && i != 0) {
                    var vline = makeSVG(sE.l, {
                        x1: ox,
                        x2: ox,
                        y1: 0,
                        y2: "100%",
                        stroke: "#888888",
                        "stroke-width": 0.5,
                        "stroke-dasharray": "5, 5"
                    });
                    s.appendChild(vline);
                }
                //points
                if (data.points) {
                    var cl = makeSVG(sE.c, {
                        cx: ox,
                        cy: oy,
                        stroke: "white",
                        "stroke-width": 1,
                        fill: element.color,
                        r: "5",
                        label: data.labels[i],
                        value: e,
                        class: "yac-tt " + element.class
                    })
                    arr_points.push(cl);
                }
                //numbers near points
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
                points += ox + "," + oy + " ";
            });
            //create filled area of the line
            if (data.areafill) {
                areapoints = 0 + "," + viewporty + " " + points + " " + ox + "," + viewporty;
                var al = makeSVG(sE.p, {
                    "stroke-width": 0,
                    fill: element.fill,
                    points: areapoints,
                    class: element.class
                });
                s.appendChild(al);
            }
            //line
            var l = makeSVG(sE.p, {
                stroke: element.color,
                "stroke-width": 3,
                fill: "none",
                points: points,
                class: element.class
            });
            s.appendChild(l);
            //append all points
            arr_points.forEach(function (e, i) {
                s.appendChild(e);
                e.addEventListener("click", data.click);
                addtt(e);
            })
            data.vline = false;
        })
    }
    //singlevalue
    function singlevalue(data) {
        var r = viewporty / 2 * 0.9;
        var c = Math.PI * r;
        var value = makeSVG(sE.t, {
            x: "50%",
            y: "50%",
            "text-anchor": "middle",
            "alignment-baseline": "middle",
            fill: "black",//data.fill,
            "style": "font-size:50px;",
            //"stroke-width": "1",
            //"stroke":"black"
        }, data.value);
        var label = makeSVG(sE.t, {
            x: "50%",
            y: "100%",
            "text-anchor": "middle",
            "alignment-baseline": "text-before-edge",
            "dominant-baseline": "hanging",
            fill: "black",
            "style": "font-size:40px;",
        }, data.label);
        var basecircle = makeSVG(sE.c, {
            r: r,
            cx: "50%",
            cy: "50%",
            "stroke-width": "5%",
            stroke: "#eeeeee",
            fill: "none",
        });
        var circle = makeSVG(sE.c, {
            r: r,
            cx: "50%",
            cy: "50%",
            "stroke-width": "5%",
            "stroke-dasharray": data.animate? 0 + " " + c * 2 : c * data.pct * 2 / 100 + " " + c * 2,
            stroke: data.fill,
            style: "transition: stroke-dasharray 1.0s ease;",
            fill: "none",
            dasharrayto: c * data.pct * 2 / 100 + " " + c * 2
        });
        s.appendChild(basecircle);
        s.appendChild(circle);
        s.appendChild(value);
        s.appendChild(label);

    }
    //main wrapper
    function getWrapper() {
        return makeSVG("svg", {
            x: 0,
            y: 0,
            width: "100%",
            height: "100%"
        });

    }
    //real wrapper of chart
    function getChildWrapper(fullsize) {
        return makeSVG("svg", {
            x: (fullsize) ? "0" : "10%",
            y: (fullsize) ? "0" : "5%",
            width: (fullsize)? "100%" : "80%",
            height: (fullsize)? "100%" : "80%",
            //fill: "#22222",
            style: "overflow:visible;",
            viewBox: "0 0 " + viewportx + " " + viewporty
        });
    }
    //create an svg element passing name of the tag, and it's attributes as object
    function makeSVG(tag, attrs, value, notsvg) {
        var el;
        if (notsvg) {
            el = document.createElement(tag);
        } else {
            el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        }

        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        if (value != null) {
            el.innerHTML = value;
        }
        return el;
    }
    //generate axis x / y group
    function generateAxis(max, labels, barchart) {
        var n = 4;
        var g = makeSVG("g");
        var liney = makeSVG(sE.l, { x1: "0%", x2: "0%", y1: "0%", y2: "100%", stroke: "#888888", "stroke-width": 1 });
        var linex = makeSVG(sE.l, { x1: "0%", x2: "105%", y1: "100%", y2: "100%", stroke: "#888888", "stroke-width": 1 });
        g.appendChild(liney);
        g.appendChild(linex);
        //unit dotted lines
        for (var c = 0; c < n; c++) {
            var h = c * 100 / n + "%";
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
                parseInt((n - c) * (max / 100) * (100 / n)) + "&nbsp;"
            )
            g.appendChild(ln);
            g.appendChild(txt);
        }
        if (labels.length > 0) {
            var ncol = (barchart) ? labels.length : labels.length - 1;
            var w = (100 / ncol);
            labels.forEach(function (e, i) {
                var lb = makeSVG(sE.t, {
                    x: (barchart) ? ((w * i) + (w / 2)) + "%" : (w * i) + "%",
                    y: "100%",
                    width: w + "%",
                    "text-anchor": "middle",
                    "alignment-baseline": "text-before-edge",
                    "dominant-baseline": "hanging",
                    class: "baselabel",
                    label: labels[i],
                    value: "",
                }, ((labels[i].length > 8) ? labels[i].substr(0, 10) + "..." : labels[i]));
                g.appendChild(lb);
                addtt(lb);
            })
        }
        return g
    }
    //get max of array
    function getMax(arr) {
        var max = 0;
        arr.forEach(function (item, i) {
            if (item.value > max) max = item.value;
        });

        return max;
    }
    //round up number
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
    //get total of array
    function getTot(arr) {
        var tot = 0;
        arr.forEach(function (item, i) {
            tot += item.value;
        });
        return tot;
    }
    //get arc
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
    //get half arc between 2 angle
    function getHalfArc(x, y, r, startAngle, endAngle) {
        var ang = startAngle + ((endAngle - startAngle) / 2);
        var xa = x + Math.cos(ang) * r;
        var ya = y - (Math.sin(ang) * r);
        return { x: xa, y: ya };
    }
    //create tooltip
    function createTooltip() {
        if (document.getElementsByClassName("yac-tooltip").length == 0) {
            var tt = makeSVG("div", {
                style: 'display:none;' +
                    'opacity:0.8;' +
                    'position:absolute;' +
                    'min-width:50px;' +
                    'padding:5px;' +
                    'border-radius:2px;' +
                    'background-color:black;' +
                    'min-height:30px;' +
                    'top:0;' +
                    'left:0;' +
                    'color:white;' +
                    'text-align:center;' +
                    'z-index:999;' +
                    '},null,true);' +
                    'tt.classList.add("yac-tooltip");' +
                    'document.body.appendChild(tt);'
            }, null, true);
            tt.classList.add("yac-tooltip");
            document.body.appendChild(tt);
        }
    }
    //tooltip event handler
    function addtt(elem) {
        elem.addEventListener("mouseover", function (e) {
            ttOver(e, this);
        });
        elem.addEventListener("mouseout", function (e) {
            ttOut(e, this);
        });
        elem.addEventListener("touchstart", function (e) {
            ttTouchOver(e, this);
        });
        elem.addEventListener("touchend", function (e) {
            ttOut(e, this);
        });
    }
    //tooltip touch event
    function ttTouchOver(e, elem) {
        var cursorX = e.touches[0].pageX;
        var cursorY = e.touches[0].pageY;
        var tt = document.getElementsByClassName("yac-tooltip");
        tt[0].style.display = "block";
        tt[0].style.left = cursorX + "px";
        tt[0].style.top = (cursorY - 50) + "px";
        tt[0].innerHTML = elem.getAttribute("label") + "<br>" + elem.getAttribute("value");
    }
    //tooltip mouseover event
    function ttOver(e, elem) {
        var cursorX = e.pageX;
        var cursorY = e.pageY;
        var tt = document.getElementsByClassName("yac-tooltip");
        tt[0].style.display = "block";
        tt[0].style.left = cursorX + "px";
        tt[0].style.top = cursorY + "px";
        tt[0].innerHTML = elem.getAttribute("label") + "<br>" + elem.getAttribute("value");
    }
    //tooltip mouseout event
    function ttOut(e, elem) {
        var tt = document.getElementsByClassName("yac-tooltip");
        tt[0].style.display = "none";
    }
    //rotate labels on x axis if are too long
    function fixBaseLabel(arr_base_labels) {
        var rotatebl = false;
        for (var i = 0; i < arr_base_labels.length; i++) {
            if (arr_base_labels[i].getBBox().width > arr_base_labels[i].attributes["width"].value) {
                rotatebl = true;
            }
        }
        if (arr_base_labels.length > 6) {
            rotatebl = true;
        }
        if (rotatebl) {
            for (var i = 0; i < arr_base_labels.length; i++) {
                arr_base_labels[i].setAttribute("transform", "rotate(25 " + arr_base_labels[i].getBBox().x + " " + arr_base_labels[i].getBBox().y + ")");
                arr_base_labels[i].setAttribute("text-anchor", "right");
            }
        }
    }
    Number.prototype.ceilTo = function (nTo) {
        nTo = nTo || 10;
        return Math.ceil(this * (1 / nTo)) * nTo;
    }
    window.yac = function (t, sel, d) {
        createTooltip();
        selector = document.getElementById(sel);
        viewportx = (selector.offsetWidth > 0) ? selector.offsetWidth : viewportx;
        viewporty = (selector.offsetHeight > 0) ? selector.offsetHeight : viewporty;
        if (d.viewportx)
            viewportx = d.viewportx;
        if (d.viewporty)
            viewporty = d.viewporty;
        type = t;
        data = d;
        s = getChildWrapper(d.fullsize);
        wrapper = getWrapper();

        switch (type) {
            case "bar":
                bar(data);
                break;
            case sE.l:
                line(data);
                break;
            case "pie":
                pie(data);
                break;
            case "doughnut":
                doughnut(data);
                break;
            case "singlevalue":
                singlevalue(data);
                break;

        }

        wrapper.appendChild(s);
        selector.appendChild(wrapper);
        var arr_base_labels = selector.getElementsByClassName("baselabel");
        if (arr_base_labels.length > 0) {
            fixBaseLabel(arr_base_labels);
        }
    }
})();