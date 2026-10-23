"use strict";
/* High score table saved to localStorage. */
const SKEY='cabinfever.scores.v1';
const DEFAULT_SCORES=[['ZOM',12000,'ESC'],['PUK',9000,'L2'],['ART',7000,'L2'],['TOY',5500,'L2'],['VNL',4000,'L1'],['RAP',3000,'L1'],['MAG',2200,'L1'],['AI ',1500,'L1'],['PAN',900,'L1'],['ZZZ',400,'L1']].map(a=>({n:a[0],s:a[1],w:a[2],d:'',cpu:1}));
function loadScores(){try{const v=JSON.parse(localStorage.getItem(SKEY));if(Array.isArray(v)&&v.length)return v;}catch(e){}return DEFAULT_SCORES.slice();}
function saveScores(){try{localStorage.setItem(SKEY,JSON.stringify(S.scores));}catch(e){}}
