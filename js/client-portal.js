/* ══ CLIENT PORTAL ENTITY ════════════════════════════════════════════════════
   Switch Entity → Closedhi Client: the Payments page as the client sees it,
   built from the client screens (list + Invoice / Basic Details / Employee /
   Attachment / Workflow panel). Closedhi's data, its own entity, so Dhi
   Hyperlocal and the Closedhi client view are untouched.

   LIST   one row per invoice Sent to the client (Cancelled hidden), plus an
          Advance Payment Request Sent before its Order exists. Once the Order
          is generated the request lives on as that Order's Advance Payment
          Invoice (FRD V5 §5.4, US7), shown with its Deal ID + Order ID.
   PANEL  order-level tabs; the Invoice tab lists every Sent invoice of the
          row's Order by month.
   Built from the listing parts (.lp-filter-bar, .listing-stats, .lp-table,
   the split side panel, .lp-sb-field-card, attachTabHTML, .lp-wf-*) and the
   design-system status pills. Display only. */
const CP_ENTITY='closedhi-client', CP_CLIENT='Closedhi';
if(typeof entitiesData!=='undefined'&&!entitiesData.some(function(e){return e.id===CP_ENTITY;}))
  entitiesData.push({id:CP_ENTITY,initials:'CC',name:'Closedhi Client',entityId:'ENT-00294',type:'Client',country:'India',plan:'Professional',employees:2,active:false});
function cpMode(){return typeof seSelectedEntity!=='undefined'&&seSelectedEntity===CP_ENTITY;}

let cp={sel:null,tab:'invoice',q:'',type:'',status:'',date:'',year:'2026',open:{}};
function cpReset(){cp={sel:null,tab:'invoice',q:'',type:'',status:'',date:'',year:'2026',open:{}};}

/* Pay details the Employee tab shows - mock, keyed by Order / Contract. */
const CP_BANK={
  '1116':{bank:'HDFC Bank',acc:'50100293817731',ifsc:'HDFC0001234',swift:'HDFCINBBXXX',currency:'INR'},
  '1118':{bank:'ICICI Bank',acc:'002301558904',ifsc:'ICIC0000023',swift:'ICICINBBXXX',currency:'INR'},
  'c23':{bank:'Axis Bank',acc:'918010045672219',ifsc:'UTIB0000552',swift:'AXISINBBXXX',currency:'INR'}
};
// Files the client adds here stay on the client side.
const cpAttach={};
if(typeof ATTACH_SCOPES!=='undefined')ATTACH_SCOPES.cp={find:function(id){
  if(!cpAttach[id])cpAttach[id]={id:id,attachments:[]};return cpAttach[id];}};

// ── Rows ──
function cpOrders(){return paymentsData.filter(function(p){return p.entityName===CP_CLIENT;});}
function cpRows(){
  const out=[];
  cpOrders().forEach(function(p){
    (imsInvData[p.orderId]||[]).forEach(function(i){
      if(!i.no||!i.sentOn||i.stage==='Cancelled')return;
      out.push({id:'i:'+p.orderId+':'+i.id,kind:'inv',p:p,i:i,
        pid:p.orderId,name:p.name,sub:i.no,due:imsInvDue(i),cur:i.currency,amt:imsInvTotal(i),
        type:p.type,status:imsInvPayStatus(i),date:i.invoiceDate});
    });
  });
  // A request whose Order does not exist yet (once it does, its Advance Payment Invoice stands in).
  Object.keys(imsAdvData).forEach(function(cid){
    const c=contractsData.find(function(x){return String(x.id)===String(cid);});
    if(!c||imsClientOf(c)!==CP_CLIENT)return;
    (imsAdvData[cid]||[]).forEach(function(r){
      if(!r.no||!r.sentOn||r.stage==='Cancelled'||r.orderId)return;
      out.push({id:'r:'+cid+':'+r.id,kind:'req',c:c,r:r,
        pid:'—',name:c.empName,sub:r.no+' · Deal '+c.contractId,due:imsReqDue(r),cur:r.currency,amt:r.amount,
        type:c.type==='Contractor'?'Contractor':c.type+' - Employee',status:imsReqPayStatus(r),date:r.requestDate});
    });
  });
  return out.sort(function(a,b){return a.date<b.date?1:-1;});
}
function cpFind(id){return cpRows().find(function(x){return x.id===id;});}

// ── Actions ──
function cpRefresh(){if(typeof renderADTPage==='function')renderADTPage();}
function cpOpen(id){
  if(cp.sel!==id){cp.tab='invoice';cp.open={};}
  cp.sel=id;
  const sb=document.getElementById('cp-split-sb');
  if(sb&&sb.classList.contains('open')&&typeof isbTab==='function'){
    isbTab('cp',cpPanelHTML);
    document.querySelectorAll('.cp-row').forEach(function(r){r.classList.toggle('lp-row-selected',r.id==='cp-row-'+id);});
  }else cpRefresh();
}
function cpClose(){cp.sel=null;cpRefresh();}
function cpTab(t){cp.tab=t;if(typeof isbTab==='function')isbTab('cp',cpPanelHTML);}
function cpStat(s){cp.status=cp.status===s?'':s;cp.sel=null;cpRefresh();}
function cpApply(){
  cp.q=lpSearchValue('cp-f-q');
  const t=getCSValue('cp-f-type'),s=getCSValue('cp-f-status');
  cp.type=t&&t!=='Type'?t:'';cp.status=s&&s!=='Status'?s:'';
  cp.date=(typeof getCDValue==='function'?getCDValue('cp-f-date'):'')||'';
  cp.sel=null;cpRefresh();
}
function cpResetFilters(){cp.q='';cp.type='';cp.status='';cp.date='';cp.sel=null;cpRefresh();}
function cpYear(v){cp.year=v;cp.open={};cpTab('invoice');}
function cpMonth(k){cp.open[k]=!cpMonthOpen(k);cpTab('invoice');}
function cpDownloadAll(){
  const n=cpInvLines(cpFind(cp.sel)).filter(function(l){return l.date.slice(0,4)===cp.year;}).length;
  showToast('Preparing download','success',n+' document'+(n===1?'':'s')+' will be zipped.');
}

// ── List ──
function cpPaymentsHTML(){
  const dotsIco='<svg width="16" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="2" x2="17" y2="2"/><line x1="1" y1="7" x2="17" y2="7"/><line x1="1" y1="12" x2="17" y2="12"/></svg>';
  const all=cpRows();
  const count=function(s){return all.filter(function(x){return x.status===s;}).length;};
  const rows=lpSearchRows(all.filter(function(x){
    if(cp.status&&x.status!==cp.status)return false;
    if(cp.type&&x.type!==cp.type)return false;
    if(cp.date&&x.due.slice(0,7)!==cp.date.slice(0,7))return false;   // due in the picked month
    return true;
  }),cp.q);
  if(cp.sel&&!rows.some(function(x){return x.id===cp.sel;}))cp.sel=null;
  const types=all.map(function(x){return x.type;}).filter(function(t,n,a){return a.indexOf(t)===n;});
  const stat=function(s,cls){
    return '<div class="listing-stat '+cls+(cp.status===s?' stat-selected':'')+'" onclick="cpStat(\''+s+'\')">'
      +'<div class="listing-stat-count">'+count(s)+'</div><div class="listing-stat-label">'+s+'</div></div>';};
  const pgn=listPage('cp-payments',[cp.q,cp.type,cp.status,cp.date].join('|'),rows.map(function(x,n){
    return '<tr class="cp-row'+(cp.sel===x.id?' lp-row-selected':'')+'" id="cp-row-'+x.id+'" style="cursor:pointer" onclick="cpOpen(\''+x.id+'\')">'
      +'<td style="color:#6b7280;font-size:13px">'+(n+1)+'</td>'
      +'<td style="font-weight:600;color:var(--navy)">'+imsEsc(x.pid)+'</td>'
      +'<td><div class="lp-c-main">'+imsEsc(x.name)+'</div><div class="lp-c-sub">'+imsEsc(x.sub)+'</div></td>'
      +'<td>'+imsDate(x.due)+'</td>'
      +'<td>'+imsMoney(x.cur,x.amt)+'</td>'
      +'<td>'+imsEsc(x.type)+'</td>'
      +'<td>'+(x.status?imsBadge(x.status):'')+'</td>'
      +'<td><button class="lp-action-btn" title="Open" onclick="event.stopPropagation();cpOpen(\''+x.id+'\')">'+dotsIco+'</button></td>'
      +'</tr>';
  }),'<tr><td colspan="8" style="padding:24px;text-align:center;color:var(--gray)">No payments match this filter.</td></tr>');
  return '<div class="lp-page">'
    +'<div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:4px">'
      +'<div class="lp-filter-bar" style="flex:1;min-width:0;padding:0"><div class="lp-filter-bar-label">Select Filter</div>'
      +'<div class="lp-filter-bar-row">'
        +lpSearchField('cp-f-q',cp.q,'Search ID','cpApply()')
        +apCS('cp-f-type',types,cp.type,'Type')
        +apCS('cp-f-status',['Unpaid','Overdue','Paid'],cp.status,'Status')
        +apCD('cp-f-date',cp.date,'Select date')
        +clearFiltersBtn([cp.q,cp.type,cp.status,cp.date],'cpResetFilters()')
        +'<button class="lp-pill-search" onclick="cpApply()">Search</button>'
      +'</div></div>'
      +'<div class="listing-stats" style="flex-shrink:0">'+stat('Unpaid','pending')+stat('Overdue','inactive')+stat('Paid','active')+'</div>'
    +'</div>'
    +'<div class="lp-split-wrap" style="margin-top:14px"><div class="lp-split-main"><div class="lp-table-card" style="border:none;border-radius:0;box-shadow:none">'
      +'<table class="lp-table"><thead><tr><th>S. No</th><th>Payment ID</th><th>Name</th><th>Due Date</th><th>Amount Due</th><th>Type</th><th>Invoice Status</th><th>Action</th></tr></thead>'
      +'<tbody>'+pgn.rows+'</tbody></table>'+pgn.pager
    +'</div></div>'
    +'<div class="lp-split-sb'+(cp.sel?' open':'')+'" id="cp-split-sb"><div class="lp-isb" id="cp-isb-inner">'+(cp.sel?cpPanelHTML():'')+'</div></div>'
    +'</div></div>';
}

// ── Panel ──
// Everything the row's Order (or, before one exists, its Contract) has sent the client.
function cpInvLines(x){
  if(!x)return [];
  const timeOf=function(logs,names){
    const l=(logs||[]).find(function(g){return names.indexOf(g.status)>-1;});return l?l.time:'';};
  if(x.kind==='req'){
    const r=x.r;
    return [{key:r.id,no:r.no,link:'Deal '+x.c.contractId,amt:r.amount,total:r.amount,cur:r.currency,type:'—',
      date:r.requestDate,time:'',status:imsReqPayStatus(r),out:imsReqOutstanding(r),
      dl:'imsDownload('+x.c.id+',\''+r.id+'\')'}];
  }
  return (imsInvData[x.p.orderId]||[]).filter(function(i){return i.no&&i.sentOn&&i.stage!=='Cancelled';})
    .map(function(i){
      return {key:i.id,no:i.no,link:i.advReq?i.advReq+' · Deal '+i.refValue+' · Order '+x.p.orderId:'',
        amt:i.amount,total:imsInvTotal(i),cur:i.currency,type:i.type,date:i.invoiceDate,
        time:timeOf(i.logs,['Generated','Advance Payment Invoice Created']),
        status:imsInvPayStatus(i),out:imsInvOutstanding(i),dl:'imsInvDownload(\''+x.p.orderId+'\',\''+i.id+'\')'};
    }).sort(function(a,b){return a.date<b.date?1:-1;});
}
function cpMonthOpen(k){
  if(k in cp.open)return cp.open[k];
  // The clicked row's month starts open; in another year, the latest month.
  const x=cpFind(cp.sel);
  if(x&&x.date.slice(0,4)===cp.year)return x.date.slice(0,7)===k;
  const first=cpInvLines(x).find(function(l){return l.date.slice(0,4)===cp.year;});
  return !!first&&first.date.slice(0,7)===k;
}
const CP_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function cpInvoiceTabHTML(x){
  const lines=cpInvLines(x).filter(function(l){return l.date.slice(0,4)===cp.year;});
  const years=['2026','2025'];
  let out='<div class="ims-rcv-bar">'
    +'<div style="display:flex;align-items:center;gap:10px">'
      +'<span style="font-size:13px;font-weight:600;color:var(--navy)">Select Year :</span>'
      +'<select class="ims-rcv-select" onchange="cpYear(this.value)">'+years.map(function(y){return '<option'+(y===cp.year?' selected':'')+'>'+y+'</option>';}).join('')+'</select>'
    +'</div>'
    +(lines.length?'<button class="att-link" onclick="cpDownloadAll()">'+IMS_ICO.dl+'Download All</button>':'')
    +'</div>';
  if(!lines.length)return out+'<p style="font-size:13px;color:#9ca3af">No invoices found.</p>';
  const months=[];
  lines.forEach(function(l){const k=l.date.slice(0,7);if(months.indexOf(k)<0)months.push(k);});
  const chev='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
  const heads=['S.No','Invoice No.','Amt','Amt + Tax','Quantity','Type','Create Time','Action'];
  months.forEach(function(k){
    const ml=lines.filter(function(l){return l.date.slice(0,7)===k;});
    const open=cpMonthOpen(k);
    const due=ml.reduce(function(s,l){return s+(l.status==='Paid'?0:l.out);},0);
    out+='<div class="cp-month'+(open?' is-open':'')+'">'
      +'<button class="cp-month-hd" onclick="cpMonth(\''+k+'\')">'
        +'<span class="cp-month-chev">'+chev+'</span>'
        +'<span class="cp-month-name">'+CP_MONTHS[+k.slice(5,7)-1]+' '+k.slice(0,4)+'</span>'
        +'<span class="cp-month-due">Total Due : <b>'+imsMoney(ml[0].cur,due)+'</b></span>'
      +'</button>'
      +(open?'<div class="ims-table-scroll"><table class="ims-table" style="width:100%;border-collapse:collapse">'
        +'<thead><tr>'+heads.map(function(h){return '<th style="'+IMS_TH+'">'+h+'</th>';}).join('')+'</tr></thead><tbody>'
        +ml.map(function(l,n){
          return '<tr>'
            +'<td style="'+IMS_TD+';color:var(--gray)">'+(n+1)+'</td>'
            +'<td style="'+IMS_TD+'"><div class="lp-c-main">'+imsEsc(l.no)+'</div>'+(l.link?'<div class="lp-c-sub">'+imsEsc(l.link)+'</div>':'')+'</td>'
            +'<td style="'+IMS_TD+'">'+imsMoney(l.cur,l.amt)+'</td>'
            +'<td style="'+IMS_TD+'">'+imsMoney(l.cur,l.total)+'</td>'
            +'<td style="'+IMS_TD+'">1</td>'
            +'<td style="'+IMS_TD+'">'+imsEsc(l.type)+'</td>'
            +'<td style="'+IMS_TD+'"><div class="lp-c-main" style="font-weight:500">'+imsDate(l.date)+'</div>'+(l.time?'<div class="lp-c-sub">'+imsEsc(l.time)+'</div>':'')+'</td>'
            +'<td style="'+IMS_TD+'"><div class="cp-act"><button class="att-row-btn" title="Download" onclick="'+l.dl+'">'+IMS_ICO.dl+'</button>'+(l.status?imsBadge(l.status):'')+'</div></td>'
            +'</tr>';
        }).join('')+'</tbody></table></div>':'')
      +'</div>';
  });
  return out;
}
function cpPanelHTML(){
  const x=cpFind(cp.sel);if(!x)return '';
  const tabs=[{id:'basic-details',label:'Basic Details'},{id:'employee',label:'Employee'},{id:'attachment',label:'Attachment'},{id:'invoice',label:'Invoice'},{id:'workflow',label:'Workflow'}];
  const tabBar='<div class="lp-isb-tabbar">'
    +'<div class="lp-isb-tabs" id="cp-isb-tabs">'+tabs.map(function(t){return '<button class="lp-isb-tab'+(cp.tab===t.id?' active':'')+'" onclick="cpTab(\''+t.id+'\')">'+t.label+'</button>';}).join('')+'</div>'
    +'<button class="lp-isb-nav-btn nav-right" onclick="scrollTabRow(\'right\',\'cp-isb-tabs\')" title="Scroll right"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>'
    +'<div class="lp-isb-right"><button class="lp-isb-close" onclick="cpClose()" title="Close">'+IMS_ICO.x+'</button></div>'
    +'</div>';
  const ord=x.kind==='inv';
  const p=x.p||{},c=x.c||{};
  const bank=CP_BANK[ord?p.orderId:'c'+c.id]||{};
  const range=String(c.empDuration||'').split(' – ');
  const cap=function(s){s=String(s||'');return s?s.charAt(0).toUpperCase()+s.slice(1):'';};
  let body='';
  if(cp.tab==='basic-details'){
    body='<div class="lp-sb-detail-grid">'
      +imsFc(IMS_ICO.doc,'Contract Id',imsEsc(ord?p.dealId:c.contractId))
      +imsFc(IMS_ICO.tag,'Country',imsEsc(ord?p.workingCountry:c.country))
      +imsFc(IMS_ICO.user,'Employment Type',imsEsc(ord?String(p.type).split(' - ')[0]:c.type))
      +imsFc(IMS_ICO.cal,'Start Date',imsEsc(ord?p.startFrom:(range[0]?imsDate(range[0]):'')))
      +imsFc(IMS_ICO.cal,'End Date',imsEsc(ord?p.endTo:(range[1]?imsDate(range[1]):'')))
      +imsFc(IMS_ICO.tag,'Create Type',imsEsc(ord?cap(p.addedFrom):'Contract'))
      +'</div>';
  }else if(cp.tab==='employee'){
    const e=ord?(p.emp||{}):{name:c.empName,email:c.email};
    body='<div class="lp-sb-detail-grid">'
      +imsFc(IMS_ICO.user,'Pay Name',imsEsc(e.name))
      +imsFc(IMS_ICO.tag,'Country',imsEsc(ord?p.workingCountry:c.country))
      +imsFc(IMS_ICO.bank,'Pay Bank',imsEsc(bank.bank))
      +imsFc(IMS_ICO.hash,'Account Number',imsEsc(bank.acc))
      +imsFc(IMS_ICO.hash,'IFSC Code',imsEsc(bank.ifsc))
      +imsFc(IMS_ICO.hash,'Swift Code',imsEsc(bank.swift))
      +imsFc(IMS_ICO.dollar,'Currency',imsEsc(bank.currency))
      +imsFc(IMS_ICO.user,'Email',imsEsc(e.email))
      +'</div>';
  }else if(cp.tab==='attachment'){
    body=attachTabHTML('cp',ord?'o'+p.orderId:'c'+c.id);
  }else if(cp.tab==='invoice'){
    body=cpInvoiceTabHTML(x);
  }else if(cp.tab==='workflow'){
    const wf=ord?(pmWorkflowData[p.id]||[]):[{title:'Advance Payment Request Sent',user:'Finance Ops',date:x.r.sentOn,time:'',
      description:'Advance Payment Request '+x.r.no+' sent against Contract/Deal '+c.contractId+'.'}];
    const iP='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    const iC='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    body=wf.length
      ?'<div class="lp-wf-wrap">'+wf.map(function(w,n){return '<div class="lp-wf-row">'
          +'<div class="lp-wf-dot-col"><div class="lp-wf-dot"></div>'+(n<wf.length-1?'<div class="lp-wf-connector"></div>':'')+'</div>'
          +'<div class="lp-wf-card"><div class="lp-wf-title">'+imsEsc(w.title)+'</div>'
          +'<div class="lp-wf-meta-row"><span class="lp-wf-meta-item">'+iP+'<span>'+imsEsc(w.user)+'</span></span>'+(w.date?'<span class="lp-wf-meta-item">'+iC+'<span>'+imsEsc(w.date)+'</span></span>':'')+(w.time?'<span class="lp-wf-meta-sep">|</span><span>'+imsEsc(w.time)+'</span>':'')+'</div>'
          +'<div class="lp-wf-desc"><span class="lp-wf-desc-label">Description:</span><span class="lp-wf-desc-text">'+imsEsc(w.description)+'</span></div>'
          +'</div></div>';}).join('')+'</div>'
      :'<div class="lp-wf-empty">No workflow configured.</div>';
  }
  return tabBar+'<div class="lp-isb-body">'+body+'</div>';
}

// ── Hook: Payments renders the client page while this entity is selected ──
(function cpHook(){
  if(typeof buildPaymentsHTML!=='function')return;
  const base=buildPaymentsHTML;
  buildPaymentsHTML=function(){return cpMode()?cpPaymentsHTML():base();};
})();
