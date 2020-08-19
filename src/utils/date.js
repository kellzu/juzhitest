// date.js
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

export function str2Date(dateStr, separator) {
  if (!separator) {
    separator = "-";
  }
  let dateArr = dateStr.split(separator);
  let year = parseInt(dateArr[0]);
  let month;
  //处理月份为04这样的情况
  if (dateArr[1].indexOf("0") == 0) {
    month = parseInt(dateArr[1].substring(1));
  } else {
    month = parseInt(dateArr[1]);
  }
  let day = parseInt(dateArr[2]);
  let date = new Date(year, month - 1, day);
  return date;
}


export function pareTime(strTime) {
  if (
    strTime == null ||
    strTime == "" ||
    strTime == undefined ||
    strTime == "undefined"
  ) {
    return null;
  }
  var d = new Date(strTime);
  var myDate =
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
    "-" +
    (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()) +
    " " +
    (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) +
    ":" +
    (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) +
    ":" +
    (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
  return myDate;
}

export function howManySundayThisMonth(newDate) {
  var mydate1 = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
  var mydate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  var myddy = mydate.getDay();
  var days = mydate1.getDate() % 7
  let monthHaveSunDays = 4
  if ((myddy + days) > 6) {
    monthHaveSunDays = monthHaveSunDays + 1;
    console.log("本月有：" + 5 + " 个周日")
  } else {
    console.log("本月有：" + 4 + " 个周日")
  }
  console.log("本月有：" + mydate1.getDate() + "天")
  return mydate1.getDate() - monthHaveSunDays
}
