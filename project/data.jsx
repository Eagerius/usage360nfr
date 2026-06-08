// Data for the dashboard
const MONTHS = ["January","February","March","April","May","June"];

const NFR_SERIES = {
  observed: [40,34,38,29,23,23],   // blue
  approved: [46,44,46,43,42,43],   // purple
};

const KPIS = [
  {num:"62",   delta:"+3.2",  deltaDir:"up",   name:"System Health Score", sub:"Total Value: 100"},
  {num:"3",    delta:"+1",    deltaDir:"up",   name:"Clients At Risk",     sub:"Total Clients: 62"},
  {num:"83.5%",delta:"-3%",   deltaDir:"down", name:"Cumm. Adoption Rate", sub:""},
  {num:"50",   delta:"+9",    deltaDir:"up",   name:"Active Instances",    sub:"Total Instances: 236"},
  {num:"1150", delta:"+67",   deltaDir:"up",   name:"Active Teams",        sub:"Total Teams: 1200"},
  {num:"5.3K", delta:"+0.7k", deltaDir:"up",   name:"Active Users",        sub:"Total Users: 7,436"},
];

const CATCHUP = [
  {html:"<b>3 clients</b> likely to breach in next 14 days."},
  {html:"<b>2 new</b> clients entered high-risk zone."},
  {html:"Lilly_001 projected to <b>breach in ~9 days</b>."},
];

// Generate reproducible clients
function makeClient({id, name, logo, alert=false, overview, breach, adoption, stats, insight}){
  return {id, name, logo, alert, overview, breach, adoption, stats, insight};
}

const CLIENTS = [
  makeClient({
    id:"lilly_001", name:"Eli Lilly", logo:"LIL", alert:true,
    stats:[
      {n:"127", d:"+9",  dir:"up",   l:"Active Instances", s:"Total Instances: 236"},
      {n:"36",  d:"-3",  dir:"down", l:"Active Teams",     s:"Total Instances: 236"},
      {n:"2487",d:"+1K", dir:"up",   l:"Active Users",     s:"Total Users: 5364"},
    ],
    overview:{
      instances:[42,40,44,37,45,36],
      teams:    [28,19,34,24,31,22],
      users:    [12,9,14,17,18,14],
    },
    breach:{bars:[28,19,28,12,34,19], threshold:21},
    adoption:[80,72,79,74,88,70],
    insight:"Returning users spend 30% more time than new users.",
  }),
  makeClient({
    id:"bms_001", name:"Bristol Myers Squibb", logo:"BMS",
    stats:[
      {n:"13",  d:"+1",  dir:"up",   l:"Active Instances", s:"Total Instances: 13"},
      {n:"540", d:"-5",  dir:"down", l:"Active Teams",     s:"Total Instances: 735"},
      {n:"190", d:"+85", dir:"up",   l:"Active Users",     s:"Total Users: 260"},
    ],
    overview:{
      instances:[38,38,41,37,40,35],
      teams:    [27,21,29,34,35,32],
      users:    [12,16,18,19,18,15],
    },
    breach:{bars:[5,24,17,30,28,29], threshold:21},
    adoption:[78,70,60,64,78,58],
    insight:"Returning users spend 30% more time than new users.",
  }),
  makeClient({
    id:"boehringer_001", name:"Boehringer Ingelheim Pharmaceuticals, Inc.", logo:"BI",
    stats:[
      {n:"10",  d:"-",   dir:"flat", l:"Active Instances", s:"Total Instances: 10"},
      {n:"510", d:"+20", dir:"up",   l:"Active Teams",     s:"Total Instances: 600"},
      {n:"160", d:"+70", dir:"up",   l:"Active Users",     s:"Total Users: 220"},
    ],
    overview:{
      instances:[32,38,32,44,34,38],
      teams:    [27,30,32,35,22,34],
      users:    [11,16,12,16,17,14],
    },
    breach:{bars:[19,15,13,14,15,18], threshold:21},
    adoption:[76,74,81,92,88,65],
    insight:"Returning users spend 30% more time than new users.",
  }),
  makeClient({
    id:"sanofi_001", name:"Sanofi", logo:"SAN",
    stats:[
      {n:"15",  d:"+2",  dir:"up",   l:"Active Instances", s:"Total Instances: 16"},
      {n:"580", d:"-10", dir:"down", l:"Active Teams",     s:"Total Instances: 750"},
      {n:"200", d:"+95", dir:"up",   l:"Active Users",     s:"Total Users: 270"},
    ],
    overview:{
      instances:[40,35,37,44,39,44],
      teams:    [20,25,24,35,21,22],
      users:    [12,16,14,19,15,20],
    },
    breach:{bars:[19,30,28,27,18,19], threshold:21},
    adoption:[65,75,73,85,71,58],
    insight:"Returning users spend 30% more time than new users.",
  }),
];

const DEPARTMENTS = [
  {id:"ZFP", label:"Field Performance"},
  {id:"ZCE", label:"Customer Engagement"},
  {id:"ZFR", label:"Field Resources"},
  {id:"ZICO",label:"Incentive Comp"},
  {id:"ZDA", label:"Data Analytics"},
  {id:"ZPF", label:"Patient Flow"},
  {id:"ZM",  label:"Marketing"},
];

Object.assign(window, {MONTHS, NFR_SERIES, KPIS, CATCHUP, CLIENTS, DEPARTMENTS});
