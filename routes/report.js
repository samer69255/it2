
// ------ Report Function -----------
async function reportSpam(client, up) {
   var path,form,s;
   var res = {};
   res.username = client.credentials.username;
   var context = '';
  return new Promise(async resolve => {

           //************************************** */
   async function tag(type) {
  //############################################
  path = "/reports/web/log_tag_selected/";//####
  form = {//#######################################
    context: context,//############################
    selected_tag_type: type//#######
  }
  s = await client.request.post(path, {//##########
  headers:{//#######################################
    'referer':"https://www.instagram.com/" + up.username,
     },form})//#####################################
     .catch(e => {s = null;});//####################
     if (s === null) {//############################
       
       return null;//###############################
     }
     return s;//####################################
  //################################################
  }

   //************************************** */
//(1) -------- Get Context ----------
  //############ FRX Function ###################
    async function frx(f) {
      path = '/reports/web/get_frx_prompt/';
      var data = {}
  for (var k in f) {
    data[k] = f[k];
  }
  s = await client.request.post(path, {
    form:data,
    header:{'referer': "https://www.instagram.com/" + up.username}
  })
  .catch(e => { s = null; });
  return s;
    }
  //############### End FRX Function ##########

//------(1) report -------------
//click report
  var s = await frx({
    'entry_point': 1,
    'location': 2,
    'object_type': 5,
    'object_id': up.id,
    'frx_prompt_request_type': 1
  });
   if (s === null) {
    console.log("report error 1");
    //log("report error 1");
    resolve({err:"report error 1", username:res.username});
    return;
  } 
    try {
    context = (s.response.context);
  }catch (e) {context = null};
  //console.log(s);
  if (context === null) {
    console.log("report error 1c");
    resolve({err:"report error 1c", username:res.username});
    //log("report error 2");
    return;
  }
  var fs = require('fs');

  //res.ssid = context.match(/"session_id":"(.*?)"/);
  res.ssid = JSON.parse(context)["session_id"];
  console.log(`user: ${up.username}`);
  //if (res.ssid) res.ssid = res.ssid[1];
  //###########################################

  //##########################################
  // (2) -------------- report ---------------
  //spam
  await sleep(Math.floor( Math.random() * 15) + 5 );
  var s = await tag("ig_spam_v3");
     if (s === null) {
       consloe.log("report error 2s");
       //log("report error 3");
       resolve({err:"report error 2s", username:res.username});
       return;
     }
     //log("==>" + s.status);
     // console.log("res2: " + s.status);
     res.status = s.status;

  s = await frx({
    context,
    object_type: 5,
    object_id: up.id,
    selected_tag_types: '["ig_spam_v3"]',
    frx_prompt_request_type: 2
  });
  if (s === null) {
    console.log("report error code 2");
    //log("report error code 4");
    resolve({err:"report error 2", username:res.username});
    return;
  }
  //################################################
  res.status = s.status;
  //console.log(res);
  resolve(res);
    });
}


async function reportSol(client, up) {
   var path,form,s;
   var res = {};
   var context;
   res.username = client.credentials.username;

  return new Promise(async resolve => {

  //************************************** */
   async function tag(type) {
  //###############################################
  path = "/reports/web/log_tag_selected/";//#######
  form = {//#######################################
    context: context,//############################
    selected_tag_type: type//#######
  }
  s = await client.request.post(path, {//##########
  headers:{//#######################################
    // 'referer':"https://www.instagram.com/" + up,
     },form})//#####################################
     .catch(e => {s = null;});//####################
     if (s === null) {//############################
       
       return null;//###############################
     }
     return s;//####################################
  //################################################
  }

   //************************************** */

  //############ FRX Function ###################
    async function frx(f) {
      path = '/reports/web/get_frx_prompt/';
      var data = {}
  for (var k in f) {
    data[k] = f[k];
  }
  s = await client.request.post(path, {
    form:data,
    // header:{'referer': "https://www.instagram.com/" + up}
  })
  .catch(e => { s = null; });
  return s;
    }
  //############### End FRX Function ##########

//##################################################
//(1) -------- Get Context report user ----------
// click to report
s = await frx({
  'entry_point': 1,
    'location': 2,
    'object_type': 5,
    'object_id': up.id,
    'frx_prompt_request_type': 1
});
  //console.log(s);
  if (s === null) {
    console.log("report error 1");
    //log("report error 1");
    resolve({err:"report error 1", username:res.username});
    return;
  }
  try {
    context = (s.response.context);
  }catch (e) {context = null};
  if (context === null) {
    console.log("report error 1c");
    resolve({err:"report error 1c", username:res.username});
    //log("report error 2");
    return;
  }
  //-----------------------------

  res.ssid = context.match(/"session_id":"(.*?)"/);
  if (res.ssid) res.ssid = res.ssid[1];
  //---------------------------------------------

//###################################################

//##################################################
  // (2) -------------- report to selected ---------------
  // انه غير مناسب
  await sleep(Math.floor( Math.random() * 15) + 5 );
  s = await tag("ig_its_inappropriate_v1");
  if (s == null) {
       consloe.log("report error 2s");
       //log("report error 3");
       resolve({err:"report error 2s", username:res.username});
       return;
     }
     //log("==>" + s.status);
  // console.log(s);

  //----- report (get fry prompt) -----------
  s = await frx({
    context,
    entry_point: 1,
    object_type: 5,
    location: 2,
    object_id: up.id,
    selected_tag_types: '["ig_its_inappropriate_v1"]',
    frx_prompt_request_type: 2
  });
  if (s === null) {
    console.log("report error code 2");
    //log("report error code 4");
    resolve({err:"report error 2", username:res.username});
    return;
  }

  //------------ Get Context --------------
  try {
    context = (s.response.context);
  }catch (e) {context = null};
  if (context === null) {
    console.log("report error 2c");
    resolve({err:"report error 2c"});
    //log("report error 2");
    return;
  }
  //---------------- End Context ----------

  //resolve(res);
  // console.log(s);
//--------------------------------------------------
//##################################################

//##################################################
  //------------ (3) report account --------------
  // ابلاغ  عن الحساب
  await sleep(Math.floor( Math.random() * 15) + 5 );
  s = await tag("ig_report_account");
  if (s === null) {
    console.log('report error 3s');
    resolve({err:'report error 3s', username:res.username});
  }
  //--------- report get frx prompt -------------
  s = await frx({
    context,
    entry_point: 1,
    object_type: 5,
    location: 2,
    object_id: up.id,
    selected_tag_types: '["ig_report_account"]',
    frx_prompt_request_type: 2
  });
  if (s === null) {
    console.log("report error code 3");
    //log("report error code 4");
    resolve({err:"report error 3", username:res.username});
    return;
  }
  //------------ Get Context --------------
  try {
    context = (s.response.context);
  }catch (e) {context = null};
  if (context === null) {
    console.log("report error 3c");
    resolve({err:"report error 3c"});
    //log("report error 2");
    return;
  }
  //---------------- End Context ----------
//##################################################


//##################################################
// ---------- (4) report ---------------
// محتوى غير لائق
  // log tag
  await sleep(Math.floor( Math.random() * 15) + 5 );
  s = await tag("ig_its_inappropriate");
  if (s === null) {
    console.log("report error 4s");
    resolve({err:"report error 4c", username:res.username});
    return;
  }

  //------------ Get Context ------------------

  s = await frx({
    entry_point: 1,
    location: 2,
    object_type: 5,
    object_id: up.id,
    context,
    selected_tag_types: '["ig_its_inappropriate"]',
    frx_prompt_request_type: 2
  });

    if (s === null) {
    console.log("report error code 4");
    //log("report error code 4");
    resolve({err:"report error 4", username:res.username});
    return;
  }

  try {
    context = (s.response.context);
  }catch (e) {context = null};
  if (context === null) {
    console.log("report error 4c");
    resolve({err:"report error 4c", username:res.username});
    //log("report error 2");
    return;
  }
  //------------ End Context -------------------
//##################################################

//##################################################
  //----step (5) -------------
  //نشاط جنسي
  await sleep(Math.floor( Math.random() * 15) + 5 );
  s = await tag("ig_nudity_v2");
  if (s === null) {
    console.log("error 5s");
    resolve({err: "report error 5s", username:res.username});
    return;
  }

//-------- Get  Context -------------------
  s = await frx({
    entry_point: 1,
    location: 2,
    object_type: 5,
    object_id: up.id,
    context,
    selected_tag_types: '["ig_nudity_v2"]',
    frx_prompt_request_type: 2
});

    if (s === null) {
    console.log("report error code 5");
    //log("report error code 4");
    resolve({err:"report error 5", username:res.username});
    return;
  }

  try {
    context = (s.response.context);
  }catch (e) {context = null};
  if (context === null) {
    console.log("report error 5c");
    resolve({err:"report error 5c", username:res.username});
    //log("report error 2");
    return;
  }
  //------------ End Context ------------------
//##################################################

//##################################################
// (6) select option
await sleep(Math.floor( Math.random() * 15) + 5 );
s = await tag("ig_sexual_exploitation_or_solicitation_v3");
if (s === null) {
  console.log("report error 6s");
  resolve({err:"report error 6s", username:res.username});
  return;
}

//---------- Get Context ------------------

s = await frx({
    entry_point: 1,
    location: 2,
    object_type: 5,
    object_id: up.id,
    context,
    selected_tag_types: '["ig_sexual_exploitation_or_solicitation_v3"]',
    action_type: 2,
    frx_prompt_request_type: 2
});

if (s === null) {
  console.log("report error 6");
  resolve({err:"report error 6", username:res.username});
}
//##################################################
res.status = s.status;
resolve(res);
});
}

async function reportScam(client, up) {
   var path,form,s;
   var res = {};
   var context;
   res.username = client.credentials.username;

  return new Promise(async resolve => {

  //************************************** */
   async function tag(type) {
  //###############################################
  path = "/reports/web/log_tag_selected/";//#######
  form = {//#######################################
    context: context,//############################
    selected_tag_type: type//#######
  }
  s = await client.request.post(path, {//##########
  headers:{//#######################################
    // 'referer':"https://www.instagram.com/" + up,
     },form})//#####################################
     .catch(e => {s = null;});//####################
     if (s === null) {//############################
       
       return null;//###############################
     }
     return s;//####################################
  //################################################
  }

   //************************************** */

  //############ FRX Function ###################
    async function frx(f) {
      path = '/reports/web/get_frx_prompt/';
      var data = {}
  for (var k in f) {
    data[k] = f[k];
  }
  s = await client.request.post(path, {
    form:data,
    // header:{'referer': "https://www.instagram.com/" + up}
  })
  .catch(e => { s = null; });
  return s;
    }
  //############### End FRX Function ##########

//##################################################
//(1) -------- Get Context report user ----------
// click to report
s = await frx({
  'entry_point': 1,
    'location': 2,
    'object_type': 5,
    'object_id': up.id,
    'frx_prompt_request_type': 1
});
  //console.log(s);
  if (s === null) {
    console.log("report error 1");
    //log("report error 1");
    resolve({err:"report error 1", username:res.username});
    return;
  }
  try {
    context = (s.response.context);
  }catch (e) {context = null};
  if (context === null) {
    console.log("report error 1c");
    resolve({err:"report error 1c", username:res.username});
    //log("report error 2");
    return;
  }
  //-----------------------------

  res.ssid = context.match(/"session_id":"(.*?)"/);
  if (res.ssid) res.ssid = res.ssid[1];
  //---------------------------------------------

//###################################################

//##################################################
  // (2) -------------- report to selected ---------------
  // انه غير مناسب
  await sleep(Math.floor( Math.random() * 15) + 5 );
  s = await tag("ig_its_inappropriate_v1");
  if (s == null) {
       consloe.log("report error 2s");
       //log("report error 3");
       resolve({err:"report error 2s", username:res.username});
       return;
     }
     //log("==>" + s.status);
  // console.log(s);

  //----- report (get fry prompt) -----------
  s = await frx({
    context,
    entry_point: 1,
    object_type: 5,
    location: 2,
    object_id: up.id,
    selected_tag_types: '["ig_its_inappropriate_v1"]',
    frx_prompt_request_type: 2
  });
  if (s === null) {
    console.log("report error code 2");
    //log("report error code 4");
    resolve({err:"report error 2", username:res.username});
    return;
  }

  //------------ Get Context --------------
  try {
    context = (s.response.context);
  }catch (e) {context = null};
  if (context === null) {
    console.log("report error 2c");
    resolve({err:"report error 2c", username:res.username});
    //log("report error 2");
    return;
  }
  //---------------- End Context ----------

  //resolve(res);
  // console.log(s);
//--------------------------------------------------
//##################################################

//##################################################
  //------------ (3) report account --------------
  // ابلاغ  عن الحساب
  await sleep(Math.floor( Math.random() * 15) + 5 );
  s = await tag("ig_report_account");
  if (s === null) {
    console.log('report error 3s');
    resolve({err:'report error 3s', username:res.username});
  }
  //--------- report get frx prompt -------------
  s = await frx({
    context,
    entry_point: 1,
    object_type: 5,
    location: 2,
    object_id: up.id,
    selected_tag_types: '["ig_report_account"]',
    frx_prompt_request_type: 2
  });
  if (s === null) {
    console.log("report error code 3");
    //log("report error code 4");
    resolve({err:"report error 3", username:res.username});
    return;
  }
  //------------ Get Context --------------
  try {
    context = (s.response.context);
  }catch (e) {context = null};
  if (context === null) {
    console.log("report error 3c");
    resolve({err:"report error 3c", username:res.username});
    //log("report error 2");
    return;
  }
  //---------------- End Context ----------
//##################################################


//##################################################
// ---------- (4) report ---------------
// محتوى غير لائق
  // log tag
  await sleep(Math.floor( Math.random() * 15) + 5 );
  s = await tag("ig_its_inappropriate");
  if (s === null) {
    console.log("report error 4s");
    resolve({err:"report error 4c", username:res.username});
    return;
  }

  //------------ Get Context ------------------

  s = await frx({
    entry_point: 1,
    location: 2,
    object_type: 5,
    object_id: up.id,
    context,
    selected_tag_types: '["ig_its_inappropriate"]',
    frx_prompt_request_type: 2
  });

    if (s === null) {
    console.log("report error code 4");
    //log("report error code 4");
    resolve({err:"report error 4", username:res.username});
    return;
  }

  try {
    context = (s.response.context);
  }catch (e) {context = null};
  if (context === null) {
    console.log("report error 4c");
    resolve({err:"report error 4c", username:res.username});
    //log("report error 2");
    return;
  }
  //------------ End Context -------------------
//##################################################

//##################################################
await sleep(Math.floor( Math.random() * 15) + 5 );
  //----step (5) -------------
  //scam
  s = await tag("ig_product_scam_fraud_v2");
  if (s === null) {
    console.log("error 5s");
    resolve({err: "report error 5s", username:res.username});
    return;
  }

//-------- Get  Context -------------------
  s = await frx({
    entry_point: 1,
    location: 2,
    object_type: 5,
    object_id: up.id,
    context,
    selected_tag_types: '["ig_product_scam_fraud_v2"]',
    frx_prompt_request_type: 2
});

    if (s === null) {
    console.log("report error code 5");
    //log("report error code 4");
    resolve({err:"report error 5", username:res.username});
    return;
  }
  //console.log("scam: " + JSON.stringify(s));
//##################################################
res.status = s.status;
resolve(res);
});
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {reportSpam, reportSol, reportScam}
