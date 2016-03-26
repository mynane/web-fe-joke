function ie7insertba(elem, type, neirong) {
    var className = 'ie7insert' + type,
        newelem = document.createElement('span');
    newelem.className = className;
    newelem.innerHTML = neirong;
    if (type === 'before') {
        elem.insertBefore(newelem, elem.firstChild);
    } else {
        elem.appendChild(newelem);
    }
    elem.runtimeStyle.behavior = '1';
}
