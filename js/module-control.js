/* ══ COMPANY SETTINGS → MODULE CONTROL ══════════════════════════════════════
   FR-11 / User Story 17. Opendhi's internal team switches whole modules on or
   off for one client entity. Module Control is checked BEFORE RBAC: a module
   switched off here is gone for every user of the entity, whatever their role
   grants. Switched on, RBAC decides as it always has.

   Two rows are not switches at all — Dashboard and Profile / My Account are
   always available, so they are drawn locked on rather than left out, and the
   list reads as the whole product rather than most of it.

   Each module owns the sub-modules the FR maps to it. Turning a module on
   opens its sub-module checklist, which starts unticked: the admin picks
   exactly which parts the client gets.

   ALWAYS EDITABLE — no Edit step. The switches work as soon as the tab
   opens; Save Changes commits them and Cancel puts back the last saved state.
   The switch is main.css's .cs-toggle (drawn black here, not green) and the
   ticks are .hd-check, so nothing here draws a control of its own. Every saved change is
   written to the entity's Logs tab (csLogsData) with the module, the old and
   new value, who and when. */

/* Modules and sub-modules are read from the sidebar itself (sidebarItems in
   core.js), so the names here are always the names the client sees in the
   menu: a sidebar dropdown is a module and its pages are the sub-modules; a
   single sidebar link is grouped under its section instead (Support → Chats,
   Tickets).
   Modules are grouped under the sidebar's own section headings (Workforce,
   Time & Pay, Governance, Support) and carry the sidebar's icon, so the tab
   reads as the menu it controls. Dashboard is always on, so it is locked. */
const MC_ALWAYS_ON=['dashboard'];
const MC_SB_ICON={};   // module key → the sidebar's icon; kept out of saved state
function mcFromSidebar(){
  const locked=[],mods=[];
  let section='';
  getSidebarItems().forEach(function(it){
    if(it.section){section=it.section;return;}
    if(it.dropdown){
      const key=it.dropdown.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      MC_SB_ICON[key]=it.icon;
      mods.push({key:key,label:it.dropdown,section:section,on:false,
        subs:(it.children||[]).map(function(c){return {id:c.id,label:c.label,on:false};})});
    }else if(MC_ALWAYS_ON.indexOf(it.id)>=0){
      MC_SB_ICON[it.id]=it.icon;
      locked.push({key:it.id,label:it.label,desc:'Always available to every user'});
    }else{
      /* A single link sitting straight under a section heading (Chats and
         Tickets under Support) is a sub-module of a module named after
         that section, so every module has sub-modules to tick. */
      const key=section.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      let m=mcFind(mods,key);
      if(!m){
        MC_SB_ICON[key]=it.icon;
        m={key:key,label:section,section:section,on:false,subs:[]};
        mods.push(m);
      }
      m.subs.push({id:it.id,label:it.label,on:false});
    }
  });
  // Not in the sidebar (it lives in the user menu), but always available.
  MC_SB_ICON.profile=sbIco.user;
  locked.push({key:'profile',label:'My Profile',desc:'From the user menu, always available'});
  return {locked:locked,mods:mods};
}
function mcIcon(key){return '<span class="mc-ico">'+(MC_SB_ICON[key]||'')+'</span>';}
const MC_LOCKED=mcFromSidebar().locked;
function mcDefaults(){return mcFromSidebar().mods;}

/* No separate view mode: the switches are live the moment the tab opens.
   csModDraft is what is on screen; csModules is what was last saved. */
let csModules=mcDefaults();
let csModDraft=null;
let csModDirty=false;

function mcClone(o){return JSON.parse(JSON.stringify(o));}
function mcFind(list,key){return list.find(function(m){return m.key===key;});}
function mcSubCount(m){return m.subs.filter(function(s){return s.on;}).length;}

const MC_ICO={
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
};

// ── RENDER ──
function csModuleTabHTML(){
  if(!csModDraft)csModDraft=mcClone(csModules);
  const list=csModDraft;
  const on=list.filter(function(m){return m.on;}).length+MC_LOCKED.length;
  const total=list.length+MC_LOCKED.length;

  const header='<div class="lp-sb-view-header"><span class="lp-sb-section-title">Module Control</span>'
    +'<span class="mc-count" id="mc-count">'+on+' of '+total+' modules enabled</span></div>';

  const locked=MC_LOCKED.map(function(m){
    return '<div class="mc-card is-on is-locked">'
      +'<div class="mc-head">'+mcIcon(m.key)
        +'<div class="mc-info"><div class="mc-name">'+m.label+'<span class="mc-tag">'+MC_ICO.lock+'Always enabled</span></div>'
        +'<div class="mc-desc">'+m.desc+'</div></div>'
        +'<label class="cs-toggle" title="Always enabled"><input type="checkbox" checked disabled><span class="cs-toggle-slider"></span></label>'
      +'</div>'
    +'</div>';
  }).join('');

  // One run of cards per sidebar section, in sidebar order.
  let groups='',section=null;
  list.forEach(function(m){
    if(m.section!==section){
      if(section!==null)groups+='</div>';
      section=m.section;
      groups+='<div class="csa-sub">'+section+'</div><div class="mc-list">';
    }
    groups+=mcCardHTML(m);
  });
  if(section!==null)groups+='</div>';

  let out=header
    +'<div class="csa-sub">Always Enabled</div><div class="mc-list">'+locked+'</div>'
    +groups;

  out+='<div class="lp-sb-form-actions">'
    +'<button class="ep-cancel-btn" onclick="mcCancelEdit()">Cancel</button>'
    +'<button class="ep-save-btn" onclick="mcSave()">Save Changes</button>'
  +'</div>';
  return '<div class="mc-form">'+out+'</div>';
}

function mcMetaText(m){
  if(!m.subs.length)return 'No sub-modules';
  return (m.on
    ?mcSubCount(m)+' of '+m.subs.length+' sub-modules selected'
    :m.subs.length+' sub-module'+(m.subs.length===1?'':'s'));
}
function mcCardHTML(m){
  const meta=mcMetaText(m);
  const subs=m.subs.map(function(s,i){
    return '<label class="hd-check mc-check"><input type="checkbox"'+(s.on?' checked':'')
      +' onchange="mcToggleSub(\''+m.key+'\','+i+',this.checked)"><span>'+s.label+'</span></label>';
  }).join('');
  return '<div class="mc-card'+(m.on?' is-on':'')+'" id="mc-card-'+m.key+'">'
    +'<div class="mc-head">'+mcIcon(m.key)
      +'<div class="mc-info"><div class="mc-name">'+m.label+'</div>'
      +'<div class="mc-desc"><span id="mc-meta-'+m.key+'">'+meta+'</span></div></div>'
      +'<label class="cs-toggle"><input type="checkbox"'+(m.on?' checked':'')
        +' onchange="mcToggleModule(\''+m.key+'\',this.checked)"><span class="cs-toggle-slider"></span></label>'
    +'</div>'
    +(m.subs.length?'<div class="mc-subs">'+subs+'</div>':'')
  +'</div>';
}

/* Toggling and ticking only touch the card involved — the tab is not
   repainted, so the switch's own slide and the checklist's reveal play out. */
// No on-screen badge; the flag only tells Cancel whether to say anything.
function mcMarkDirty(){csModDirty=true;}
function mcRefreshMeta(m){
  const meta=document.getElementById('mc-meta-'+m.key);
  if(meta)meta.innerHTML=mcMetaText(m);
  const count=document.getElementById('mc-count');
  if(count){
    const on=csModDraft.filter(function(x){return x.on;}).length+MC_LOCKED.length;
    count.textContent=on+' of '+(csModDraft.length+MC_LOCKED.length)+' modules enabled';
  }
}
function mcToggleModule(key,checked){
  if(!csModDraft)return;
  const m=mcFind(csModDraft,key);if(!m)return;
  m.on=checked;
  const card=document.getElementById('mc-card-'+key);
  if(card)card.classList.toggle('is-on',checked);
  mcRefreshMeta(m);
  mcMarkDirty();
}
function mcToggleSub(key,i,checked){
  if(!csModDraft)return;
  const m=mcFind(csModDraft,key);if(!m||!m.subs[i])return;
  m.subs[i].on=checked;
  mcRefreshMeta(m);
  mcMarkDirty();
}

// ── PERSISTENCE ──
// Cancel puts the switches back to what was last saved.
function mcCancelEdit(){
  csModDraft=null;
  const wasDirty=csModDirty;csModDirty=false;
  isbTab('cs',renderCsSidebar);
  if(wasDirty)showToast('Changes discarded','info','Module access is unchanged.');
}
/* A module switched on with nothing ticked would give the client a module
   with no parts — refused, naming the module that needs a tick. */
function mcSave(){
  const d=csModDraft;if(!d)return;
  const empty=d.find(function(m){return m.on&&m.subs.length&&!mcSubCount(m);});
  if(empty){
    showToast('Select at least one sub-module','error',empty.label+' is switched on with no sub-modules selected.');
    const card=document.getElementById('mc-card-'+empty.key);
    if(card){card.classList.add('mc-card-err');setTimeout(function(){card.classList.remove('mc-card-err');},1500);}
    return;
  }
  /* One Logs entry per module that changed: its name, old value, new value.
     The entry carries the entity's current status, so the timeline heads it
     "Updated" rather than claiming the entity itself changed status. */
  const status=(csLogsData[0]&&csLogsData[0].status)||'Active';
  const stamp=stampNow();
  const lines=[];
  d.forEach(function(m){
    const old=mcFind(csModules,m.key);
    const picked=m.subs.filter(function(s){return s.on;}).map(function(s){return s.label;});
    if(old.on!==m.on){
      lines.push('Module Control · '+m.label+': '+(old.on?'On':'Off')+' → '+(m.on?'On':'Off')
        +(m.on&&picked.length?' ('+picked.join(', ')+')':''));
    }else if(m.on&&m.subs.length){
      const before=old.subs.filter(function(s){return s.on;}).map(function(s){return s.label;});
      if(before.join('|')!==picked.join('|')){
        lines.push('Module Control · '+m.label+' sub-modules: '+(before.join(', ')||'None')+' → '+picked.join(', '));
      }
    }
  });
  csModules=mcClone(d);
  csModDraft=null;csModDirty=false;
  lines.reverse().forEach(function(l){
    csLogsData.unshift({date:stamp.date,time:stamp.time,user:CURRENT_USER,status:status,action:l});
  });
  isbTab('cs',renderCsSidebar);
  if(!lines.length){showToast('No changes to save','info','Module access is unchanged.');return;}
  const onCount=csModules.filter(function(m){return m.on;}).length;
  showToast('Module control saved','success',
    lines.length+' change'+(lines.length===1?'':'s')+' logged · '+onCount+' of '+csModules.length+' modules on');
}
