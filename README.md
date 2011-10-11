log-callback-error
==================

A set of overrides to existing JavaScript functions that take callbacks,
which will log an error if an exception is thrown during the invocation of
the callback.

This is aimed primarily for mobile browser engines.

the problem
-----------

On the desktop today, to track down runtime exceptions that are occurring in
your JavaScript code, it's fairly easy to bring up a "web debugger" like Web
Inspector or FireBug, and have it show you where the error occurred.

For mobile platforms, well, we have a problem, because we don't have robust
JavaScript debug capability available.  In fact, often, you have no idea that
any runtime error occurred at all, besides the sneaking feeling that your
application "just isn't working right".

some help
---------

In lieu of this missing function, there's this library.  It instruments a
number of built-in JavaScript functions which take callbacks, and will run
those callbacks in a try/catch.  It will then report the exception to you via
`console.log()`.  In addition, it will display a little bit of context about
the function invocation that specified the callback, as this may help you
further narrow down the problem.

For instance, if you open the file `test/tests.html` in a browser, and
click on the button `setTimeout`, it will run a `setTimeout()` function with a
callback that causes a runtime exception.  You should then see the following
in the console:

    exception executing callback: TypeError: Cannot set property 'x' of null
        callsite:   setTimeout(callbackWithError, 500)
        stacktrace follows
    TypeError: Cannot set property 'x' of null
        at functionThatThrowsError (http://example.com/log-callback-error/test/tests.js:80:9)
        at callbackWithError (http://example.com/log-callback-error/test/tests.js:74:5)
        at http://example.com/log-callback-error/log-callback-error.js:65:21

Note that you'll only see the stacktrace if your browser supports the `stack`
property on exceptions (at least Opera and V8-enabled browsers; Safari flavors
do not yet support the `stack` property).

The stacktrace is the stack at the time the exception occurred.

The second line of the output, labelled with `callsite`,
is the *context* of the call.  It provides
some information about how the callback was initially registered.  In the case
above, it provides the name of the callback function registered, along with
the timeout millisecond value.

usage
-----

Add the line

    <script src="log-callback-error.js"></script>

before any other JavaScript files in your HTML files.

functions overridden
--------------------

The following functions are overridden to provide the exception callback
handling:

    window.setTimeout()
    window.setInterval()
    window.addEventListener()
    Node.prototype.addEventListener()
    XMLHttpRequest.prototype.addEventListener()

The `Node.prototype.addEventListener()` override applies to all DOM nodes,
including `document`.  The `XMLHttpRequest` flavor applies to all XHR
requests.

Specifically note, these are the only things overridden.  Need more?  Fork,
add, push.

It seems likely that the `onblahblah` flavored event properties will never
be supported, because the DOM host objects suck.

