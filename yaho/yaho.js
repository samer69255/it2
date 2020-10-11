var request = require('request');
var unescapeJs = require("unescape-js");

cookie={hotmail:"", yahoo:""};
           ss= {};
           yy = {};
           su= {ems:[], u:0, f:0, t:0, len:0, stat:'stop'};
           stat= "stop";
           ems= [];
           runner = '';
           var interval;

function InitH() {
    return new Promise(resolve => {
        
        request.get('https://signup.live.com/?lic=1', (err, response, body) => {
            if (err) {
                console.log('initing ...');
                return Init();  };
            console.log('working');
    var uaid = body.match(/"uaid":"(.*?)"/)[1],
        uiflvr = body.match(/"uiflvr":(\d+)/)[1],
        scid = body.match(/"scid":(\d+)/)[1],
        hpgid = body.match(/"hpgid":(\d+)/)[1],
        canary = (body.match(/"apiCanary":"(.*?)"/)[1]);
    
    ss = {
        uaid:uaid,
        uiflvr:uiflvr,
        scid:scid,
        hpgid:hpgid,
        canary:unescapeJs(canary)
    }
    
    var Cookies = response.headers['set-cookie'];
    Cookies.forEach(key => {
        var cc = key.split(' ')[0];
        cookie.hotmail += " " + cc;
    });
     cookie.hotmail =  cookie.hotmail.trim();
    //console.log(cookie);
    resolve();
        });
        

    });

}

function checkH(email) {
    
    return new Promise(resolve => {
          var data = {signInName: email,uaid: ss.uaid,includeSuggestions:true,uiflvr: ss.uiflvr,scid: ss.scid,hpgid: ss.hpgid}
   // console.log(data);
    var options = {
    url:'https://signup.live.com/API/CheckAvailableSigninNames?lic=1',
    json:(data),
    headers:{
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': cookie.hotmail,
        'canary': ss.canary
}
}
    
    request.post(options, (err, response, body) => {
        if (err) {
            
            return resolve('int');
        }
        if (response.statusCode != '200')  {resolve('error');
          console.log(response.statusCode);
          return;
        }
        if (body.apiCanary)
      ss.canary = body.apiCanary;
      resolve(body.isAvailable);
      //console.log(body);
    });
     
    });
  
}

function InitY() {
    return new Promise(resolve => {
      cookie={hotmail:"", yahoo:""};
           ss= {};
           yy = {};
        request.get('https://login.yahoo.com/account/create', (err, response, body) => {
            var crumb = body.match(/<input type="hidden" value="(.*?)" name="crumb">/)[1];
            var acrumb = body.match(/<input type="hidden" value="(.*?)" name="acrumb">/)[1];
            yy.crumb = crumb;
            yy.acrumb = acrumb;
            
            var Cookies = response.headers['set-cookie'];
    Cookies.forEach(key => {
        var cc = key.split(' ')[0];
        cookie.yahoo += " " + cc;
    });
     cookie.yahoo =  cookie.yahoo.trim();
           // console.log(cookie.yahoo);
            resolve();
        });
    });
}

function checkY(email) {
    
    return new Promise(resolve => {
         var data = {
        specId:'yidReg',
        cacheStored:true,
        crumb:yy.crumb,
        acrumb:yy.acrumb,
        sessionIndex:'',
        done:'https://www.yahoo.com',
        googleIdToken:'',
        authCode:'',
        tos0:'oath_freereg|xa|en-JO',
        firstName:'',
        lastName:'',
        yid:email.split('@')[0],
        password:'',
        shortCountryCode:'AF',
        phone:'',
        mm:'',
        dd:'',
        yyyy:'',
        freeformGender:''
    }
    data = dataText(data);
    var options = {
    url:'https://login.yahoo.com/account/module/create?validateField=yid',
    body:(data),
    headers:{
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': cookie.yahoo,
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'Cache-Control':'no-cache',
        'Accept-Language':'ar-IQ',
        'Accept':'*/*',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763',
        'Origin':'https://login.yahoo.com',
        'Referer':'https://login.yahoo.com/',
        'X-Requested-With': 'XMLHttpRequest',
}
}
    request.post(options, (err, response, body) => {
        if (err) throw err;
        try {
          body = JSON.parse(body);
        }
        catch(e) {
          resolve('error');
          return;
        }
        
       //console.log(body.errors);
        var isAvis = true;
        if (body.errors) {
            for (var o in body.errors) {
                var ob = body.errors[o];
                if (ob.name == 'yid') { isAvis = false; break;   }
            }
            resolve(isAvis);
        }
        else resolve(undefined);
        
        
    });
    });
   
}

function dataText(data) {
    var txt = "";
    for (var i in data) {
        if (i != Object.keys(data)[0]) txt += "&"
        txt += i + "=" + data[i];
    }
    
    return txt;
}

async function Check(email) {
  var res;
  if (/@(yahoo|ymail)/i.test(email)) res = await checkY(email);
  else if (/@(hotmail|outlook|live)/i.test(email)) res = await checkH(email);
  else res = await CheckEmail(email);
  console.log(email + "=> " + res);
  return res;
}

async function CheckEmail(email) {
  var ss;
  return new Promise(resolve => {
  request.get('http://emailverify.eu-4.evennode.com/?pass=1223455&email=' + email, (err,r,data) => {
    //console.log(data);
    try {
       ss = !JSON.parse(data).verify;
    } catch (e) { ss = false;}
    resolve(ss);
  });
  });
}

function reset() {
      
         cookie={hotmail:"", yahoo:""};
           ss= {};
           yy = {};
           su= {ems:[], u:0, f:0, t:0, len:0, stat:'stop'};
           stat= "stop";
           ems= [];
           runner = '';
         if (interval != null) clearInterval(interval);
}


async function time(dd) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        },dd);
    });
}


module.exports = {InitY, checkY, InitH, checkH, Check, reset}