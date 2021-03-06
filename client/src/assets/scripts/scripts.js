"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
  return typeof e
} : function(e) {
  return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
};
! function(e) {
  if ("object" === ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    var t;
    t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.GitHubCalendar = e()
  }
}(function() {
  return function e(t, n, r) {
    function a(u, s) {
      if (!n[u]) {
        if (!t[u]) {
          var c = "function" == typeof require && require;
          if (!s && c) return c(u, !0);
          if (o) return o(u, !0);
          var i = new Error("Cannot find module '" + u + "'");
          throw i.code = "MODULE_NOT_FOUND", i
        }
        var l = n[u] = {
          exports: {}
        };
        t[u][0].call(l.exports, function(e) {
          var n = t[u][1][e];
          return a(n ? n : e)
        }, l, l.exports, e, t, n, r)
      }
      return n[u].exports
    }
    for (var o = "function" == typeof require && require, u = 0; u < r.length; u++) a(r[u]);
    return a
  }({
    1: [function(e, t) {
      var n = e("github-calendar-parser"),
        r = e("elly"),
        a = e("add-subtract-date"),
        o = e("formatoid"),
        u = "MMM D, YYYY",
        s = "MMMM D";
      t.exports = function(e, t, c) {
        e = r(e), c = c || {}, c.summary_text = c.summary_text || 'Summary of pull requests, issues opened, and commits made by <a href="https://github.com/' + t + '" target="blank">@' + t + "</a>", c.global_stats === !1 && (e.style.minHeight = "175px"), c.proxy = c.proxy || function(e) {
          return "https://urlreq.appspot.com/req?method=GET&url=" + e
        };
        var i = function l() {
          return fetch(c.proxy("https://github.com/" + t)).then(function(e) {
            return e.text()
          }).then(function(t) {
            var i = document.createElement("div");
            i.innerHTML = t;
            var f = i.querySelector(".js-contribution-graph");
            if (f.querySelector(".float-left.text-gray").innerHTML = c.summary_text, f.querySelector("include-fragment")) setTimeout(l, 500);
            else {
              if (c.global_stats !== !1) {
                var d = n(r("svg", f).outerHTML),
                  p = d.current_streak ? o(d.current_streak_range[0], s) + " – " + o(d.current_streak_range[1], s) : d.last_contributed ? "Last contributed in " + o(d.last_contributed, s) + "." : "Rock - Hard Place",
                  g = d.longest_streak ? o(d.longest_streak_range[0], s) + " – " + o(d.longest_streak_range[1], s) : d.last_contributed ? "Last contributed in " + o(d.last_contributed, s) + "." : "Rock - Hard Place",
                  y = r("<div>", {
                    "class": "contrib-column contrib-column-first table-column",
                    html: '<span class="text-muted">Contributions in the last year</span>\n                               <span class="contrib-number">' + d.last_year + ' total</span>\n                               <span class="text-muted">' + o(a.subtract(new Date, 1, "year"), u) + " – " + o(new Date, u) + "</span>"
                  }),
                  m = r("<div>", {
                    "class": "contrib-column table-column",
                    html: '<span class="text-muted">Longest streak</span>\n                               <span class="contrib-number">' + d.longest_streak + ' days</span>\n                               <span class="text-muted">' + g + "</span>"
                  }),
                  b = r("<div>", {
                    "class": "contrib-column table-column",
                    html: '<span class="text-muted">Current streak</span>\n                               <span class="contrib-number">' + d.current_streak + ' days</span>\n                               <span class="text-muted">' + p + "</span>"
                  });
                f.appendChild(y), f.appendChild(m), f.appendChild(b)
              }
              e.innerHTML = f.innerHTML
            }
          })["catch"](function(e) {
            return console.error(e)
          })
        };
        return i()
      }
    }, {
      "add-subtract-date": 2,
      elly: 4,
      formatoid: 6,
      "github-calendar-parser": 8
    }],
    2: [function(e, t) {
      function n(e) {
        return function t(n, r, a) {
          switch (r = e * r, a) {
            case "years":
            case "year":
              n.setFullYear(n.getFullYear() + r);
              break;
            case "months":
            case "month":
              n.setMonth(n.getMonth() + r);
              break;
            case "weeks":
            case "week":
              return t(n, 7 * r, "days");
            case "days":
            case "day":
              n.setDate(n.getDate() + r);
              break;
            case "hours":
            case "hour":
              n.setHours(n.getHours() + r);
              break;
            case "minutes":
            case "minute":
              n.setMinutes(n.getMinutes() + r);
              break;
            case "seconds":
            case "second":
              n.setSeconds(n.getSeconds() + r);
              break;
            case "milliseconds":
            case "millisecond":
              n.setMilliseconds(n.getMilliseconds() + r);
              break;
            default:
              throw new Error("Invalid range: " + a)
          }
          return n
        }
      }
      t.exports = {
        add: n(1),
        subtract: n(-1)
      }
    }, {}],
    3: [function(e, t) {
      t.exports = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], t.exports.abbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], t.exports["short"] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    }, {}],
    4: [function(e, t) {
      function n(e, t) {
        return "string" == typeof e ? "<" === e.charAt(0) ? (e = document.createElement(e.slice(1, -1)), r(t || {}, function(t, n) {
          switch (n) {
            case "text":
              return void(e.textContent = t);
            case "html":
              return void(e.innerHTML = t)
          }
          e.setAttribute(n, t)
        }), e) : (t = t || document, t.querySelector(e)) : e
      }
      var r = e("iterate-object"),
        a = e("sliced");
      n.$$ = function(e, t) {
        return t = t || document, a(t.querySelectorAll(e))
      }, t.exports = n
    }, {
      "iterate-object": 9,
      sliced: 13
    }],
    5: [function(e, t) {
      t.exports = function(e, t, n) {
        t = t || 2, n = n || "0", e = e.toString();
        var r = t - e.length;
        return (0 >= r ? "" : n.repeat(r)) + e
      }
    }, {}],
    6: [function(e, t) {
      var n = e("months"),
        r = e("days"),
        a = e("fillo"),
        o = e("parse-it").Parser,
        u = new o({
          YYYY: function(e) {
            return e.getFullYear()
          },
          YY: function(e) {
            return e.getFullYear() % 100
          },
          MMMM: function(e) {
            return n[e.getMonth()]
          },
          MMM: function(e) {
            return n.abbr[e.getMonth()]
          },
          MM: function(e) {
            return a(e.getMonth() + 1)
          },
          M: function(e) {
            return e.getMonth() + 1
          },
          dddd: function(e) {
            return r[e.getDay()]
          },
          ddd: function(e) {
            return r.abbr[e.getDay()]
          },
          dd: function(e) {
            return r["short"][e.getDay()]
          },
          d: function(e) {
            return e.getDay()
          },
          DD: function(e) {
            return a(e.getDate())
          },
          D: function(e) {
            return e.getDate()
          },
          A: function(e) {
            return e.getHours() >= 12 ? "PM" : "AM"
          },
          a: function(e) {
            return e.getHours() >= 12 ? "pm" : "am"
          },
          hh: function(e) {
            return a(e.getHours() % 12 || 12)
          },
          h: function(e) {
            return e.getHours() % 12 || 12
          },
          HH: function(e) {
            return a(e.getHours())
          },
          H: function(e) {
            return e.getHours()
          },
          mm: function(e) {
            return a(e.getMinutes())
          },
          m: function(e) {
            return e.getMinutes()
          },
          ss: function(e) {
            return a(e.getSeconds())
          },
          s: function(e) {
            return e.getSeconds()
          }
        });
      t.exports = function(e, t) {
        return u.run(t, [e])
      }
    }, {
      days: 3,
      fillo: 5,
      months: 10,
      "parse-it": 11
    }],
    7: [function(e, t) {
      t.exports = ["#eee", "#d6e685", "#8cc665", "#44a340", "#1e6823"]
    }, {}],
    8: [function(e, t) {
      var n = e("github-calendar-legend");
      t.exports = function(e) {
        var t = {
            last_year: 0,
            longest_streak: -1,
            longest_streak_range: [],
            current_streak: 0,
            current_streak_range: [],
            weeks: [],
            days: [],
            last_contributed: null
          },
          r = [],
          a = function() {
            t.current_streak > t.longest_streak && (t.longest_streak = t.current_streak, t.longest_streak_range[0] = t.current_streak_range[0], t.longest_streak_range[1] = t.current_streak_range[1])
          };
        return e.split("\n").slice(2).map(function(e) {
          return e.trim()
        }).forEach(function(e) {
          if (e.startsWith("<g transform")) return r.length && t.weeks.push(r) && (r = []);
          var o = e.match(/fill="(#[a-z0-9]+)"/),
            u = e.match(/data-date="([0-9\-]+)"/),
            s = e.match(/data-count="([0-9]+)"/);
          if (o = o && o[1], u = u && u[1], s = s && +s[1], o) {
            var c = {
              fill: o,
              date: new Date(u),
              count: s,
              level: n.indexOf(o)
            };
            0 === t.current_streak && (t.current_streak_range[0] = c.date), c.count ? (++t.current_streak, t.last_year += c.count, t.last_contributed = c.date, t.current_streak_range[1] = c.date) : (a(), t.current_streak = 0), r.push(c), t.days.push(c)
          }
        }), a(), t
      }
    }, {
      "github-calendar-legend": 7
    }],
    9: [function(e, t) {
      function n(e, t) {
        var n = 0,
          r = [];
        if (Array.isArray(e))
          for (; n < e.length && t(e[n], n, e) !== !1; ++n);
        else if ("object" === ("undefined" == typeof e ? "undefined" : _typeof(e)) && null !== e)
          for (r = Object.keys(e); n < r.length && t(e[r[n]], r[n], e) !== !1; ++n);
      }
      t.exports = n
    }, {}],
    10: [function(e, t) {
      t.exports = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], t.exports.abbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }, {}],
    11: [function(e, t) {
      function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
      }
      function r(e, t, n) {
        return new u(t).run(e, n)
      }
      var a = function() {
          function e(e, t) {
            for (var n = 0; n < t.length; n++) {
              var r = t[n];
              r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
            }
          }
          return function(t, n, r) {
            return n && e(t.prototype, n), r && e(t, r), t
          }
        }(),
        o = e("regex-escape"),
        u = function() {
          function e(t) {
            n(this, e), this.obj = t || {}, this.re = new RegExp("^(" + Object.keys(t).map(o).join("|") + ")")
          }
          return a(e, [{
            key: "run",
            value: function(e, t) {
              var n = "";
              t = t || [];
              do {
                var r = e.match(this.re),
                  a = r && r[1],
                  o = a || e.charAt(0);
                if (a) {
                  var u = this.obj[a];
                  "function" == typeof u && (u = u.apply(this, t)), n += u
                } else n += o;
                e = e.substring(o.length)
              } while (e);
              return n
            }
          }]), e
        }();
      r.Parser = u, t.exports = r
    }, {
      "regex-escape": 12
    }],
    12: [function(e, t) {
      function n(e) {
        return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
      }
      n.proto = function() {
        return RegExp.escape = n, n
      }, t.exports = n
    }, {}],
    13: [function(e, t) {
      t.exports = function(e, t, n) {
        var r = [],
          a = e.length;
        if (0 === a) return r;
        var o = 0 > t ? Math.max(0, t + a) : t || 0;
        for (void 0 !== n && (a = 0 > n ? n + a : n); a-- > o;) r[a - o] = e[a];
        return r
      }
    }, {}]
  }, {}, [1])(1)
});
