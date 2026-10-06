/* ══ INVOICE MANAGEMENT PHASE 2 ═════════════════════════════════════════════
   UI for the Invoice Management Phase 2 FRD. Display only: the fields, states
   and actions are all here, the rules behind them belong to the backend.

   BUILT FROM THE SHARED PARTS, like every Company Settings tab:
   .lp-sb-detail-grid / .lp-sb-field-card to read, .csa-sub for a section
   line, and main.css's .cs-toggle for switches. Nothing here draws a control
   of its own. */

/* ── COMPANY SETTINGS → PAYROLL → PAYMENTS / INVOICE SETTINGS ───────────────
   FR1 Payment Terms and FR4 Allow Advance Payment, per entity. The term set
   here is the DEFAULT: it pre-fills every new invoice and advance request,
   which can still change it. The Advance switch is live, the same as the
   Payroll Input Rules switches directly above it - no edit mode. */

const IMS_TERMS=[
  {term:'Due on Receipt',days:0},
  {term:'Net 7',days:7},
  {term:'Net 15',days:15},
  {term:'Net 30',days:30},
  {term:'Net 45',days:45},
  {term:'Net 60',days:60},
  {term:'Net 90',days:90},
  {term:'Custom',days:null}
];

/* The FRD's default for Allow Advance Payment is OFF. The prototype starts it
   ON so the Create pop-up can be reached on any contract past Quotation
   Approved; switch it off in Company Settings → Payroll to see the hidden state. */
let csPay={
  paymentTerm:'Net 30',
  customDays:21,
  customDate:'2026-07-15',   // Custom term on the Payments tab is a date
  allowAdvance:true,
  // the Payroll Input Rules switches, now part of the same edit
  includeExpenses:true,
  deductUnpaid:true
};

// Payment Due Days for a term - the Custom term carries its own.
function imsTermDays(term,customDays){
  const t=IMS_TERMS.find(function(x){return x.term===term;});
  return t&&t.days!=null?t.days:customDays;
}
function imsDaysText(n){return n+' Day'+(n===1?'':'s');}

const IMS_ICO={
  expand:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  hash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  bank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
  dollar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  x:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  eye:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  send:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  edit:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  dl:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  link:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
};

function imsFc(icon,label,value,wide){
  return '<div class="lp-sb-field-card'+(wide?' is-wide':'')+'">'
    +'<div class="lp-sb-field-icon">'+icon+'</div>'
    +'<div class="lp-sb-field-content"><div class="lp-sb-field-label">'+label+'</div>'
    +'<div class="lp-sb-field-value">'+(value!=null&&value!==''?value:'<span style="color:#9ca3af">-</span>')+'</div></div>'
  +'</div>';
}

/* ── The Payroll tab's own Edit ──
   The tab reads first and changes only through its Edit button, the Leaves
   tab's pattern: in view the payment term is a value and each switch reads
   ON / OFF; Edit turns them into the dropdown and toggles, with Cancel /
   Save Changes at the end. Nothing is written until Save. */
let csPayEdit=false;
let csPayEditTab='';      // which tab is in Edit: 'payroll' or 'payments'
let csPayDraft=null;
function imsPayClone(o){return JSON.parse(JSON.stringify(o));}
function imsOnOff(on){return '<span class="ims-onoff">'+(on?'ON':'OFF')+'</span>';}
function imsPayEditing(tab){return csPayEdit&&csPayEditTab===tab;}
// A tab header: Edit in view, the "Unsaved changes" chip while that tab is editing.
function csPayrollHeaderAction(tab){
  tab=tab||'payroll';
  return imsPayEditing(tab)
    ?'<span class="csa-dirty" id="ims-dirty">Unsaved changes</span>'
    :'<button class="lp-sb-view-edit-btn" onclick="imsPayrollStartEdit(\''+tab+'\')">'+IMS_ICO.edit+' Edit</button>';
}
// One row of the switch cards - same markup as the tab has always used.
function imsRuleRow(label,key,on,last,edit){
  return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0'+(last?'':';border-bottom:1px solid #f1f5f9')+'">'
    +'<span style="font-size:13px;color:var(--navy)">'+label+'</span>'
    +(edit
      ?'<label class="cs-toggle"><input type="checkbox" id="ims-sw-'+key+'"'+(on?' checked':'')+' onchange="imsPayDirty()"><span class="cs-toggle-slider"></span></label>'
      :imsOnOff(on))
  +'</div>';
}
function imsCard(rows){return '<div style="background:#fff;border:1px solid var(--border);border-radius:10px;padding:4px 14px">'+rows+'</div>';}
function imsPayActions(){
  return '<div class="lp-sb-form-actions ims-pay-actions">'
    +'<button class="ep-cancel-btn" onclick="imsPayrollCancelEdit()">Cancel</button>'
    +'<button class="ep-save-btn" onclick="imsPayrollSave()">Save Changes</button></div>';
}
// Payroll tab → Payroll Input Rules (called from pages.js).
function csPayrollRulesHTML(){
  const edit=imsPayEditing('payroll');
  const m=edit?csPayDraft:csPay;
  return '<div style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:10px">Payroll Input Rules</div>'
    +imsCard(imsRuleRow('Include Approved Expenses in Payroll','exp',m.includeExpenses,false,edit)
      +imsRuleRow('Deduct Unpaid Leave Automatically','lop',m.deductUnpaid,true,edit))
    +(edit?imsPayActions():'');
}
// Payments tab (FR1 Payment Terms, FR4 Allow Advance Payment) - its own Edit.
function csPaymentsTabHTML(){
  const edit=imsPayEditing('payments');
  const m=edit?csPayDraft:csPay;
  const isCustom=m.paymentTerm==='Custom';
  let out='<div class="lp-sb-view-header"><span class="lp-sb-section-title">Payment Settings</span>'+csPayrollHeaderAction('payments')+'</div>'
    +'<div class="ims-pay-view">';
  if(edit){
    out+='<div class="lp-sb-form-grid ims-pay-grid">'
      +'<div class="lp-sb-field"><label>Default Payment Term</label>'
        +apCS('ims-term',IMS_TERMS.map(function(t){return t.term;}),m.paymentTerm,'Select term','imsPayTermPick')+'</div>'
      +'<div class="lp-sb-field" id="ims-days-wrap"'+(isCustom?'':' style="display:none"')+'><label>Due Date</label>'
        +apCD('ims-cdate',m.customDate,'Select date','imsPayDirty')+'</div>'
      +'</div>';
  }else{
    out+='<div class="lp-sb-detail-grid">'
      +imsFc(IMS_ICO.doc,'Default Payment Term',imsEsc(m.paymentTerm)+(isCustom?' · '+imsDate(m.customDate):''))
      +'</div>';
  }
  out+='<div style="margin-top:10px">'+imsCard(imsRuleRow('Allow Advance Payment','adv',m.allowAdvance,true,edit))+'</div>';
  if(edit)out+=imsPayActions();
  return out+'</div>';
}
function imsPayDirty(){const el=document.getElementById('ims-dirty');if(el)el.classList.add('is-on');}
// apCS hook: the Custom days field shows only for Custom.
function imsPayTermPick(v){
  if(csPayDraft)csPayDraft.paymentTerm=v;
  const w=document.getElementById('ims-days-wrap');if(w)w.style.display=v==='Custom'?'':'none';
  imsPayDirty();
}
function imsPayrollStartEdit(tab){
  csPayDraft=imsPayClone(csPay);csPayEdit=true;csPayEditTab=tab||'payroll';
  isbTab('cs',renderCsSidebar);
}
function imsPayrollCancelEdit(){
  csPayEdit=false;csPayEditTab='';csPayDraft=null;
  isbTab('cs',renderCsSidebar);
}
function imsPayrollSave(){
  const d=csPayDraft;if(!d)return;
  const tab=csPayEditTab;
  const on=function(k){const el=document.getElementById('ims-sw-'+k);return el?el.checked:null;};
  if(document.getElementById('cdw-ims-cdate')||document.querySelector('.cd-trigger[data-cdid="ims-cdate"]')){const v=getCDValue('ims-cdate');if(v)d.customDate=v;}
  if(on('exp')!==null)d.includeExpenses=on('exp');
  if(on('lop')!==null)d.deductUnpaid=on('lop');
  if(on('adv')!==null)d.allowAdvance=on('adv');
  csPay=imsPayClone(d);
  csPayEdit=false;csPayEditTab='';csPayDraft=null;
  isbTab('cs',renderCsSidebar);
  if(tab==='payments')showToast('Payment settings saved','success',csPay.paymentTerm+' · '+(csPay.paymentTerm==='Custom'?'due '+imsDate(csPay.customDate):imsDaysText(imsTermDays(csPay.paymentTerm,csPay.customDays)))
    +' · Advance Payment '+(csPay.allowAdvance?'ON':'OFF'));
  else showToast('Payroll settings saved','success','Payroll Input Rules updated.');
}
// Leaving a tab leaves its Edit unsaved.
(function(){
  if(typeof csSetTab!=='function')return;
  const base=csSetTab;
  csSetTab=function(tab){if(csPayEdit&&tab!==csPayEditTab){csPayEdit=false;csPayEditTab='';csPayDraft=null;}return base.apply(this,arguments);};
})();

/* ══ CONTRACTS → CONTRACT PANEL → ADVANCE PAYMENT ═══════════════════════════
   FR5 / US5 / US6 / US9. The client pays before the contract is approved and
   before an order exists. One active request per contract; a cancelled one
   stays on record and a replacement can be raised.

     REQUEST     Draft → Generated → Sent, or Cancelled from Generated / Sent.
                 Payment Status (Unpaid / Overdue / Paid) is separate from the
                 stage and only applies once Sent.
     ORDER       From Contract Approved, the request carries on in Receivables
                 as the order's Advance Payment Invoice.

   Built from the panel's own parts: .lp-sb-view-header, .pm-ts-stats,
   .lp-sb-detail-grid / .lp-sb-field-card, the compliance tab's table, .csa-sub
   and .csa-empty, the .ct-modal shell and .lp-status-badge tones. The document
   preview is the ADT document page (.adt-doc-page) the agreements use.

   Display only - the amount and payment rules belong to the backend. */

// The one fixed "today" the prototype's timesheets already use.
const IMS_TODAY=typeof TS_TODAY!=='undefined'?TS_TODAY:'2026-06-24';
const IMS_CURRENCIES=['INR','EUR','GBP','USD'];
const IMS_MODES=['Bank Transfer','UPI','Cheque','Card'];
// ADT's billing entity, by the currency it bills in.
const IMS_BILLING={INR:'Dhi Hyperlocal Pvt Ltd',EUR:'Dhi Hyperlocal BV',GBP:'Dhi Hyperlocal Ltd',USD:'Dhi Hyperlocal Inc'};
const IMS_BANKS={
  INR:['HDFC Bank ••4410','ICICI Bank ••2087'],
  EUR:['ING Bank ••4567','ABN AMRO ••1198'],
  GBP:['Barclays ••9876','HSBC UK ••3321'],
  USD:['Citibank ••7765']
};
const IMS_PAY_INSTR={
  INR:'HDFC Bank · A/C 50200012344410 · IFSC HDFC0000123 · Dhi Hyperlocal Pvt Ltd',
  EUR:'ING Bank · IBAN NL91 INGB 0001 2345 67 · BIC INGBNL2A · Dhi Hyperlocal BV',
  GBP:'Barclays · Sort code 20-00-00 · A/C 43219876 · Dhi Hyperlocal Ltd',
  USD:'Citibank · A/C 30017765 · ABA 021000089 · Dhi Hyperlocal Inc'
};
/* Contracts carry no client company in the prototype, so the one each belongs
   to is set here (FR5 needs Client on the request and the balance). */
const IMS_CLIENT={2:'Closedhi',4:'Nimbus Retail Pvt Ltd',7:'Closedhi',13:'Harbor Health Ltd',14:'Nimbus Retail Pvt Ltd',
  17:'Orbit Labs BV',23:'Closedhi',10:'Nimbus Retail Pvt Ltd'};
function imsClientOf(c){return IMS_CLIENT[c.id]||'Closedhi';}
function imsClientContacts(client){
  // Company name without its legal suffix: "Nimbus Retail Pvt Ltd" -> nimbusretail.com
  const slug=String(client).replace(/\b(pvt|private|ltd|limited|bv|inc|llc|gmbh|sl)\b\.?/gi,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,'');
  return [
    {name:'Accounts Payable',email:'accounts@'+slug+'.com'},
    {name:'Finance Head',email:'finance@'+slug+'.com'}
  ];
}

/* ── Mock data ─────────────────────────────────────────────────────────────
   Every stage and status appears at least once:
     2  Draft                         14 Sent · Overdue
     4  Sent · Unpaid, part-paid      17 Generated (pending sending)
     7  Paid → Order 1118, partly applied
     13 Cancelled + replacement Paid → Order 1119
     23 Cancelled, no replacement yet
     3  Inactive contract (Create is blocked) */
let imsAdvSeq=9;
const imsAdvData={
  2:[{id:'r2a',no:null,stage:'Draft',amount:170000,currency:'INR',requestDate:'2026-06-22',term:'Net 15',customDays:0,
      createdOn:'22 Jun 2026',payments:[]}],
  4:[{id:'r4a',no:'ADV/2026-27/0003',stage:'Sent',amount:200000,currency:'INR',requestDate:'2026-06-10',term:'Net 30',customDays:0,
      sentOn:'10 Jun 2026',sentTo:['accounts@nimbusretail.com'],
      payments:[],
      }],
  14:[{id:'r14a',no:'ADV/2026-27/0004',stage:'Sent',amount:150000,currency:'INR',requestDate:'2026-05-26',term:'Net 15',customDays:0,
      sentOn:'26 May 2026',sentTo:['accounts@nimbusretail.com'],payments:[]}],
  17:[{id:'r17a',no:'ADV/2026-27/0005',stage:'Generated',amount:5000,currency:'EUR',requestDate:'2026-06-23',term:'Net 7',customDays:0,
      payments:[]}],
  7:[{id:'r7a',no:'ADV/2026-27/0001',stage:'Sent',amount:300000,currency:'INR',requestDate:'2026-05-04',term:'Net 15',customDays:0,
      sentOn:'04 May 2026',sentTo:['accounts@closedhi.com'],orderId:'1118',
      payments:[{date:'2026-05-12',amount:300000,mode:'Bank Transfer',ref:'NEFT-HDFC-88213',bank:'HDFC Bank ••4410',by:'Finance Ops'}],
      }],
  13:[{id:'r13a',no:'ADV/2026-27/0002',stage:'Cancelled',amount:8000,currency:'GBP',requestDate:'2026-05-08',term:'Net 7',customDays:0,
      sentOn:'08 May 2026',cancelledOn:'12 May 2026',cancelledBy:'Finance Ops',
      cancelReason:'Amount revised after commercial review. Replaced by a new request.',payments:[]},
     {id:'r13b',no:'ADV/2026-27/0006',stage:'Sent',amount:6000,currency:'GBP',requestDate:'2026-05-12',term:'Net 7',customDays:0,
      sentOn:'12 May 2026',sentTo:['accounts@harborhealth.com'],orderId:'1119',
      payments:[{date:'2026-05-16',amount:6000,mode:'Card',ref:'CARD-TXN-55120',bank:'Barclays ••9876',by:'Finance Ops'}],
      }],
  /* Contract 10 - INR 1,00,000 advance received; carried into order 1120 as its
     Advance Payment Invoice. */
  10:[{id:'r10a',no:'ADV/2026-27/0008',stage:'Sent',amount:100000,currency:'INR',requestDate:'2026-05-25',term:'Net 15',customDays:0,
      sentOn:'25 May 2026',sentTo:['accounts@nimbusretail.com'],orderId:'1120',
      payments:[{date:'2026-05-28',amount:100000,mode:'Bank Transfer',ref:'NEFT-ICIC-40211',bank:'HDFC Bank ••4410',by:'Finance Ops'}],
      }],
  23:[{id:'r23a',no:'ADV/2026-27/0007',stage:'Cancelled',amount:50000,currency:'INR',requestDate:'2026-06-01',term:'Net 15',customDays:0,
      cancelledOn:'03 Jun 2026',cancelledBy:'Finance Ops',
      cancelReason:'Client asked to raise the advance after contract approval.',payments:[]},
     // The replacement, sent and still unpaid - what the client sees to Pay.
     {id:'r23b',no:'ADV/2026-27/0009',stage:'Sent',amount:75000,currency:'INR',requestDate:'2026-06-15',term:'Net 15',customDays:0,
      sentOn:'15 Jun 2026',sentTo:['accounts@closedhi.com'],payments:[]}]
};

/* The two orders the paid advances carried into (contracts 7 and 13, both past
   Contract Approved). Every nested block the order panel reads is filled. */
(function imsSeedOrders(){
  if(typeof paymentsData==='undefined')return;
  const mk=function(id,orderId,c,client,cur,amount,invSt){
    if(paymentsData.some(function(p){return p.orderId===orderId;}))return;
    const money=payMoney(cur,amount);
    paymentsData.push({id:id,orderId:orderId,name:c.empName,amountDue:money,type:c.type+' - Employee',orderStatus:'Onboarding',invoiceStatus:invSt,
      key:orderId,dealId:c.contractId,entityName:client,addedFrom:'agency',createdTime:c.approvedOn+' | 10:00 am',courseId:'—',courseName:'—',
      lastUpdated:'--',startFrom:c.startFrom,endTo:c.endTo,workingCountry:c.country,orderCategory:'international',
      emp:{empId:'—',name:c.empName,email:c.email||'—',mobile:c.contact||'—',status:'Pending Onboarding',createdOn:c.approvedOn+' | 10:00 am'},
      sales:{companyId:'—',companyName:client,contactPersonId:'—',contactPersonName:'Accounts Payable',rateType:'Monthly',days:'0',
        rate:money,totalAmount:money,contractPeriod:'—',workLocation:c.country,tsPeriodDate:'—',paymentTerm:'15'},
      user:{company:{userId:'—',concernPersonName:'Accounts Payable',companyName:client,firstName:'—',lastName:'—',email:'—',mobile:'—',altMobile:'—',website:'—',address:'—'},
        concern:{key:'—',name:'Accounts Payable',mobile:'—',email:'—',date:c.approvedOn,createBy:'Finance Ops',address:'—'}},
      attachments:[]});
    if(typeof pmWorkflowData!=='undefined')pmWorkflowData[id]=[{title:'Order Created',user:'System',date:c.approvedOn,time:'10:00 am',
      description:'Order generated on contract approval ('+c.contractId+'). Advance Payment Invoice created in Receivables.'}];
    if(typeof pmLogsData!=='undefined')pmLogsData[id]=[{date:c.approvedOn,time:'10:00 AM',user:'System',status:'Onboarding',
      action:'Order created on approval of contract '+c.contractId+'.'}];
  };
  const byId=function(n){return (typeof contractsData!=='undefined'?contractsData:[]).find(function(c){return c.id===n;});};
  const c7=byId(7),c13=byId(13);
  if(c7)mk(3,'1118',Object.assign({approvedOn:'20 May 2026',startFrom:'01 Jun 2026',endTo:'31 May 2027'},c7),'Closedhi','INR',100000,'Pending');
  const c10=byId(10);
  if(c10)mk(5,'1120',Object.assign({approvedOn:'01 Jun 2026',startFrom:'15 Jun 2026',endTo:'14 Jun 2027'},c10),'Nimbus Retail Pvt Ltd','INR',40000,'Pending');
  if(c13)mk(4,'1119',Object.assign({approvedOn:'22 May 2026',startFrom:'01 Jun 2026',endTo:'31 Dec 2026'},c13),'Harbor Health Ltd','GBP',4500,'Unpaid');
})();

// ── Helpers ──
function imsEsc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function imsMoney(cur,n){return payMoney(cur,n);}
function imsDate(iso){return iso?payDateLabel(iso):'—';}
function imsAddDays(iso,days){
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso||'');if(!m)return '';
  const d=new Date(Date.UTC(+m[1],+m[2]-1,+m[3]+Number(days||0)));
  return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0');
}
function imsDaysBetween(a,b){return Math.round((Date.parse(b)-Date.parse(a))/86400000);}
function imsSum(list,k){return (list||[]).reduce(function(s,x){return s+Number(x[k]||0);},0);}
function imsReqDueDays(r){return imsTermDays(r.term,r.customDays);}
function imsReqDue(r){return imsAddDays(r.requestDate,imsReqDueDays(r));}
function imsReqReceived(r){return imsSum(r.payments,'amount');}
function imsReqOutstanding(r){return Math.max(0,r.amount-imsReqReceived(r));}
// Payment Status is derived, never picked: blank before Sent, '—' once cancelled.
function imsReqPayStatus(r){
  if(r.stage==='Cancelled')return '—';
  if(r.stage!=='Sent')return '';
  if(imsReqOutstanding(r)===0)return 'Paid';
  return IMS_TODAY>imsReqDue(r)?'Overdue':'Unpaid';
}
function imsActiveReq(cid){
  const list=imsAdvData[cid]||[];
  for(let i=list.length-1;i>=0;i--)if(list[i].stage!=='Cancelled')return list[i];
  return null;
}
function imsFindReq(cid,rid){return (imsAdvData[cid]||[]).find(function(r){return r.id===rid;});}
// Client + Contract + Currency: everything confirmed against live requests.
/* Statuses take the listing tones (SB_STATUS_TONE): Paid green, Draft / Unpaid
   amber, Overdue / Cancelled red, Generated blue. Tags stay neutral (.ims-tag). */
// One status per document: the Payment Status once Sent (Unpaid / Overdue /
// Paid), otherwise where it stands - Draft, Generated or Cancelled.
function imsStatusBadge(stage,ps){return imsBadge(ps&&ps!=='—'?ps:stage);}
// Overdue reads amber (attention), not red.
function imsBadge(v){return v&&v!=='—'?'<span class="lp-status-badge ims-badge tone-'+(v==='Overdue'?'wait':statusTone(v))+'">'+v+'</span>'
  :'<span class="ims-dash">—</span>';}
function imsInternalTag(){return '<span class="lp-status-badge ims-badge ims-tag">Internal only</span>';}
function imsCtApproved(c){
  const flow=typeof ctFlowFor==='function'?ctFlowFor(c.type):[];
  const at=flow.indexOf('Contract Approved');
  return at>=0&&flow.indexOf(c.status)>=at;
}
function imsNextAdvNo(){imsAdvSeq+=1;return 'ADV/2026-27/'+String(imsAdvSeq).padStart(4,'0');}
function imsBtn(label,onclick,primary,icon,disabled){
  return '<button class="'+(primary?'ep-save-btn':'ep-cancel-btn')+' ims-btn-sm"'+(disabled?' disabled':'')
    +' onclick="'+onclick+'">'+(icon||'')+label+'</button>';
}
/* Repaint what shows the request: the Advance Payment pop-up when it is open,
   and the contract panel behind it, whose Logs timeline carries the entries. */
function imsRefreshCt(){
  if(imsModal&&imsModal.kind==='view')imsPaint();
  if(typeof isbTab==='function'&&typeof ctSelectedId!=='undefined'&&ctSelectedId!=null)isbTab('ct',renderCtSidebar);
}
/* Every Advance Payment action is written into the contract's Logs, as an
   "Advance Payment" entry with what happened as its comment. */
/* `o` (optional): status - the entry's heading (default "Advance Payment"),
   user - the actor ("System" for what the system does). */
function imsCtLog(cid,text,o){
  o=o||{};
  const s=stampNow();
  if(typeof ctLogsData==='undefined')return;
  (ctLogsData[cid]=ctLogsData[cid]||[]).unshift({date:s.date,time:s.time,user:o.user||CURRENT_USER,
    status:o.status||'Advance Payment',action:imsEsc(text)});
}

/* ── Audit (FR 5.9 / US9) ──
   Besides the action itself, the system records the request's Payment Status
   change (previous → new) and every notification sent. Take a snapshot before
   the change, then imsAdvAudit() after it. */
function imsAdvSnap(cid){
  const r=imsActiveReq(cid);
  return {rid:r&&r.id,ps:r?imsReqPayStatus(r):''};
}
function imsAdvAudit(cid,before){
  const after=imsAdvSnap(cid);
  const r=after.rid?imsFindReq(cid,after.rid):(before.rid?imsFindReq(cid,before.rid):null);
  if(r){
    const ps1=imsReqPayStatus(r),ps0=before.rid===r.id?before.ps:'';
    if(ps0!==ps1)imsCtLog(cid,(r.no||'Draft request')+' · '+(ps0||'—')+' → '+(ps1||'—')
      +(ps1==='Paid'||ps1==='—'?'':' · Outstanding '+imsMoney(r.currency,imsReqOutstanding(r)))+'.',{user:'System',status:'Payment Status Changed'});
  }
}
function imsNotifLog(cid,event,to){
  imsCtLog(cid,event+' · email to '+(to&&to.length?to.join(', '):'client')+' · in-app.',{user:'System',status:'Notification Sent'});
}

/* ── Contract Logs → Advance Payment ───────────────────────────────────────
   Everything starts in the contract's Logs Status select. None of these move
   the contract itself.

     Advance Payment                    opens the request form: a blank one,
                                        the saved draft (Cancel / Save Draft /
                                        Generate), or the request read-only
     Advance Payment · Send             Generated - Recipients appear between
                                        Status and Comment; Submit sends
     Advance Payment · Cancel           Generated, or Sent with nothing paid -
                                        the Comment is the Cancellation Reason
     Advance Payment · Received         Sent and unpaid - Comment, Submit marks it Paid

   Each step is offered only while it applies, and every one of them lands in
   the Logs timeline as an "Advance Payment" entry. */
const IMS_AP='Advance Payment';
const IMS_AP_SEND=IMS_AP+' · Send';
const IMS_AP_CANCEL=IMS_AP+' · Cancel';
const IMS_AP_PAY=IMS_AP+' · Received';
function imsAdvEligible(c){
  if((imsAdvData[c.id]||[]).length)return true;
  return !!csPay.allowAdvance;
}
function imsApOptions(c){
  const out=[IMS_AP];
  const r=imsActiveReq(c.id);
  if(r&&r.stage==='Generated')out.push(IMS_AP_SEND,IMS_AP_CANCEL);
  if(r&&r.stage==='Sent'){
    if(imsReqOutstanding(r)>0)out.push(IMS_AP_PAY);
    if(imsReqReceived(r)===0)out.push(IMS_AP_CANCEL);
  }
  return out;
}
function imsCtLogOptions(c,opts){
  if(!imsAdvEligible(c))return opts;
  const flow=ctFlowFor(c.type);
  const i=flow.indexOf(c.status);
  // After the current status and its one step forward, before the steps back.
  const k=Math.min(opts.length,i>=0&&i<flow.length-1?2:1);
  return opts.slice(0,k).concat(imsApOptions(c),opts.slice(k));
}
/* The one field that sits between Status and Comment: Send's recipients.
   Rendered hidden with the form, shown only while Send is picked. */
// Send is a pop-up (imsOpenSendAdv), so nothing sits between Status and Comment.
function imsCtLogBlockHTML(){return '';}
function imsLgCommentLabel(text){
  const lbl=document.getElementById('ct-log-comment-lbl');
  if(lbl)lbl.innerHTML=text+' <span class="lp-logs-form-req">*</span>';
}
// The pop-up picks leave the select on the contract's own status.
function imsCtLogReset(id,c){
  const wrap=document.getElementById('csw-'+id);
  if(!wrap)return;
  const val=wrap.querySelector('.cs-value');if(val)val.textContent=c.status;
  wrap.querySelectorAll('.cs-option').forEach(function(o){o.classList.toggle('cs-selected',o.textContent===c.status);});
}
// apCS hook on the contract Logs Status select.
function imsCtLogPick(v,id){
  const rc=document.getElementById('ims-lg-recips');
  if(rc)rc.style.display=v===IMS_AP_SEND?'':'none';
  imsLgCommentLabel(v===IMS_AP_CANCEL?'Cancellation Reason':'Comment');
  const c=contractsData.find(function(x){return x.id===ctSelectedId;});
  if(!c)return;
  const r=imsActiveReq(c.id);
  if(v===IMS_AP){imsCtLogReset(id,c);imsOpenAdvanceForm(c.id);}
  else if(v===IMS_AP_SEND&&r){imsCtLogReset(id,c);imsOpenSendAdv(c.id,r.id);}
}
function imsOpenAdvanceForm(cid){
  const list=imsAdvData[cid]||[];
  const r=imsActiveReq(cid)||list[list.length-1];
  if(!r||r.stage==='Cancelled'){imsOpenCreate(cid);return;}
  imsOpenEdit(cid,r.id);
}
/* Submit with an Advance Payment step picked (ctSaveLog hands over here).
   Send and Cancel are recorded with the comment; the others reopen their
   pop-up. */
function imsCtLogSubmit(cid,inpId){
  const act=getCSValue('ct-log-status-sel');
  if(act!==IMS_AP_CANCEL&&act!==IMS_AP_PAY){imsCtLogPick(act,'ct-log-status-sel');return;}
  const flash=function(el){if(el){el.classList.add('is-invalid');setTimeout(function(){el.classList.remove('is-invalid');},1600);}};
  const inp=document.getElementById(inpId||'ct-log-comment-inp');
  const comment=inp?inp.value.trim():'';
  if(!comment){flash(inp);return;}
  const r=imsActiveReq(cid);if(!r)return;
  if(act===IMS_AP_PAY){
    // US6: Advance Payment · Received - the full amount, confirmed from the Logs.
    const c=contractsData.find(function(x){return x.id===cid;})||{};
    const to=[(imsClientContacts(imsClientOf(c))[0]||{}).email||'client','OpenDHI Finance/Admin'];
    const amt=imsReqOutstanding(r);
    const before=imsAdvSnap(cid);
    r.payments.push({date:IMS_TODAY,amount:amt,mode:'—',ref:'—',by:CURRENT_USER,notes:comment});
    imsCtLog(cid,'Advance payment of '+imsMoney(r.currency,amt)+' received against '+r.no+'. '+comment);
    imsAdvAudit(cid,before);
    imsNotifLog(cid,'Advance Payment Received',to);
    imsNotify(IMS_MSG.advPaid(r.no),'Contract ID - '+c.contractId,function(){imsGoContract(cid);});
    imsRefreshCt();
    showToast('Advance payment received','success',r.no+' · '+imsMoney(r.currency,amt)+' · Paid. Notification sent to the client and OpenDHI Finance.');
  }else if(act===IMS_AP_SEND){
    const rc=Array.prototype.map.call(document.querySelectorAll('.ims-recip:checked'),function(x){return x.value;});
    if(!rc.length){showToast('Pick at least one recipient','error','The request is sent only to a valid client recipient.');return;}
    r.stage='Sent';r.sentOn=imsDate(IMS_TODAY);r.sentTo=rc;
    imsCtLog(cid,'Advance Payment Request '+r.no+' sent to '+rc.join(', ')+'. '+comment);
    imsRefreshCt();
    const ps=imsReqPayStatus(r);
    showToast('Advance request sent','success','Advance Payment Request '+r.no+' requires payment of '+imsMoney(r.currency,r.amount)
      +'. Notification sent to the client'+(ps==='Overdue'?' · already past its Due Date, marked Overdue.':'.'));
  }else{
    const before=imsAdvSnap(cid);
    r.stage='Cancelled';r.cancelReason=comment;r.cancelledOn=imsDate(IMS_TODAY);r.cancelledBy=CURRENT_USER;
    imsCtLog(cid,'Advance Payment Request '+r.no+' cancelled. Reason: '+comment);
    if(before.ps)imsCtLog(cid,r.no+' · '+before.ps+' → —.',{user:'System',status:'Payment Status Changed'});
    imsRefreshCt();
    showToast('Advance request cancelled','info',r.no+' is cancelled. A replacement request can now be created.');
  }
}
function imsOpenAdvance(cid){
  if((imsAdvData[cid]||[]).length){imsModal={kind:'view',cid:cid};imsPaint();}
  else imsOpenCreate(cid);
}
function imsViewHTML(c){
  return imsShell('Advance Payment','Contract '+imsEsc(c.contractId)+' · '+imsEsc(c.empName)+' · '+imsEsc(imsClientOf(c)),
    '<div class="ims-adv-modal">'+ctAdvanceTabHTML(c)+'</div>',
    '<button class="ep-save-btn" onclick="imsClose()">Close</button>',true);
}
// Panel tables: the compliance tab's own head and cell styles.
const IMS_TH='padding:9px 12px;text-align:left;font-size:11px;font-weight:600;color:var(--navy);background:#f8fafc;border-bottom:1px solid var(--border)';
const IMS_TD='padding:10px 12px;font-size:13px;color:var(--navy);border-bottom:1px solid #f1f5f9';
function imsTable(heads,rows){
  return '<table class="ims-table" style="width:100%;border-collapse:collapse;border:1px solid var(--border);border-radius:10px;overflow:hidden">'
    +'<thead><tr>'+heads.map(function(h){return '<th style="'+IMS_TH+'">'+h+'</th>';}).join('')+'</tr></thead>'
    +'<tbody>'+rows.map(function(r){return '<tr>'+r.map(function(cell){return '<td style="'+IMS_TD+'">'+cell+'</td>';}).join('')+'</tr>';}).join('')+'</tbody>'
  +'</table>';
}
function imsStat(label,val,color){
  return '<div class="pm-ts-stat"><div class="pm-ts-stat-val" style="color:'+(color||'var(--navy)')+'">'+val+'</div><div class="pm-ts-stat-lbl">'+label+'</div></div>';
}

/* ── The request, read-only ── (body of the "View Request" pop-up)
   Nothing here changes the request: every action starts in the Logs form.
   The only buttons are the document ones - Preview and Download PDF. */
function ctAdvanceTabHTML(c){
  const list=imsAdvData[c.id]||[];
  const r=imsActiveReq(c.id)||list[list.length-1];
  if(!r)return '';
  const ps=imsReqPayStatus(r);
  const received=imsReqReceived(r),outstanding=imsReqOutstanding(r);
  const due=imsReqDue(r);
  const cancelled=r.stage==='Cancelled';
  const cid=c.id,rid="'"+r.id+"'";

  const acts=imsBtn('Preview','imsOpenPreview('+cid+','+rid+')',false,IMS_ICO.eye)
    +(r.no?imsBtn('Download PDF','imsDownload('+cid+','+rid+')',true,IMS_ICO.dl):'');

  // Identity line (number, stage, payment status) with the
  // document actions on the right.
  let out='<div class="lp-sb-view-header">'
    +'<div class="ims-req-head">'
      +'<span class="ims-req-no">'+(r.no?imsEsc(r.no):'Draft request')+'</span>'
      +imsStatusBadge(r.stage,ps)
    +'</div>'
    +'<div class="ims-acts">'+acts+'</div></div>';

  out+='<div class="pm-ts-stats">'
    +imsStat('Requested',imsMoney(r.currency,r.amount))
    +imsStat('Received',imsMoney(r.currency,received))
    +imsStat('Outstanding',cancelled?'—':imsMoney(r.currency,outstanding))
    +imsStat('Due Date',imsDate(due))
  +'</div>';

  const days=imsReqDueDays(r);
  out+='<div class="lp-sb-detail-grid">'
    +imsFc(IMS_ICO.hash,'Advance Request Number',r.no?imsEsc(r.no):'<span style="color:#9ca3af">Assigned on generation</span>')
    +imsFc(IMS_ICO.doc,'Contract/Deal Reference',imsEsc(c.contractId)+' · '+imsEsc(c.empName))
    +imsFc(IMS_ICO.user,'Client',imsEsc(imsClientOf(c)))
    +imsFc(IMS_ICO.bank,'Billing Entity',imsEsc(IMS_BILLING[r.currency]||IMS_BILLING.INR))
    +imsFc(IMS_ICO.cal,'Request Date',imsDate(r.requestDate))
    +imsFc(IMS_ICO.clock,'Payment Terms',imsEsc(r.term)+' · '+imsDaysText(days))
    +imsFc(IMS_ICO.dollar,'Currency',imsEsc(r.currency))
    +imsFc(IMS_ICO.cal,'Due Date',imsDate(due))
    +imsFc(IMS_ICO.tag,'Type','Advance Payment '+imsInternalTag())
    +imsFc(IMS_ICO.tag,'Category','Prepayment '+imsInternalTag())
    +(r.sentOn?imsFc(IMS_ICO.send,'Sent On',imsEsc(r.sentOn)+(r.sentTo&&r.sentTo.length?' · '+imsEsc(r.sentTo.join(', ')):''),true):'')
    +(cancelled?imsFc(IMS_ICO.cal,'Cancelled On',imsEsc(r.cancelledOn||'—'))
      +imsFc(IMS_ICO.user,'Cancelled By',imsEsc(r.cancelledBy||'—'))
      +imsFc(IMS_ICO.x,'Cancellation Reason',imsEsc(r.cancelReason),true):'')
  +'</div>';

  // Contract approved: the request carries on in the order's Receivables.
  if(!cancelled&&imsCtApproved(c)){
    out+=r.orderId
      ?'<div class="ims-link-row">'+IMS_ICO.link+'<span>Advance Payment Invoice created in Receivables</span>'
        +'<button class="add-link" onclick="imsOpenOrder(\''+r.orderId+'\')">Order '+imsEsc(r.orderId)+' →</button></div>'
      :'<div class="ims-link-row">'+IMS_ICO.link+'<span>The Advance Payment Invoice is created in Receivables when the order is generated.</span></div>';
  }

  if(!cancelled){
    out+='<div class="csa-sub">Payments Received</div>';
    out+=r.payments.length
      ?imsTable(['Payment Date','Amount','Mode','Payment Reference','Bank / Account','Recorded By'],
        r.payments.map(function(p){return [imsDate(p.date),'<b>'+imsMoney(r.currency,p.amount)+'</b>',imsEsc(p.mode),imsEsc(p.ref),imsEsc(p.bank||'—'),imsEsc(p.by||'—')];}))
      :'<div class="csa-empty">No payment recorded yet.</div>';

  }

  // Earlier requests on this contract, kept for history.
  const earlier=list.filter(function(q){return q!==r&&q.stage==='Cancelled';});
  if(earlier.length){
    out+='<div class="csa-sub">Previous Requests</div>'
      +imsTable(['Request No.','Amount','Request Date','Cancelled On','Reason'],
        earlier.map(function(q){return ['<b>'+imsEsc(q.no||'Draft')+'</b>',imsMoney(q.currency,q.amount),imsDate(q.requestDate),imsEsc(q.cancelledOn||'—'),
          '<span class="ims-wrap">'+imsEsc(q.cancelReason||'—')+'</span>'];}));
  }
  return '<div class="ims-adv">'+out+'</div>';
}

function imsOpenOrder(orderId){
  imsModal=null;imsPaint();
  const p=(typeof paymentsData!=='undefined'?paymentsData:[]).find(function(x){return x.orderId===orderId;});
  navigatePage('payments');
  if(p&&typeof openPmSidebar==='function')openPmSidebar(p.id,'receivable');
}
function imsDownload(cid,rid){
  const r=imsFindReq(cid,rid);if(!r)return;
  showToast('Preparing PDF','success',(r.no||'Draft request').replace(/\//g,'-')+'.pdf will download shortly.');
}

/* ── Modals ────────────────────────────────────────────────────────────────
   Mounted on their own host under <body>, like the agreements modal, so the
   panel underneath keeps its scroll and tab. One open at a time. */
let imsModal=null;   // {kind, cid, rid}
function imsHost(){
  let h=document.getElementById('ims-host');
  if(!h){h=document.createElement('div');h.id='ims-host';document.body.appendChild(h);}
  return h;
}
function imsPaint(){
  imsHost().innerHTML=imsModal?imsModalHTML():'';
  if(imsModal&&imsModal.kind==='inv-manual')imsManSync();   // fill tax, total and due date
}
/* A form opened over the request view goes back to it on close; the view
   itself (or a Create with nothing to go back to) closes outright. */
function imsClose(){
  const m=imsModal;
  imsModal=m&&m.backForm?m.backForm:(m&&m.back==='view'?{kind:'view',cid:m.cid}:null);
  imsPaint();
}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&imsModal)imsClose();});

function imsShell(title,sub,body,foot,wide,hdrActs){
  return '<div class="ct-modal-overlay" onclick="imsClose()">'
    +'<div class="ct-modal ct-modal--form'+(wide?' ims-modal-wide':'')+'" role="dialog" aria-modal="true" aria-label="'+attrSafe(title)+'" onclick="event.stopPropagation()">'
    +'<div class="ct-modal-hdr"><span class="ct-modal-title">'+title+'</span>'
      // Optional header actions (Preview) sit beside the close button.
      +'<div class="ims-hdr-acts">'+(hdrActs||'')
      +'<button class="ct-modal-close" onclick="imsClose()" aria-label="Close">'+IMS_ICO.x+'</button></div></div>'
    +(sub?'<p class="ct-modal-sub">'+sub+'</p>':'')
    +body
    +'<div class="ct-modal-foot"><div class="ct-modal-btns">'+foot+'</div></div>'
    +'</div></div>';
}
function imsRO(label,val){return '<div class="ct-modal-field"><div class="ct-modal-flabel">'+label+'</div><div class="ct-modal-fval">'+val+'</div></div>';}
function imsGrp(label,control,req,full,id){
  return '<div class="ep-form-group'+(full?' ep-form-full':'')+'"'+(id?' id="'+id+'"':'')+'>'
    +'<label class="ep-form-label">'+label+(req?' <span class="req">*</span>':'')+'</label>'+control+'</div>';
}
function imsInput(id,val,type,ph,extra){
  return '<input class="ep-form-input" id="'+id+'" type="'+(type||'text')+'" value="'+imsEsc(val==null?'':val)+'" placeholder="'+attrSafe(ph||'')+'"'+(extra||'')+'>';
}
function imsVal(id){const el=document.getElementById(id);return el?el.value.trim():'';}
// Required fields are flagged the way every other form here flags them.
function imsFlag(id){
  const el=document.querySelector('[data-csid="'+id+'"]')||document.getElementById(id);
  if(el){el.classList.add('is-invalid');setTimeout(function(){el.classList.remove('is-invalid');},2500);el.focus&&el.focus();}
}
function imsNeed(ids){
  let first=null;
  ids.forEach(function(id){
    let v=imsVal(id);
    if(!v&&document.getElementById('csw-'+id))v=getCSValue(id);
    if(!v){
      const el=document.querySelector('[data-csid="'+id+'"]')||document.querySelector('#cdw-'+id+' .cd-trigger')||document.getElementById(id);
      if(el){el.classList.add('is-invalid');setTimeout(function(){el.classList.remove('is-invalid');},1600);if(!first)first=el;}
    }
  });
  if(first){showToast('Some details are missing','error','Fill in the fields marked *.');return false;}
  return true;
}

function imsModalHTML(){
  const m=imsModal;
  // Receivable pop-ups (order panel) - no contract behind them.
  if(m.kind==='inv-manual')return imsManualHTML(m);
  if(m.kind==='inv-preview')return imsInvPreviewHTML(m);
  if(m.kind==='inv-expand')return imsExpandHTML(m);
  if(m.kind==='inv-status')return imsInvStatusHTML(m);
  if(m.kind==='inv-send'||m.kind==='send')return imsSendHTML(m);
  const c=contractsData.find(function(x){return x.id===m.cid;});
  if(!c)return '';
  if(m.kind==='view')return imsViewHTML(c);
  if(m.kind==='create'||m.kind==='edit')return imsCreateHTML(c,m);
  const r=imsFindReq(m.cid,m.rid);
  if(m.kind==='preview')return imsPreviewHTML(c,m.temp||r);
  return '';
}

// ── Create / Edit (FR 5.1) ──
function imsOpenCreate(cid){
  if(!csPay.allowAdvance)return;
  const c=contractsData.find(function(x){return x.id===cid;});
  imsModal={kind:'create',cid:cid,draft:{amount:'',currency:(c&&c.currency)||'INR',requestDate:IMS_TODAY,
    term:csPay.paymentTerm,customDays:csPay.customDays}};
  imsPaint();
}
function imsOpenEdit(cid,rid){
  const r=imsFindReq(cid,rid);if(!r)return;
  imsModal={kind:'edit',cid:cid,rid:rid,readOnly:r.stage!=='Draft',
    draft:{amount:r.amount,currency:r.currency,requestDate:r.requestDate,term:r.term,customDays:r.customDays}};
  imsPaint();
}
function imsCreateHTML(c,m){
  if(m.readOnly)return imsRequestROHTML(c,m);
  const d=m.draft;
  const isCustom=d.term==='Custom';
  const due=imsAddDays(d.requestDate,imsTermDays(d.term,d.customDays));
  const body='<div class="ct-modal-grid">'
      +imsRO('Document Type','Advance Payment Request')
      +imsRO('Contract/Deal Reference',imsEsc(c.contractId)+' · '+imsEsc(c.empName))
      +imsRO('Client',imsEsc(imsClientOf(c)))
      +imsRO('Billing Entity','<span id="ims-f-entity">'+imsEsc(IMS_BILLING[d.currency]||IMS_BILLING.INR)+'</span>')
    +'</div>'
    +'<div class="ep-form-grid">'
      +imsGrp('Advance Amount',imsInput('ims-f-amount',d.amount,'number','Enter amount',' min="0" step="0.01"'),true)
      +imsGrp('Currency',apCS('ims-f-cur',IMS_CURRENCIES,d.currency,'Select currency','imsCreateCurPick'),true)
      +imsGrp('Request Date',apCD('ims-f-date',d.requestDate,'Select date','imsCreateDatePick'),true)
      +imsGrp('Payment Terms',apCS('ims-f-term',IMS_TERMS.map(function(t){return t.term;}),d.term,'Select term','imsCreateTermPick'))
      +'<div class="ep-form-group" id="ims-f-days-wrap"'+(isCustom?'':' style="display:none"')+'>'
        +'<label class="ep-form-label">Payment Due Days</label>'
        +'<div class="csa-unit">'+imsInput('ims-f-days',d.customDays,'number','',' min="0" step="1" oninput="imsCreateDaysInput(this.value)"')
        +'<span class="csa-unit-tag">days</span></div></div>'
      +imsGrp('Due Date',imsInput('ims-f-due',imsDate(due),'text','',' readonly'))
    +'</div>'
    +'<div class="ct-modal-grid ims-modal-grid-after">'
      +imsRO('Type','Advance Payment '+imsInternalTag())
      +imsRO('Category','Prepayment '+imsInternalTag())
    +'</div>';
  // Footer in the FRD's own words: Create → Save Draft → Generate.
  const foot='<button class="ep-cancel-btn" onclick="imsClose()">Cancel</button>'
    +'<button class="ep-cancel-btn" onclick="imsSaveRequest(false)">Save Draft</button>'
    +'<button class="ep-save-btn" onclick="imsSaveRequest(true)">Generate</button>';
  return imsShell(m.kind==='edit'?'Advance Payment Request · Draft':'Create Advance Payment Request',
    'Collect payment from the client before the contract is approved. Fields marked <span class="req">*</span> are required.',body,foot,false,
    imsBtn('Preview','imsFormPreview()',false,IMS_ICO.eye));
}
/* A generated / sent request opens in the same layout, read-only: its values
   were locked on generation. */
function imsRequestROHTML(c,m){
  const r=imsFindReq(m.cid,m.rid);
  const ps=imsReqPayStatus(r);
  const body='<div class="ct-modal-grid">'
      +imsRO('Advance Request Number',imsEsc(r.no||'—'))
      +imsRO('Document Type','Advance Payment Request')
      +imsRO('Contract/Deal Reference',imsEsc(c.contractId)+' · '+imsEsc(c.empName))
      +imsRO('Client',imsEsc(imsClientOf(c)))
      +imsRO('Billing Entity',imsEsc(IMS_BILLING[r.currency]||IMS_BILLING.INR))
      +imsRO('Advance Amount',imsMoney(r.currency,r.amount))
      +imsRO('Currency',imsEsc(r.currency))
      +imsRO('Request Date',imsDate(r.requestDate))
      +imsRO('Payment Terms',imsEsc(r.term)+' · '+imsDaysText(imsReqDueDays(r)))
      +imsRO('Due Date',imsDate(imsReqDue(r)))
      +imsRO('Type','Advance Payment '+imsInternalTag())
      +imsRO('Category','Prepayment '+imsInternalTag())
    +'</div>';
  const foot='<button class="ep-cancel-btn" onclick="imsClose()">Close</button>'
    +'<button class="ep-save-btn" onclick="imsDownload('+c.id+',\''+r.id+'\')">'+IMS_ICO.dl+' Download PDF</button>';
  return imsShell('Advance Payment Request · '+imsEsc(r.no||''),
    imsStatusBadge(r.stage,ps),body,foot,false,
    imsBtn('Preview','imsOpenPreview('+c.id+',\''+r.id+'\')',false,IMS_ICO.eye));
}
// Preview the form as it stands, saved or not, and come back to it.
function imsFormPreview(){
  const m=imsModal;if(!m)return;
  const d=m.draft;
  const amt=parseFloat(imsVal('ims-f-amount'));
  const saved=m.rid?imsFindReq(m.cid,m.rid):null;
  const temp={id:saved?saved.id:'',no:saved?saved.no:null,amount:isNaN(amt)?0:amt,currency:getCSValue('ims-f-cur')||d.currency,
    requestDate:getCDValue('ims-f-date')||d.requestDate,term:d.term,customDays:d.customDays};
  d.amount=isNaN(amt)?'':amt;
  imsModal={kind:'preview',cid:m.cid,rid:m.rid,temp:temp,backForm:m};
  imsPaint();
}
// Keep the draft in step with the pickers so Due Date and Billing Entity follow.
function imsCreateSync(){
  const d=imsModal&&imsModal.draft;if(!d)return;
  const amt=document.getElementById('ims-f-amount');if(amt)d.amount=amt.value;
  const due=document.getElementById('ims-f-due');
  if(due)due.value=imsDate(imsAddDays(d.requestDate,imsTermDays(d.term,d.customDays)));
  const ent=document.getElementById('ims-f-entity');
  if(ent)ent.textContent=IMS_BILLING[d.currency]||IMS_BILLING.INR;
}
function imsCreateCurPick(v){if(imsModal)imsModal.draft.currency=v;imsCreateSync();}
function imsCreateDatePick(v){if(imsModal)imsModal.draft.requestDate=v;imsCreateSync();}
function imsCreateTermPick(v){
  if(!imsModal)return;
  imsModal.draft.term=v;
  const w=document.getElementById('ims-f-days-wrap');if(w)w.style.display=v==='Custom'?'':'none';
  imsCreateSync();
}
function imsCreateDaysInput(v){if(imsModal){const n=parseInt(v,10);imsModal.draft.customDays=isNaN(n)?0:n;}imsCreateSync();}
function imsSaveRequest(generate){
  const m=imsModal;if(!m)return;
  if(!imsNeed(['ims-f-amount','ims-f-cur','ims-f-date']))return;
  const d=m.draft;
  d.amount=parseFloat(imsVal('ims-f-amount'))||0;
  d.currency=getCSValue('ims-f-cur')||d.currency;
  d.requestDate=getCDValue('ims-f-date')||d.requestDate;
  const c=contractsData.find(function(x){return x.id===m.cid;});
  let r;
  if(m.kind==='edit'){
    r=imsFindReq(m.cid,m.rid);
    Object.assign(r,{amount:d.amount,currency:d.currency,requestDate:d.requestDate,term:d.term,customDays:d.customDays});
  }else{
    r={id:'r'+m.cid+'-'+Date.now(),no:null,stage:'Draft',amount:d.amount,currency:d.currency,requestDate:d.requestDate,
      term:d.term,customDays:d.customDays,createdOn:imsDate(IMS_TODAY),payments:[]};
    (imsAdvData[m.cid]=imsAdvData[m.cid]||[]).push(r);
  }
  if(generate){r.no=imsNextAdvNo();r.stage='Generated';}
  if(generate)imsCtLog(m.cid,'Advance Payment Request '+r.no+' generated · '+imsMoney(r.currency,r.amount)+', due '+imsDate(imsReqDue(r))+'.');
  else imsCtLog(m.cid,m.kind==='edit'?'Advance Payment Request draft updated · '+imsMoney(r.currency,r.amount)+'.'
    :'Advance Payment Request created as draft · '+imsMoney(r.currency,r.amount)+', due '+imsDate(imsReqDue(r))+'.');
  imsClose();imsRefreshCt();
  showToast(generate?'Advance request generated':'Draft saved','success',
    generate?r.no+' · '+imsMoney(r.currency,r.amount)+' · due '+imsDate(imsReqDue(r))
      :'Advance request for '+c.contractId+' saved as a draft.');
}


// ── Document preview: what the client receives ──
function imsOpenPreview(cid,rid){imsModal={kind:'preview',cid:cid,rid:rid,backForm:imsModal&&imsModal.kind!=='preview'?imsModal:null};imsPaint();}
function imsPreviewHTML(c,r){
  const client=imsClientOf(c);
  const ent=IMS_BILLING[r.currency]||IMS_BILLING.INR;
  const due=imsDate(imsReqDue(r));
  const docTh='padding:9px 12px;text-align:left;font-size:11px;font-weight:700;color:var(--navy);background:#f8fafc;border-bottom:1px solid var(--border)';
  const docTd='padding:11px 12px;font-size:12.5px;color:#374151;border-bottom:1px solid #f1f5f9';
  const doc='<div class="adt-doc-page">'
    +'<div class="adt-doc-header">'
      +'<div><div class="adt-doc-brand">ADT</div><div class="adt-doc-brand-sub">'+imsEsc(ent)+'</div></div>'
      +'<div><div class="adt-doc-title">ADVANCE PAYMENT REQUEST</div>'
        +'<div class="adt-doc-meta">No. '+(r.no?imsEsc(r.no):'DRAFT')+'</div>'
        +'<div class="adt-doc-meta">Date: '+imsDate(r.requestDate)+'</div></div>'
    +'</div>'
    +'<div class="ims-doc-parties">'
      +'<div class="adt-doc-section"><div class="adt-doc-section-title">Billed To</div>'
        +'<p class="adt-doc-clause"><b>'+imsEsc(client)+'</b><br>Contract/Deal Reference: '+imsEsc(c.contractId)+'</p></div>'
      +'<div class="adt-doc-section"><div class="adt-doc-section-title">Billed By</div>'
        +'<p class="adt-doc-clause"><b>'+imsEsc(ent)+'</b><br>Billing Entity</p></div>'
    +'</div>'
    +'<table style="width:100%;border-collapse:collapse;border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px">'
      +'<thead><tr><th style="'+docTh+'">Description</th><th style="'+docTh+';text-align:right">Amount ('+imsEsc(r.currency)+')</th></tr></thead>'
      +'<tbody><tr><td style="'+docTd+'">Advance payment against Contract/Deal '+imsEsc(c.contractId)+' · '+imsEsc(c.empName)+'</td>'
        +'<td style="'+docTd+';text-align:right">'+imsMoney(r.currency,r.amount)+'</td></tr>'
      +'<tr><td style="'+docTd+';font-weight:700;color:var(--navy);border-bottom:none">Amount Due</td>'
        +'<td style="'+docTd+';text-align:right;font-weight:800;color:var(--navy);border-bottom:none">'+imsMoney(r.currency,r.amount)+'</td></tr></tbody>'
    +'</table>'
    +'<div class="ims-doc-parties">'
      +'<div class="adt-doc-section"><div class="adt-doc-section-title">Payment Terms</div>'
        +'<p class="adt-doc-clause">'+imsEsc(r.term)+(r.term==='Custom'?' ('+imsDaysText(imsReqDueDays(r))+')':'')
          +'<br>Due Date: <b>'+due+'</b></p></div>'
      +'<div class="adt-doc-section"><div class="adt-doc-section-title">Payment Instructions</div>'
        +'<p class="adt-doc-clause">'+imsEsc(IMS_PAY_INSTR[r.currency]||IMS_PAY_INSTR.INR)+'</p></div>'
    +'</div>'
  +'</div>';
  const foot='<button class="ep-cancel-btn" onclick="imsDownload('+c.id+',\''+r.id+'\')">'+IMS_ICO.dl+' Download PDF</button>'
    +'<button class="ep-save-btn" onclick="imsClose()">Close</button>';
  return imsShell('Advance Payment Request','Client view · '+(r.no?imsEsc(r.no):'Draft')+' · '+imsEsc(client),
    '<div class="csag-doc-wrap">'+doc+'</div>',foot,true);
}

/* ══ PAYMENTS → ORDER PANEL → RECEIVABLE ════════════════════════════════════
   FR1 / FR2 / FR3 / 5.4 / 5.10, US1 / US3 / US4 / US7 / US8. The order's
   invoices, one list, opened in place:

     LIST     the tab's own "Select Year" row with "+ Create Invoice" and
              "Export PDF" on the right, four summary cards, the invoice table
     DETAIL   Back, the invoice's figures and captured terms, Advance Applied,
              Payments Received, and a Logs block - timeline + the Logs form,
              where every stage move is made (Status, Comment, Submit)

   Stage (Draft → Generated → Sent, or Cancelled) and Payment Status (Unpaid /
   Overdue / Paid) are separate; Payment Status only applies once Sent. The
   Advance Payment Invoice is the order's copy of a paid advance request:
   carried-forward terms and due date, no tax.

   Built from the panel's parts only - .pm-ts-stats, the compliance table,
   .lp-sb-detail-grid, .lp-logs-wrap / .lp-logs-form, .ct-modal, the timesheet
   export drawer (.tsx-*) and the ADT document page. Display only: amount and
   tax rules belong to the backend. */

const IMS_ORDER_CT={'1118':7,'1119':13,'1120':10};   // order → the contract it came from
let imsInvSeq=40;
function imsNextInvNo(){imsInvSeq+=1;return 'DHI/2026-27/'+String(imsInvSeq).padStart(4,'0');}
function imsSeedLog(date,time,user,status,action){return {date:date,time:time,user:user,status:status,action:action};}
/* Each invoice carries its full trail, newest first, under one fixed set of
   entry names: Draft · Generated · Sent · Send Failed · Payment Status Changed ·
   Payment Received · Advance Applied · Cancelled · Notification Sent /
   Notification Failed · Advance Payment Invoice Created. The user acts;
   everything the system derives (status, reminders) is Actor = System. */
const IMS_FO='Finance Ops',IMS_SYS='System';
const imsInvData={
  '1116':[
    {id:'i21',no:'DHI/2026-27/0021',type:'Timesheet',currency:'INR',invoiceDate:'2026-05-01',term:'Net 15',customDays:0,amount:100000,
     description:'EOR service fee · May 2026',refType:'Order',refValue:'1116',stage:'Sent',sentOn:'01 May 2026',sentTo:['accounts@closedhi.com'],
     createdOn:'01 May 2026',payments:[{date:'2026-05-14',amount:118000,mode:'Bank Transfer',ref:'NEFT-HDFC-77120'}],advApplied:[],
     logs:[imsSeedLog('14 May 2026','11:02 AM',IMS_SYS,'Payment Status Changed','Unpaid → Paid · Outstanding INR 0.'),
           imsSeedLog('14 May 2026','11:02 AM',IMS_SYS,'Payment Received','INR 118,000 received · Bank Transfer · ref NEFT-HDFC-77120 · Outstanding INR 0.'),
           imsSeedLog('13 May 2026','09:00 AM',IMS_SYS,'Notification Sent','Due Reminder · email to accounts@closedhi.com · in-app · INR 118,000 due on 16 May 2026.'),
           imsSeedLog('01 May 2026','10:15 AM',IMS_SYS,'Notification Sent','Invoice Sent · email to accounts@closedhi.com · in-app.'),
           imsSeedLog('01 May 2026','10:15 AM',IMS_SYS,'Payment Status Changed','— → Unpaid · Outstanding INR 118,000.'),
           imsSeedLog('01 May 2026','10:15 AM',IMS_FO,'Sent','Invoice sent to accounts@closedhi.com.'),
           imsSeedLog('01 May 2026','10:05 AM',IMS_FO,'Generated','Invoice DHI/2026-27/0021 generated. Terms Net 15 · 15 Days captured, due 16 May 2026; financial values locked.'),
           imsSeedLog('01 May 2026','09:50 AM',IMS_SYS,'Draft','Invoice created with the order · INR 118,000.')]},
    {id:'i29',no:'DHI/2026-27/0029',type:'Timesheet',currency:'INR',invoiceDate:'2026-05-28',term:'Net 15',customDays:0,amount:95000,
     description:'EOR service fee · June 2026',refType:'Order',refValue:'1116',stage:'Cancelled',createdOn:'28 May 2026',
     cancelledOn:'30 May 2026',cancelledBy:'Finance Ops',cancelReason:'Raised at the wrong rate. Replaced by DHI/2026-27/0034.',payments:[],advApplied:[],
     logs:[imsSeedLog('30 May 2026','04:40 PM',IMS_FO,'Cancelled','Cancelled. Reason: Raised at the wrong rate. Replaced by DHI/2026-27/0034. Number DHI/2026-27/0029 will not be reused.'),
           imsSeedLog('29 May 2026','12:10 PM',IMS_SYS,'Notification Sent','Pending Sending · to Finance Ops · email · in-app · Invoice DHI/2026-27/0029 is pending Sending.'),
           imsSeedLog('28 May 2026','12:10 PM',IMS_FO,'Generated','Invoice DHI/2026-27/0029 generated. Terms Net 15 · 15 Days captured, due 12 Jun 2026; financial values locked.'),
           imsSeedLog('28 May 2026','12:00 PM',IMS_FO,'Draft','Draft created · INR 112,100.')]},
    {id:'i34',no:'DHI/2026-27/0034',type:'Timesheet',currency:'INR',invoiceDate:'2026-06-01',term:'Net 15',customDays:0,amount:100000,
     description:'EOR service fee · June 2026',refType:'Order',refValue:'1116',stage:'Sent',sentOn:'01 Jun 2026',sentTo:['accounts@closedhi.com'],
     createdOn:'01 Jun 2026',payments:[],advApplied:[],
     logs:[imsSeedLog('22 Jun 2026','09:00 AM',IMS_SYS,'Notification Sent','Overdue Reminder (attempt 2 of 3) · email to accounts@closedhi.com · in-app · Outstanding INR 118,000.'),
           imsSeedLog('17 Jun 2026','12:00 AM',IMS_SYS,'Notification Sent','Overdue Reminder (attempt 1 of 3) · email to accounts@closedhi.com · in-app · Outstanding INR 118,000.'),
           imsSeedLog('17 Jun 2026','12:00 AM',IMS_SYS,'Payment Status Changed','Unpaid → Overdue · Due Date 16 Jun 2026 passed · Outstanding INR 118,000.'),
           imsSeedLog('13 Jun 2026','09:00 AM',IMS_SYS,'Notification Sent','Due Reminder · email to accounts@closedhi.com · in-app · INR 118,000 due on 16 Jun 2026.'),
           imsSeedLog('01 Jun 2026','10:20 AM',IMS_SYS,'Notification Sent','Invoice Sent · email to accounts@closedhi.com · in-app.'),
           imsSeedLog('01 Jun 2026','10:20 AM',IMS_SYS,'Payment Status Changed','— → Unpaid · Outstanding INR 118,000.'),
           imsSeedLog('01 Jun 2026','10:20 AM',IMS_FO,'Sent','Invoice sent to accounts@closedhi.com.'),
           imsSeedLog('01 Jun 2026','10:05 AM',IMS_FO,'Generated','Invoice DHI/2026-27/0034 generated. Terms Net 15 · 15 Days captured, due 16 Jun 2026; financial values locked.'),
           imsSeedLog('01 Jun 2026','09:55 AM',IMS_FO,'Draft','Draft created · INR 118,000. Replaces DHI/2026-27/0029.')]},
    {id:'i36',no:'DHI/2026-27/0036',type:'Manual',currency:'INR',invoiceDate:'2026-06-10',term:'Net 30',customDays:0,amount:25000,
     description:'Work permit processing charges',refType:'Case',refValue:'IMM-2291',stage:'Sent',sentOn:'10 Jun 2026',sentTo:['accounts@closedhi.com'],
     createdOn:'10 Jun 2026',payments:[],advApplied:[],
     logs:[imsSeedLog('10 Jun 2026','02:45 PM',IMS_SYS,'Notification Sent','Manual Invoice · email to accounts@closedhi.com · in-app.'),
           imsSeedLog('10 Jun 2026','02:45 PM',IMS_SYS,'Payment Status Changed','— → Unpaid · Outstanding INR 29,500.'),
           imsSeedLog('10 Jun 2026','02:45 PM',IMS_FO,'Sent','Manual invoice sent to accounts@closedhi.com.'),
           imsSeedLog('10 Jun 2026','02:30 PM',IMS_FO,'Generated','Manual invoice DHI/2026-27/0036 generated. Terms Net 30 · 30 Days captured, due 10 Jul 2026; financial values locked.'),
           imsSeedLog('10 Jun 2026','02:20 PM',IMS_FO,'Draft','Manual invoice saved as a draft · INR 29,500 · Reference Case IMM-2291.')]},
    {id:'i-d1',no:null,type:'Manual',currency:'INR',invoiceDate:'2026-06-23',term:'Net 15',customDays:0,amount:8000,
     description:'Laptop shipping to employee',refType:'Order',refValue:'1116',stage:'Draft',createdOn:'23 Jun 2026',payments:[],advApplied:[],
     logs:[imsSeedLog('24 Jun 2026','09:00 AM',IMS_SYS,'Notification Sent','Pending Generation · to Finance Ops · email · in-app · Manual invoice draft for Closedhi is pending Generation.'),
           imsSeedLog('23 Jun 2026','05:10 PM',IMS_FO,'Draft','Manual invoice saved as a draft · INR 9,440 · Reference Order 1116.')]}
  ],
  '1114':[
    {id:'i38',no:'DHI/2026-27/0038',type:'Timesheet',currency:'EUR',invoiceDate:'2026-06-20',term:'Net 30',customDays:0,amount:8500,
     description:'EOR service fee · June 2026',refType:'Order',refValue:'1114',stage:'Generated',createdOn:'20 Jun 2026',payments:[],advApplied:[],
     logs:[imsSeedLog('22 Jun 2026','09:00 AM',IMS_SYS,'Notification Sent','Pending Sending · to Finance Ops · email · in-app · Invoice DHI/2026-27/0038 is pending Sending.'),
           imsSeedLog('20 Jun 2026','11:32 AM',IMS_SYS,'Send Failed','Sending to gwynne@spacex.com failed (mailbox unavailable). Stage stays Generated; no Payment Status applied.'),
           imsSeedLog('20 Jun 2026','11:30 AM',IMS_FO,'Generated','Invoice DHI/2026-27/0038 generated. Terms Net 30 · 30 Days captured, due 20 Jul 2026; financial values locked.'),
           imsSeedLog('20 Jun 2026','11:20 AM',IMS_SYS,'Draft','Invoice created with the order · EUR 10,285.')]}
  ],
  '1118':[
    {id:'i27',no:'DHI/2026-27/0027',type:'Advance Payment',currency:'INR',invoiceDate:'2026-05-20',term:'Net 15',customDays:0,dueDate:'2026-05-19',amount:300000,
     description:'Advance payment against Contract/Deal 94138',refType:'Contract',refValue:'94138',advReq:'ADV/2026-27/0001',stage:'Sent',sentOn:'04 May 2026',
     createdOn:'20 May 2026',payments:[{date:'2026-05-12',amount:300000,mode:'Bank Transfer',ref:'NEFT-HDFC-88213'}],advApplied:[],
     logs:[imsSeedLog('20 May 2026','10:00 AM',IMS_SYS,'Advance Payment Invoice Created','Created on generation of Order 1118 from ADV/2026-27/0001. Carried forward: Net 15, Due Date 19 May 2026, Amount Paid INR 300,000, Outstanding INR 0, Payment Status Paid. Payment reference NEFT-HDFC-88213 linked. Request history stays in the Contract Logs.')]},
    {id:'i31',no:'DHI/2026-27/0031',type:'Timesheet',currency:'INR',invoiceDate:'2026-06-01',term:'Net 15',customDays:0,amount:100000,
     description:'PEO service fee · June 2026',refType:'Order',refValue:'1118',stage:'Sent',sentOn:'01 Jun 2026',sentTo:['accounts@closedhi.com'],
     createdOn:'01 Jun 2026',payments:[{date:'2026-06-05',amount:118000,mode:'Bank Transfer',ref:'NEFT-HDFC-90412'}],advApplied:[],
     logs:[imsSeedLog('05 Jun 2026','09:40 AM',IMS_SYS,'Payment Status Changed','Unpaid → Paid · Outstanding INR 0.'),
           imsSeedLog('05 Jun 2026','09:40 AM',IMS_SYS,'Payment Received','INR 118,000 received · Bank Transfer · ref NEFT-HDFC-90412 · Outstanding INR 0.'),
           imsSeedLog('01 Jun 2026','10:10 AM',IMS_SYS,'Notification Sent','Invoice Sent · email to accounts@closedhi.com · in-app.'),
           imsSeedLog('01 Jun 2026','10:10 AM',IMS_SYS,'Payment Status Changed','— → Unpaid · Outstanding INR 118,000.'),
           imsSeedLog('01 Jun 2026','10:10 AM',IMS_FO,'Sent','Invoice sent to accounts@closedhi.com.'),
           imsSeedLog('01 Jun 2026','10:00 AM',IMS_FO,'Generated','Invoice DHI/2026-27/0031 generated. Terms Net 15 · 15 Days captured, due 16 Jun 2026; financial values locked.'),
           imsSeedLog('01 Jun 2026','09:50 AM',IMS_SYS,'Draft','Invoice created with the order · INR 118,000.')]},
    {id:'i40',no:'DHI/2026-27/0040',type:'Timesheet',currency:'INR',invoiceDate:'2026-06-22',term:'Net 15',customDays:0,amount:100000,
     description:'PEO service fee · July 2026',refType:'Order',refValue:'1118',stage:'Sent',sentOn:'22 Jun 2026',sentTo:['accounts@closedhi.com'],
     createdOn:'22 Jun 2026',payments:[],advApplied:[],
     logs:[imsSeedLog('22 Jun 2026','10:10 AM',IMS_SYS,'Notification Sent','Invoice Sent · email to accounts@closedhi.com · in-app.'),
           imsSeedLog('22 Jun 2026','10:10 AM',IMS_SYS,'Payment Status Changed','— → Unpaid · Outstanding INR 118,000.'),
           imsSeedLog('22 Jun 2026','10:10 AM',IMS_FO,'Sent','Invoice sent to accounts@closedhi.com.'),
           imsSeedLog('22 Jun 2026','10:00 AM',IMS_FO,'Generated','Invoice DHI/2026-27/0040 generated. Terms Net 15 · 15 Days captured, due 07 Jul 2026; financial values locked.'),
           imsSeedLog('22 Jun 2026','09:50 AM',IMS_SYS,'Draft','Invoice created with the order · INR 118,000.')]}
  ],
  '1120':[
    {id:'i32',no:'DHI/2026-27/0032',type:'Advance Payment',currency:'INR',invoiceDate:'2026-06-01',term:'Net 15',customDays:0,dueDate:'2026-06-09',amount:100000,
     description:'Advance payment against Contract/Deal 94141',refType:'Contract',refValue:'94141',advReq:'ADV/2026-27/0008',stage:'Sent',sentOn:'25 May 2026',
     createdOn:'01 Jun 2026',payments:[{date:'2026-05-28',amount:100000,mode:'Bank Transfer',ref:'NEFT-ICIC-40211'}],advApplied:[],
     logs:[imsSeedLog('01 Jun 2026','10:00 AM',IMS_SYS,'Advance Payment Invoice Created','Created on generation of Order 1120 from ADV/2026-27/0008. Carried forward: Net 15, Due Date 09 Jun 2026, Amount Paid INR 100,000, Outstanding INR 0, Payment Status Paid. Payment reference NEFT-ICIC-40211 linked. Request history stays in the Contract Logs.')]},
    {id:'i39',no:'DHI/2026-27/0039',type:'Timesheet',currency:'INR',invoiceDate:'2026-06-21',term:'Net 15',customDays:0,amount:33898.31,taxAmount:6101.69,
     description:'EOR service fee · June 2026',refType:'Order',refValue:'1120',stage:'Sent',sentOn:'21 Jun 2026',sentTo:['accounts@nimbusretail.com'],
     createdOn:'21 Jun 2026',payments:[{date:'2026-06-22',amount:40000,mode:'Bank Transfer',ref:'NEFT-ICIC-41877'}],advApplied:[],
     logs:[imsSeedLog('22 Jun 2026','11:15 AM',IMS_SYS,'Payment Status Changed','Unpaid → Paid · Outstanding INR 0.'),
           imsSeedLog('22 Jun 2026','11:15 AM',IMS_SYS,'Payment Received','INR 40,000 received · Bank Transfer · ref NEFT-ICIC-41877 · Outstanding INR 0.'),
           imsSeedLog('21 Jun 2026','10:20 AM',IMS_SYS,'Payment Status Changed','— → Unpaid · Outstanding INR 40,000.'),
           imsSeedLog('21 Jun 2026','10:20 AM',IMS_FO,'Sent','Invoice sent to accounts@nimbusretail.com.'),
           imsSeedLog('21 Jun 2026','10:05 AM',IMS_FO,'Generated','Invoice DHI/2026-27/0039 generated. Terms Net 15 · 15 Days captured, due 06 Jul 2026; financial values locked.'),
           imsSeedLog('21 Jun 2026','09:55 AM',IMS_SYS,'Draft','Invoice created with the order · INR 40,000.')]}
  ],
  '1119':[
    {id:'i28',no:'DHI/2026-27/0028',type:'Advance Payment',currency:'GBP',invoiceDate:'2026-05-22',term:'Net 7',customDays:0,dueDate:'2026-05-19',amount:6000,
     description:'Advance payment against Contract/Deal 94144',refType:'Contract',refValue:'94144',advReq:'ADV/2026-27/0006',stage:'Sent',sentOn:'12 May 2026',
     createdOn:'22 May 2026',payments:[{date:'2026-05-16',amount:6000,mode:'Card',ref:'CARD-TXN-55120'}],advApplied:[],
     logs:[imsSeedLog('22 May 2026','10:00 AM',IMS_SYS,'Advance Payment Invoice Created','Created on generation of Order 1119 from ADV/2026-27/0006. Carried forward: Net 7, Due Date 19 May 2026, Amount Paid GBP 6,000, Outstanding GBP 0, Payment Status Paid. Payment reference CARD-TXN-55120 linked. Request history stays in the Contract Logs.')]},
    {id:'i35',no:'DHI/2026-27/0035',type:'Timesheet',currency:'GBP',invoiceDate:'2026-06-05',term:'Net 7',customDays:0,amount:4500,
     description:'EOR service fee · June 2026',refType:'Order',refValue:'1119',stage:'Sent',sentOn:'05 Jun 2026',sentTo:['accounts@harborhealth.com'],
     createdOn:'05 Jun 2026',payments:[],advApplied:[],
     logs:[imsSeedLog('20 Jun 2026','09:00 AM',IMS_SYS,'Notification Failed','Overdue Reminder (attempt 2 of 3) · email to accounts@harborhealth.com bounced (mailbox full); in-app delivered. Stage and Payment Status unchanged.'),
           imsSeedLog('13 Jun 2026','12:00 AM',IMS_SYS,'Notification Sent','Overdue Reminder (attempt 1 of 3) · email to accounts@harborhealth.com · in-app · Outstanding GBP 4,500.'),
           imsSeedLog('13 Jun 2026','12:00 AM',IMS_SYS,'Payment Status Changed','Unpaid → Overdue · Due Date 12 Jun 2026 passed · Outstanding GBP 4,500.'),
           imsSeedLog('09 Jun 2026','09:00 AM',IMS_SYS,'Notification Sent','Due Reminder · email to accounts@harborhealth.com · in-app · GBP 4,500 due on 12 Jun 2026.'),
           imsSeedLog('05 Jun 2026','11:00 AM',IMS_SYS,'Notification Sent','Invoice Sent · email to accounts@harborhealth.com · in-app.'),
           imsSeedLog('05 Jun 2026','11:00 AM',IMS_SYS,'Payment Status Changed','— → Unpaid · Outstanding GBP 4,500.'),
           imsSeedLog('05 Jun 2026','11:00 AM',IMS_FO,'Sent','Invoice sent to accounts@harborhealth.com.'),
           imsSeedLog('05 Jun 2026','10:50 AM',IMS_FO,'Generated','Invoice DHI/2026-27/0035 generated. Terms Net 7 · 7 Days captured, due 12 Jun 2026; financial values locked.'),
           imsSeedLog('05 Jun 2026','10:45 AM',IMS_SYS,'Draft','Invoice created with the order · GBP 4,500.')]}
  ]
};

// ── Figures ──
function imsInvTaxInfo(i){
  if(i.type==='Advance Payment')return {rate:0,label:'No tax'};
  if(i.currency==='INR')return {rate:0.18,label:'GST 18%'};
  if(i.currency==='EUR')return {rate:0.21,label:'VAT 21%'};
  return {rate:0,label:'No tax'};
}
function imsInvTax(i){return i.taxAmount!=null?i.taxAmount:Math.round(i.amount*imsInvTaxInfo(i).rate*100)/100;}
function imsInvTotal(i){return i.amount+imsInvTax(i);}
function imsInvPaid(i){return imsSum(i.payments,'amount');}
function imsInvOutstanding(i){return Math.max(0,imsInvTotal(i)-imsInvPaid(i));}
function imsInvDueDays(i){return imsTermDays(i.term,i.customDays);}
// Captured at generation; a draft's is only a preview of what it will be.
function imsInvDue(i){return i.dueDate||imsAddDays(i.invoiceDate,imsInvDueDays(i));}
function imsInvPayStatus(i){
  if(i.stage==='Cancelled')return '—';
  if(i.stage!=='Sent')return '';
  if(imsInvOutstanding(i)===0)return 'Paid';
  return IMS_TODAY>imsInvDue(i)?'Overdue':'Unpaid';
}
function imsOrderCurrency(p){return String(p.amountDue||'INR').split(' ')[0]||'INR';}
function imsFindInv(orderId,invId){return (imsInvData[orderId]||[]).find(function(i){return i.id===invId;});}

// ── State: which order's list, and which invoice is open in it ──
/* The tab's state: the invoice opened from the list, and which of its
   sub-tabs (Details / Logs) is showing. */
let imsRcv={orderId:null,invId:null,sub:'details'};
function imsRcvRefresh(){document.querySelectorAll('.ims-menu-portal').forEach(function(m){m.remove();});if(typeof isbTab==='function'&&typeof pmSelectedId!=='undefined'&&pmSelectedId!=null)isbTab('pm',renderPmSidebar);}
function imsRcvOpen(orderId,invId,sub){imsRcv={orderId:orderId,invId:invId,sub:sub||'details'};imsRcvRefresh();}
function imsRcvBack(){imsRcv.invId=null;imsRcv.sub='details';imsRcvRefresh();}
function imsRcvSub(sub){imsRcv.sub=sub;imsRcvRefresh();}
// The invoice the Logs form acts on.
function imsIvCur(){return imsRcv.invId;}
function imsRcvRowOpen(orderId,invId){
  const i=imsFindInv(orderId,invId);
  if(i&&i.stage==='Draft')imsOpenManual(orderId,invId);
  else imsRcvOpen(orderId,invId);
}

// ── THE TAB ── (called from renderPmSidebar in pages.js)
function pmReceivableHTML(p){
  if(imsRcv.orderId!==p.orderId)imsRcv={orderId:p.orderId,invId:null,sub:'details'};
  const inv=imsRcv.invId?imsFindInv(p.orderId,imsRcv.invId):null;
  if(!inv)return '<div class="ims-rcv">'+imsRcvListHTML(p)+'</div>';
  // An opened invoice: Back, then its details. Its history is in the order's Logs tab.
  const back='<button class="add-link ims-back" onclick="imsRcvBack()">'
    +'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>Back to Receivables</button>';
  return '<div class="ims-rcv">'+back+imsInvDetailHTML(p,inv)+'</div>';
}
// The Logs sub-tab: the opened invoice's timeline and its Logs form.
function imsRcvLogsHTML(p,i){
  return '<div class="lp-logs-wrap">'+imsInvTimelineHTML(i)
    +'<div class="lp-logs-side">'+imsInvLogFormHTML(p,i)+'</div></div>';
}

function imsLinkBtn(label,onclick,icon){
  return '<button onclick="'+onclick+'" style="border:none;background:none;color:var(--orange);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:5px;font-family:inherit">'
    +(icon||'')+label+'</button>';
}

/* The invoice table - in the tab, and full width in the Expand pop-up. In the
   pop-up a row click closes it and opens that invoice in the panel. */
function imsRcvTableHTML(p,inPopup){
  const list=imsInvData[p.orderId]||[];
  const dotsIco='<svg width="16" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="2" x2="17" y2="2"/><line x1="1" y1="7" x2="17" y2="7"/><line x1="1" y1="12" x2="17" y2="12"/></svg>';
  const heads=['S.No','Invoice No.','Amt','Amt + Tax','Quantity','Type','Create Time','Status','Action'];
  const rows=list.map(function(i,n){
    const ps=imsInvPayStatus(i);
    const first=(i.logs||[])[i.logs&&i.logs.length?i.logs.length-1:0]||{};
    const dl=i.no?'<button class="ims-dl-btn" title="Download PDF" onclick="event.stopPropagation();imsInvDownload(\''+p.orderId+'\',\''+i.id+'\')">'+IMS_ICO.dl+'</button>':'<span></span>';
    return {id:i.id,cells:[
      '<span style="color:#6b7280">'+(n+1)+'</span>',
      '<b>'+(i.no?imsEsc(i.no):'Draft')+'</b>',
      imsMoney(i.currency,i.amount),
      imsMoney(i.currency,imsInvTotal(i)),
      '1',
      imsEsc(i.type),
      '<div>'+imsEsc(i.createdOn||'—')+'</div>'+(first.time?'<div class="ims-sub-time">'+imsEsc(first.time)+'</div>':''),
      imsPayStatusCell(p.orderId,i),
      '<div class="ims-act-cell">'+dl+'</div>'
    ]};
  });
  const open=inPopup?'imsExpandRowOpen':'imsRcvRowOpen';
  return '<div class="ims-table-scroll"><table class="ims-table" style="width:100%;border-collapse:collapse;border:1px solid var(--border);border-radius:10px;overflow:hidden">'
    +'<thead><tr>'+heads.map(function(h){return '<th style="'+IMS_TH+'">'+h+'</th>';}).join('')+'</tr></thead>'
    +'<tbody>'+rows.map(function(r){
      // A draft opens straight in its form; anything generated opens its detail.
      return '<tr class="ims-row" onclick="'+open+'(\''+p.orderId+'\',\''+r.id+'\')">'
        +r.cells.map(function(cell){return '<td style="'+IMS_TD+'">'+cell+'</td>';}).join('')+'</tr>';
    }).join('')+'</tbody></table></div>';
}
// Expand: the same table in a centred pop-up, every column in view.
function imsOpenExpand(orderId){imsModal={kind:'inv-expand',orderId:orderId};imsPaint();}
function imsExpandRowOpen(orderId,invId){imsModal=null;imsPaint();imsRcvRowOpen(orderId,invId);}
function imsExpandHTML(m){
  const p=paymentsData.find(function(x){return x.orderId===m.orderId;})||{};
  return '<div class="ct-modal-overlay" onclick="imsClose()">'
    +'<div class="ct-modal ims-modal-xl" role="dialog" aria-modal="true" aria-label="Receivables" onclick="event.stopPropagation()">'
    +'<div class="ct-modal-hdr"><span class="ct-modal-title">Receivables</span>'
      +'<button class="ct-modal-close" onclick="imsClose()" aria-label="Close">'+IMS_ICO.x+'</button></div>'
    +'<p class="ct-modal-sub">Order '+imsEsc(m.orderId)+' · '+imsEsc(p.name||'')+' · '+imsEsc(p.entityName||'')+'</p>'
    +imsRcvTableHTML(p,true)
    +'</div></div>';
}

function imsRcvListHTML(p){
  const list=imsInvData[p.orderId]||[];
  const cur=list.length?list[0].currency:imsOrderCurrency(p);
  const yrOpts=[2026,2025,2024].map(function(y){return '<option'+(y===2026?' selected':'')+'>'+y+'</option>';}).join('');
  const plusIco='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  let out='<div class="ims-rcv-bar">'
    +'<div style="display:flex;align-items:center;gap:10px">'
    +'<span style="font-size:13px;font-weight:600;color:var(--navy)">Select Year :</span>'
    +'<select class="ims-rcv-select">'+yrOpts+'</select>'
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:18px">'
      +(list.length?'<button class="ims-expand-btn" title="Expand" aria-label="Expand" onclick="imsOpenExpand(\''+p.orderId+'\')">'+IMS_ICO.expand+'</button>':'')
      +imsLinkBtn('Create Invoice','imsOpenManual(\''+p.orderId+'\')',plusIco)
    +'</div>'
    +'</div>';
  if(!list.length)return out+'<p style="font-size:13px;color:#9ca3af">No receivables found.</p>';

  // No summary cards: the FRD asks for Due Date, Paid, Outstanding and Payment Status
  // per invoice, which the table below shows.
  out+=imsRcvTableHTML(p,false);

  return out;
}

// ── Invoice detail ──
function imsInvDetailHTML(p,i){
  const ps=imsInvPayStatus(i);
  const due=imsInvDue(i),tx=imsInvTaxInfo(i);
  const cancelled=i.stage==='Cancelled';
  const oid="'"+p.orderId+"'",iid="'"+i.id+"'";
  const locked=i.stage!=='Draft';
  const acts=imsBtn('Preview','imsOpenInvPreview('+oid+','+iid+')',false,IMS_ICO.eye);
  // Download sits on the invoice's row in the Receivable list, not here.

  let out='<div class="lp-sb-view-header">'
      +'<div class="ims-req-head">'
        +'<span class="ims-req-no">'+(i.no?imsEsc(i.no):'Draft invoice')+'</span>'
        +imsStatusBadge(i.stage,ps)
      +'</div>'
      +'<div class="ims-acts">'+acts+'</div>'
    +'</div>';

  out+='<div class="pm-ts-stats ims-inv-stats ims-stats-3">'
    +imsStat('Invoice Total',imsMoney(i.currency,imsInvTotal(i)))
    +imsStat('Paid',imsMoney(i.currency,imsInvPaid(i)))
    +imsStat('Outstanding',cancelled?'—':imsMoney(i.currency,imsInvOutstanding(i)))
  +'</div>';

  const client=p.entityName;
  out+='<div class="lp-sb-detail-grid">'
    +imsFc(IMS_ICO.hash,'Invoice Number',i.no?imsEsc(i.no)+(locked?' '+imsBadge('Values locked').replace('ims-badge','ims-badge ims-tag'):'')
      :'<span style="color:#9ca3af">Assigned on generation</span>')
    +imsFc(IMS_ICO.tag,'Invoice Type',imsEsc(i.type))
    +imsFc(IMS_ICO.user,'Client',imsEsc(client))
    +imsFc(IMS_ICO.bank,'Billing Entity',imsEsc(IMS_BILLING[i.currency]||IMS_BILLING.INR))
    +(i.type==='Advance Payment'
      ?imsFc(IMS_ICO.doc,'Contract/Deal Reference',imsEsc(i.refValue))+imsFc(IMS_ICO.doc,'Order Reference','Order · '+imsEsc(p.orderId))
      :imsFc(IMS_ICO.doc,'Reference',imsEsc(i.refType)+' · '+imsEsc(i.refValue)))
    +(i.advReq?imsFc(IMS_ICO.doc,'Advance Request Reference',imsEsc(i.advReq)):'')
    +imsFc(IMS_ICO.cal,'Invoice Date',imsDate(i.invoiceDate))
    +imsFc(IMS_ICO.clock,'Payment Terms',imsEsc(i.term)+' · '+imsDaysText(imsInvDueDays(i))
      +(locked?' '+imsBadge(i.type==='Advance Payment'?'Carried forward':'Captured').replace('ims-badge','ims-badge ims-tag'):''))
    +imsFc(IMS_ICO.cal,'Due Date',imsDate(due))
    +imsFc(IMS_ICO.dollar,'Currency',imsEsc(i.currency))
    +imsFc(IMS_ICO.dollar,'Amount',imsMoney(i.currency,i.amount))
    +imsFc(IMS_ICO.dollar,'Tax',tx.label+' · '+imsMoney(i.currency,imsInvTax(i)))
    +imsFc(IMS_ICO.dollar,'Total Amount','<b>'+imsMoney(i.currency,imsInvTotal(i))+'</b>')
    +imsFc(IMS_ICO.cal,'Created Date',imsEsc(i.createdOn||'—'))
    +(i.description?imsFc(IMS_ICO.doc,'Description',imsEsc(i.description),true):'')
    +(i.sentOn?imsFc(IMS_ICO.send,'Sent On',imsEsc(i.sentOn)+(i.sentTo&&i.sentTo.length?' · '+imsEsc(i.sentTo.join(', ')):''),true):'')
    +(cancelled?imsFc(IMS_ICO.cal,'Cancelled On',imsEsc(i.cancelledOn||'—'))
      +imsFc(IMS_ICO.user,'Cancelled By',imsEsc(i.cancelledBy||'—'))
      +imsFc(IMS_ICO.x,'Cancellation Reason',imsEsc(i.cancelReason||'—'),true):'')
  +'</div>';

  if(i.stage==='Sent'||i.payments.length){
    out+='<div class="csa-sub">Payments Received</div>';
    // Each payment as field cards, like the invoice fields above it.
    out+=i.payments.length
      ?i.payments.map(function(pm,n){
          return (i.payments.length>1?'<div class="ims-pay-no">Payment '+(n+1)+'</div>':'')
            +'<div class="lp-sb-detail-grid">'
              +imsFc(IMS_ICO.cal,'Payment Date',imsDate(pm.date))
              +imsFc(IMS_ICO.dollar,'Amount',imsMoney(i.currency,pm.amount))
              +imsFc(IMS_ICO.bank,'Mode',imsEsc(pm.mode))
              +imsFc(IMS_ICO.hash,'Payment Reference',imsEsc(pm.ref))
            +'</div>';
        }).join('')
      :'<div class="csa-empty">No payment recorded yet.</div>';
  }

  // Logs live in the Logs sub-tab.
  return out;
}

const IMS_LOG_ICO={
  person:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  cal:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  clk:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
};
function imsInvTimelineHTML(i){
  const logs=(i.logs||[]).filter(function(l){return !/Notification/i.test(l.status||'');});
  if(!logs.length)return '<div class="lp-logs-empty">No activity logs yet.</div>';
  return '<div class="lp-logs-timeline">'+logs.map(function(l,n){
    return '<div class="lp-log-row">'
      +'<div class="lp-log-avatar-col"><div class="lp-log-avatar lp-log-avatar--default">'+IMS_LOG_ICO.person+'</div>'
        +(n<logs.length-1?'<div class="lp-log-connector"></div>':'')+'</div>'
      +'<div class="lp-log-card">'
        +'<div class="lp-log-status-row"><span class="lp-log-dot lp-log-dot--default"></span>'
          +'<span class="lp-log-status-text lp-log-status-text--default">'+imsEsc(l.status)+'</span></div>'
        +'<div class="lp-log-meta-row">'
          +'<span class="lp-log-meta-item">'+IMS_LOG_ICO.person+'<span>'+imsEsc(l.user)+'</span></span>'
          +'<span class="lp-log-meta-item">'+IMS_LOG_ICO.cal+'<span>'+imsEsc(l.date)+'</span></span>'
          +'<span class="lp-log-meta-item">'+IMS_LOG_ICO.clk+'<span>'+imsEsc(l.time)+'</span></span>'
        +'</div>'
        +(l.action?'<div class="lp-log-comment-row"><span class="lp-log-comment-label">Comment:</span>'+imsEsc(l.action)+'</div>':'')
      +'</div></div>';
  }).join('')+'</div>';
}

/* The invoice's Logs form. Status offers the current stage (a comment only),
   the moves the stage allows, and the two pop-up actions:
     Draft      Generated · Edit Draft
     Generated  Sent (Recipients appear) · Cancelled (Comment = reason)
     Sent       Cancelled while nothing is paid */
const IMS_IV_POPUP=['Edit Draft','Sent'];
function imsInvMoves(p,i){
  const out=[];
  if(i.stage==='Draft')out.push('Generated','Edit Draft');
  else if(i.stage==='Generated')out.push('Sent','Cancelled');
  else if(i.stage==='Sent'&&imsInvPaid(i)===0)out.push('Cancelled');
  return out;
}
function imsInvLogFormHTML(p,i){
  const moves=imsInvMoves(p,i);
  const sub=moves.length?'Move this invoice on, or add a comment':'Add a comment against this invoice';
  // "Sent" opens the Send pop-up (imsOpenSendInv); nothing sits between Status and Comment.
  return '<div class="lp-logs-form">'
    +'<div class="lp-logs-form-header"><span class="lp-log-dot lp-log-dot--default"></span>'+i.stage+'</div>'
    +'<p class="lp-logs-form-sub">'+sub+'</p>'
    +lpLogStatusField('ims-iv-sel',i.stage,[i.stage].concat(moves),'imsIvPick')
    +'<div class="lp-logs-form-label" id="ims-iv-clabel">Comment <span class="lp-logs-form-req">*</span></div>'
    +'<textarea class="lp-logs-form-textarea" id="ims-iv-comment" placeholder="Enter comment"></textarea>'
    +'<div style="display:flex;gap:10px;margin-top:12px">'
      +'<button class="ep-cancel-btn" style="flex:1" onclick="imsRcvRefresh()">Cancel</button>'
      +'<button class="lp-logs-save-btn" style="flex:1" onclick="imsIvSubmit(\''+p.orderId+'\',\''+i.id+'\')">Submit</button>'
    +'</div></div>';
}
function imsIvPick(v){
  const lbl=document.getElementById('ims-iv-clabel');
  if(lbl)lbl.innerHTML=(v==='Cancelled'?'Cancellation Reason':'Comment')+' <span class="lp-logs-form-req">*</span>';
  if(v==='Sent'){
    // The pop-up does the sending; the select goes back to the invoice's own stage.
    const i=imsFindInv(imsRcv.orderId,imsIvCur());
    const wrap=document.getElementById('csw-ims-iv-sel');
    if(wrap&&i){
      const val=wrap.querySelector('.cs-value');if(val)val.textContent=i.stage;
      wrap.querySelectorAll('.cs-option').forEach(function(o){o.classList.toggle('cs-selected',o.textContent===i.stage);});
    }
    imsOpenSendInv(imsRcv.orderId,imsIvCur());imsSendRun();
  }
  else if(v==='Edit Draft')imsOpenManual(imsRcv.orderId,imsIvCur());
}
/* An invoice event is written twice: on the invoice's own Logs, and on its
   order's Logs tab, so the order carries the history of everything billed
   under it. */
// On the order's Logs an entry is headed by what happened to the invoice ("Invoice Sent").
function imsInvLogHead(status){return /^Advance Payment Invoice/.test(status)?status:'Invoice '+status;}
function imsInvLog(i,status,text,user){
  const s=stampNow();
  (i.logs=i.logs||[]).unshift({date:s.date,time:s.time,user:user||CURRENT_USER,status:status,action:text});
  const orderId=Object.keys(imsInvData).find(function(k){return (imsInvData[k]||[]).indexOf(i)>=0;});
  const p=orderId&&typeof paymentsData!=='undefined'?paymentsData.find(function(x){return x.orderId===orderId;}):null;
  if(p&&typeof pmLogsData!=='undefined'){
    // Headed by what happened to the invoice ("Invoice Generated"), not the order's own status.
    (pmLogsData[p.id]=pmLogsData[p.id]||[]).unshift({date:s.date,time:s.time,user:user||CURRENT_USER,status:imsInvLogHead(status),
      action:(i.no?i.no:(i.type==='Manual'?'Manual invoice (draft)':'Invoice (draft)'))+' · '+imsMoney(i.currency,imsInvTotal(i))+'. '+text});
  }
}
function imsIvSubmit(orderId,invId){
  const i=imsFindInv(orderId,invId);if(!i)return;
  const to=getCSValue('ims-iv-sel');
  const inp=document.getElementById('ims-iv-comment');
  const comment=inp?inp.value.trim():'';
  const flash=function(el){if(el){el.classList.add('is-invalid');setTimeout(function(){el.classList.remove('is-invalid');},1600);}};
  if(!to){flash(csTrigger('ims-iv-sel'));return;}
  if(IMS_IV_POPUP.indexOf(to)>=0){imsIvPick(to);return;}
  if(!comment){flash(inp);return;}
  imsInvMove(i,to,comment);
}
/* One place that moves an invoice's stage - used by its Logs form and by the
   row's Action menu → Update Status pop-up. */
function imsInvMove(i,to,comment){
  if(to===i.stage){
    imsInvLog(i,i.stage,comment);
    imsRcvRefresh();showToast('Comment saved','success','Added to '+(i.no||'the draft invoice')+'.');
  }else if(to==='Generated'){
    i.no=imsNextInvNo();i.stage='Generated';i.dueDate=imsInvDue(i);
    imsInvLog(i,'Generated',(i.type==='Manual'?'Manual invoice ':'Invoice ')+i.no+' generated. Terms '+i.term+' · '+imsDaysText(imsInvDueDays(i))+' captured, due '+imsDate(i.dueDate)+'; financial values locked. '+comment);
    imsRcvRefresh();
    showToast('Invoice generated','success',i.no+' · '+imsMoney(i.currency,imsInvTotal(i))+' · due '+imsDate(i.dueDate));
  }else if(to==='Cancelled'){
    const psBefore=imsInvPayStatus(i);
    i.stage='Cancelled';i.cancelReason=comment;i.cancelledOn=imsDate(IMS_TODAY);i.cancelledBy=CURRENT_USER;
    imsInvLog(i,'Cancelled','Cancelled. Reason: '+comment);
    if(psBefore)imsInvLog(i,'Payment Status Changed',psBefore+' → —.','System');
    imsRcvRefresh();
    showToast('Invoice cancelled','info',i.no+' is cancelled. The number will not be reused.');
  }
}

// ── Manual Invoice (FR2 / US3): create and edit a draft ──
function imsOpenManual(orderId,invId){
  const p=paymentsData.find(function(x){return x.orderId===orderId;});if(!p)return;
  const i=invId?imsFindInv(orderId,invId):null;
  imsModal={kind:'inv-manual',orderId:orderId,invId:invId||null,draft:i
    ?{invoiceDate:i.invoiceDate,currency:i.currency,term:i.term,customDays:i.customDays,refType:i.refType,refValue:i.refValue,description:i.description,amount:i.amount}
    :{invoiceDate:IMS_TODAY,currency:imsOrderCurrency(p),term:csPay.paymentTerm,customDays:csPay.customDays,refType:'Order',refValue:orderId,description:'',amount:''}};
  imsPaint();
}
function imsManualHTML(m){
  const p=paymentsData.find(function(x){return x.orderId===m.orderId;})||{};
  const d=m.draft;
  const isCustom=d.term==='Custom';
  const body='<div class="ct-modal-grid">'
      +imsRO('Invoice Type','Manual')
      +imsRO('Order',imsEsc(m.orderId)+' · '+imsEsc(p.name||''))
      +imsRO('Client',imsEsc(p.entityName||'—'))
      +imsRO('Billing Entity','<span id="ims-m-entity">'+imsEsc(IMS_BILLING[d.currency]||IMS_BILLING.INR)+'</span>')
    +'</div>'
    +'<div class="ep-form-grid">'
      +imsGrp('Invoice Date',apCD('ims-m-date',d.invoiceDate,'Select date','imsManDatePick'),true)
      +imsGrp('Currency',apCS('ims-m-cur',IMS_CURRENCIES,d.currency,'Select currency','imsManCurPick'),true)
      +imsGrp('Payment Terms',apCS('ims-m-term',IMS_TERMS.map(function(t){return t.term;}),d.term,'Select term','imsManTermPick'))
      +'<div class="ep-form-group" id="ims-m-days-wrap"'+(isCustom?'':' style="display:none"')+'>'
        +'<label class="ep-form-label">Payment Due Days</label>'
        +'<div class="csa-unit">'+imsInput('ims-m-days',d.customDays,'number','',' min="0" step="1" oninput="imsManDaysInput(this.value)"')
        +'<span class="csa-unit-tag">days</span></div></div>'
      +imsGrp('Due Date',imsInput('ims-m-due','','text','',' readonly'))
      +imsGrp('Reference Type',apCS('ims-m-reft',['Contract','Order','Case'],d.refType,'Select type','imsManRefPick'))
      +imsGrp('Reference',imsInput('ims-m-ref',d.refValue,'text','Contract / Order / Case number'))
      +imsGrp('Description','<textarea class="ep-form-input ims-textarea" id="ims-m-desc" rows="2" placeholder="What is being billed">'+imsEsc(d.description)+'</textarea>',true,true)
      +imsGrp('Amount',imsInput('ims-m-amount',d.amount,'number','Enter amount',' min="0" step="0.01" oninput="imsManSync()"'),true)
      +imsGrp('Tax',imsInput('ims-m-tax','','text','',' readonly'))
      +imsGrp('Total Amount',imsInput('ims-m-total','','text','',' readonly'),false,true)
    +'</div>';
  // Same as the Advance Payment form: Preview on top, the FRD's Create → Save Draft → Generate below.
  const foot='<button class="ep-cancel-btn" onclick="imsClose()">Cancel</button>'
    +'<button class="ep-cancel-btn" onclick="imsSaveManual(false)">Save Draft</button>'
    +'<button class="ep-save-btn" onclick="imsSaveManual(true)">'+IMS_ICO.send+' Send</button>';
  return imsShell(m.invId?'Manual Invoice · Draft':'Create Manual Invoice',
    'Bill a charge outside the normal invoice run. Fields marked <span class="req">*</span> are required.',body,foot,false,
    imsBtn('Preview','imsManPreview()',false,IMS_ICO.eye));
}
// Read the form into the draft (for Preview, and so it survives coming back).
function imsManRead(){
  const m=imsModal;if(!m||!m.draft)return;
  const d=m.draft;
  d.invoiceDate=getCDValue('ims-m-date')||d.invoiceDate;
  d.currency=getCSValue('ims-m-cur')||d.currency;
  d.refType=getCSValue('ims-m-reft')||d.refType;
  d.refValue=imsVal('ims-m-ref');
  d.description=imsVal('ims-m-desc');
  d.amount=imsVal('ims-m-amount');
}
function imsManPreview(){
  const m=imsModal;if(!m)return;
  imsManRead();
  const d=m.draft;
  const saved=m.invId?imsFindInv(m.orderId,m.invId):null;
  const temp={id:saved?saved.id:'',no:saved?saved.no:null,type:'Manual',currency:d.currency,invoiceDate:d.invoiceDate,term:d.term,
    customDays:d.customDays,amount:parseFloat(d.amount)||0,description:d.description,refType:d.refType,refValue:d.refValue,
    payments:[],advApplied:[]};
  imsModal={kind:'inv-preview',orderId:m.orderId,invId:m.invId,temp:temp,backForm:m};
  imsPaint();
}
// Tax, total, due date and billing entity follow the fields as they change.
function imsManSync(){
  const m=imsModal;if(!m||m.kind!=='inv-manual')return;
  const d=m.draft;
  const amt=parseFloat(imsVal('ims-m-amount'))||0;
  const probe={type:'Manual',currency:d.currency,amount:amt};
  const tx=imsInvTaxInfo(probe);
  const set=function(id,v){const el=document.getElementById(id);if(el)el.value=v;};
  set('ims-m-tax',tx.label+' · '+imsMoney(d.currency,imsInvTax(probe)));
  set('ims-m-total',imsMoney(d.currency,imsInvTotal(probe)));
  set('ims-m-due',imsDate(imsAddDays(d.invoiceDate,imsTermDays(d.term,d.customDays))));
  const ent=document.getElementById('ims-m-entity');if(ent)ent.textContent=IMS_BILLING[d.currency]||IMS_BILLING.INR;
}
function imsManDatePick(v){if(imsModal)imsModal.draft.invoiceDate=v;imsManSync();}
function imsManCurPick(v){if(imsModal)imsModal.draft.currency=v;imsManSync();}
function imsManRefPick(v){if(imsModal)imsModal.draft.refType=v;}
function imsManTermPick(v){
  if(!imsModal)return;imsModal.draft.term=v;
  const w=document.getElementById('ims-m-days-wrap');if(w)w.style.display=v==='Custom'?'':'none';
  imsManSync();
}
function imsManDaysInput(v){if(imsModal){const n=parseInt(v,10);imsModal.draft.customDays=isNaN(n)?0:n;}imsManSync();}
/* Save Draft keeps it editable and goes back to the list. Generate assigns
   the number, captures the terms and Due Date, locks the values and opens
   the invoice - one step from Send. */
function imsSaveManual(generate){
  const m=imsModal;if(!m)return;
  if(!imsNeed(['ims-m-date','ims-m-cur','ims-m-desc','ims-m-amount']))return;
  const d=m.draft;
  const vals={invoiceDate:getCDValue('ims-m-date')||d.invoiceDate,currency:getCSValue('ims-m-cur')||d.currency,term:d.term,customDays:d.customDays,
    refType:getCSValue('ims-m-reft')||d.refType,refValue:imsVal('ims-m-ref'),description:imsVal('ims-m-desc'),amount:parseFloat(imsVal('ims-m-amount'))||0};
  const po=paymentsData.find(function(x){return x.orderId===m.orderId;})||{};
  const ent=function(c){return IMS_BILLING[c]||IMS_BILLING.INR;};
  let dup=null;
  if(vals.refValue)paymentsData.forEach(function(q){
    if(dup||q.entityName!==po.entityName)return;
    (imsInvData[q.orderId]||[]).forEach(function(x){
      if(!dup&&x.type==='Manual'&&x.id!==m.invId&&x.stage!=='Cancelled'&&x.refType===vals.refType
        &&String(x.refValue).toLowerCase()===vals.refValue.toLowerCase()&&ent(x.currency)===ent(vals.currency))dup=x;
    });
  });
  if(dup){
    imsFlag('ims-m-ref');
    showToast('Duplicate Manual Invoice','error',(dup.no||'A draft manual invoice')+' already exists for '+(po.entityName||'this client')
      +' · '+ent(vals.currency)+' · '+vals.refType+' '+vals.refValue+'.');
    return;
  }
  let i;
  if(m.invId){
    i=imsFindInv(m.orderId,m.invId);Object.assign(i,vals);
    imsInvLog(i,'Draft','Draft updated · '+imsMoney(i.currency,imsInvTotal(i))+'.');
  }else{
    i=Object.assign({id:'i-'+Date.now(),no:null,type:'Manual',stage:'Draft',createdOn:imsDate(IMS_TODAY),payments:[],advApplied:[],logs:[]},vals);
    (imsInvData[m.orderId]=imsInvData[m.orderId]||[]).unshift(i);
    imsInvLog(i,'Draft','Manual invoice saved as a draft · '+imsMoney(i.currency,imsInvTotal(i))+'.');
  }
  if(generate){
    i.no=imsNextInvNo();i.stage='Generated';i.dueDate=imsInvDue(i);
    imsInvLog(i,'Generated',(i.type==='Manual'?'Manual invoice ':'Invoice ')+i.no+' generated. Terms '+i.term+' · '+imsDaysText(imsInvDueDays(i))+' captured, due '+imsDate(i.dueDate)+'; financial values locked.');
    imsRcv={orderId:m.orderId,invId:i.id,sub:'details'};
  }else imsRcv={orderId:m.orderId,invId:null,sub:'details'};
  imsModal=null;imsPaint();
  // Send: generated and emailed to the client in one step (no compose screen).
  if(generate){imsOpenSendInv(m.orderId,i.id);imsSendRun();return;}
  imsRcvRefresh();
  showToast('Draft saved','success','Manual invoice · '+imsMoney(i.currency,imsInvTotal(i))+'.');
}

function imsOpenInvPreview(orderId,invId){
  imsModal={kind:'inv-preview',orderId:orderId,invId:invId,backForm:imsModal&&imsModal.kind==='inv-send'?imsModal:null};
  imsPaint();
}
function imsInvDownload(orderId,invId){
  const i=imsFindInv(orderId,invId);if(!i)return;
  showToast('Preparing PDF','success',(i.no||'Draft invoice').replace(/\//g,'-')+'.pdf will download shortly.');
}
function imsInvPreviewHTML(m){
  const p=paymentsData.find(function(x){return x.orderId===m.orderId;})||{};
  const i=m.temp||imsFindInv(m.orderId,m.invId);   // temp: the form as it stands
  const ent=IMS_BILLING[i.currency]||IMS_BILLING.INR;
  const tx=imsInvTaxInfo(i);
  const adv=i.type==='Advance Payment';
  const docTh='padding:9px 12px;text-align:left;font-size:11px;font-weight:700;color:var(--navy);background:#f8fafc;border-bottom:1px solid var(--border)';
  const docTd='padding:11px 12px;font-size:12.5px;color:#374151;border-bottom:1px solid #f1f5f9';
  const line=function(label,val,strong){return '<tr><td style="'+docTd+(strong?';font-weight:700;color:var(--navy)':'')+'">'+label+'</td>'
    +'<td style="'+docTd+';text-align:right'+(strong?';font-weight:800;color:var(--navy)':'')+'">'+val+'</td></tr>';};
  const doc='<div class="adt-doc-page">'
    +'<div class="adt-doc-header">'
      +'<div><div class="adt-doc-brand">ADT</div><div class="adt-doc-brand-sub">'+imsEsc(ent)+'</div></div>'
      +'<div><div class="adt-doc-title">'+(adv?'ADVANCE PAYMENT INVOICE':'INVOICE')+'</div>'
        +'<div class="adt-doc-meta">No. '+(i.no?imsEsc(i.no):'DRAFT')+'</div>'
        +'<div class="adt-doc-meta">Date: '+imsDate(i.invoiceDate)+'</div></div>'
    +'</div>'
    +'<div class="ims-doc-parties">'
      +'<div class="adt-doc-section"><div class="adt-doc-section-title">Billed To</div>'
        +'<p class="adt-doc-clause"><b>'+imsEsc(p.entityName||'—')+'</b><br>Reference: '+imsEsc(i.refType)+' '+imsEsc(i.refValue)+'</p></div>'
      +'<div class="adt-doc-section"><div class="adt-doc-section-title">Billed By</div>'
        +'<p class="adt-doc-clause"><b>'+imsEsc(ent)+'</b><br>Billing Entity</p></div>'
    +'</div>'
    +'<table style="width:100%;border-collapse:collapse;border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px">'
      +'<thead><tr><th style="'+docTh+'">Description</th><th style="'+docTh+';text-align:right">Amount ('+imsEsc(i.currency)+')</th></tr></thead>'
      +'<tbody>'+line(imsEsc(i.description||'—'),imsMoney(i.currency,i.amount))
        +(adv?'':line(tx.label,imsMoney(i.currency,imsInvTax(i))))
        +line('Total',imsMoney(i.currency,imsInvTotal(i)),true)
      +'</tbody></table>'
    +'<div class="ims-doc-parties">'
      +'<div class="adt-doc-section"><div class="adt-doc-section-title">Payment Terms</div>'
        +'<p class="adt-doc-clause">'+imsEsc(i.term)+(i.term==='Custom'?' ('+imsDaysText(imsInvDueDays(i))+')':'')+'<br>Due Date: <b>'+imsDate(imsInvDue(i))+'</b></p></div>'
      +'<div class="adt-doc-section"><div class="adt-doc-section-title">Payment Instructions</div>'
        +'<p class="adt-doc-clause">'+imsEsc(IMS_PAY_INSTR[i.currency]||IMS_PAY_INSTR.INR)+'</p></div>'
    +'</div>'
  +'</div>';
  const foot='<button class="ep-cancel-btn" onclick="imsInvDownload(\''+m.orderId+'\',\''+i.id+'\')">'+IMS_ICO.dl+' Download PDF</button>'
    +'<button class="ep-save-btn" onclick="imsClose()">Close</button>';
  return imsShell(adv?'Advance Payment Invoice':'Invoice','Client view · '+(i.no?imsEsc(i.no):'Draft')+' · '+imsEsc(p.entityName||''),
    '<div class="csag-doc-wrap">'+doc+'</div>',foot,true);
}

/* ══ SEND: the email pop-up ═════════════════════════════════════════════════
   One pop-up for sending an Advance Payment Request (contract Logs → Status →
   "Advance Payment · Send") and an invoice (invoice Logs → Status → "Sent").
   The way invoicing tools send: To (the client's contacts, billing contact
   ticked), CC, Subject and Message pre-filled from the FRD's templates (US2 /
   US3 / US10) and editable, and the PDF attached. The stage becomes Sent only
   when Send is pressed, and the Logs entry is written for you - no comment. */
function imsSendHTML(m){
  const s=m.send;
  const to='<div class="ims-recips">'+s.contacts.map(function(p){
    return '<label class="hd-check csa-check"><input type="checkbox" class="ims-send-to" value="'+attrSafe(p.email)+'"'
      +(s.to.indexOf(p.email)>=0?' checked':'')+'><span>'+imsEsc(p.name)+' · '+imsEsc(p.email)+'</span></label>';
  }).join('')+'</div>';
  const body='<div class="ep-form-grid">'
      +imsGrp('To',to,true,true)
      +imsGrp('CC',imsInput('ims-send-cc',s.cc,'text','Add email addresses, separated by commas'),false,true)
      +imsGrp('Subject',imsInput('ims-send-subj',s.subject,'text',''),true,true)
      +imsGrp('Message','<textarea class="ep-form-input ims-textarea" id="ims-send-msg" rows="4">'+imsEsc(s.message)+'</textarea>',true,true)
      +imsGrp('Attachment','<button type="button" class="ims-attach" onclick="imsSendPreview()" title="Preview">'
        +'<span class="ims-attach-ico">'+IMS_ICO.doc+'</span><span>'+imsEsc(s.file)+'</span></button>',false,true)
    +'</div>';
  const foot='<button class="ep-cancel-btn" onclick="imsClose()">Cancel</button>'
    +'<button class="ep-save-btn" onclick="imsSendRun()">'+IMS_ICO.send+' Send</button>';
  return imsShell(s.title,s.sub,body,foot);
}
// Keep what has been typed when the pop-up is repainted (Preview and back).
function imsSendCapture(){
  const m=imsModal;if(!m||!m.send)return;
  m.send.to=Array.prototype.map.call(document.querySelectorAll('.ims-send-to:checked'),function(x){return x.value;});
  m.send.cc=imsVal('ims-send-cc');
  m.send.subject=imsVal('ims-send-subj');
  const msg=document.getElementById('ims-send-msg');if(msg)m.send.message=msg.value;
}
function imsSendPreview(){
  imsSendCapture();
  const m=imsModal;
  if(m.kind==='send')imsOpenPreview(m.cid,m.rid);
  else imsOpenInvPreview(m.orderId,m.invId);
}
function imsSendRun(){
  imsSendCapture();
  const m=imsModal,s=m.send;
  if(!s.to.length){showToast('Pick at least one recipient','error','It is Sent only after delivery to a valid client recipient.');return;}
  if(!imsNeed(['ims-send-subj']))return;
  const who=s.to.join(', ')+(s.cc?' (cc '+s.cc+')':'');
  if(m.kind==='send'){
    const r=imsFindReq(m.cid,m.rid);if(!r)return;
    const before=imsAdvSnap(m.cid);
    r.stage='Sent';r.sentOn=imsDate(IMS_TODAY);r.sentTo=s.to.slice();
    imsCtLog(m.cid,'Advance Payment Request '+r.no+' sent to '+who+'.');
    imsAdvAudit(m.cid,before);
    imsNotifLog(m.cid,'Advance Payment Request Sent',s.to);
    imsNotify(IMS_MSG.advSent(r.no,imsMoney(r.currency,r.amount)),'Contract ID - '+(contractsData.find(function(x){return x.id===m.cid;})||{}).contractId,
      (function(cid){return function(){imsGoContract(cid);};})(m.cid));
    imsModal=null;imsPaint();imsRefreshCt();
    const ps=imsReqPayStatus(r);
    showToast('Advance request sent','success','Advance Payment Request '+r.no+' requires payment of '+imsMoney(r.currency,r.amount)
      +'. Notification sent to the client'+(ps==='Overdue'?' · already past its Due Date, marked Overdue.':'.'));
  }else{
    const i=imsFindInv(m.orderId,m.invId);if(!i)return;
    i.stage='Sent';i.sentOn=imsDate(IMS_TODAY);i.sentTo=s.to.slice();
    imsInvLog(i,'Sent','Invoice sent to '+who+'.');
    imsInvLog(i,'Payment Status Changed','— → '+imsInvPayStatus(i)+' · Outstanding '+imsMoney(i.currency,imsInvOutstanding(i))
      +(imsInvPayStatus(i)==='Overdue'?' · Due Date '+imsDate(imsInvDue(i))+' had already passed when sent.':'.'),'System');
    imsInvLog(i,'Notification Sent',(i.type==='Manual'?'Manual Invoice':'Invoice Sent')+' · email to '+s.to.join(', ')+' · in-app.','System');
    imsNotify(IMS_MSG.sent(i.no,imsDate(imsInvDue(i))),'Order '+m.orderId+' · Invoice sent',
      (function(o,id){return function(){imsGoInvoice(o,id);};})(m.orderId,m.invId));
    imsModal=null;imsPaint();imsRcvRefresh();
    showToast('Invoice sent','success',(i.type==='Manual'?'Manual Invoice ':'Invoice ')+i.no+' has been issued. Due Date: '
      +imsDate(imsInvDue(i))+'. Notification sent to the client.');
  }
}
// Advance Payment Request - the FRD's US10 "Advance Payment Request Sent" email.
function imsOpenSendAdv(cid,rid){
  const c=contractsData.find(function(x){return x.id===cid;});
  const r=imsFindReq(cid,rid);if(!c||!r)return;
  const client=imsClientOf(c);
  const contacts=imsClientContacts(client);
  imsModal={kind:'send',cid:cid,rid:rid,send:{
    title:'Send Advance Payment Request',
    sub:imsEsc(r.no)+' · '+imsMoney(r.currency,r.amount)+' · due '+imsDate(imsReqDue(r)),
    contacts:contacts,to:[contacts[0].email],cc:'',
    subject:'Advance Payment Request '+r.no+' – Payment Required',
    message:'Dear '+client+', Advance Payment Request '+r.no+' for '+imsMoney(r.currency,r.amount)+' has been raised against '
      +c.contractId+'. Payment is due on '+imsDate(imsReqDue(r))+'. Please review the request and complete the required payment.',
    file:r.no.replace(/\//g,'-')+'.pdf'}};
  imsPaint();
}
// Invoice - US3's Manual Invoice email for manual invoices, US2's Invoice Sent email otherwise.
function imsOpenSendInv(orderId,invId){
  const p=paymentsData.find(function(x){return x.orderId===orderId;});
  const i=imsFindInv(orderId,invId);if(!p||!i)return;
  const contacts=imsClientContacts(p.entityName);
  const amt=imsMoney(i.currency,imsInvTotal(i)),due=imsDate(imsInvDue(i));
  imsModal={kind:'inv-send',orderId:orderId,invId:invId,send:{
    title:'Send Invoice',
    sub:imsEsc(i.no)+' · '+amt+' · due '+due,
    contacts:contacts,to:[contacts[0].email],cc:'',
    subject:'Invoice '+i.no+' from ADT',
    message:'Dear '+p.entityName+', '+(i.type==='Manual'?'Manual Invoice ':'Invoice ')+i.no+' for '+amt
      +' has been issued and is due on '+due+'. Please review the invoice and arrange payment as per the agreed terms.',
    file:i.no.replace(/\//g,'-')+'.pdf'}};
  imsPaint();
}

/* ══ BELL NOTIFICATIONS (US2 / US10 in-app messages) ═══════════════════════
   Every Invoice and Advance Payment event that the FRD notifies about lands in
   the bell, in the FRD's own in-app wording. Clicking one opens its record.
   The email side is the Send pop-up; this is the in-app side. */
function imsGoInvoice(orderId,invId){
  const p=paymentsData.find(function(x){return x.orderId===orderId;});if(!p)return;
  navigatePage('payments');
  openPmSidebar(p.id,'receivable');
  if(invId)imsRcvOpen(orderId,invId);
}
function imsGoContract(cid){
  navigatePage('contracts');
  if(typeof ctLandingOpen!=='undefined'&&ctLandingOpen&&typeof ctOpenType==='function')ctOpenType(CT_TYPE_ALL);
  openCtSidebar(cid,'logs');
}
function imsNotify(text,ref,go,time){
  if(typeof notifData==='undefined')return;
  notifData.unshift({name:imsEsc(text),ref:imsEsc(ref),time:time||'Just now',pending:true,go:go});
  if(typeof notifOpen!=='undefined'&&notifOpen&&typeof renderNotif==='function')renderNotif();
}
// FRD in-app texts
const IMS_MSG={
  pending:function(ref,what){return 'Invoice '+ref+' is pending '+what+'.';},
  sent:function(no,due){return 'Invoice '+no+' has been issued. Due Date: '+due+'.';},
  due:function(no,amt,due){return 'Invoice '+no+' – '+amt+' is due on '+due+'.';},
  overdue:function(no,amt){return 'Invoice '+no+' is overdue. Outstanding: '+amt+'.';},
  advSent:function(no,amt){return 'Advance Payment Request '+no+' requires payment of '+amt+'.';},
  advPaid:function(no){return 'Advance payment received against '+no+'.';}
};
// Seeded reminders: what the scheduler would have raised by 24 Jun 2026.
(function imsSeedNotifs(){
  const inv=function(o,id){return imsFindInv(o,id);};
  const add=function(text,ref,go,time){imsNotify(text,ref,go,time);};
  const i34=inv('1116','i34'),i36=inv('1116','i36'),i38=inv('1114','i38'),d1=inv('1116','i-d1'),i35=inv('1119','i35');
  // oldest first - imsNotify puts each on top
  if(i35)add(IMS_MSG.overdue(i35.no,imsMoney(i35.currency,imsInvOutstanding(i35))),'Order 1119 · Overdue reminder',function(){imsGoInvoice('1119','i35');},'5 days ago');
  if(i38)add(IMS_MSG.pending(i38.no,'Sending'),'Order 1114 · Pending action',function(){imsGoInvoice('1114','i38');},'4 days ago');
  if(i36)add(IMS_MSG.due(i36.no,imsMoney(i36.currency,imsInvOutstanding(i36)),imsDate(imsInvDue(i36))),'Order 1116 · Due reminder',function(){imsGoInvoice('1116','i36');},'1 day ago');
  if(d1)add(IMS_MSG.pending('Draft','Generation'),'Order 1116 · Pending action',function(){imsGoInvoice('1116');},'5 hrs ago');
  if(i34)add(IMS_MSG.overdue(i34.no,imsMoney(i34.currency,imsInvOutstanding(i34))),'Order 1116 · Overdue reminder',function(){imsGoInvoice('1116','i34');},'2 hrs ago');
})();

/* ── A new order's first invoice ──
   Creating an order (Payments → +) puts its amount straight into the order's
   Receivable tab as a Service invoice, in Draft - pending generation - so it
   is billed through the same Generate → Send flow as every other invoice. */
function imsOnOrderCreated(orderId,o){
  const i={id:'i-'+orderId+'-1',no:null,type:'Timesheet',stage:'Draft',currency:o.currency,invoiceDate:IMS_TODAY,
    term:csPay.paymentTerm,customDays:csPay.customDays,amount:Number(o.amount)||0,
    description:o.type+' service fee · '+o.rateType+(o.startIso?' · '+imsDate(o.startIso)+' – '+imsDate(o.endIso):''),
    refType:'Order',refValue:orderId,createdOn:imsDate(IMS_TODAY),payments:[],advApplied:[],logs:[]};
  (imsInvData[orderId]=imsInvData[orderId]||[]).unshift(i);
  imsInvLog(i,'Draft','Invoice created with the order · '+imsMoney(i.currency,imsInvTotal(i))+'.');
}

/* ── Invoice row → Action ──
   The Contracts listing's Action cell, as it is: the stage button with its
   step menu (done ✓ · current · next numbered) and the ≡ that opens the
   record. Picking a step:
     Generated / Cancelled   the "Update Status" pop-up (from → to, comment)
     Sent                    the Send pop-up (email to the client)
   The invoice's own Logs keep the full history ("View full log"). */
const IMS_INV_FLOW=['Draft','Generated','Sent'];
function imsInvExtraSteps(orderId,i){
  const out=[];
  const paid=imsInvPaid(i);
  if(i.stage==='Generated'||(i.stage==='Sent'&&paid===0))out.push('Cancelled');
  return out;
}
/* Status dropdown (Receivable list): one flow per invoice -
     Pending → Unpaid → Overdue → Paid → Closed
   Pending   not yet sent (Draft / Generated)
   Unpaid    sent, due date not passed      Overdue  sent, due date passed (system)
   Paid      paid in full                    Closed   closed after payment, or cancelled
   Moves offered: Pending → Unpaid (Draft opens its form to Generate, Generated
   opens Send) · Unpaid / Overdue → Paid · Paid → Closed · Pending (generated) /
   Unpaid with nothing paid → Closed = cancel, reason required. */
const IMS_FLOW=['Pending','Unpaid','Overdue','Paid','Closed'];
function imsInvFlow(i){
  if(i.closed||i.stage==='Cancelled')return 'Closed';
  if(i.stage==='Draft'||i.stage==='Generated')return 'Pending';
  return imsInvPayStatus(i)||'Pending';
}
function imsFlowMoves(i){
  const f=imsInvFlow(i);
  if(f==='Pending')return i.stage==='Draft'?['Unpaid']:['Unpaid','Closed'];
  if(f==='Unpaid'||f==='Overdue')return imsInvPaid(i)===0?['Paid','Closed']:['Paid'];
  if(f==='Paid')return ['Closed'];
  return [];
}
function imsPayStatusCell(orderId,i){
  const f=imsInvFlow(i),at=IMS_FLOW.indexOf(f),moves=imsFlowMoves(i);
  const o="'"+orderId+"'",d="'"+i.id+"'";
  const tick='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
  const items=IMS_FLOW.map(function(step,n){
    const cur=step===f, done=n<at&&!(step==='Overdue'&&f!=='Overdue'&&f!=='Paid'&&f!=='Closed');
    const cls=cur?'current':done?'done':'next';
    const click=moves.indexOf(step)>=0?' onclick="event.stopPropagation();imsFlowPick('+o+','+d+',\''+step+'\')"':'';
    return '<div class="ct-act-item '+cls+'"'+click+'><span class="ct-act-step '+cls+'">'+(cur||done?tick:(n+1))+'</span>'+step+'</div>';
  }).join('');
  return '<div class="ct-action-wrap" onclick="event.stopPropagation()">'
    +'<button class="ct-action-btn" onclick="imsToggleInvAction(\''+i.id+'-pay\',event)"><span>'+f+'</span>'
      +'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>'
    +'<div class="ct-action-menu">'+items+'</div>'
  +'</div>';
}
function imsFlowPick(orderId,invId,to){
  document.querySelectorAll('.ims-menu-portal').forEach(function(m){m.remove();});
  const i=imsFindInv(orderId,invId);if(!i)return;
  const back=imsModal&&imsModal.kind==='inv-expand'?imsModal:null;
  const from=imsInvFlow(i);
  if(to==='Unpaid'){                                   // sending makes it Unpaid
    if(i.stage==='Draft'){imsModal=null;imsPaint();imsRcvRowOpen(orderId,invId);return;}
    // No email pop-up: sending emails the client's billing contact straight away.
    imsOpenSendInv(orderId,invId);imsSendRun();return;
  }
  if(to==='Paid'){imsModal={kind:'inv-status',orderId:orderId,invId:invId,to:'Paid',pay:true,fromLbl:from,backForm:back};imsPaint();return;}
  if(from==='Paid'){imsModal={kind:'inv-status',orderId:orderId,invId:invId,to:'Closed',close:true,fromLbl:from,backForm:back};imsPaint();return;}
  // Pending / Unpaid → Closed: cancel, reason required
  imsModal={kind:'inv-status',orderId:orderId,invId:invId,to:'Cancelled',fromLbl:from,toLbl:'Closed',backForm:back};imsPaint();
}
function imsPayPick(orderId,invId){imsFlowPick(orderId,invId,'Paid');}
function imsInvActionCell(orderId,i,dotsIco){
  const o="'"+orderId+"'",d="'"+i.id+"'";
  const cancelled=i.stage==='Cancelled';
  const at=IMS_INV_FLOW.indexOf(i.stage);
  const tick='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
  let items=IMS_INV_FLOW.map(function(step,n){
    const done=cancelled?n<=1&&!!i.no:at>n, cur=!cancelled&&at===n;
    const cls=done?'done':cur?'current':'next';
    // only the next step forward is offered, as the Logs form does
    const click=!cancelled&&n===at+1?' onclick="event.stopPropagation();imsInvPick('+o+','+d+',\''+step+'\')"':'';
    return '<div class="ct-act-item '+cls+'"'+click+'><span class="ct-act-step '+cls+'">'+(done?tick:(n+1))+'</span>'+step+'</div>';
  }).join('');
  if(cancelled)items+='<div class="ct-act-item current"><span class="ct-act-step current">'+tick+'</span>Cancelled</div>';
  items+=imsInvExtraSteps(orderId,i).map(function(step){
    return '<div class="ct-act-item next" onclick="event.stopPropagation();imsInvPick('+o+','+d+',\''+step+'\')">'
      +'<span class="ct-act-step next">·</span>'+step+'</div>';
  }).join('');
  return '<div class="ct-action-wrap" onclick="event.stopPropagation()">'
    +'<button class="ct-action-btn" onclick="imsToggleInvAction('+d+',event)"><span>'+i.stage+'</span>'
      +'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>'
    +'<button class="ct-dots-btn" title="Open" onclick="event.stopPropagation();imsRcvRowOpen('+o+','+d+')">'+dotsIco+'</button>'
    +'<div class="ct-action-menu" id="ivm-'+i.id+'">'+items+'</div>'
  +'</div>';
}
function imsToggleInvAction(invId,e){
  if(e)e.stopPropagation();
  /* The side panel clips anything positioned inside it, so the open menu is a
     copy on <body>, placed against the row's button. A second click closes it. */
  const open=document.querySelector('.ims-menu-portal');
  const same=open&&open.classList.contains('open')&&open.dataset.inv===invId;
  document.querySelectorAll('.ims-menu-portal').forEach(function(x){x.remove();});
  document.querySelectorAll('.ct-action-menu').forEach(function(x){x.classList.remove('open');});
  if(same)return;
  const w=e?e.target.closest('.ct-action-wrap'):null;
  const src=w?w.querySelector('.ct-action-menu'):document.getElementById('ivm-'+invId);if(!src)return;
  const m=src.cloneNode(true);
  m.removeAttribute('id');m.dataset.inv=invId;m.classList.add('ims-menu-portal','open');
  document.body.appendChild(m);
  if(w)placeAnchoredMenu(m,w.getBoundingClientRect());
}
function imsInvPick(orderId,invId,step){
  document.querySelectorAll('.ims-menu-portal').forEach(function(m){m.remove();});
  document.querySelectorAll('.ct-action-menu').forEach(function(m){m.classList.remove('open');});
  // From the Expand pop-up, closing the step's pop-up goes back to it.
  const back=imsModal&&imsModal.kind==='inv-expand'?imsModal:null;
  imsInvPickRun(orderId,invId,step);
  if(back&&imsModal&&imsModal!==back&&!imsModal.backForm)imsModal.backForm=back;
}
function imsInvPickRun(orderId,invId,step){
  if(step==='Sent'){imsOpenSendInv(orderId,invId);imsSendRun();}
  else{imsModal={kind:'inv-status',orderId:orderId,invId:invId,to:step};imsPaint();
    const t=document.getElementById('ims-st-comment');if(t)t.focus();}
}
// "Update Status" - the Contracts status pop-up, for an invoice.
function imsInvStatusHTML(m){
  const p=paymentsData.find(function(x){return x.orderId===m.orderId;})||{};
  const i=imsFindInv(m.orderId,m.invId);
  const cancel=m.to==='Cancelled';
  const arrow='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
  return '<div class="ct-modal-overlay" onclick="imsClose()">'
    +'<div class="ct-modal ct-sm" style="width:min(540px,92vw)" role="dialog" aria-modal="true" aria-label="Update invoice status" onclick="event.stopPropagation()">'
    +'<div class="ct-modal-hdr"><span class="ct-modal-title">Update Status</span><button class="ct-modal-close" onclick="imsClose()" aria-label="Close">'+IMS_ICO.x+'</button></div>'
    +'<p class="ct-modal-sub">'+(i.no?imsEsc(i.no):'Draft invoice')+' &middot; '+imsEsc(p.entityName||'')+' &middot; '+imsMoney(i.currency,imsInvTotal(i))+'</p>'
    +'<div class="ct-sm-move">'+imsBadge(m.fromLbl||(m.pay?imsInvPayStatus(i):i.stage))+arrow+imsBadge(m.toLbl||m.to)+'</div>'
    +'<div class="ep-form-grid">'
    +'<div class="ep-form-group ep-form-full"><label class="ep-form-label">'+(cancel?'Cancellation Reason':'Comment')+' <span class="req">*</span></label>'
      +'<textarea id="ims-st-comment" class="ep-form-input" rows="4" placeholder="'+(cancel?'Why is this invoice being cancelled?':'Add a comment')+'" style="resize:vertical;min-height:90px;height:auto;line-height:1.5"></textarea></div>'
    +'</div>'
    +'<div class="ct-modal-foot">'
      +'<button class="add-link" onclick="imsInvStatusToLog()">View full log</button>'
      +'<div class="ct-modal-btns">'
        +'<button class="ep-cancel-btn" onclick="imsClose()">Cancel</button>'
        +'<button class="ep-save-btn" onclick="imsInvStatusSubmit()">Submit</button>'
      +'</div>'
    +'</div>'
    +'</div></div>';
}
function imsInvStatusSubmit(){
  const m=imsModal;if(!m)return;
  const inp=document.getElementById('ims-st-comment');
  const comment=inp?inp.value.trim():'';
  if(!comment){if(inp){inp.classList.add('is-invalid');setTimeout(function(){inp.classList.remove('is-invalid');},1600);inp.focus();}return;}
  const i=imsFindInv(m.orderId,m.invId);if(!i)return;
  imsModal=null;imsPaint();
  if(m.close){
    i.closed=true;
    imsInvLog(i,'Closed','Paid → Closed. '+comment);
    imsRcvRefresh();
    showToast('Invoice closed','success',i.no+' is now Closed.');
    return;
  }
  if(m.pay){
    const before=imsInvPayStatus(i),amt=imsInvOutstanding(i);
    i.payments.push({date:IMS_TODAY,amount:amt,mode:'—',ref:'—'});
    imsInvLog(i,'Payment Status Changed',before+' → Paid · '+imsMoney(i.currency,amt)+' received. '+comment);
    const p=paymentsData.find(function(x){return x.orderId===m.orderId;});
    const moved=p?imsPmSyncOrder(p):false;
    if(moved&&typeof renderADTPage==='function')renderADTPage();else imsRcvRefresh();
    showToast('Payment Status updated',
      'success',i.no+' is now Paid.'+(moved?' All invoices paid – order '+m.orderId+' is Paid.':''));
    return;
  }
  imsInvMove(i,m.to,comment);
}
function imsInvStatusToLog(){
  const m=imsModal;if(!m)return;
  imsModal=null;imsPaint();
  if(typeof navPmTab==='function')navPmTab('logs');
}

/* ══ SEEDED AUDIT HISTORY ═══════════════════════════════════════════════════
   The seeded requests and invoices were made "before today", so their audit
   trail is written here, dated, in the same shape the live actions write:
   the action (user) and what it changed (System) - FR 5.14 / US11. Merged into
   the existing Logs in date order, newest first. */
function imsLogTime(l){const t=Date.parse(String(l.date||'')+' '+String(l.time||'').toUpperCase());return isNaN(t)?0:t;}
// Newest first; entries in the same minute keep the later one on top.
function imsMergeLogs(existing,added){
  return added.concat(existing||[]).map(function(l,n){return {l:l,n:n};})
    .sort(function(a,b){return imsLogTime(b.l)-imsLogTime(a.l)||b.n-a.n;}).map(function(x){return x.l;});
}
(function imsSeedAudit(){
  if(typeof ctLogsData==='undefined')return;
  const FO='Finance Ops',SYS='System';
  const e=function(date,time,user,status,action){return {date:date,time:time,user:user,status:status,action:action};};
  const AP='Advance Payment',PS='Payment Status Changed',NS='Notification Sent';
  const seed={
    2:[e('22 Jun 2026','05:10 PM',FO,AP,'Advance Payment Request created as draft · INR 170,000, due 07 Jul 2026.')],
    4:[e('10 Jun 2026','09:30 AM',FO,AP,'Advance Payment Request created as draft · INR 200,000, due 10 Jul 2026.'),
       e('10 Jun 2026','09:45 AM',FO,AP,'Advance Payment Request ADV/2026-27/0003 generated · INR 200,000, due 10 Jul 2026.'),
       e('10 Jun 2026','10:00 AM',FO,AP,'Advance Payment Request ADV/2026-27/0003 sent to accounts@nimbusretail.com.'),
       e('10 Jun 2026','10:00 AM',SYS,PS,'ADV/2026-27/0003 · — → Unpaid · Outstanding INR 200,000.'),
       e('10 Jun 2026','10:00 AM',SYS,NS,'Advance Payment Request Sent · email to accounts@nimbusretail.com · in-app.')],
    14:[e('26 May 2026','11:00 AM',FO,AP,'Advance Payment Request ADV/2026-27/0004 generated · INR 150,000, due 10 Jun 2026.'),
        e('26 May 2026','11:15 AM',FO,AP,'Advance Payment Request ADV/2026-27/0004 sent to accounts@nimbusretail.com, finance@nimbusretail.com.'),
        e('26 May 2026','11:15 AM',SYS,PS,'ADV/2026-27/0004 · — → Unpaid · Outstanding INR 150,000.'),
        e('26 May 2026','11:16 AM',SYS,'Notification Failed','Advance Payment Request Sent · email to finance@nimbusretail.com bounced (mailbox full); delivered to accounts@nimbusretail.com and in-app. Stage and Payment Status unchanged.'),
        e('11 Jun 2026','12:00 AM',SYS,PS,'ADV/2026-27/0004 · Unpaid → Overdue · Due Date 10 Jun 2026 passed with INR 150,000 outstanding.')],
    17:[e('23 Jun 2026','03:00 PM',FO,AP,'Advance Payment Request created as draft · EUR 5,000.'),
        e('23 Jun 2026','03:20 PM',FO,AP,'Advance Payment Request ADV/2026-27/0005 generated · EUR 5,000, due 30 Jun 2026.')],
    7:[e('04 May 2026','10:00 AM',FO,AP,'Advance Payment Request ADV/2026-27/0001 generated · INR 300,000, due 19 May 2026.'),
       e('04 May 2026','10:20 AM',FO,AP,'Advance Payment Request ADV/2026-27/0001 sent to accounts@closedhi.com.'),
       e('04 May 2026','10:20 AM',SYS,PS,'ADV/2026-27/0001 · — → Unpaid · Outstanding INR 300,000.'),
       e('04 May 2026','10:20 AM',SYS,NS,'Advance Payment Request Sent · email to accounts@closedhi.com · in-app.'),
       e('12 May 2026','04:30 PM',FO,AP,'Advance payment of INR 300,000 received against ADV/2026-27/0001 · ref NEFT-HDFC-88213.'),
       e('12 May 2026','04:30 PM',SYS,PS,'ADV/2026-27/0001 · Unpaid → Paid.'),
       e('12 May 2026','04:30 PM',SYS,NS,'Advance Payment Received · email to accounts@closedhi.com · in-app.'),
       e('20 May 2026','10:00 AM',SYS,'Advance Payment Invoice Created','DHI/2026-27/0027 created in Receivables on generation of Order 1118 · carries ADV/2026-27/0001: terms, Due Date and INR 300,000 paid.')],
    13:[e('08 May 2026','11:00 AM',FO,AP,'Advance Payment Request ADV/2026-27/0002 generated · GBP 8,000, due 15 May 2026.'),
        e('08 May 2026','11:10 AM',FO,AP,'Advance Payment Request ADV/2026-27/0002 sent to accounts@harborhealth.com.'),
        e('08 May 2026','11:10 AM',SYS,PS,'ADV/2026-27/0002 · — → Unpaid · Outstanding GBP 8,000.'),
        e('12 May 2026','09:00 AM',FO,AP,'Advance Payment Request ADV/2026-27/0002 cancelled. Reason: Amount revised after commercial review. Replaced by a new request.'),
        e('12 May 2026','09:00 AM',SYS,PS,'ADV/2026-27/0002 · Unpaid → —.'),
        e('12 May 2026','09:30 AM',FO,AP,'Advance Payment Request ADV/2026-27/0006 generated · GBP 6,000, due 19 May 2026.'),
        e('12 May 2026','09:40 AM',FO,AP,'Advance Payment Request ADV/2026-27/0006 sent to accounts@harborhealth.com.'),
        e('12 May 2026','09:40 AM',SYS,PS,'ADV/2026-27/0006 · — → Unpaid · Outstanding GBP 6,000.'),
        e('16 May 2026','01:15 PM',FO,AP,'Advance payment of GBP 6,000 received against ADV/2026-27/0006 · ref CARD-TXN-55120.'),
        e('16 May 2026','01:15 PM',SYS,PS,'ADV/2026-27/0006 · Unpaid → Paid.'),
        e('22 May 2026','10:00 AM',SYS,'Advance Payment Invoice Created','DHI/2026-27/0028 created in Receivables on generation of Order 1119 · carries ADV/2026-27/0006.')],
    10:[e('25 May 2026','09:30 AM',FO,AP,'Advance Payment Request ADV/2026-27/0008 generated · INR 100,000, due 09 Jun 2026.'),
        e('25 May 2026','09:45 AM',FO,AP,'Advance Payment Request ADV/2026-27/0008 sent to accounts@nimbusretail.com.'),
        e('25 May 2026','09:45 AM',SYS,PS,'ADV/2026-27/0008 · — → Unpaid · Outstanding INR 100,000.'),
        e('28 May 2026','11:10 AM',FO,AP,'Advance payment of INR 100,000 received against ADV/2026-27/0008 · ref NEFT-ICIC-40211.'),
        e('28 May 2026','11:10 AM',SYS,PS,'ADV/2026-27/0008 · Unpaid → Paid.'),
        e('01 Jun 2026','10:00 AM',SYS,'Advance Payment Invoice Created','DHI/2026-27/0032 created in Receivables on generation of Order 1120 · carries ADV/2026-27/0008: terms, Due Date and INR 100,000 paid.')],
    23:[e('01 Jun 2026','10:00 AM',FO,AP,'Advance Payment Request ADV/2026-27/0007 generated · INR 50,000, due 16 Jun 2026.'),
        e('03 Jun 2026','04:00 PM',FO,AP,'Advance Payment Request ADV/2026-27/0007 cancelled. Reason: Client asked to raise the advance after contract approval.'),
        e('15 Jun 2026','10:00 AM',FO,AP,'Advance Payment Request ADV/2026-27/0009 generated · INR 75,000, due 30 Jun 2026. Replaces ADV/2026-27/0007.'),
        e('15 Jun 2026','10:15 AM',FO,AP,'Advance Payment Request ADV/2026-27/0009 sent to accounts@closedhi.com.'),
        e('15 Jun 2026','10:15 AM',SYS,PS,'ADV/2026-27/0009 · — → Unpaid · Outstanding INR 75,000.'),
        e('15 Jun 2026','10:15 AM',SYS,NS,'Advance Payment Request Sent · email to accounts@closedhi.com · in-app.')]
  };
  Object.keys(seed).forEach(function(cid){ctLogsData[cid]=imsMergeLogs(ctLogsData[cid],seed[cid]);});

  // Each order's Logs carry its invoices' history too (live events do this through imsInvLog).
  if(typeof paymentsData==='undefined'||typeof pmLogsData==='undefined')return;
  Object.keys(imsInvData).forEach(function(orderId){
    const p=paymentsData.find(function(x){return x.orderId===orderId;});if(!p)return;
    const added=[];
    (imsInvData[orderId]||[]).forEach(function(i){
      (i.logs||[]).forEach(function(l){
        added.push({date:l.date,time:l.time,user:l.user,status:imsInvLogHead(l.status),
          action:(i.no||(i.type==='Manual'?'Manual invoice (draft)':'Invoice (draft)'))+' · '+imsMoney(i.currency,imsInvTotal(i))+'. '+l.action});
      });
    });
    pmLogsData[p.id]=imsMergeLogs(pmLogsData[p.id],added);
  });
})();

/* ══ CLIENT VIEW (FR5 §5.3, FR6, US5 AC16, US10 AC4) ═════════════════════════
   Switch Entity → Closedhi shows the platform as the client sees it: the same
   menu, the client's own user in the topbar, the client's in-app messages in
   the bell, and Finance → Payments listing the Advance Payment Requests sent
   to them, with View · Download. Built from the
   listing page parts (.lp-filter-bar, .listing-stats, .lp-table, the split
   side panel) and the document previews already used on the Finance side.
   Type and Category stay internal: nothing here shows them. */
const IMS_CL_ENTITY='closedhi', IMS_CL_NAME='Closedhi';
function imsClientMode(){return typeof seSelectedEntity!=='undefined'&&seSelectedEntity===IMS_CL_ENTITY;}
// Any client-side entity: this one, or the Closedhi Client portal (js/client-portal.js).
function imsClientLike(){return imsClientMode()||(typeof cpMode==='function'&&cpMode());}
let imsCl={tab:'advance',sel:null,q:'',status:''};

// What the client may see: only documents that were Sent to them.
function imsClReqs(){
  const out=[];
  Object.keys(imsAdvData).forEach(function(cid){
    const c=contractsData.find(function(x){return String(x.id)===String(cid);});
    if(!c||imsClientOf(c)!==IMS_CL_NAME)return;
    (imsAdvData[cid]||[]).forEach(function(r){if(r.no&&r.sentOn)out.push({c:c,r:r,id:'r:'+cid+':'+r.id});});
  });
  return out.sort(function(a,b){return a.r.requestDate<b.r.requestDate?1:-1;});
}
function imsClInvs(){
  const out=[];
  paymentsData.forEach(function(p){
    if(p.entityName!==IMS_CL_NAME)return;
    (imsInvData[p.orderId]||[]).forEach(function(i){if(i.no&&i.sentOn&&i.stage!=='Cancelled')out.push({p:p,i:i,id:'i:'+p.orderId+':'+i.id});});
  });
  return out.sort(function(a,b){return a.i.invoiceDate<b.i.invoiceDate?1:-1;});
}
function imsClRefresh(){if(typeof renderADTPage==='function')renderADTPage();}
function imsClOpen(id){imsCl.sel=imsCl.sel===id?null:id;imsClRefresh();}
function imsClClose(){imsCl.sel=null;imsClRefresh();}
function imsClStat(s){imsCl.status=imsCl.status===s?'':s;imsCl.sel=null;imsClRefresh();}
function imsClApply(){
  const q=document.getElementById('cl-f-q');imsCl.q=q?q.value.trim():'';
  const st=typeof getCSValue==='function'?getCSValue('cl-f-status'):'';imsCl.status=st||'';
  imsClRefresh();
}

function imsClientPaymentsHTML(){
  const dotsIco='<svg width="16" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="2" x2="17" y2="2"/><line x1="1" y1="7" x2="17" y2="7"/><line x1="1" y1="12" x2="17" y2="12"/></svg>';
  const adv=imsCl.tab==='advance';
  const all=adv?imsClReqs():imsClInvs();
  const ps=function(x){return adv?imsReqPayStatus(x.r):imsInvPayStatus(x.i);};
  const count=function(s){return all.filter(function(x){return ps(x)===s;}).length;};
  const q=imsCl.q.toLowerCase();
  const rows=all.filter(function(x){
    if(imsCl.status&&ps(x)!==imsCl.status)return false;
    if(!q)return true;
    return (adv?(x.r.no+' '+x.c.contractId):(x.i.no+' '+x.p.orderId+' '+x.i.type)).toLowerCase().indexOf(q)>-1;
  });
  if(imsCl.sel&&!rows.some(function(x){return x.id===imsCl.sel;}))imsCl.sel=null;

  const stat=function(s,cls){
    return '<div class="listing-stat'+(cls?' '+cls:'')+(imsCl.status===s?' stat-selected':'')+'" onclick="imsClStat(\''+s+'\')">'
      +'<div class="listing-stat-count">'+count(s)+'</div><div class="listing-stat-label">'+s+'</div></div>';};

  const heads=adv?['S. No','Request No.','Contract/Deal','Request Date','Due Date','Amount','Outstanding','Payment Status','Action']
    :['S. No','Invoice No.','Type','Order','Invoice Date','Due Date','Total','Outstanding','Payment Status','Action'];
  const body=rows.length?rows.map(function(x,n){
    const sel=imsCl.sel===x.id?' lp-row-selected':'';
    const open=' onclick="imsClOpen(\''+x.id+'\')"';
    const st=ps(x);
    const cells=adv?[
      '<td style="color:#6b7280;font-size:13px">'+(n+1)+'</td>',
      '<td style="font-weight:600;color:var(--navy)">'+imsEsc(x.r.no)+'</td>',
      '<td>'+imsEsc(x.c.contractId)+'</td>',
      '<td>'+imsDate(x.r.requestDate)+'</td>',
      '<td>'+imsDate(imsReqDue(x.r))+'</td>',
      '<td>'+imsMoney(x.r.currency,x.r.amount)+'</td>',
      '<td style="font-weight:600;color:var(--navy)">'+(st==='—'?'—':imsMoney(x.r.currency,imsReqOutstanding(x.r)))+'</td>',
      '<td>'+(st?imsBadge(st):'')+'</td>'
    ]:[
      '<td style="color:#6b7280;font-size:13px">'+(n+1)+'</td>',
      '<td style="font-weight:600;color:var(--navy)">'+imsEsc(x.i.no)+'</td>',
      '<td>'+imsEsc(x.i.type)+'</td>',
      '<td>'+imsEsc(x.p.orderId)+'</td>',
      '<td>'+imsDate(x.i.invoiceDate)+'</td>',
      '<td>'+imsDate(imsInvDue(x.i))+'</td>',
      '<td>'+imsMoney(x.i.currency,imsInvTotal(x.i))+'</td>',
      '<td style="font-weight:600;color:var(--navy)">'+imsMoney(x.i.currency,imsInvOutstanding(x.i))+'</td>',
      '<td>'+(st?imsBadge(st):'')+'</td>'
    ];
    return '<tr class="pm-row'+sel+'" style="cursor:pointer"'+open+'>'+cells.join('')
      +'<td><button class="lp-action-btn" title="Open" onclick="event.stopPropagation();imsClOpen(\''+x.id+'\')">'+dotsIco+'</button></td></tr>';
  }).join(''):'<tr><td colspan="'+heads.length+'" style="padding:24px;text-align:center;color:var(--gray)">Nothing here yet.</td></tr>';

  const selRow=imsCl.sel?all.find(function(x){return x.id===imsCl.sel;}):null;
  return '<div class="lp-page">'
    +'<div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:4px">'
      +'<div class="lp-filter-bar" style="flex:1;min-width:0;padding:0"><div class="lp-filter-bar-label">Select Filter</div>'
      +'<div class="lp-filter-bar-row">'
        +lpSearchField('cl-f-q',imsCl.q,adv?'Search request, contract':'Search invoice, order','imsClApply()')
        +apCS('cl-f-status',['Unpaid','Overdue','Paid'],imsCl.status,'Payment Status')
        +'<button class="lp-pill-search" onclick="imsClApply()">Search</button>'
      +'</div></div>'
      +'<div class="listing-stats" style="flex-shrink:0">'+stat('Unpaid','pending')+stat('Overdue','')+stat('Paid','active')+'</div>'
    +'</div>'
    +'<div class="lp-split-wrap" style="margin-top:14px"><div class="lp-split-main"><div class="lp-table-card" style="border:none;border-radius:0;box-shadow:none">'
      +'<table class="lp-table"><thead><tr>'+heads.map(function(h){return '<th>'+h+'</th>';}).join('')+'</tr></thead><tbody>'+body+'</tbody></table>'
    +'</div></div>'
    +'<div class="lp-split-sb'+(selRow?' open':'')+'"><div class="lp-isb">'+(selRow?imsClPanelHTML(selRow,adv):'')+'</div></div>'
    +'</div></div>';
}

// The side panel: what the client was sent, and View · Download · Pay.
function imsClPanelHTML(x,adv){
  const tabBar='<div class="lp-isb-tabbar"><div class="lp-isb-tabs"><button class="lp-isb-tab active">Details</button></div>'
    +'<div class="lp-isb-right"><button class="lp-isb-close" onclick="imsClClose()" title="Close">'+IMS_ICO.x+'</button></div></div>';
  let head,stats,grid,view,dl;
  if(adv){
    const r=x.r,st=imsReqPayStatus(r),out=imsReqOutstanding(r);
    view='imsOpenPreview('+x.c.id+',\''+r.id+'\')';dl='imsDownload('+x.c.id+',\''+r.id+'\')';
    head='<span class="ims-req-no">'+imsEsc(r.no)+'</span>'+(st?imsBadge(st):'');
    stats=imsStat('Amount',imsMoney(r.currency,r.amount))+imsStat('Paid',imsMoney(r.currency,imsReqReceived(r)))
      +imsStat('Outstanding',st==='—'?'—':imsMoney(r.currency,out));
    grid=imsFc(IMS_ICO.hash,'Advance Request Number',imsEsc(r.no))
      +imsFc(IMS_ICO.doc,'Contract/Deal Reference',imsEsc(x.c.contractId))
      +imsFc(IMS_ICO.user,'Client',imsEsc(IMS_CL_NAME))
      +imsFc(IMS_ICO.bank,'Billing Entity',imsEsc(IMS_BILLING[r.currency]||IMS_BILLING.INR))
      +imsFc(IMS_ICO.cal,'Request Date',imsDate(r.requestDate))
      +imsFc(IMS_ICO.clock,'Payment Terms',imsEsc(r.term)+' · '+imsDaysText(imsReqDueDays(r)))
      +imsFc(IMS_ICO.cal,'Due Date',imsDate(imsReqDue(r)))
      +imsFc(IMS_ICO.dollar,'Currency',imsEsc(r.currency))
      +imsFc(IMS_ICO.bank,'Payment Instructions',imsEsc(IMS_PAY_INSTR[r.currency]||IMS_PAY_INSTR.INR),true);
  }else{
    const i=x.i,st=imsInvPayStatus(i),out=imsInvOutstanding(i);
    view='imsOpenInvPreview(\''+x.p.orderId+'\',\''+i.id+'\')';dl='imsInvDownload(\''+x.p.orderId+'\',\''+i.id+'\')';
    head='<span class="ims-req-no">'+imsEsc(i.no)+'</span>'+(st?imsBadge(st):'');
    stats=imsStat('Invoice Total',imsMoney(i.currency,imsInvTotal(i)))
      +imsStat('Paid',imsMoney(i.currency,imsInvPaid(i)))
      +imsStat('Outstanding',imsMoney(i.currency,out));
    grid=imsFc(IMS_ICO.hash,'Invoice Number',imsEsc(i.no))
      +imsFc(IMS_ICO.tag,'Invoice Type',imsEsc(i.type))
      +imsFc(IMS_ICO.doc,'Order',imsEsc(x.p.orderId)+' · '+imsEsc(x.p.name))
      +imsFc(IMS_ICO.bank,'Billing Entity',imsEsc(IMS_BILLING[i.currency]||IMS_BILLING.INR))
      +imsFc(IMS_ICO.cal,'Invoice Date',imsDate(i.invoiceDate))
      +imsFc(IMS_ICO.clock,'Payment Terms',imsEsc(i.term)+' · '+imsDaysText(imsInvDueDays(i)))
      +imsFc(IMS_ICO.cal,'Due Date',imsDate(imsInvDue(i)))
      +imsFc(IMS_ICO.dollar,'Currency',imsEsc(i.currency))
      +imsFc(IMS_ICO.dollar,'Amount',imsMoney(i.currency,i.amount))
      +imsFc(IMS_ICO.dollar,'Tax',imsInvTaxInfo(i).label+' · '+imsMoney(i.currency,imsInvTax(i)))
      +(i.description?imsFc(IMS_ICO.doc,'Description',imsEsc(i.description),true):'');
  }
  const acts=imsBtn('View',view,false,IMS_ICO.eye)+imsBtn('Download',dl,true,IMS_ICO.dl);
  const body='<div class="ims-rcv">'
    +'<div class="lp-sb-view-header"><div class="ims-req-head">'+head+'</div><div class="ims-acts">'+acts+'</div></div>'
    +'<div class="pm-ts-stats ims-inv-stats'+(adv?' ims-stats-3':'')+'">'+stats+'</div>'
    +'<div class="lp-sb-detail-grid">'+grid+'</div></div>';
  return tabBar+'<div class="lp-isb-body">'+body+'</div>';
}

// The client's own in-app messages (US2 events 2-4, US9 1-2).
let imsNotifAdmin=null;
function imsClientNotifs(){
  const portal=typeof cpMode==='function'&&cpMode();
  const go=function(tab,id){
    if(portal){const cid=id==='r:7:r7a'?'i:1118:i27':id;return function(){navigatePage('payments');cpOpen(cid);};}
    if(tab!=='advance')return undefined;return function(){navigatePage('payments');imsCl.sel=id;imsClRefresh();};};
  const inv=function(o,id){return imsFindInv(o,id);};
  const list=[];
  const r9=imsFindReq(23,'r23b');
  if(r9)list.push({name:IMS_MSG.advSent(r9.no,imsMoney(r9.currency,r9.amount)),ref:'Advance Payment Request',time:'9 days ago',pending:true,go:go('advance','r:23:r23b')});
  const i34=inv('1116','i34');if(i34)list.push({name:IMS_MSG.overdue(i34.no,imsMoney(i34.currency,imsInvOutstanding(i34))),ref:'Invoice · Overdue',time:'2 hrs ago',pending:true,go:go('invoices','i:1116:i34')});
  const i40=inv('1118','i40');if(i40)list.push({name:IMS_MSG.sent(i40.no,imsDate(imsInvDue(i40))),ref:'Invoice',time:'2 days ago',pending:true,go:go('invoices','i:1118:i40')});
  const i36=inv('1116','i36');if(i36)list.push({name:IMS_MSG.due(i36.no,imsMoney(i36.currency,imsInvOutstanding(i36)),imsDate(imsInvDue(i36))),ref:'Invoice · Due reminder',time:'1 day ago',pending:true,go:go('invoices','i:1116:i36')});
  list.push({name:IMS_MSG.advPaid('ADV/2026-27/0001'),ref:'Advance Payment Request',time:'43 days ago',pending:true,go:go('advance','r:7:r7a')});
  return list.sort(function(a,b){return (parseInt(a.time,10)*(/hr/.test(a.time)?1:24))-(parseInt(b.time,10)*(/hr/.test(b.time)?1:24));});
}

// The topbar as the client: their company and their user.
const IMS_CL_USER={initials:'ST',name:'Shaun Test1',email:'shaun.varghese@closedhi.com',role:'Client Admin'};
let imsHdrSaved=null;
function imsSetHeader(client){
  const q=function(s){return document.querySelector(s);};
  const et=q('#entity-trigger'),ut=q('#user-trigger');if(!et||!ut)return;
  const textNode=function(el){return Array.from(el.childNodes).find(function(n){return n.nodeType===3&&n.textContent.trim();});};
  if(!imsHdrSaved)imsHdrSaved={
    ent:textNode(et).textContent,entTitle:q('#entity-dd .hdr-dd-title').textContent,entSub:q('#entity-dd .hdr-dd-subtitle').textContent,
    entLogo:q('#entity-dd .hdr-dd-entity-logo').textContent,entVals:Array.from(document.querySelectorAll('#entity-dd .hdr-dd-info-val')).map(function(v){return v.textContent;}),
    user:textNode(ut).textContent,av:q('#user-trigger .user-avatar-sm').textContent,uTitle:q('#user-dd .hdr-dd-title').textContent,
    uSub:q('#user-dd .hdr-dd-subtitle').textContent,uAv:q('#user-dd .user-avatar-sm').textContent,uVals:Array.from(document.querySelectorAll('#user-dd .hdr-dd-info-val')).map(function(v){return v.textContent;})
  };
  const h=imsHdrSaved,e=(entitiesData||[]).find(function(x){return x.id===seSelectedEntity;})||{};
  const name=e.name||IMS_CL_NAME;
  textNode(et).textContent=' '+(client?name:h.ent.trim())+' ';
  q('#entity-dd .hdr-dd-title').textContent=client?name:h.entTitle;
  q('#entity-dd .hdr-dd-subtitle').textContent=client?'Entity ID: '+(e.entityId||''):h.entSub;
  q('#entity-dd .hdr-dd-entity-logo').textContent=client?(e.initials||'CL'):h.entLogo;
  const ev=document.querySelectorAll('#entity-dd .hdr-dd-info-val');
  if(ev[0])ev[0].textContent=client?'Client':h.entVals[0];
  if(ev[1])ev[1].textContent=client?(e.country||'India'):h.entVals[1];
  textNode(ut).textContent=' '+(client?IMS_CL_USER.name:h.user.trim())+' ';
  q('#user-trigger .user-avatar-sm').textContent=client?IMS_CL_USER.initials:h.av;
  q('#user-dd .hdr-dd-title').textContent=client?IMS_CL_USER.name:h.uTitle;
  q('#user-dd .hdr-dd-subtitle').textContent=client?IMS_CL_USER.email:h.uSub;
  q('#user-dd .user-avatar-sm').textContent=client?IMS_CL_USER.initials:h.uAv;
  const uv=document.querySelectorAll('#user-dd .hdr-dd-info-val');
  if(uv[0])uv[0].textContent=client?IMS_CL_USER.role:h.uVals[0];
}

// Switching the entity swaps the topbar, the bell and the Payments page.
function imsApplyEntity(){
  const client=imsClientLike();
  imsSetHeader(client);
  if(typeof notifData!=='undefined'){
    if(client){if(!imsNotifAdmin)imsNotifAdmin=notifData.slice();notifData.splice(0,notifData.length);imsClientNotifs().forEach(function(n){notifData.push(n);});}
    else if(imsNotifAdmin){notifData.splice(0,notifData.length);imsNotifAdmin.forEach(function(n){notifData.push(n);});imsNotifAdmin=null;}
  }
  imsCl={tab:'advance',sel:null,q:'',status:''};
  if(typeof cpReset==='function')cpReset();
  if(typeof lastSidebarSig!=='undefined')lastSidebarSig=null;
}
(function imsHookClient(){
  if(typeof buildPaymentsHTML==='function'){
    const basePay=buildPaymentsHTML;
    buildPaymentsHTML=function(){return imsClientMode()?imsClientPaymentsHTML():basePay();};
  }
  // renderer.js loads after this file, so its page render is wrapped once every script has run.
  document.addEventListener('DOMContentLoaded',function(){
    if(typeof renderADTPage!=='function')return;
    const baseRender=renderADTPage;
    renderADTPage=function(){
      // An action menu copied onto <body> belongs to the page being left.
      document.querySelectorAll('.ims-menu-portal').forEach(function(m){m.remove();});
      baseRender.apply(this,arguments);
      // The client cannot create orders.
      const add=document.getElementById('tb-page-add-btn');
      if(add&&imsClientLike()&&page==='payments')add.style.display='none';
    };
  });
  if(typeof proceedSwitchEntity==='function'){
    proceedSwitchEntity=function(){
      const e=entitiesData.find(function(x){return x.id===seSelectedEntity;});if(!e)return;
      imsApplyEntity();
      openDropdowns.clear();
      if(imsClientLike()){openDropdowns.add('Finance');navigatePage('payments');}
      else navigatePage('dashboard');
    };
  }
})();

/* ══ ORDER LOGS → INVOICE ACTIONS ═══════════════════════════════════════════
   The order's Logs tab also moves its invoices. Each action shows the invoices
   it applies to:
     Invoice · Generated   Draft invoices                 single select
     Invoice · Sent        Generated invoices             single select → Send pop-up
     Invoice · Cancelled   Generated, or Sent nothing paid single select, Comment = reason
     Paid                  Sent and Unpaid / Overdue      multi-select, Paid in full
   When every invoice on the order is Paid, the order's Invoice Status becomes Paid. */
const IMS_MARK_PAID='Paid';   // the order Logs' own "Paid" status picks the invoices it closes
const IMS_PM_GEN='Invoice · Generated',IMS_PM_SEND='Invoice · Sent',IMS_PM_CANCEL='Invoice · Cancelled';
const IMS_PM_ACTS=[];   // invoice stage moves stay on the row's Invoice Status menu
function imsPmFor(orderId,act){
  return (imsInvData[orderId]||[]).filter(function(i){
    const ps=imsInvPayStatus(i);
    if(act===IMS_PM_GEN)return i.stage==='Draft';
    if(act===IMS_PM_SEND)return i.stage==='Generated';
    if(act===IMS_PM_CANCEL)return i.stage==='Generated'||(i.stage==='Sent'&&imsInvPaid(i)===0);
    return ps==='Unpaid'||ps==='Overdue';
  });
}
function imsPmUnpaid(orderId){return imsPmFor(orderId,IMS_MARK_PAID);}
function imsPmInvLabel(i){
  const ps=imsInvPayStatus(i);
  return (i.no||'Draft · '+imsEsc(i.description||i.type))+' · '+imsMoney(i.currency,imsInvTotal(i))+(ps&&ps!=='—'?' · '+ps:'');
}
function imsPmPaidBlock(p){return '<div id="pm-log-invs-wrap" data-order="'+p.orderId+'" style="display:none"></div>';}
// apCS hook on the order Logs Status select.
function imsPmLogPick(v){
  const w=document.getElementById('pm-log-invs-wrap');if(!w)return;
  const lbl=document.querySelector('#pm-log-comment-inp');
  const head=lbl?lbl.previousElementSibling:null;
  if(head&&head.classList.contains('lp-logs-form-label'))
    head.innerHTML=(v===IMS_PM_CANCEL?'Cancellation Reason':'Comment')+' <span class="lp-logs-form-req">*</span>';
  if(IMS_PM_ACTS.indexOf(v)<0&&!(v===IMS_MARK_PAID&&imsPmUnpaid(w.dataset.order).length)){w.style.display='none';w.innerHTML='';return;}
  const list=imsPmFor(w.dataset.order,v);
  const opts=list.map(imsPmInvLabel);
  const multi=v===IMS_MARK_PAID;
  w.innerHTML='<div class="lp-logs-form-label">'+(multi?'Invoices':'Invoice')+' <span class="lp-logs-form-req">*</span></div>'
    +(opts.length?(multi?apMS('pm-log-invs',opts,[],'Select invoices'):apCS('pm-log-inv',opts,'','Select invoice'))
      :'<div class="csa-empty">No invoices for this action.</div>');
  w.style.display='';
}
function imsPmFlash(el){if(el){el.classList.add('is-invalid');setTimeout(function(){el.classList.remove('is-invalid');},1600);}}
// Every invoice on the order (cancelled ones aside) Paid → the order's Invoice Status is Paid.
function imsPmSyncOrder(p){
  const live=(imsInvData[p.orderId]||[]).filter(function(i){return i.stage!=='Cancelled';});
  if(!live.length||!live.every(function(i){return imsInvPayStatus(i)==='Paid';})||p.invoiceStatus==='Paid')return false;
  const before=p.invoiceStatus;p.invoiceStatus='Paid';
  const st=stampNow();
  (pmLogsData[p.id]=pmLogsData[p.id]||[]).unshift({date:st.date,time:st.time,user:'System',status:'Paid',
    action:'All invoices on order '+p.orderId+' are paid. Invoice Status '+before+' → Paid.'});
  return true;
}
function imsPmRefresh(p,moved){if(moved&&typeof renderADTPage==='function')renderADTPage();else isbTab('pm',renderPmSidebar);}
// pmSaveLog hands invoice actions here.
function imsPmLogSubmit(orderId,act){
  const p=paymentsData.find(function(x){return x.id===orderId;});if(!p)return;
  const inp=document.getElementById('pm-log-comment-inp');
  const comment=inp?inp.value.trim():'';
  const list=imsPmFor(p.orderId,act);
  let picked;
  if(act===IMS_MARK_PAID){
    picked=list.filter(function(i){return getMSValue('pm-log-invs').indexOf(imsPmInvLabel(i))>=0;});
    if(!picked.length){imsPmFlash(document.querySelector('#msw-pm-log-invs .ms-trigger'));showToast('Select invoices','error','Pick at least one invoice to mark as paid.');return;}
  }else{
    const v=document.getElementById('csw-pm-log-inv')?getCSValue('pm-log-inv'):'';
    picked=list.filter(function(i){return imsPmInvLabel(i)===v;});
    if(!picked.length){imsPmFlash(csTrigger('pm-log-inv'));showToast('Select an invoice','error','Pick the invoice this action applies to.');return;}
  }
  const i0=picked[0];
  if(act===IMS_PM_SEND){imsOpenSendInv(p.orderId,i0.id);imsSendRun();return;}
  if(!comment){imsPmFlash(inp);return;}
  if(inp)inp.value='';
  pmPendingStatus='';
  if(act===IMS_PM_GEN||act===IMS_PM_CANCEL){imsInvMove(i0,act===IMS_PM_GEN?'Generated':'Cancelled',comment);isbTab('pm',renderPmSidebar);return;}
  const done=[];
  picked.forEach(function(i){
    const before=imsInvPayStatus(i),amt=imsInvOutstanding(i);
    i.payments.push({date:IMS_TODAY,amount:amt,mode:'—',ref:'—'});
    imsInvLog(i,'Payment Status Changed',before+' → Paid · '+imsMoney(i.currency,amt)+' received. '+comment,'System');
    done.push(i.no);
  });
  const st=stampNow();
  (pmLogsData[p.id]=pmLogsData[p.id]||[]).unshift({date:st.date,time:st.time,user:CURRENT_USER,status:IMS_MARK_PAID,
    action:done.join(', ')+' marked as Paid. '+comment});
  const moved=imsPmSyncOrder(p);
  imsPmRefresh(p,moved);
  showToast('Marked as paid','success',done.join(', ')+(done.length>1?' are':' is')+' now Paid.'+(moved?' All invoices paid – order '+p.orderId+' is Paid.':''));
}
