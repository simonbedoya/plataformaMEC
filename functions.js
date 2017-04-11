/**
 * Created by sbv23 on 17/12/2016.
 */


exports.datetime = function datetime() {
  let date = new Date();
  console.log(date);

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let second = date.getSeconds();
    let minute = date.getMinutes();
    let hour = date.getHours();
    let finalsecond = "";
    let finalminute = "";
    let finalhour = "";
    let finalday = "";
    let finalmonth = "";

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

exports.convertDate = function convertDate(date) {
    let year = date.charAt(4) + date.charAt(5);
    let month = "";
    if(date.charAt(2) === "0"){
        month = date.charAt(3);
    }else{
        month = date.charAt(2) + date.charAt(3);
    }
    let day = date.charAt(0) + date.charAt(1);
    let newDate = new Date("20"+year, month - 1, day);
    let finalday ="";
    let finalmonth= "";
    let day_n = newDate.getDate();
    let month_n = newDate.getMonth();
    let year_n = newDate.getFullYear();
    if (day_n >= 1 && day_n <= 9){
        finalday = "0" + day_n.toString();
    }else{
        finalday = day_n.toString();
    }
    if(month_n >= 0 && month_n <=9){
        finalmonth = "0" + (month_n + 1).toString();
    }else{
        finalmonth = month_n.toString();
    }
    return year_n.toString() + "/" + finalmonth + "/" + finalday;
};

exports.random = function random(length, chars) {
    let path = '';
    for (let i = length; i > 0; --i) path += chars[Math.floor(Math.random() * chars.length)];
    return path;
};

exports.convertHour = function convertHour(hour) {
    return String(`${hour}:00:00`);
};

exports.fileExists = function fileExists(file, cb) {
    fs.stat(file, function(err, stats){
        if (err) {
            if (err.code === 'ENOENT') {
                return cb(null, false);
            } else { // en caso de otro error
                return cb(err);
            }
        }
        // devolvemos el resultado de `isFile`.
        return cb(null, stats.isFile());
    });
};

exports.validatePass = function validatePass(pass) {
  return /^(?=.*\d)(?=(.*\W){2})(?=.*[a-zA-Z])(?!.*\s).{1,15}$/.test(pass);
};