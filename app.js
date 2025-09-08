// Core utilities for Grameen Cooling Solution
const STORAGE_KEY = 'gcs_orders_v1';

export const STATUSES = [
  'Pending',
  'Approved',
  'Assigned',
  'In Service',
  'Completed',
  'Rejected/Cancelled'
];

export function generateOrderId() {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const d = String(dt.getDate()).padStart(2,'0');
  const rand = Math.floor(100000 + Math.random()*900000);
  return `GCS-${y}${m}${d}-${rand}`;
}

export function getOrders(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }catch(e){
    return [];
  }
}
export function saveOrders(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
export function saveOrder(order){
  const list = getOrders();
  list.unshift(order);
  saveOrders(list);
}
export function getOrderById(id){
  return getOrders().find(o=>o.id===id);
}
export function updateOrderStatus(id, status){
  const list = getOrders();
  const idx = list.findIndex(o=>o.id===id);
  if(idx>-1){
    list[idx].status = status;
    list[idx].history = list[idx].history || [];
    list[idx].history.push({ts: new Date().toISOString(), note:`Status → ${status}`});
    saveOrders(list);
    return list[idx];
  }
  return null;
}
export function upsertOrder(updated){
  const list = getOrders();
  const idx = list.findIndex(o=>o.id===updated.id);
  if(idx>-1) list[idx] = updated;
  else list.unshift(updated);
  saveOrders(list);
}

export function statusClass(s){
  const map = {
    'Pending':'s-pending',
    'Approved':'s-approved',
    'Assigned':'s-assigned',
    'In Service':'s-inservice',
    'Completed':'s-completed',
    'Rejected/Cancelled':'s-rejected'
  };
  return `status ${map[s]||'s-pending'}`;
}

export function progressPercent(status){
  const order = ['Pending','Approved','Assigned','In Service','Completed'];
  const i = order.indexOf(status);
  if(i<0) return 0;
  return Math.round((i/(order.length-1))*100);
}

export function currencyINR(n){
  try{
    return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(Number(n||0));
  }catch(e){return `₹${n}`}
}
