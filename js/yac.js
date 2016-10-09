(function($) {
    "use strict";
    $.fn.yac = function(type, data) {
        var selector = this;
        switch (type) {
            case "bar":
                selector = bar(selector, data);
                break;
            case "line":
                selector = line(selector, data);
                break;
            case "pie":
                selector = pie(selector, data);
                break;
            case "doughnut":
                selector = doughnut(selector, data);
                break;
        }
        return selector;
    }

    function bar(selector, data) {
        var wrapper = makeSVG("svg", { x: 0, y: 0, width: "100%", height: "100%", viewBox: "0 0 800 600" });
        var s = makeSVG("svg", { x: "5%", y: "5%", width: "90%", height: "90%", fill: "#22222", style: "overflow:visible;" });
        wrapper = $(wrapper);
        s = $(s);
        var ncol = data.columns.length;
        var colw = parseInt(Math.floor(100 / ncol));
        var max = getMax(data.columns);
        max = roundMax(max);

        var u = 100 / max;
        //axis
        var liney = makeSVG("line", { x1: "0%", x2: "0%", y1: "0%", y2: "100%", stroke: "#888888", "stroke-width": 1 });
        var linex = makeSVG("line", { x1: "0%", x2: "105%", y1: "100%", y2: "100%", stroke: "#888888", "stroke-width": 1 });
        s.append(liney);
        s.append(linex);
        //unit dotted lines
        for (var c = 0; c < 11; c++) {
            var h = c * 10 + "%";
            var ln = makeSVG("line", {
                x1: "0%",
                x2: "105%",
                y1: h,
                y2: h,
                stroke: "#888888",
                "stroke-width": 0.5,
                "stroke-dasharray": "5, 5"
            });
            var txt = makeSVG("text", {
                    x: "0%",
                    y: h,
                    "alignment-baseline": "middle",
                    "text-anchor": "end"
                },
                ((10 - c) * (max / 100) * 10).toFixed(1) + "&nbsp;"
            )
            s.append(ln);
            s.append(txt);
        }

        $(data.columns).each(function(i, e) {
            var px = (100 / ncol * i) + 5;
            var cl = makeSVG("rect", {
                x: px + 2 + "%",
                y: (100 - (u * e.value)) + "%",
                stroke: e.stroke,
                'stroke-width': "2",
                fill: e.fill,
                width: (100 / ncol - 4) + "%",
                height: (u * e.value) + "%",
                label: e.label,
                value: e.value,
                class: "yac-slice " + e.class
            })
            var lb = makeSVG("text", {
                x: px + (50 / ncol) + "%",
                y: "100%",
                width: ((100 / ncol) - 1) + "%",
                height: "auto",
                "text-anchor": "middle",
                "alignment-baseline": "text-before-edge"
            }, e.label);
            var lbvalue = makeSVG("text", {
                x: px + (50 / ncol) + "%",
                y: 99 - (u * e.value) + "%",
                width: ((100 / ncol) - 1) + "%",
                "text-anchor": "middle",
                "alignment-baseline": "baseline"
            }, e.value);

            $(cl).on("click", data.click);
            $(cl).on("mouseover", data.mouseover);
            s.append(cl);
            s.append(lb);
            s.append(lbvalue);
        })
        wrapper.append(s);
        selector.append(wrapper);
        return selector;

    }

    function line(selector, data) {
        var s = makeSVG("svg", { x: "5%", y: "5%", width: "90%", height: "90%", fill: "#22222", style: "overflow:visible;" });
        var wrapper = makeSVG("svg", { x: 0, y: 0, width: "100%", height: "100%", viewBox: "0 0 800 600" });
        wrapper = $(wrapper);
        s = $(s);
        var ncol = data.columns.length;
        var colw = parseInt(100 / (ncol - 1));
        var max = getMax(data.columns);
        max = roundMax(max);
        var u = 100 / max;
        //axis
        var liney = makeSVG("line", { x1: "0%", x2: "0%", y1: "0%", y2: "100%", stroke: "#888888", "stroke-width": 1 });
        var linex = makeSVG("line", { x1: "0%", x2: "105%", y1: "100%", y2: "100%", stroke: "#888888", "stroke-width": 1 });
        s.append(liney);
        s.append(linex);
        //unit dotted lines
        for (var c = 0; c < 11; c++) {
            var h = c * 10 + "%";
            var ln = makeSVG("line", {
                x1: "0%",
                x2: "105%",
                y1: h,
                y2: h,
                stroke: "#888888",
                "stroke-width": 0.5,
                "stroke-dasharray": "5, 5"
            });
            var txt = makeSVG("text", {
                    x: "0%",
                    y: h,
                    "alignment-baseline": "middle",
                    "text-anchor": "end"
                },
                parseInt((10 - c) * (max / 100) * 10) + "&nbsp;"
            )
            s.append(ln);
            s.append(txt);
        }
        var ox = "0%";
        var oy = "100%";
        $(data.columns).each(function(i, e) {
            var px = (100 / ncol * (i + 1));
            var cl = makeSVG("circle", {
                cx: px + "%",
                cy: (100 - (u * e.value)) + "%",
                stroke: e.stroke,
                'stroke-width': 1,
                fill: e.fill,
                r: "1%",
                label: e.label,
                value: e.value,
                class: e.class
            })
            var line = makeSVG("line", { x1: px + "%", x2: ox, y1: (100 - (u * e.value)) + "%", y2: oy, stroke: "grey", "stroke-width": 2 });
            var lb = makeSVG("text", {
                x: px + "%",
                y: "100%",
                //width: (100 / ncol) + "%",
                "text-anchor": "middle",
                "alignment-baseline": "text-before-edge"
            }, e.label);
            var lbvalue = makeSVG("text", {
                x: px + "%",
                y: 98 - (u * e.value) + "%",
                width: (100 / ncol) + "%",
                "text-anchor": "middle",
                "alignment-baseline": "baseline"
            }, e.value);

            $(cl).on("click", data.click);
            $(cl).on("mouseover", data.mouseover);

            s.append(lb);
            s.append(lbvalue);
            s.append(line);
            s.append(cl);

            ox = px + "%";
            oy = (100 - (u * e.value)) + "%";
            //var points +=

        })
        wrapper.append(s);
        selector.append(wrapper);
        return selector;
    }

    function pie(selector, data) {
        var s = makeSVG("svg", { x: 0, y: 0, width: "100%", height: "100%", fill: "yellow", viewBox: "0 0 600 600" });
        s = $(s);
        selector.append(s);
        var ncol = data.columns.length + 2;
        var tot = 300 * Math.PI;
        var totArr = getTot(data.columns);
        var prev = 0;
        var k = 300;
        var legenda = "";

        $(data.columns).each(function(i, e) {
            var angle = 2 * Math.PI / totArr * this.value;
            var d = createSvgArc(300, 300, 150, prev, (prev + angle));
            var path = makeSVG("path", {
                d: d,
                fill: this.fill,
                stroke: this.stroke,
                "stroke-width": 2,
                label: e.label,
                value: e.value,
                class: e.class
            });
            $(path).on("click", data.click);
            $(path).on("mouseover", data.mouseover);
            var xa1, xa2, ya1, ya2;
            var a1 = getHalfArc(300, 300, 150, prev, (prev + angle));
            var a2 = getHalfArc(300, 300, 200, prev, (prev + angle));
            var line = makeSVG("line", { x1: a1.x, y1: a1.y, x2: a2.x, y2: a2.y, stroke: "black" });
            var text = makeSVG("text", { x: a2.x, y: a2.y, fill: "black" }, this.value);
            s.append(line);
            s.append(path);
            s.append(text);
            var backbox = text.getBBox();
            var r = makeSVG("rect", {
                x: backbox.x - 5,
                y: backbox.y - 3,
                width: backbox.width + 10,
                height: backbox.height + 6,
                fill: "#eeeeee",
                stroke: "black"
            });
            s.append(r);
            s.append(text);
            prev += angle;
        });
        return selector;
    }

    function doughnut(selector, data) {
        var s = makeSVG("svg", { x: 0, y: 0, width: "100%", height: "100%", fill: "none", viewBox: "0 0 300 300" });
        s = $(s);
        var ncol = data.columns.length + 2;
        var tot = 2 * 100 * Math.PI;
        var totArr = getTot(data.columns);
        var prev = 0;
        var text = makeSVG("text", {
            x: "150",
            y: "150",
            "text-anchor": "middle",
            "alignment-baseline": "middle",
            fill: "black"
        }, "");
        $(data.columns).each(function(i, e) {
            var v = this.value * tot / totArr;
            var circle = makeSVG("circle", {
                r: "100",
                cx: "50%",
                cy: "50%",
                "stroke-width": "35",
                "stroke-dasharray": v + "  " + tot,
                "stroke-dashoffset": -prev,
                stroke: this.fill,
                label: this.label,
                value: this.value,
                class: this.class,
                //fill: "none"
            });
            $(circle).on("click", data.click);
            $(circle).on("mouseover", function() {
                    $(this).attr("stroke-width", "50");
                    $(text).html($(this).attr("label") + ": " + $(this).attr("value"));
                }) //data.mouseover);
            $(circle).on("mouseout", function() {
                    $(circle).attr("stroke-width", "35");
                    $(text).html("");
                }) //data.mouseover);


            s.append(circle);
            prev += v;
        })
        s.append(text);
        selector.append(s);
        return selector;
    }

    function makeSVG(tag, attrs, value) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        if (value != null) {
            $(el).html(value);
        }
        return el;
    }

    function getMax(arr) {
        var max = 0;
        $(arr).each(function() {
            if (this.value > max) max = this.value;
        })
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
        $(arr).each(function() {
            tot += this.value;
        })
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


}(jQuery));