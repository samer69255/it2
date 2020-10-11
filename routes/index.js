var express = require('express');
var router = express.Router();
const Instagram = require('./instx.js');
var request = require("request");
const FileCookieStore = require('tough-cookie-filestore2');
const Telegraf = require('telegraf');
var {Check, InitY, InitH, reset} = require('../yaho/yaho');
var {reportSpam, reportSol, reportScam} = require("./report.js");
var fs = require("fs");
var u = 0;
var reply;

//Cookies File
var Config = JSON.parse(fs.readFileSync("./user/data.json"));
var util = require('util');
var accounts = [];
Config.users.forEach(async key => {
  var cookieStore = new FileCookieStore(`./user/cookies/${key.username}_cookie.json`);
  var username = key.email;
  var password = key.pass;
  var c = new Instagram({ cookieStore, username, password });
  var s = await c.login();
  if (s.authenticated) {
    console.log(`logined to ${key.email}`);
    accounts.push(c);
    //console.log(c.credentials.username)
  }
  else console.log(`login: ${s}`);
  //console.log(s);
});

//Set Process False
Config.Start = false;

(async function () {
// var a = await client.login();
// console.log(a);
// if (a.authenticated) {

// // var user = await client.getUserByUsername({username:up});
// // //fs.writeFileSync("./data.json", JSON.stringify(user, null, 4));
// // if (user == undefined) return console.log("error 1");
// // console.log("user id:" + user.id);
// // var i = 0;

// // while(true) {
// // await report();
// // log("report success " + ++i);
// // console.log('report success ' + i);
// // await sleep(300);
    
    

// // }

// }else console.log("log in error");
// console.log(a);
})();


/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.query.token) {
		Config.token = req.query.token;
		botrun();
		res.end("success");
		return;
	}
  res.render('index', { title: 'Express' });
});



// ************** functions *********************
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

var access = fs.createWriteStream("./log.txt", { flags: 'a' });


function log(text) {
  text = (new Date()).toUTCString() + ":=> " + text;
  access.write(util.format(text + "\n"));
}

function start() {
  console.log(`start new session`);
  if (Config.type == '1') var report = reportSpam;
  else if (Config.type == '2') var report = reportScam;
  else if (Config.type == '3') var report = reportSol;
  for (var i in accounts) {
    var c = accounts[i];
    var n = 0;
    if (Config.Start == false) break;
    //console.log(c);
    report(c, Config.up)
    .then(async s => {
      if (s.err) {
        Config.Start = false;
        reply(`error:
        username: ${s.username}
        text: ${s.error}
        text: ${Config.type}
        اجراء: تم ايقاف العمليات بأمر المطور`);
        return;
      }
      u++;
      console.log(`${u}:${s.username} => ${s.ssid}:${s.status}`);
      //console.log(`res: ${JSON.stringify(s)}`);
      if (++n == accounts.length) {
        if (Config.Start) {
          await sleep(5000);
          start();
        }
      }
    });
  }
}

if (Config.token) botrun();
function botrun() {
//************** Telegram BOT ***************** *//
bot = new Telegraf(Config.token);

bot.use((ctx, next) => {
  try {
    var username = ctx.update.message.chat.username;
  }
  catch (e) {
    var username = "user";
  }
  
  // BOT ADMIN
  if (username == Config.admin) {
    var text = ctx.update.message.text;
    var sp = text.split(" ");
    var cmd = sp[0];
    var v = sp[1];
    if (cmd == "/setuser") {
      if (!v) return ctx.reply("user not valid");
      Config.username = v;
      saveConfig();
      ctx.reply("Success!");
    }
    else next();
  } else next();
  
});

bot.use((ctx, next) => {
  try {
    var username = ctx.update.message.chat.username;
  }
  catch (e) {
    var username = "audmin"
  }
  if (Config.username !== username) {
    ctx.reply("تم رفض الوصول");
    return;
  }
  return next()
});


bot.start((ctx) => {
  var username = ctx.update.message.chat.username;
  //if (! client.isLogin()) return ctx.reply("Please Login !!");
  ctx.replyWithHTML(`
  كيفية عمل البوت:

  -/setType<b>تغير نوع الابلاغ</b> (لتحديد نوع الابلاغ)

  -<b>/login</b> (لاضافة حساب جديد)

  -<b>/rmaccountمسح حساب</b> (لازالة حساب)
  
  -<b>/setUserتحديد النوع</b> (تغير نوع الابلاغ)

  -<b>/runتشغيل المهمة</b> (تشغيل الابلاغات)

  `);
  
});


bot.use((ctx, next) => {
  tel = ctx;
  return next()
});

// ************ الحالة ****************
bot.hears(/\/getstatus|الحالة/, ctx => {
  if (Config.Start) ctx.reply(`الحالة: تعمل
  اجمالي الابلاغات: ${u}`);
  else ctx.reply("العمليات: متوقفة");
});

bot.hears(/\/getUser/, ctx => {
  var user = Config.up.username;
  if (user) ctx.reply(`الحساب المستهدف: ${user}`);
   else ctx.reply(`لا يوجد حساب مستهدف`);
});


bot.hears(/الغاء|\/cancel/, ctx => {
    if (Config.cmd.length > 0) {
      Config.cmd = "";
      saveConfig();
      ctx.reply('تم الغاء الامر');
    }
});

bot.hears(/\/stop|ايقاف/, ctx => {
    
    if(Config.Start) {
      Config.Start = false;
      saveConfig();
      ctx.reply(`تم ايقاف المهمة`);
    } else ctx.reply("تم ايقاف العمليات بالفعل");
});
//  ********** الحماية ************
bot.use( (ctx, next) => {
  if (Config.Start) {
    ctx.reply(`الرجاء انتظار اكتمال العملية الحالية`);
  } else next();
});
bot.use(async (ctx, next) => {
  var text = ctx.update.message.text;

  if (Config.cmd == 'user') {
   // var client = new Instagram({});
   var client = accounts[0];
    var user = await client.getUserByUsername({username:text});
    Config.uid = user.id;
    Config.up = {id:user.id, username: text};
    saveConfig();
    console.log(`Username: ${Config.uid}`);
    ctx.reply("تم حفظ المجني عليه");
    Config.cmd = '';
    saveConfig();
  }

  //----------- Remove Account ----------------
  else if (Config.cmd == 'rmuser') {
    var ex1 = false;
    var ex2 = false;
    for (var i in Config.users) {
      if (Config.users[i].email == text) ex1 = i;
      if (ex1 !== false) {
        for (var o in accounts) {
        if (accounts[o].credentials.username == text) ex2 = o;
      }
      Config.users = Config.users.slice(ex1, 1);
      saveConfig();
      if (ex2 !== false) {
        accounts = accounts.slice(ex2, 1);
        fs.unlinkSync(`./user/cookies/${text}_cookie.json`);
      }
      ctx.reply(`تمت ازالة الحساب ${text} بنجاح`);
      }
      
    }
    console.log(ex1);
    console.log(ex2);

  }

    else if (Config.cmd == 'type') { 
      if (text == '1' || text == '2' || text == '3') {
        Config.type = text;
        Config.cmd = '';
        saveConfig();
        ctx.reply('تم تغير نوع الابلاغ بنجاح');
      } else ctx.reply('الرجاء ارسال ادخال صالح');
    }

  else next();
});



// ************ تغير الدومين  *****
bot.hears(/\/run|بدأ المهمة/, ctx => {
    u = 0;
    console.log('start');
    Config.Start = true;
    reply = ctx.reply;
    start();
    ctx.reply(`تم تشغيل المهمة
    اكتب /getstatus لعرض الحالة`);
});

bot.hears(/\/setUser|تحديد اليوزر/, ctx => {
  ctx.reply(`ارسل اليوزر الان`);
  Config.cmd = 'user';
});

bot.hears(/\/setType|تغير النوع/, ctx => {
  ctx.reply(`ارسل الرقم الخاص لنوع الابلاغ:
  
  ----------
  1 => سبام
  2 => سكام
  3 => اغواء جنسي
  -----------`);
  Config.cmd = 'type';
});

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.command("login", async (ctx) => {
  console.log('cmd => login');
  var text = ctx.update.message.text;
  tel = ctx;
  var ob = text.split(" ");
  var username = ob[1];
  var password = ob[2];
  if ( !(username && password) )  {
    return ctx.reply(`Use:\n/login [YourUsername] [YourPassword]`);
  }
  //if (client.islogin) logout();
  var path = `./user/cookies/${username}_cookie.json`;
  if (!isfile(path)) fs.writeFileSync(path, "{}", "UTF-8");
  var cookieStore = new FileCookieStore(path);
  var c = new Instagram({ cookieStore, username, password });
  var e;
  var a = await c.login({username, password}).catch(er => {e=er});
  console.log(a);
  if (a) {
    if (a.authenticated) {
      console.log('login success');
      ctx.reply("تم تسجيل الدخول بنجاح");
      Config.users.push({
        email:username,
        pass:password
      });
      accounts.push(c);
      saveConfig();
    }
    else if (!a.user) {
      ctx.reply("فشل تسجيل الدخول: اسم المستخدم غير موجود");
      console.log("login: username!");
      fs.unlinkSync(path);
    }
    else {
      ctx.reply("فشل تسجيل الدخول: كلمة المرور غير صحيحة");
      console.log("login: password!");
      fs.unlinkSync(path);
    }
  }
  else {
    if (e) {
      var code = e.toString().match(/StatusCodeError: ([0-9]+)/);
      if (code === undefined) {ctx.reply(`حدث خطأ غير معروف
      للمساعدة راسل المطور @swsam
      كود الخطأ: loginerror1`);
      console.log('login: loginerror1');
      fs.unlinkSync(path);
      }
      else {
        code = code[1];
        if (code == 403) {ctx.reply("تم رفض تسجيل الدخول, حاول مرة اخرى بعد دقائق");
        console.log('login: 403');
        fs.unlinkSync(path);
        }
        else if (code == 400) {ctx.reply('فشلت المصادقة: وافق على الدخول واعد التسجيل');
          console.log('login: 400');
          console.log(e);
        }
        else {ctx.reply(`حدث خطأ غير متوقع
        للمزيد من المعلومات راسل المطور @swsam
        كود: loginerror2`);
        console.log('loginerror2');
        fs.unlinkSync(path);
        }
      }
    }
    else {
      ctx.reply(`حدث خطأ غير محسوب
      اعد المحاولة لاحقا او اتصل بالمطور @swsam
      كود: loginerror3`);
      console.log('loginerror3');
      fs.unlinkSync(path);
    }
  }
  
});

bot.hears(/\/reset|مسح البيانات/, ctx => {
    var files = fs.readdirSync('./results')
    .filter( key => key.indexOf('.json') > -1);
    console.log('cmd => reset');
    files.forEach( file => {
      fs.unlinkSync(`./results/${file}`);
    });

    Config.domain = "yahoo.com";
    saveConfig();
    ctx.reply("تم مسح جميع الملفات");
    console.log('reset success');
});



bot.hears("/removeAccount", async ctx => {
  if (Config.users.length  == 0) return ctx.reply(`لا يوجد حسابات محفوظة`);
  var res = "ارسل اليوزر\n-----------" + "\n";
  res += Config.users
  .map(ob => {
    return "" + ob.email;
  }).join("\n");
  res += "\n----------" + "\n" + "/cancel (للالغاء)";
  Config.cmd = "rmuser";
  ctx.reply(res);
});

bot.launch();
}
//********************************************************************** */

// ******** function ***************
function saveConfig() {
  fs.writeFileSync("./user/data.json", JSON.stringify(Config, null, 4));
}

async function logout() {
  fs.writeFileSync("./user/cookies.json", "{}", "UTF-8");
   cookieStore = new FileCookieStore('./user/cookies.json');
   client = new Instagram({ cookieStore });
   await client.request.get("/");
}


    function makeid(length) {
   var result           = '';
   var characters       = '1234567890abcdeqwrtyuioplkjhgfdsazxcvbnm';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function isfile(path) {
  var res;
  try {
  if (fs.existsSync(path)) {
    res = true;
  } else res = false;
} catch(err) {
  res = false;
}
return res;
}

module.exports = router;