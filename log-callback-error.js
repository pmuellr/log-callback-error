(function() {
  /*
  #-----------------------------------------------------------------------------
  # The MIT License
  #
  # Copyright (c) 2011 Patrick Mueller
  #
  # Permission is hereby granted, free of charge, to any person obtaining a copy
  # of this software and associated documentation files (the "Software"), to deal
  # in the Software without restriction, including without limitation the rights
  # to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  # copies of the Software, and to permit persons to whom the Software is
  # furnished to do so, subject to the following conditions:
  #
  # The above copyright notice and this permission notice shall be included in
  # all copies or substantial portions of the Software.
  #
  # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  # IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  # FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  # AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  # LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  # OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  # THE SOFTWARE.
  #-----------------------------------------------------------------------------
  */
  var getFunctionName, getStackTrace, main, setUpCallSiteFormatters, wrapFunction, wrappedCallBack;
  var __slice = Array.prototype.slice;
  main = function() {
    var NodeP, XHRP;
    setUpCallSiteFormatters();
    window.setTimeout = wrapFunction(window.setTimeout, 0);
    window.setInterval = wrapFunction(window.setInterval, 0);
    NodeP = Node.prototype;
    XHRP = XMLHttpRequest.prototype;
    window.addEventListener = wrapFunction(window.addEventListener, 1);
    NodeP.addEventListener = wrapFunction(NodeP.addEventListener, 1);
    return XHRP.addEventListener = wrapFunction(XHRP.addEventListener, 1);
  };
  wrapFunction = function() {
    var cbIndices, func;
    func = arguments[0], cbIndices = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return function() {
      var callSite, cbIndex, _i, _len;
      if (func.__callSiteFormatter) {
        callSite = func.__callSiteFormatter(this, arguments);
      } else {
        callSite = "" + (getFunctionName(func)) + "()";
      }
      for (_i = 0, _len = cbIndices.length; _i < _len; _i++) {
        cbIndex = cbIndices[_i];
        arguments[cbIndex] = wrappedCallBack(callSite, arguments[cbIndex]);
        arguments[cbIndex].__callSite = callSite;
      }
      return func.apply(this, arguments);
    };
  };
  wrappedCallBack = function(callSite, func) {
    if (typeof func !== 'function') {
      return func;
    }
    return function() {
      var stackTrace;
      try {
        return func.apply(this, arguments);
      } catch (e) {
        console.log("exception executing callback: " + e);
        console.log("  callsite:   " + callSite);
        stackTrace = getStackTrace(e);
        if (stackTrace) {
          console.log("  stacktrace follows");
          console.log(stackTrace);
        }
        throw e;
      }
    };
  };
  setUpCallSiteFormatters = function() {
    var NodeP, XHRP;
    window.setTimeout.__callSiteFormatter = function(receiver, args) {
      return "setTimeout(" + (getFunctionName(args[0])) + ", " + args[1] + ")";
    };
    window.setInterval.__callSiteFormatter = function(receiver, args) {
      return "setInterval(" + (getFunctionName(args[0])) + ", " + args[1] + ")";
    };
    NodeP = Node.prototype;
    XHRP = XMLHttpRequest.prototype;
    window.addEventListener.__callSiteFormatter = function(receiver, args) {
      return "window.addEventListener('" + args[0] + "', " + (getFunctionName(args[1])) + ")";
    };
    NodeP.addEventListener.__callSiteFormatter = function(receiver, args) {
      if (receiver.nodeName) {
        return "<" + receiver.nodeName + ">.addEventListener('" + args[0] + "', " + (getFunctionName(args[1])) + ")";
      } else {
        return "" + receiver + ".addEventListener('" + args[0] + "', " + (getFunctionName(args[1])) + ")";
      }
    };
    return XHRP.addEventListener.__callSiteFormatter = function(receiver, args) {
      return "XMLHttpRequest.addEventListener('" + args[0] + "', " + (getFunctionName(args[1])) + ")";
    };
  };
  getFunctionName = function(func) {
    if (func.name) {
      return func.name;
    }
    if (func.displayName) {
      return func.displayName;
    }
    return '<anonymous>';
  };
  getStackTrace = function(e) {
    if (e.stack) {
      return e.stack;
    }
    return null;
  };
  main();
}).call(this);
