(function(window, undefined) {
"use strict";

var v = window.v;

//Делаем обертку/наследника jquery. Для части методов делаем свою реализацию, которая изменяет vdom/берет данные из vdom и регистрирует измения. 
//Для остальных методов над домом применяем vdom и вызываем базовый jqeury метод. 

//ограничения: 

//basic
jquery
constructor
selector
extend
init

//array
length
size
toArray
get
pushStack
each
map
slice
first
last
eq
end
push //internal
sort //internal
splice //internal

//selector--
find
filter
not
is
has
closest
index
add
addBack
parent
parents
parentsUntil
next
prev
nextAll
prevAll
nextUntil
prevUntil
siblings
children
contents
andSelf

//dom manip++
domManip
detach
remove
text
append
prepend
before
after
empty
clone
html
replaceWith
appendTo
prependTo
insertBefore
insertAfter
replaceAll
show
hide
toggle
attr
removeAttr
prop
removeProp
addClass
removeClass
toggleClass
hasClass
wrapAll
wrapInner
wrap
unwrap
css // getter-
val // getter- 

//data++
data
removeData

//events++
on
one
off
trigger
triggerHandler
blur
focus
focusin
focusout
load
resize
scroll
unload
click
dblclick
mousedown
mouseup
mousemove
mouseover
mouseout
mouseenter
mouseleave
change
select
submit
keydown
keypress
keyup
error
contextmenu
hover
bind
unbind
delegate
undelegate

//dom layout getter-- setter+?
offset
position
offsetParent
scrollLeft
scrollTop
innerHeight
height
outerHeight
innerWidth
width
outerWidth


//utils--
ready
queue
dequeue
clearQueue
promise
ajaxStart
ajaxStop
ajaxComplete
ajaxError
ajaxSuccess
ajaxSend
serialize
serializeArray

//animation+-?
fadeTo
animate
stop
finish
slideDown
slideUp
slideToggle
fadeIn
fadeOut
fadeToggle
delay



})(window);