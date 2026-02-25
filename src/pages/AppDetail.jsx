import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import SEO from '../components/SEO.jsx'
import PayPalButton from '../components/PayPalButton.jsx'
import InstallDisclaimer from '../components/InstallDisclaimer.jsx'
import ReportApp from '../components/ReportApp.jsx'
import TrustScore from '../components/TrustScore.jsx'
import PermissionPanel from '../components/PermissionPanel.jsx'
import PoweredBy from '../components/PoweredBy.jsx'
import AppCard from '../components/AppCard.jsx'
import { APPS } from '../utils/data.js'
import { useToast } from '../hooks/useToast.js'
import { useInstallState } from '../hooks/useInstallState.js'
import { trackView, trackInstall } from '../lib/analytics.js'
import { getSimilarApps } from '../lib/recommendations.js'
import styles from './AppDetail.module.css'

const TABS = ['Overview', 'Safety Report', 'Reviews', 'Versions']

const BADGE_MAP = {
  trending:  { icon: '🔥', label: 'Trending' },
  verified:  { icon: '🛡', label: 'Verified Safe' },
  top_rated: { icon: '⭐', label: 'Top Rated' },
  new:       { icon: '🚀', label: 'New' },
  rising:    { icon: '📈', label: 'Rising Fast' },
}

const FINDINGS = [
  { sev: 'pass', msg: 'No secrets or API keys detected in source' },
  { sev: 'pass', msg: 'No known malware signatures matched' },
  { sev: 'pass', msg: 'All 47 dependencies clear of critical CVEs' },
  { sev: 'pass', msg: 'No outbound network calls detected in sandbox' },
  { sev: 'pass', msg: 'No device fingerprinting detected' },
  { sev: 'pass', msg: 'Privacy policy URL verified and live' },
  { sev: 'pass', msg: 'Obfuscation score 0.09 — normal minification' },
]

const REVIEWS = [
  { handle: '@alex_builds',    stars: 5, text: 'Best Pomodoro app I\'ve used. Offline, no account needed. Installed on every device.', date: '18 Feb 2026' },
  { handle: '@sarahdev',       stars: 5, text: 'Checked the safety report before installing — zero issues, no network calls. Exactly what I wanted.', date: '12 Feb 2026' },
  { handle: '@techreview_au',  stars: 4, text: 'Solid app. Would love optional sync, but for pure local use it\'s perfect.', date: '3 Feb 2026' },
]

const VERSIONS = [
  { ver: '2.3.1', date: '14 Jan 2026', score: 5,  build: 'a4f2c91', current: true  },
  { ver: '2.3.0', date: '2 Jan 2026',  score: 5,  build: 'b8e1a22', current: false },
  { ver: '2.2.0', date: '18 Dec 2025', score: 7,  build: 'c3d9f44', current: false },
]

/* ── Screenshot Mockup Component ── */
function ScreenshotMockup({ type, color }) {
  const bg = 'rgba(255,255,255,.14)'
  const bg2 = 'rgba(255,255,255,.08)'
  const bg3 = 'rgba(255,255,255,.05)'
  const text = 'rgba(255,255,255,.55)'
  const textDim = 'rgba(255,255,255,.3)'
  const accent = 'rgba(0,229,160,.5)'
  const accentBg = 'rgba(0,229,160,.15)'

  switch (type) {
    case 'editor':
      return (
        <div className={styles.mockup}>
          {/* Window chrome */}
          <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:5, paddingBottom:4, borderBottom:'1px solid rgba(255,255,255,.06)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#ff5f56' }} />
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#ffbd2e' }} />
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#27c93f' }} />
            <div style={{ flex:1 }} />
            <div style={{ height:3, width:'30%', background:bg2, borderRadius:6 }} />
          </div>
          {/* Tab bar */}
          <div style={{ display:'flex', gap:2, marginBottom:5 }}>
            <div style={{ padding:'2px 6px', background:'rgba(255,255,255,.1)', borderRadius:'4px 4px 0 0', fontSize:0 }}>
              <div style={{ height:2, width:20, background:text, borderRadius:1 }} />
            </div>
            <div style={{ padding:'2px 6px', borderRadius:'4px 4px 0 0', fontSize:0 }}>
              <div style={{ height:2, width:16, background:textDim, borderRadius:1 }} />
            </div>
          </div>
          {/* Editor body */}
          <div style={{ display:'flex', gap:3, flex:1 }}>
            {/* Line numbers */}
            <div style={{ display:'flex', flexDirection:'column', gap:3, paddingRight:3, borderRight:'1px solid rgba(255,255,255,.05)' }}>
              {[1,2,3,4,5,6,7].map(n => (
                <div key={n} style={{ height:2, width:6, background:textDim, borderRadius:1 }} />
              ))}
            </div>
            {/* Code lines */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
              <div style={{ display:'flex', gap:3 }}>
                <div style={{ height:2, width:'22%', background:'rgba(198,120,221,.5)', borderRadius:1 }} />
                <div style={{ height:2, width:'30%', background:'rgba(97,175,239,.5)', borderRadius:1 }} />
              </div>
              <div style={{ display:'flex', gap:3, paddingLeft:8 }}>
                <div style={{ height:2, width:'18%', background:'rgba(230,192,123,.5)', borderRadius:1 }} />
                <div style={{ height:2, width:'35%', background:'rgba(152,195,121,.5)', borderRadius:1 }} />
              </div>
              <div style={{ display:'flex', gap:3, paddingLeft:8 }}>
                <div style={{ height:2, width:'25%', background:'rgba(97,175,239,.5)', borderRadius:1 }} />
                <div style={{ height:2, width:'20%', background:'rgba(224,108,117,.5)', borderRadius:1 }} />
              </div>
              <div style={{ display:'flex', gap:3, paddingLeft:16 }}>
                <div style={{ height:2, width:'40%', background:'rgba(152,195,121,.5)', borderRadius:1 }} />
              </div>
              <div style={{ display:'flex', gap:3, paddingLeft:8 }}>
                <div style={{ height:2, width:'15%', background:'rgba(198,120,221,.5)', borderRadius:1 }} />
                <div style={{ height:2, width:'28%', background:'rgba(86,182,194,.5)', borderRadius:1 }} />
              </div>
              <div style={{ display:'flex', gap:3 }}>
                <div style={{ height:2, width:'12%', background:'rgba(198,120,221,.5)', borderRadius:1 }} />
              </div>
              <div style={{ height:2, width:'50%', background:'rgba(92,99,112,.4)', borderRadius:1 }} />
            </div>
            {/* Minimap */}
            <div style={{ width:'14%', background:bg3, borderRadius:2, position:'relative' }}>
              <div style={{ position:'absolute', top:'10%', left:0, right:0, height:'30%', background:'rgba(255,255,255,.04)', borderRadius:1 }} />
            </div>
          </div>
        </div>
      )

    case 'list':
      return (
        <div className={styles.mockup}>
          {/* Search bar */}
          <div style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 6px', background:bg2, borderRadius:6, marginBottom:6 }}>
            <div style={{ fontSize:6, lineHeight:1, opacity:0.4 }}>&#x1F50D;</div>
            <div style={{ height:2, width:'50%', background:textDim, borderRadius:1 }} />
          </div>
          {/* Section header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
            <div style={{ height:2.5, width:'25%', background:text, borderRadius:1 }} />
            <div style={{ height:2, width:'10%', background:accent, borderRadius:1 }} />
          </div>
          {/* Task items */}
          {[
            { done: true, w: '65%', pri: false },
            { done: true, w: '55%', pri: false },
            { done: false, w: '70%', pri: true },
            { done: false, w: '50%', pri: false },
            { done: false, w: '60%', pri: true },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', border:`1.5px solid ${item.done ? accent : 'rgba(255,255,255,.2)'}`, background: item.done ? accentBg : 'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {item.done && <div style={{ width:3, height:3, borderRadius:'50%', background:accent }} />}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ height:2, width:item.w, background: item.done ? textDim : text, borderRadius:1, textDecoration: item.done ? 'line-through' : 'none' }} />
              </div>
              {item.pri && <div style={{ width:4, height:4, borderRadius:1, background:'rgba(255,107,107,.4)', flexShrink:0 }} />}
              <div style={{ height:2, width:14, background:textDim, borderRadius:1, flexShrink:0 }} />
            </div>
          ))}
        </div>
      )

    case 'grid':
      return (
        <div className={styles.mockup}>
          {/* Top bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
            <div style={{ height:3, width:'30%', background:text, borderRadius:2 }} />
            <div style={{ display:'flex', gap:3 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:4, height:4, background:textDim, borderRadius:1 }} />
              </div>
              <div style={{ width:8, height:8, borderRadius:2, background:accentBg }} />
            </div>
          </div>
          {/* Grid items */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, flex:1 }}>
            {[
              { color:'rgba(108,92,231,.3)', h:'100%' },
              { color:'rgba(0,184,148,.3)', h:'80%' },
              { color:'rgba(9,132,227,.3)', h:'90%' },
              { color:'rgba(225,112,85,.3)', h:'100%' },
            ].map((item, i) => (
              <div key={i} style={{ background:bg2, borderRadius:5, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                <div style={{ height:item.h, minHeight:16, background:item.color, borderRadius:'5px 5px 0 0' }} />
                <div style={{ padding:3 }}>
                  <div style={{ height:2, width:'70%', background:text, borderRadius:1, marginBottom:2 }} />
                  <div style={{ height:1.5, width:'50%', background:textDim, borderRadius:1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'player':
      return (
        <div className={styles.mockup} style={{ justifyContent:'space-between' }}>
          {/* Album art */}
          <div style={{ alignSelf:'center', width:48, height:48, borderRadius:8, background:`linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.04))`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,.2)', margin:'4px 0' }}>
            <div style={{ fontSize:16, opacity:0.5 }}>&#9835;</div>
          </div>
          {/* Track info */}
          <div style={{ textAlign:'center' }}>
            <div style={{ height:3, width:'60%', background:text, borderRadius:2, margin:'0 auto 3px' }} />
            <div style={{ height:2, width:'40%', background:textDim, borderRadius:2, margin:'0 auto' }} />
          </div>
          {/* Progress bar */}
          <div>
            <div style={{ height:3, width:'100%', background:bg2, borderRadius:4, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', left:0, top:0, height:'100%', width:'38%', background:'rgba(255,255,255,.35)', borderRadius:4 }} />
              <div style={{ position:'absolute', left:'38%', top:-1, width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,.7)', transform:'translateX(-50%)' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:2 }}>
              <div style={{ height:1.5, width:12, background:textDim, borderRadius:1 }} />
              <div style={{ height:1.5, width:12, background:textDim, borderRadius:1 }} />
            </div>
          </div>
          {/* Controls */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
            <div style={{ width:8, height:8, opacity:0.4, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:0, height:0, borderRight:'5px solid rgba(255,255,255,.5)', borderTop:'3px solid transparent', borderBottom:'3px solid transparent' }} />
            </div>
            <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(255,255,255,.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:0, height:0, borderLeft:'7px solid rgba(255,255,255,.7)', borderTop:'5px solid transparent', borderBottom:'5px solid transparent', marginLeft:2 }} />
            </div>
            <div style={{ width:8, height:8, opacity:0.4, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:0, height:0, borderLeft:'5px solid rgba(255,255,255,.5)', borderTop:'3px solid transparent', borderBottom:'3px solid transparent' }} />
            </div>
          </div>
        </div>
      )

    case 'chat':
      return (
        <div className={styles.mockup} style={{ justifyContent:'space-between' }}>
          {/* Chat header */}
          <div style={{ display:'flex', alignItems:'center', gap:5, paddingBottom:4, borderBottom:'1px solid rgba(255,255,255,.06)', marginBottom:4 }}>
            <div style={{ width:14, height:14, borderRadius:'50%', background:accentBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:accent }} />
            </div>
            <div>
              <div style={{ height:2.5, width:30, background:text, borderRadius:1, marginBottom:2 }} />
              <div style={{ height:1.5, width:18, background:'rgba(0,229,160,.4)', borderRadius:1 }} />
            </div>
          </div>
          {/* Messages */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:3 }}>
            <div style={{ alignSelf:'flex-start', background:bg, borderRadius:'8px 8px 8px 2px', padding:'4px 7px', maxWidth:'72%' }}>
              <div style={{ height:2, width:44, background:text, borderRadius:1, marginBottom:2 }} />
              <div style={{ height:2, width:30, background:text, borderRadius:1 }} />
            </div>
            <div style={{ alignSelf:'flex-end', background:'rgba(0,229,160,.18)', borderRadius:'8px 8px 2px 8px', padding:'4px 7px', maxWidth:'72%' }}>
              <div style={{ height:2, width:38, background:'rgba(0,229,160,.5)', borderRadius:1 }} />
            </div>
            <div style={{ alignSelf:'flex-start', background:bg, borderRadius:'8px 8px 8px 2px', padding:'4px 7px', maxWidth:'72%' }}>
              <div style={{ height:2, width:50, background:text, borderRadius:1 }} />
            </div>
            <div style={{ alignSelf:'flex-end', background:'rgba(0,229,160,.18)', borderRadius:'8px 8px 2px 8px', padding:'4px 7px', maxWidth:'72%' }}>
              <div style={{ height:2, width:52, background:'rgba(0,229,160,.5)', borderRadius:1, marginBottom:2 }} />
              <div style={{ height:2, width:28, background:'rgba(0,229,160,.5)', borderRadius:1 }} />
            </div>
          </div>
          {/* Input bar */}
          <div style={{ display:'flex', gap:4, alignItems:'center', marginTop:4, padding:'3px 5px', background:bg2, borderRadius:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:bg, flexShrink:0 }} />
            <div style={{ height:2, width:'50%', background:textDim, borderRadius:1 }} />
            <div style={{ marginLeft:'auto', width:10, height:10, borderRadius:'50%', background:accentBg, flexShrink:0 }} />
          </div>
        </div>
      )

    case 'map':
      return (
        <div className={styles.mockup} style={{ position:'relative', padding:0, overflow:'hidden' }}>
          {/* Map area */}
          <div style={{ flex:1, background:'rgba(30,40,55,.6)', borderRadius:4, position:'relative', overflow:'hidden' }}>
            {/* Water bodies */}
            <div style={{ position:'absolute', top:'60%', left:'0%', width:'35%', height:'30%', background:'rgba(52,152,219,.12)', borderRadius:'0 40% 0 0' }} />
            <div style={{ position:'absolute', top:'0%', right:'0%', width:'25%', height:'20%', background:'rgba(52,152,219,.08)', borderRadius:'0 0 0 30%' }} />
            {/* Grid streets */}
            {[18, 38, 58, 78].map(t => (
              <div key={`h${t}`} style={{ position:'absolute', top:`${t}%`, left:0, right:0, height:1.5, background:'rgba(255,255,255,.08)' }} />
            ))}
            {[20, 42, 62, 82].map(l => (
              <div key={`v${l}`} style={{ position:'absolute', left:`${l}%`, top:0, bottom:0, width:1.5, background:'rgba(255,255,255,.08)' }} />
            ))}
            {/* Major roads */}
            <div style={{ position:'absolute', top:'10%', left:'5%', width:'85%', height:2.5, background:'rgba(255,255,255,.15)', borderRadius:2, transform:'rotate(-12deg)' }} />
            <div style={{ position:'absolute', top:'25%', left:'15%', width:'70%', height:2.5, background:'rgba(255,255,255,.15)', borderRadius:2, transform:'rotate(6deg)' }} />
            {/* Parks/green */}
            <div style={{ position:'absolute', top:'40%', left:'25%', width:14, height:10, background:'rgba(0,229,160,.1)', borderRadius:3 }} />
            <div style={{ position:'absolute', top:'20%', left:'65%', width:10, height:8, background:'rgba(0,229,160,.08)', borderRadius:2 }} />
            {/* Pin */}
            <div style={{ position:'absolute', top:'28%', left:'50%', transform:'translate(-50%, -50%)', zIndex:2 }}>
              <div style={{ width:10, height:10, borderRadius:'50% 50% 50% 0', background:'rgba(231,76,60,.8)', transform:'rotate(-45deg)', boxShadow:'0 2px 6px rgba(0,0,0,.3)' }} />
            </div>
            {/* Second pin */}
            <div style={{ position:'absolute', top:'55%', left:'35%', transform:'translate(-50%, -50%)', zIndex:2 }}>
              <div style={{ width:7, height:7, borderRadius:'50% 50% 50% 0', background:'rgba(52,152,219,.7)', transform:'rotate(-45deg)' }} />
            </div>
          </div>
          {/* Bottom card overlay */}
          <div style={{ position:'absolute', bottom:3, left:4, right:4, background:'rgba(20,25,35,.85)', borderRadius:5, padding:'4px 6px', display:'flex', alignItems:'center', gap:5, backdropFilter:'blur(4px)' }}>
            <div style={{ width:12, height:12, borderRadius:3, background:accentBg, flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ height:2, width:'60%', background:text, borderRadius:1, marginBottom:2 }} />
              <div style={{ height:1.5, width:'40%', background:textDim, borderRadius:1 }} />
            </div>
            <div style={{ height:8, width:8, borderRadius:2, background:accentBg, flexShrink:0 }} />
          </div>
        </div>
      )

    case 'chart':
      return (
        <div className={styles.mockup}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
            <div>
              <div style={{ height:2, width:30, background:textDim, borderRadius:1, marginBottom:3 }} />
              <div style={{ height:3.5, width:40, background:text, borderRadius:1 }} />
            </div>
            <div style={{ display:'flex', gap:3 }}>
              {['W','M','Y'].map(p => (
                <div key={p} style={{ padding:'1px 4px', borderRadius:3, background: p === 'M' ? accentBg : 'transparent', fontSize:0 }}>
                  <div style={{ height:2, width:6, background: p === 'M' ? accent : textDim, borderRadius:1 }} />
                </div>
              ))}
            </div>
          </div>
          {/* Chart area */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end', position:'relative' }}>
            {/* Grid lines */}
            {[0, 25, 50, 75].map(t => (
              <div key={t} style={{ position:'absolute', top:`${t}%`, left:0, right:0, height:0.5, background:'rgba(255,255,255,.04)', borderStyle:'dashed' }} />
            ))}
            {/* Bars */}
            <div style={{ display:'flex', alignItems:'flex-end', gap:3, flex:1, paddingTop:6, position:'relative', zIndex:1 }}>
              {[35, 52, 42, 68, 58, 75, 48, 82].map((h, i) => (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                  <div style={{ width:'100%', height:`${h}%`, background:`linear-gradient(to top, rgba(0,229,160,${0.15 + i * 0.04}), rgba(0,229,160,${0.3 + i * 0.05}))`, borderRadius:'2px 2px 0 0', transition:'height .3s' }} />
                </div>
              ))}
            </div>
            <div style={{ height:0.5, background:bg, marginTop:1 }} />
            {/* Labels */}
            <div style={{ display:'flex', gap:3, marginTop:2 }}>
              {['J','F','M','A','M','J','J','A'].map((l, i) => (
                <div key={i} style={{ flex:1, height:1.5, display:'flex', justifyContent:'center' }}>
                  <div style={{ width:4, height:1.5, background:textDim, borderRadius:1 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'feed':
      return (
        <div className={styles.mockup}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6, paddingBottom:4, borderBottom:'1px solid rgba(255,255,255,.06)' }}>
            <div style={{ height:3, width:'25%', background:text, borderRadius:2 }} />
            <div style={{ width:10, height:10, borderRadius:'50%', background:bg }} />
          </div>
          {/* Feed items */}
          {[
            { hasImage: true, lines: 2 },
            { hasImage: false, lines: 1 },
            { hasImage: true, lines: 2 },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom:6, paddingBottom:5, borderBottom: i < 2 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
              <div style={{ display:'flex', gap:5, marginBottom:4, alignItems:'center' }}>
                <div style={{ width:12, height:12, borderRadius:'50%', background:['rgba(108,92,231,.3)','rgba(0,184,148,.3)','rgba(225,112,85,.3)'][i], flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ height:2, width:'45%', background:text, borderRadius:1 }} />
                </div>
                <div style={{ height:1.5, width:14, background:textDim, borderRadius:1 }} />
              </div>
              <div style={{ height:2, width:'90%', background:textDim, borderRadius:1, marginBottom:2, marginLeft:17 }} />
              {item.lines > 1 && <div style={{ height:2, width:'65%', background:textDim, borderRadius:1, marginLeft:17 }} />}
              {item.hasImage && (
                <div style={{ height:20, background:bg2, borderRadius:4, marginTop:4, marginLeft:17 }} />
              )}
              <div style={{ display:'flex', gap:8, marginTop:4, marginLeft:17 }}>
                <div style={{ height:2, width:10, background:textDim, borderRadius:1 }} />
                <div style={{ height:2, width:10, background:textDim, borderRadius:1 }} />
                <div style={{ height:2, width:10, background:textDim, borderRadius:1 }} />
              </div>
            </div>
          ))}
        </div>
      )

    case 'form':
      return (
        <div className={styles.mockup}>
          {/* Form header */}
          <div style={{ height:3, width:'45%', background:text, borderRadius:2, marginBottom:3 }} />
          <div style={{ height:2, width:'70%', background:textDim, borderRadius:1, marginBottom:8 }} />
          {/* Form fields */}
          {[
            { label: '35%', width: '100%' },
            { label: '25%', width: '100%' },
            { label: '30%', width: '60%' },
          ].map((field, i) => (
            <div key={i} style={{ marginBottom:6 }}>
              <div style={{ height:2, width:field.label, background:text, borderRadius:1, marginBottom:3 }} />
              <div style={{ height:12, width:field.width, background:bg2, borderRadius:4, border:'1px solid rgba(255,255,255,.08)', position:'relative' }}>
                <div style={{ position:'absolute', left:4, top:'50%', transform:'translateY(-50%)', height:2, width:'40%', background:textDim, borderRadius:1 }} />
              </div>
            </div>
          ))}
          {/* Toggle */}
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
            <div style={{ width:16, height:9, borderRadius:5, background:accentBg, position:'relative' }}>
              <div style={{ position:'absolute', right:1, top:1, width:7, height:7, borderRadius:'50%', background:accent }} />
            </div>
            <div style={{ height:2, width:'35%', background:text, borderRadius:1 }} />
          </div>
          {/* Submit button */}
          <div style={{ height:14, width:'50%', background:accentBg, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ height:2, width:'60%', background:accent, borderRadius:1 }} />
          </div>
        </div>
      )

    case 'gauge':
      return (
        <div className={styles.mockup} style={{ alignItems:'center', justifyContent:'center' }}>
          {/* Top stats row */}
          <div style={{ display:'flex', gap:6, width:'100%', marginBottom:6 }}>
            {[
              { val: '92%', color: accent },
              { val: '1.2s', color: 'rgba(255,184,77,.5)' },
              { val: '4.8', color: text },
            ].map((s, i) => (
              <div key={i} style={{ flex:1, textAlign:'center' }}>
                <div style={{ height:3, width:'50%', background:s.color, borderRadius:1, margin:'0 auto 2px' }} />
                <div style={{ height:1.5, width:'70%', background:textDim, borderRadius:1, margin:'0 auto' }} />
              </div>
            ))}
          </div>
          {/* Gauge */}
          <svg viewBox="0 0 60 35" style={{ width:'70%', maxWidth:80, marginBottom:4 }}>
            <path d="M 5 30 A 25 25 0 0 1 55 30" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="4" strokeLinecap="round" />
            <path d="M 5 30 A 25 25 0 0 1 48 12" fill="none" stroke="url(#gaugeGrad)" strokeWidth="4" strokeLinecap="round" />
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,229,160,.3)" />
                <stop offset="100%" stopColor="rgba(0,229,160,.8)" />
              </linearGradient>
            </defs>
            <circle cx="48" cy="12" r="2.5" fill="rgba(0,229,160,.8)" />
            <text x="30" y="28" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,.6)" fontWeight="700">85</text>
          </svg>
          {/* Label */}
          <div style={{ height:2.5, width:'35%', background:text, borderRadius:2, marginBottom:2 }} />
          <div style={{ height:2, width:'50%', background:textDim, borderRadius:1 }} />
        </div>
      )

    case 'board':
      return (
        <div className={styles.mockup}>
          {/* Board header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
            <div style={{ height:2.5, width:'30%', background:text, borderRadius:1 }} />
            <div style={{ display:'flex', gap:2 }}>
              <div style={{ width:6, height:6, borderRadius:2, background:bg }} />
              <div style={{ width:6, height:6, borderRadius:2, background:bg }} />
            </div>
          </div>
          {/* Columns */}
          <div style={{ display:'flex', gap:4, flex:1 }}>
            {[
              { label: 'rgba(108,92,231,.3)', cards: 3 },
              { label: 'rgba(0,184,148,.3)', cards: 2 },
              { label: 'rgba(225,112,85,.3)', cards: 1 },
            ].map((col, ci) => (
              <div key={ci} style={{ flex:1, display:'flex', flexDirection:'column', gap:3 }}>
                <div style={{ display:'flex', alignItems:'center', gap:3, marginBottom:1 }}>
                  <div style={{ width:4, height:4, borderRadius:'50%', background:col.label }} />
                  <div style={{ height:2, width:'50%', background:text, borderRadius:1 }} />
                  <div style={{ height:2, width:8, background:textDim, borderRadius:1, marginLeft:'auto' }} />
                </div>
                {Array.from({ length: col.cards }).map((_, j) => (
                  <div key={j} style={{ background:bg2, borderRadius:4, padding:4, borderLeft:`2px solid ${col.label}` }}>
                    <div style={{ height:2, width:'80%', background:text, borderRadius:1, marginBottom:3 }} />
                    <div style={{ height:1.5, width:'55%', background:textDim, borderRadius:1, marginBottom:3 }} />
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:col.label }} />
                      <div style={{ height:1.5, width:12, background:textDim, borderRadius:1 }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )

    case 'game':
      return (
        <div className={styles.mockup} style={{ alignItems:'center', justifyContent:'space-between' }}>
          {/* Score header */}
          <div style={{ display:'flex', justifyContent:'space-between', width:'100%', marginBottom:2 }}>
            <div style={{ height:2.5, width:20, background:text, borderRadius:1 }} />
            <div style={{ height:2.5, width:16, background:accent, borderRadius:1 }} />
          </div>
          {/* Game grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:2, width:'85%' }}>
            {Array.from({ length: 16 }).map((_, i) => {
              const colors = [
                'rgba(0,229,160,.3)', 'rgba(108,92,231,.3)', 'rgba(225,112,85,.3)',
                'rgba(9,132,227,.3)', 'rgba(255,184,77,.3)', 'rgba(232,67,147,.3)',
              ]
              const isActive = [0, 3, 5, 6, 10, 12, 15].includes(i)
              return (
                <div key={i} style={{
                  aspectRatio:'1', borderRadius:3,
                  background: isActive ? colors[i % colors.length] : bg2,
                  border: isActive ? `1px solid ${colors[i % colors.length].replace('.3', '.4')}` : '1px solid rgba(255,255,255,.04)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {isActive && <div style={{ width:'40%', height:'40%', borderRadius:2, background:colors[i % colors.length].replace('.3', '.5') }} />}
                </div>
              )
            })}
          </div>
          {/* Controls */}
          <div style={{ display:'flex', gap:6, marginTop:2 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:14, height:14, borderRadius:'50%', background:bg, border:'1px solid rgba(255,255,255,.08)' }} />
            ))}
          </div>
        </div>
      )

    case 'cards':
      return (
        <div className={styles.mockup}>
          {/* Section header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
            <div style={{ height:3, width:'35%', background:text, borderRadius:2 }} />
            <div style={{ height:2, width:'15%', background:accent, borderRadius:1 }} />
          </div>
          {/* Cards grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, flex:1 }}>
            {[
              { color:'rgba(108,92,231,.25)', icon:'rgba(108,92,231,.5)' },
              { color:'rgba(0,184,148,.25)', icon:'rgba(0,184,148,.5)' },
              { color:'rgba(9,132,227,.25)', icon:'rgba(9,132,227,.5)' },
              { color:'rgba(225,112,85,.25)', icon:'rgba(225,112,85,.5)' },
            ].map((item, i) => (
              <div key={i} style={{ background:bg2, borderRadius:6, overflow:'hidden', display:'flex', flexDirection:'column' }}>
                <div style={{ height:18, background:item.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:item.icon }} />
                </div>
                <div style={{ padding:'4px 5px' }}>
                  <div style={{ height:2, width:'75%', background:text, borderRadius:1, marginBottom:2 }} />
                  <div style={{ height:1.5, width:'55%', background:textDim, borderRadius:1, marginBottom:3 }} />
                  <div style={{ display:'flex', gap:2 }}>
                    <div style={{ height:2, width:14, background:accentBg, borderRadius:4 }} />
                    <div style={{ height:2, width:10, background:bg, borderRadius:4 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return (
        <div className={styles.mockup}>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:8 }}>
            <div style={{ width:18, height:18, borderRadius:5, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:8, height:8, borderRadius:2, background:accentBg }} />
            </div>
            <div>
              <div style={{ height:3, width:40, background:text, borderRadius:2, marginBottom:3 }} />
              <div style={{ height:2, width:28, background:textDim, borderRadius:1 }} />
            </div>
          </div>
          <div style={{ height:2.5, width:'85%', background:textDim, borderRadius:2, marginBottom:4 }} />
          <div style={{ height:2.5, width:'65%', background:textDim, borderRadius:2, marginBottom:4 }} />
          <div style={{ height:2.5, width:'75%', background:textDim, borderRadius:2, marginBottom:8 }} />
          <div style={{ height:12, width:'45%', background:accentBg, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ height:2, width:'60%', background:accent, borderRadius:1 }} />
          </div>
        </div>
      )
  }
}

export default function AppDetail() {
  const { id } = useParams()
  const { toast, ToastContainer } = useToast()
  const [tab, setTab] = useState(0)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const app = APPS.find(a => a.id === id) || APPS[0]
  const { installed, install } = useInstallState(app.id)

  // Track page view
  useState(() => { trackView(app.id) })

  // AI-powered similar apps
  const similarApps = getSimilarApps(app, APPS, 4)

  function handleInstallClick() {
    setShowDisclaimer(true)
  }

  function handleInstallAccepted() {
    setShowDisclaimer(false)
    install()
    trackInstall(app.id)
    toast(`${app.name} installed successfully!`)
    if (app.url) window.open(app.url, '_blank', 'noopener,noreferrer')
  }

  // Use price field from app data — all current apps are Free
  const isPaid = app.price && app.price !== 'Free'
  const price = isPaid ? app.price : null

  const avgRating = app.averageRating || (REVIEWS.reduce((sum, r) => sum + r.stars, 0) / REVIEWS.length).toFixed(1)
  const badges = (app.badges || []).map(b => BADGE_MAP[b]).filter(Boolean)
  const developer = app.developer || 'Independent Developer'

  // JSON-LD for SoftwareApplication
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.desc,
    applicationCategory: app.category,
    operatingSystem: 'Web, iOS, Android',
    url: `https://agentslock.com/app/${app.id}`,
    offers: {
      '@type': 'Offer',
      price: price || '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      ratingCount: app.totalReviews || REVIEWS.length,
      bestRating: '5',
      worstRating: '1',
    },
  }

  return (
    <>
      <SEO
        title={`${app.name} — SafeLaunch App Store`}
        description={`${app.desc} AI-verified safe with a trust score of ${app.safetyScore || 0}/100. Install now on SafeLaunch.`}
        canonical={`https://agentslock.com/app/${app.id}`}
        type="product"
        jsonLd={jsonLd}
      />
      <Nav />
      <div className="page-wrap" style={{ maxWidth: 1100 }}>
        <Link to="/store" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>&larr; Back to Store</Link>

        <div className={styles.hero}>
          {/* Left col */}
          <div className={styles.left}>
            <div className={styles.iconLg}>{app.icon}</div>
            <h1 className={`display ${styles.title}`}>{app.name}</h1>
            <div className={styles.publisher}>by <a href="#" style={{ color: 'var(--accent)' }}>{developer}</a> &middot; Developer Trust: <strong style={{ color: 'var(--accent)' }}>{app.developerTrust || 70}/100</strong></div>
            <div className={styles.metaRow}>
              {badges.map(b => (
                <span key={b.label} className="badge badge-pass">{b.icon} {b.label}</span>
              ))}
              <span className="badge badge-muted">{app.category}</span>
              <span className="badge badge-muted">v2.3.1</span>
              <span className="badge badge-muted">{app.installs} installs</span>
              {app.size && <span className="badge badge-muted">{app.size}</span>}
              {isPaid && <span className="badge badge-warn">${price}</span>}
            </div>
            <p className={styles.desc}>
              {app.longDesc || app.desc}
            </p>

            {/* Screenshots */}
            <div className={styles.screenshots}>
              {(app.screenshots || []).map((s, i) => (
                <div key={i} className={styles.screenshot} style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)` }}>
                  <div className={styles.ssHeader}>
                    <span className={styles.ssIcon}>{app.icon}</span>
                    <span className={styles.ssTitle}>{s.title}</span>
                  </div>
                  <div className={styles.ssBody}>
                    <ScreenshotMockup type={s.mockup || 'default'} color={s.color} />
                  </div>
                  <div className={styles.ssCaption}>{s.caption}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map((t, i) => (
                <div key={t} className={`${styles.tab} ${tab === i ? styles.activeTab : ''}`} onClick={() => setTab(i)}>{t}</div>
              ))}
            </div>

            {/* Overview — now includes Permission Transparency */}
            {tab === 0 && (
              <div className={styles.tabBody}>
                {app.whatsNew && (
                  <>
                    <h3 style={{ marginBottom: 10 }}>What's New</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 24 }}>{app.whatsNew}</p>
                  </>
                )}

                {/* Permission Transparency Panel — the clear "can / cannot" display */}
                <PermissionPanel
                  permissions={app.permissions || []}
                  safetyScore={app.safetyScore || 0}
                />

                <h3 style={{ marginBottom: 10, marginTop: 24 }}>Privacy</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  {app.permissions && app.permissions.some(p => p.toLowerCase().includes('internet'))
                    ? `${app.name} connects to the internet to provide its core functionality. Review the developer's privacy policy for details on data handling.`
                    : `All data stored in your browser's localStorage. Nothing is ever sent to any server.`
                  }
                  {' '}<Link to="/privacy" style={{ color: 'var(--accent)' }}>View Privacy Policy &rarr;</Link>
                </p>
              </div>
            )}

            {/* Safety */}
            {tab === 1 && (
              <div className={styles.tabBody}>
                <div className={styles.scanSummary}>
                  {[['Critical', 0, 'var(--danger)'], ['Medium', 0, 'var(--warn)'], ['Passed', 16, 'var(--accent)']].map(([l, n, c]) => (
                    <div key={l} className={styles.scanCard}>
                      <div className={`display ${styles.scanNum}`} style={{ color: c }}>{n}</div>
                      <div className={styles.scanLabel}>{l}</div>
                    </div>
                  ))}
                </div>
                {FINDINGS.map((f, i) => (
                  <div key={i} className={styles.findingRow}>
                    <div className={styles.fdot} style={{ background: 'var(--accent)' }} />
                    <div style={{ flex: 1 }}>{f.msg}</div>
                    <span className="badge badge-pass">PASS</span>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <Link to={`/report/${app.id}`} className="btn btn-ghost">View Full Scan Report &rarr;</Link>
                </div>
              </div>
            )}

            {/* Reviews */}
            {tab === 2 && (
              <div className={styles.tabBody}>
                <div className={styles.ratingOverview}>
                  <div className={styles.ratingBig}>
                    <span className="display" style={{fontSize:'2.5rem'}}>{avgRating}</span>
                    <span style={{ color: 'var(--accent)', letterSpacing: 2, fontSize: '1.2rem' }}>{'★'.repeat(Math.round(avgRating))}</span>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{app.totalReviews || REVIEWS.length} reviews</span>
                </div>
                {REVIEWS.map((r, i) => (
                  <div key={i} className={styles.review}>
                    <div className={styles.reviewHeader}>
                      <span style={{ fontWeight: 700 }}>{r.handle}</span>
                      <span style={{ color: 'var(--accent)', letterSpacing: 2 }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.87rem', lineHeight: 1.6 }}>{r.text}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>{r.date}</div>
                  </div>
                ))}
                <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => toast('Review form coming soon')}>Write a Review</button>
              </div>
            )}

            {/* Versions */}
            {tab === 3 && (
              <div className={styles.tabBody}>
                {VERSIONS.map(v => (
                  <div key={v.ver} className={styles.versionRow} style={{ borderColor: v.current ? 'rgba(0,229,160,.3)' : 'var(--border)' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>v{v.ver}</span>
                      {v.current && <span className="badge badge-pass" style={{ marginLeft: 8 }}>CURRENT</span>}
                      <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{v.date} &middot; Risk: {v.score} &middot; Build: {v.build}</div>
                    </div>
                    <Link to={`/report/${app.id}`} style={{ color: v.current ? 'var(--accent)' : 'var(--muted)', fontSize: '0.82rem' }}>Report &rarr;</Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Install card — now with Trust Score gauge */}
          <div className={styles.installCard}>
            {/* Universal Trust Score — the ONE number investors see */}
            <div className={styles.trustScoreWrap}>
              <TrustScore score={app.safetyScore || 0} size="lg" />
            </div>

            {/* Verification badges — visible trust signals */}
            <div className={styles.certBadges}>
              {(app.safetyScore || 0) >= 85 && (
                <span className={styles.certBadge}>{'\u2713'} AI Security Checked</span>
              )}
              {(app.safetyScore || 0) >= 80 && (
                <span className={styles.certBadge}>{'\u2713'} Privacy Verified</span>
              )}
              {(app.safetyScore || 0) >= 70 && (
                <span className={styles.certBadge}>{'\u2713'} No Trackers</span>
              )}
            </div>

            {/* Safety badge with score */}
            <div className={styles.trustBadge}>
              {app.safetyScore >= 85 ? 'Safety Verified' : 'Safety Reviewed'} ({app.safetyScore || 'N/A'}/100) &middot; v2.3.1
            </div>

            {isPaid ? (
              <div className={styles.paySection}>
                <div className={styles.priceTag}>${price}</div>
                <PayPalButton
                  amount={price}
                  description={`Purchase ${app.name}`}
                  onSuccess={() => { trackInstall(app.id); toast(`${app.name} purchased and installed!`) }}
                  onError={() => toast('Payment failed. Please try again.')}
                />
              </div>
            ) : installed ? (
              <a href={app.url} target="_blank" rel="noopener noreferrer" className={`btn ${styles.installBtn} ${styles.openBtn}`}>Open App</a>
            ) : (
              <button className={`btn btn-primary ${styles.installBtn}`} onClick={handleInstallClick}>Install Free</button>
            )}

            <Link to={`/report/${app.id}`} className={styles.reportLink}>View full safety report &rarr;</Link>

            {/* Promote link */}
            <Link to={`/app/${app.id}/promote`} className={styles.reportLink} style={{ color: 'var(--accent2)' }}>Promote this app &rarr;</Link>

            <div className={styles.installMeta}>
              {[
                ['Developer', developer],
                ['Version', '2.3.1'],
                ['Trust Score', `${app.safetyScore || 'N/A'}/100`],
                ['Last scanned', '14 Jan 2026'],
                ['Build hash', 'a4f2c91'],
                ['Size', app.size || 'N/A'],
                ['Installs', `${app.installs}`],
                ['Rating', `${avgRating} (${app.totalReviews || REVIEWS.length})`],
                ['Developer Trust', `${app.developerTrust || 'N/A'}/100`],
                ['Offline support', app.permissions && app.permissions.some(p => p.toLowerCase().includes('none') || p.toLowerCase().includes('offline')) ? '\u2713 Yes' : '~ Partial'],
                ['PWA installable', '\u2713 Yes'],
                ['Price', isPaid ? `$${price}` : 'Free'],
              ].map(([k, v]) => (
                <div key={k} className={styles.metaRow2}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, color: String(v).startsWith('\u2713') ? 'var(--accent)' : 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Report App button */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowReport(true)}
              style={{ width: '100%', justifyContent: 'center', marginTop: 14, color: 'var(--muted)', fontSize: '0.82rem' }}
            >
              Report App
            </button>
          </div>
        </div>
      </div>

      {/* Similar Apps — AI Recommendations */}
      {similarApps.length > 0 && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 40px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Apps You May Like</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {similarApps.map(a => <AppCard key={a.id} app={a} />)}
          </div>
        </div>
      )}

      {/* Independent developer disclaimer banner */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 20px' }}>
        <div style={{ padding: '14px 20px', background: 'rgba(255,184,77,.06)', border: '1px solid rgba(255,184,77,.15)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Apps on SafeLaunch are provided by <strong style={{ color: 'var(--text)' }}>independent developers</strong>. The platform does not create, own, or guarantee third-party applications. <Link to="/how-safety-works" style={{ color: 'var(--accent)' }}>How safety works</Link> &middot; <Link to="/terms" style={{ color: 'var(--accent)' }}>Terms</Link>
        </div>
      </div>

      {/* Powered by SafeLaunch — viral growth footer */}
      <PoweredBy />

      <Footer />

      {showDisclaimer && (
        <InstallDisclaimer
          appName={app.name}
          appId={app.id}
          onAccept={handleInstallAccepted}
          onCancel={() => setShowDisclaimer(false)}
        />
      )}

      {showReport && (
        <ReportApp
          appId={app.id}
          appName={app.name}
          onClose={() => setShowReport(false)}
        />
      )}

      <ToastContainer />
    </>
  )
}
