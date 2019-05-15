/**
 * Created by jiachenpan on 16/11/18.
 */

/* Is it a company mailbox?*/
export function isWscnEmail(str) {
  const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wallstreetcn\.com$/i;
  return reg.test(str.trim());
}

/* Is it a mailbox?*/
export function isEmail(str) {
  const reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return reg.test(str.trim());
}

/* Legal uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* Lower case letters*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/*verificationkey*/
// export function validateKey(str) {
//     var reg = /^[a-z_\-:]+$/;
//     return reg.test(str);
// }

/* uppercase letter*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* Uppercase and lowercase letters*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

// Judge an empty array or an empty object
export function isEmpty(value) {
  return (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}

// Acquisition type
export function getType(val) {
  return Object.prototype.toString.call(val).match(/\s{1}(\w+)/)[1];
}


