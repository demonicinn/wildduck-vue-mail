/* eslint-disable */

/**
 *
 * @param e
 * @param arg_opts
 * @returns {boolean}
 */
export function effectRipple(e, arg_opts) {
    let opts = Object.assign({
            ele: e.target, // Corrugated element
            type: 'hit', // hitClick location diffusion　center中心点扩展
            bgc: 'rgba(0, 0, 0, 0.15)' // Ripple color
        }, arg_opts),
        target = opts.ele;
    if (target) {
        let rect = target.getBoundingClientRect(),
            ripple = target.querySelector('.e-ripple');
        if (!ripple) {
            ripple = document.createElement('span');
            ripple.className = 'e-ripple';
            ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
            target.appendChild(ripple);
        } else {
            ripple.className = 'e-ripple';
        }
        switch (opts.type) {
            case 'center':
                ripple.style.top = (rect.height / 2 - ripple.offsetHeight / 2) + 'px';
                ripple.style.left = (rect.width / 2 - ripple.offsetWidth / 2) + 'px';
                break;
            default:
                ripple.style.top = (e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop) + 'px';
                ripple.style.left = (e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft) + 'px';
        }
        ripple.style.backgroundColor = opts.bgc;
        ripple.className = 'e-ripple z-active';
        return false;
    }
}
// database64 Convert file format to binary
/**
 *
 * @param data
 * @param mime
 * @returns {*}
 */
export function data2blob(data, mime) {
    // dataURL The format is “data:image/png;base64,****”,Before the comma, there are some descriptive words., we only need the comma after the line
    data = data.split(',')[1];
    data = window.atob(data);
    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i);
    }
    // canvas.toDataURL The default format returned is image/png
    return new Blob([ia], {type: mime});
};
