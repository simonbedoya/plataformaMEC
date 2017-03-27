/**
 * Created by sbv23 on 17/12/2016.
 */


exports.datetime = function datetime() {
  var date = new Date();
  console.log(date);

  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var second = date.getSeconds();
  var minute = date.getMinutes();
  var hour = date.getHours();
  var finalsecond = "";
  var finalminute = "";
  var finalhour = "";
  var finalday = "";
  var finalmonth = "";

  if (day >= 1 && day <= 9){
      finalday = "0" + day.toString();
  }else{
      finalday = day.toString();
  }
  if(month >= 0 && month <=9){
      finalmonth = "0" + (month + 1).toString();
  }else{
      finalmonth = month.toString();
  }
  if (second >= 0 && second <= 9){
      finalsecond = "0" + second.toString();
  }else{
      finalsecond = second;
  }
  if (minute >= 0 && minute <= 9){
      finalminute = "0" + minute.toString();
  }else{
      finalminute = minute;
  }
  if (hour >= 0 && hour <= 9){
      finalhour = "0" + hour.toString();
  }else{
      finalhour = hour;
  }
  return year.toString() + "/" + finalmonth + "/" + finalday + " " + finalhour + ":" + finalminute + ":" + finalsecond;
};

exports.random = function random(length, chars) {
    let path = '';
    for (let i = length; i > 0; --i) path += chars[Math.floor(Math.random() * chars.length)];
    return path;
}