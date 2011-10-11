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

var output

listen(window, "load", onLoad)
listen(document, "DOMContentLoaded", callbackWithError)

//------------------------------------------------------------------------------
function onLoad() {
    setUp()
}

//------------------------------------------------------------------------------
function clicked_setTimeout(e) {
    e.stopPropagation()
    setTimeout(callbackWithError, 500)
}

//------------------------------------------------------------------------------
function clicked_setInterval(e) {
    e.stopPropagation()

    var watchId = setInterval(callbackWithError, 1000)
    setTimeout(function() {clearInterval(watchId)}, 3000)
}

//------------------------------------------------------------------------------
function clicked_button(e) {
    e.stopPropagation()
    callbackWithError()
}

//------------------------------------------------------------------------------
function clicked_window(e) {
    e.stopPropagation()
    callbackWithError()
}

//------------------------------------------------------------------------------
function clicked_xhr(e) {
    e.stopPropagation()

    var xhr = new XMLHttpRequest()
    xhr.addEventListener("readystatechange",callbackWithError,false)
    xhr.open("GET", "something.xml")
    xhr.send()
}

//------------------------------------------------------------------------------
function callbackWithError() {
    functionThatThrowsError()
}

//------------------------------------------------------------------------------
function functionThatThrowsError() {
    var x = null
    x.x = null
}

//------------------------------------------------------------------------------
function setUp() {
    var button_setTimeout  = elementAt("button-setTimeout")
    var button_setInterval = elementAt("button-setInterval")

    var button_click_button = elementAt("button-click-button")
    var button_click_window = elementAt("button-click-window")
    var button_xhr          = elementAt("button-xhr")

    listen(button_setTimeout,   "click", clicked_setTimeout)
    listen(button_setInterval,  "click", clicked_setInterval)
    listen(button_click_button, "click", clicked_button)
    listen(window,              "click", clicked_window)
    listen(button_xhr,          "click", clicked_xhr)
}

//------------------------------------------------------------------------------
function elementAt(id) {
    return document.getElementById(id)
}

//------------------------------------------------------------------------------
function listen(object, event, handler, useCapture) {
    useCapture = !!useCapture
    return object.addEventListener(event, handler, useCapture)
}

