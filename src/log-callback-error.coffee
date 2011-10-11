###
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
###

main = () ->
    setUpCallSiteFormatters()

    window.setTimeout  = wrapFunction(window.setTimeout,  0)
    window.setInterval = wrapFunction(window.setInterval, 0)

    NodeP  = Node.prototype
    XHRP   = XMLHttpRequest.prototype

    window.addEventListener = wrapFunction(window.addEventListener, 1)
    NodeP.addEventListener  = wrapFunction(NodeP.addEventListener,  1)
    XHRP.addEventListener   = wrapFunction(XHRP.addEventListener,   1)

#-------------------------------------------------------------------------------
wrapFunction = (func, cbIndices...) ->
    ->
        if func.__callSiteFormatter
            callSite = func.__callSiteFormatter(this, arguments)
        else
            callSite = "#{getFunctionName(func)}()"

        for cbIndex in cbIndices
            arguments[cbIndex] = wrappedCallBack(callSite, arguments[cbIndex])
            arguments[cbIndex].__callSite = callSite

        func.apply(this, arguments)

#-------------------------------------------------------------------------------
wrappedCallBack = (callSite, func) ->
    return func if typeof(func) isnt 'function'

    ->
        try
            func.apply(this, arguments)
        catch e
            console.log "exception executing callback: #{e}"
            console.log "  callsite:   #{callSite}"

            stackTrace = getStackTrace(e)
            if stackTrace
                console.log "  stacktrace follows"
                console.log stackTrace

            throw e

#-------------------------------------------------------------------------------
setUpCallSiteFormatters = ->
    window.setTimeout.__callSiteFormatter = (receiver, args) ->
        "setTimeout(#{getFunctionName(args[0])}, #{args[1]})"

    window.setInterval.__callSiteFormatter = (receiver, args) ->
        "setInterval(#{getFunctionName(args[0])}, #{args[1]})"

    NodeP = Node.prototype
    XHRP  = XMLHttpRequest.prototype

    window.addEventListener.__callSiteFormatter = (receiver, args) ->
        "window.addEventListener('#{args[0]}', #{getFunctionName(args[1])})"

    NodeP.addEventListener.__callSiteFormatter = (receiver, args) ->
        if receiver.nodeName
            "<#{receiver.nodeName}>.addEventListener('#{args[0]}', #{getFunctionName(args[1])})"
        else
            "#{receiver}.addEventListener('#{args[0]}', #{getFunctionName(args[1])})"

    XHRP.addEventListener.__callSiteFormatter = (receiver, args) ->
        "XMLHttpRequest.addEventListener('#{args[0]}', #{getFunctionName(args[1])})"

#-------------------------------------------------------------------------------
getFunctionName = (func) ->
    return func.name if func.name
    return func.displayName if func.displayName
    return '<anonymous>'

#-------------------------------------------------------------------------------
getStackTrace = (e) ->
    return e.stack if e.stack

    return null

#-------------------------------------------------------------------------------
main()

